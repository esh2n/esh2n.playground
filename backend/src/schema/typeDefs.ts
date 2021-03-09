import { gql } from "../deps/oak_graphql.ts";

// Graphql type
export const typeDefs: any = gql`
	enum RoleOptions {
		CLIENT
		ITEMEDITOR
		ADMIN
		SUPERADMIN
	}

	enum Provider {
		Facebook
		Google
	}

	type User {
		id: String!
		username: String!
		email: String!
		password: String!
		roles: [RoleOptions!]!
		created_at: String!
	}

	type ResponseMessage {
		message: String!
	}

	type Query {
		users: [User]!
		user: User
	}

	type Mutation {
		signup(username: String!, email: String!, password: String!): User
		signin(email: String!, password: String!): User
		signout: ResponseMessage
		requestToResetPassword(email: String!): ResponseMessage
		resetPassword(password: String!, token: String!): ResponseMessage
		updateRoles(id: String!, roles: [RoleOptions]!): User
		deleteUser(id: String!): ResponseMessage
		socialMediaLogin(username: String!, email: String, id: String!, expiration: String!, provider: Provider!): User
	}
`;
