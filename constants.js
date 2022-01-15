require("dotenv-flow").config();

const port = Number(process.env.PORT || 3001);
const liveUri = process.env.BAD_API_LIVE_URI;

if (!liveUri) throw Error("Please specify BAD_API_LIVE_URI in .env");

module.exports = { port, liveUri };
