import { Client } from "../deps/postgres.ts";

const DB_NAME = Deno.env.get("DB_NAME");
const DB_USER = Deno.env.get("DB_USER");
const DB_PASSWORD = Deno.env.get("DB_PASSWORD");
const DB_HOST = Deno.env.get("DB_HOST");
const DB_PORT = Deno.env.get("DB_PORT") || 5432;

export const client = new Client({
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  hostname: DB_HOST,
  port: +DB_PORT,
});
