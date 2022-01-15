const dotenv = require("dotenv");
dotenv.config();

const port = Number(process.env.PORT || 3001);
const rpsBaseUri = process.env.BAD_API_BASE_URI;
const rpsLiveEndpoint = process.env.BAD_API_LIVE_ENDPOINT;

if (!rpsBaseUri) throw Error("Please specify BAD_API_BASE_URI in .env");
if (!rpsLiveEndpoint)
    throw Error("Please specify BAD_API_LIVE_ENDPOINT in .env");

module.exports = { port, rpsApiUri: `${rpsBaseUri}${rpsLiveEndpoint}` };
