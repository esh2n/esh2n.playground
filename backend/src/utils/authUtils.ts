import { Request } from "../deps/oak.ts";
import { client } from "../db/db.ts";
import { queryByIdString } from "./queryStrings.ts";
import { RoleOptions, User } from "../types/types.ts";

export const isAuthenticated = async (request: Request) => {
  if (!request.userId) throw new Error("Please login to proceed.");

  await client.connect();
  const result = await client.query(queryByIdString(request.userId));

  const user = result.rowsOfObjects()[0] as User;

  if (!user) throw new Error("Not authenticated.");

  if (user.token_version !== request.tokenVersion) {
    throw new Error("Not authenticated.");
  }
  await client.end();

  return user;
};

export const isSuperAdmin = (roles: RoleOptions[]) => {
  return roles.includes(RoleOptions.superAdmin);
};

export const checkAdmin = (roles: RoleOptions[]) => {
  return roles.includes(RoleOptions.admin);
};
