import { Router, RouterContext } from "./deps/oak.ts";
import { applyGraphQL } from "./deps/oak_graphql.ts";
import { resolvers } from "./resolvers/index.ts";
import { typeDefs } from "./schema/typeDefs.ts";
import { sendToken } from "./utils/tokenHandler.ts";

export const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: (ctx: RouterContext) => {
    return ctx;
  },
});
