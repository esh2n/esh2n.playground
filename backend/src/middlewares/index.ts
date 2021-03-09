import { Middleware } from "../deps/oak.ts";
import { getNumericDate, Payload } from "../deps/djwt.ts";
import { PayloadInfo, User } from "../types/types.ts";
import { createToken, sendToken, verifyToken } from "../utils/tokenHandler.ts";
import { isAuthenticated } from "../utils/authUtils.ts";
import { client } from "../db/db.ts";
import { updateTokenVersionString } from "../utils/queryStrings.ts";

const TOKEN_NAME = Deno.env.get("TOKEN_NAME")!;

export const checkToken: Middleware = async (ctx, next) => {
  let token: string | undefined;
  const authorization = ctx.request.headers.get("authorization");

  if (authorization) {
    token = authorization.split(" ")[1];
  } else {
    token = ctx.cookies.get(TOKEN_NAME);
  }
  if (token) {
    const decodedToken = verifyToken(token);
    if (decodedToken) {
      if (decodedToken.payload) {
        const payload = decodedToken.payload as Payload & {
          payloadInfo: PayloadInfo;
        };

        const { payloadInfo, exp } = payload;

        // set data to request
        ctx.request.userId = payloadInfo?.id;
        ctx.request.tokenVersion = payloadInfo?.token_version;
        ctx.request.exp = exp;
        if (exp === undefined) throw new Error("Exp is invalid.");

        const currentTokenAge = getNumericDate(15 * 60 * 60 * 24) - exp;

        // update jwt(handle if id token_age is under 6 hours)
        if (currentTokenAge > 60 * 60 * 6) {
          try {
            const user = await isAuthenticated(ctx.request);

            if (user) {
              await client.connect();

              const updatedUserData = await client.query(
                updateTokenVersionString(user.id, user.token_version + 1),
              );
              const updatedUser = updatedUserData.rowsOfObjects()[0] as User;

              if (updatedUser) {
                const newToken = await createToken(
                  updatedUser.id,
                  updatedUser.token_version,
                );

                console.log("newToken ---->", newToken);

                sendToken(ctx.cookies, newToken);

                // set data to request
                ctx.request.tokenVersion = updatedUser.token_version;
                ctx.request.exp = Date.now() + 1000 * 15 * 60 * 60 * 24;
              }
            }
          } catch (error) {
          }
        }
      }
    }
  }
  await next();
};
