import pg from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { postgresUrl } from "utils/env";
import { RpsDatabase } from "./schema";

// Set pg to parse the results of e.g. COUNT functions as numbers.
// This comes with the risk of the db giving too big a number for js to
// handle, but with this given assignment, I can't see that happening.
pg.defaults.parseInt8 = true;

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
