const { postgresUrl } = require("../utils/env");
const { Kysely, PostgresDialect } = require("kysely");

require("pg").defaults.parseInt8 = true;

const db = new Kysely({
    dialect: new PostgresDialect({
        connectionString: postgresUrl,
    }),
});

module.exports = db;
