import "../deps/oak.ts";
declare module "../deps/oak.ts" {
  interface Request {
    userId?: string;
    tokenVersion?: number;
    exp?: number;
  }
}

export enum Provider {
  facebook = "Facebook",
  google = "Google",
}

export enum RoleOptions {
  client = "CLIENT",
  itemEditor = "ITEMEDITOR",
  admin = "ADMIN",
  superAdmin = "SUPERADMIN",
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  token_version: number;
  reset_password_token?: string;
  reset_password_token_expiry?: number;
  facebook_id?: string;
  google_id?: string;
  roles: RoleOptions[];
  created_at: string;
}

export type SignupArgs = Pick<User, "username" | "email" | "password">;
export type SigninArgs = Omit<SignupArgs, "username">;

export type UserResponse = Pick<
  User,
  "id" | "username" | "email" | "roles" | "created_at"
>;

export type PayloadInfo = {
  id: string;
  token_version: number;
};

export type DecodedToken = {
  payload: {
    payloadInfo: PayloadInfo;
    exp: number;
  };
  signature: string;
};

export type ResponseMessage = {
  message: string;
};

export type UpdateRolesArgs = {
  id: string;
  roles: RoleOptions[];
};

export type SocialMediaLoginArgs = Pick<User, "id" | "username" | "email"> & {
  expiration: string;
  provider: Provider;
};
