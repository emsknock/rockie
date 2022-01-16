require("dotenv-flow").config();

const port = Number(process.env.PORT || 3001);
const liveUrl = process.env.BAD_API_LIVE_URL;

if (!liveUrl) throw Error("Please specify BAD_API_LIVE_URL in .env");

module.exports = { port, liveUrl };
