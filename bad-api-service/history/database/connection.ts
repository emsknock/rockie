import pg from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { postgresUrl } from "utils/env";
import { RpsDatabase } from "./schema";

// TODO: Refactor or annotate this to be more understandable
pg.defaults.parseInt8 = true;
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (value) =>
    Number(new Date(`${value}+0000`))
);

const isDev = process.env.NODE_ENV === "development";

// NextJS's Hot Module Replacement will keep making new connections unless we
// save the connection as a global variable
declare global {
    var _kysely: Kysely<RpsDatabase>;
}

const db =
    (isDev && global._kysely) ||
    new Kysely<RpsDatabase>({
        dialect: new PostgresDialect({
            connectionString: postgresUrl,
        }),
    });

if (isDev && !global._kysely) global._kysely = db;

export default db;
