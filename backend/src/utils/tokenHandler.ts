import {
  create,
  decode,
  getNumericDate,
  Header,
  Payload,
} from "../deps/djwt.ts";
import { Cookies } from "../deps/oak.ts";
import { PayloadInfo } from "../types/types.ts";

const TOKEN_SECRET = Deno.env.get("TOKEN_SECRET")!;
const TOKEN_NAME = Deno.env.get("TOKEN_NAME")!;

const header: Header = { alg: "HS512", typ: "JWT" };

export const createToken = async (
  id: string,
  token_version: number,
) => {
  const payloadInfo: PayloadInfo = {
    id,
    token_version,
  };
  const payload: Payload = {
    payloadInfo,
    // 15days
    exp: getNumericDate(15 * 60 * 60 * 24),
  };
  return await create(header, payload, TOKEN_SECRET);
};

export const sendToken = (cookies: Cookies, token: string) =>
  cookies.set(TOKEN_NAME, token, { httpOnly: true });

export const verifyToken = (token: string) => decode(token);

export const deleteToken = (cookies: Cookies) => cookies.delete(TOKEN_NAME);
