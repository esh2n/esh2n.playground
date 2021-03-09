import { Application } from "./deps/oak.ts";
import { oakCors } from "./deps/cors.ts";
import { checkToken } from "./middlewares/index.ts";
import { GraphQLService } from "./server.ts";

const PORT = Deno.env.get("PORT") || 3001;
const FRONTEND_URI = Deno.env.get("FRONTEND_URI");

const app = new Application();
app.use(oakCors({ credentials: true, origin: FRONTEND_URI })); // allow access from frontend
app.use(checkToken);

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());
console.log(`Server is ready at http://localhost:${PORT}/graphql`);

await app.listen({ port: +PORT });
