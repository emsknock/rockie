require("dotenv-flow").config();

const port = Number(process.env.PORT || 3001);
const liveUrl = process.env.BAD_API_LIVE_URL;
const historyUrl = process.env.BAD_API_HISTORY_URL;
const postgresUrl = process.env.POSTGRES_URL;
const dbCronExpr = process.env.DB_CRON_EXPR ?? "*/1 * * * *";

if (!liveUrl) throw Error("Please specify BAD_API_LIVE_URL in .env");
if (!historyUrl) throw Error("Please specify BAD_API_HISTORY_URL in .env");
if (!postgresUrl) throw Error("Please specify POSTGRES_URL in .env");

module.exports = { port, liveUrl, historyUrl, postgresUrl, dbCronExpr };
