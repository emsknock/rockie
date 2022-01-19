import pg from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { RpsDatabase } from "./schema";

// TODO: Refactor or annotate this to be more understandable
pg.defaults.parseInt8 = true;
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (value) =>
    Number(new Date(`${value}+0000`))
);

const isDev = process.env.NODE_ENV === "development";
const postgresUri = process.env.POSTGRES_URI;
if (!postgresUri) throw new Error("Please specify POSTGRES_URI in .env");

// NextJS's Hot Module Replacement will keep making new connections unless we
// save the connection as a global variable
declare global {
    var _kysely: Kysely<RpsDatabase>;
}

const db =
    (isDev && global._kysely) ||
    new Kysely<RpsDatabase>({
        dialect: new PostgresDialect({
            connectionString: postgresUri,
        }),
    });

if (isDev && !global._kysely) global._kysely = db;

export default db;
