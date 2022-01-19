import { GameBegin, GameResult } from "bad-api-service/types";

const isBrowser = typeof window !== "undefined";
const liveUrl = process.env.BAD_API_LIVE_URL;
if (!liveUrl) throw new Error("Please specify BAD_API_LIVE_URL in .env");

// Socket related code doesn't need to run server side
const sock = isBrowser && new WebSocket(liveUrl);

// A copy of the bad-api-watcher's message parsing function.
// FIXME: Git submodules would probably allow us to share the code between the
//        nextjs app and bad-api-watcher. Unfortunately I don't have the time
//        right now to look into it.
export function parseApiMessage(data: any) {
    // The API sends each event as an escaped string that needs to first be
    // unescaped and then parsed. Easiest to just call `JSON.parse` twice.
    const json = JSON.parse(data);
    const event = JSON.parse(json);
    return event as GameBegin | GameResult;
}

export default sock;
