import {
  Provider,
  ResponseMessage,
  SigninArgs,
  SignupArgs,
  SocialMediaLoginArgs,
  UpdateRolesArgs,
  User,
  UserResponse,
} from "../types/types.ts";
import {
  validateProviderToken,
  validateUsername,
} from "../utils/validations.ts";
import { validateEmail, validatePassword } from "../utils/validations.ts";
import { client } from "../db/db.ts";
import {
  deleteUserByIdString,
  insertUserString,
  queryByEmailString,
  queryByIdString,
  queryByProviderIdString,
  queryByResetPasswordTokenString,
  updateRequestResetPasswordString,
  updateResetPasswordString,
  updateRolesString,
  updateTokenVersionString,
} from "../utils/queryStrings.ts";

import { createToken, deleteToken, sendToken } from "../utils/tokenHandler.ts";
import { RouterContext } from "../deps/oak.ts";
import bcrypt from "../deps/bcrypt.ts";
import { isAuthenticated, isSuperAdmin } from "../utils/authUtils.ts";
import { v4 } from "../deps/uuid.ts";
import { sendEmail } from "../utils/emailHandler.ts";

export const Mutation = {
  // signup -> set to cookies.
  signup: async (
    _: any,
    { username, email, password }: SignupArgs,
    { cookies }: RouterContext,
  ): Promise<UserResponse | null> => {
    try {
      if (!username) throw new Error("Username is required.");
      if (!email) throw new Error("Email is required.");
      if (!password) throw new Error("Password is required.");

      const formattedUsername = username.trim();
      const isUsernameValid = validateUsername(formattedUsername);
      if (!isUsernameValid) {
        throw new Error("Username must be between 3 - 200 characters.");
      }

      const isPasswordValid = validatePassword(password);
      if (!isPasswordValid) {
        throw new Error("Password must be between 6 - 30 characters.");
      }

      const formattedEmail = email.trim().toLowerCase();
      const isEmailValid = validateEmail(formattedEmail);
      if (!isEmailValid) throw new Error("Email is invalid.");

      await client.connect();
      const result = await client.query(queryByEmailString(formattedEmail));
      const user = result.rowsOfObjects()[0] as User;
      if (user) throw new Error("This email is already in use.");

      const hashedPassword = await bcrypt.hash(password);

      const userData = await client.query(
        insertUserString(formattedUsername, formattedEmail, hashedPassword),
      );

      const newUser = userData.rowsOfObjects()[0] as User;
      const returnedUser: UserResponse = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles,
        created_at: newUser.created_at,
      };

      await client.end();

      const token = await createToken(newUser.id, newUser.token_version);
      sendToken(cookies, token);

      return returnedUser;
    } catch (error) {
      throw error;
    }
  },
  signin: async (
    _: any,
    { email, password }: SigninArgs,
    { cookies }: RouterContext,
  ): Promise<UserResponse | null> => {
    try {
      if (!email) throw new Error("Email is required.");
      if (!password) throw new Error("Password is required.");

      const formattedEmail = email.trim().toLowerCase();

      await client.connect();
      const result = await client.query(queryByEmailString(formattedEmail));
      const user = result.rowsOfObjects()[0] as User;
      if (!user) throw new Error("Email or password is invalid.");

      if (user.reset_password_token) {
        throw new Error("Please reset your password.");
      }
      // facebook user or google user
      if (
        (!!user.facebook_id && user.password === Provider.facebook) ||
        (!!user.google_id && user.password === Provider.google)
      ) {
        throw new Error("Please reset your password.");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) throw new Error("Email or password is invalid.");

      const returnedUser: UserResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        created_at: user.created_at,
      };

      await client.end();

      const token = await createToken(user.id, user.token_version);
      sendToken(cookies, token);

      return returnedUser;
    } catch (error) {
      throw error;
    }
  },
  signout: async (
    _: any,
    __: any,
    { request, cookies }: RouterContext,
  ): Promise<ResponseMessage | null> => {
    try {
      const user = await isAuthenticated(request);
      user.token_version = user.token_version + 1;

      await client.connect();
      const updatedUserData = await client.query(
        updateTokenVersionString(user.id, user.token_version),
      );
      const updatedUser = updatedUserData.rowsOfObjects()[0] as User;

      if (!updatedUser) throw new Error("Sorry, cannot proceed.");

      await client.end();

      deleteToken(cookies);

      return { message: "Goodbye." };
    } catch (error) {
      throw error;
    }
  },
  requestToResetPassword: async (
    _: any,
    { email }: { email: string },
  ): Promise<ResponseMessage | null> => {
    try {
      if (!email) throw new Error("Email is required.");

      await client.connect();

      const formattedEmail = email.trim().toLowerCase();
      const result = await client.query(queryByEmailString(formattedEmail));
      const user = result.rowsOfObjects()[0] as User;

      if (!user) throw new Error("Email not found, please sign up.");

      const uuid = v4.generate();
      const reset_password_token = await bcrypt.hash(uuid);
      const reset_password_token_expiry = Date.now() + 1000 * 60 * 30;

      const updatedUserData = await client.query(
        updateRequestResetPasswordString(
          formattedEmail,
          reset_password_token,
          reset_password_token_expiry,
        ),
      );

      const updatedUser = updatedUserData.rowsOfObjects()[0] as User;

      if (!updatedUser) throw new Error("Sorry, cannot proceed.");

      await client.end();

      const subject = "Reset Your Password";

      const response = await sendEmail(
        formattedEmail,
        subject,
        reset_password_token,
      );

      if (!response.ok) throw new Error("Sorry, cannot proceed.");

      return { message: "Please check your email to reset your password." };
    } catch (error) {
      throw error;
    }
  },
  resetPassword: async (
    _: any,
    { password, token }: { password: string; token: string },
  ): Promise<ResponseMessage | null> => {
    try {
      if (!password || !token) throw new Error("Sorry, cannot proceed.");

      await client.connect();

      const result = await client.query(queryByResetPasswordTokenString(token));
      const user = result.rowsOfObjects()[0] as User;

      if (!user) throw new Error("Sorry, cannot proceed.");
      if (!user.reset_password_token_expiry) {
        throw new Error("Sorry, cannot proceed.");
      }

      const isTokenExpired = user.reset_password_token_expiry < Date.now();

      if (isTokenExpired) throw new Error("Sorry,cannot proceed.");

      const hashedPassword = await bcrypt.hash(password);

      const updatedUserData = await client.query(
        updateResetPasswordString(user.id, hashedPassword),
      );
      const updatedUser = updatedUserData.rowsOfObjects()[0] as User;
      if (!updatedUser) throw new Error("Sorry, cannot proceed.");

      await client.end();

      return {
        message:
          "Successfully reset your password, you can now signin with your new password.",
      };
    } catch (error) {
      throw error;
    }
  },
  updateRoles: async (
    _: any,
    { id, roles }: UpdateRolesArgs,
    { request }: RouterContext,
  ): Promise<UserResponse | null> => {
    try {
      const admin = await isAuthenticated(request);

      const isSuper = isSuperAdmin(admin.roles);
      if (!isSuper) throw new Error("No Authorization.");

      // prevent you(super admin) change your role.
      if (request.userId == id) throw new Error("Sorry, cannot proceed.");

      await client.connect();

      const result = await client.query(queryByIdString(id));
      const user = result.rowsOfObjects()[0] as User;

      if (!user) throw new Error("Sorry, cannot proceed.");

      const updatedUserData = await client.query(updateRolesString(id, roles));
      const updatedUser = updatedUserData.rowsOfObjects()[0] as User;

      if (!updatedUser) throw new Error("Sorry, cannot proceed.");

      await client.end();

      const returnUser: UserResponse = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        roles: updatedUser.roles,
        created_at: updatedUser.created_at,
      };

      return returnUser;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (
    _: any,
    { id }: { id: string },
    { request }: RouterContext,
  ): Promise<ResponseMessage | null> => {
    try {
      const admin = await isAuthenticated(request);

      const isSuper = isSuperAdmin(admin.roles);
      if (!isSuper) throw new Error("No Authorization.");

      // prevent you(super admin) delete your role.
      if (request.userId == id) throw new Error("Sorry, cannot proceed.");

      await client.connect();

      const result = await client.query(queryByIdString(id));
      const user = result.rowsOfObjects()[0] as User;

      if (!user) throw new Error("Sorry, cannot proceed.");

      const deletedUserData = await client.query(deleteUserByIdString(id));

      if (!deletedUserData?.query?.result?.rowCount) {
        throw new Error("Sorry, cannot proceed.");
      }

      await client.end();

      return { message: `The user ID: ${id} has been deleted.` };
    } catch (error) {
      throw error;
    }
  },
  socialMediaLogin: async (
    _: any,
    { id, username, email, expiration, provider }: SocialMediaLoginArgs,
    { cookies }: RouterContext,
  ): Promise<UserResponse | null> => {
    try {
      if (!id || !username || !expiration || !provider) {
        throw new Error("Sorry, cannot proceed.");
      }

      const isTokenValid = validateProviderToken(+expiration);

      if (!isTokenValid) throw new Error("Token is not valid, cannot proceed.");

      await client.connect();
      const result = await client.query(queryByProviderIdString(id, provider));
      const user = result.rowsOfObjects()[0] as User;
      const formattedEmail = email.toLowerCase() || provider;

      if (!user) {
        // general -> media
        const emailUserData = await client.query(
          queryByEmailString(formattedEmail),
        );
        const emailUser = emailUserData.rowsOfObjects()[0] as User;
        if (emailUser) {
          // login
          const token = await createToken(
            emailUser.id,
            emailUser.token_version,
          );

          sendToken(cookies, token);

          const returnedUser: UserResponse = {
            id: emailUser.id,
            username: emailUser.username,
            email: emailUser.email,
            roles: emailUser.roles,
            created_at: emailUser.created_at,
          };

          await client.end();

          return returnedUser;
        }

        // new user
        let newUserData;
        if (provider == Provider.facebook) {
          newUserData = await client.query(
            insertUserString(
              username,
              formattedEmail,
              provider,
              id,
              undefined,
            ),
          );
        }

        if (provider == Provider.google) {
          newUserData = await client.query(
            insertUserString(
              username,
              formattedEmail,
              provider,
              undefined,
              id,
            ),
          );
        }

        const newUser = newUserData?.rowsOfObjects()[0] as User;

        const returnedUser: UserResponse = {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          roles: newUser.roles,
          created_at: newUser.created_at,
        };

        await client.end();

        const token = await createToken(newUser.id, newUser.token_version);
        sendToken(cookies, token);

        return returnedUser;
      } else {
        // login
        const token = await createToken(user.id, user.token_version);

        sendToken(cookies, token);

        const returnedUser: UserResponse = {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          created_at: user.created_at,
        };

        await client.end();

        return returnedUser;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
