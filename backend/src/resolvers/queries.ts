import { client } from "../db/db.ts";
import { RouterContext } from "../deps/oak.ts";
import { isAuthenticated } from "../utils/authUtils.ts";
import { UserResponse } from "../types/types.ts";
import { checkAdmin, isSuperAdmin } from "../utils/authUtils.ts";
import { queryUsersString } from "../utils/queryStrings.ts";

export const Query = {
  users: async (
    _: any,
    __: any,
    { request }: RouterContext,
  ): Promise<UserResponse[] | null> => {
    const admin = await isAuthenticated(request);
    const isSuper = isSuperAdmin(admin.roles);
    const isAdmin = checkAdmin(admin.roles);

    if (!isSuper && !isAdmin) throw new Error("No Authorization.");

    await client.connect();
    const result = await client.query(queryUsersString());
    const users = result.rowsOfObjects();

    const returnUsers: UserResponse[] = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      created_at: user.created_at,
    }));

    return returnUsers;
  },
  user: async (
    _: any,
    __: any,
    { request }: RouterContext,
  ): Promise<UserResponse | null> => {
    try {
      const user = await isAuthenticated(request);

      const returnedUser: UserResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        created_at: user.created_at,
      };

      return returnedUser;
    } catch (error) {
      return null;
    }
  },
};
