import { liveUrl } from "utils/env";
import { GestureId } from "utils/gestures";
import { normaliseGameId } from "utils/hash-id";

const isBrowser = typeof window !== "undefined";

// Socket related code doesn't need to run server side
const sock = isBrowser && new WebSocket(liveUrl);

export async function parseApiMessage(data: any) {
    // FIXME: Git submodules would probably allow us to share the code between the
    //        nextjs app and bad-api-watcher. Unfortunately I don't have the time
    //        right now to look into it.

    type GameBegin = {
        type: "GAME_BEGIN";
        gameId: string;
        playerA: { name: string };
        playerB: { name: string };
    };
    type GameResult = {
        type: "GAME_RESULT";
        gameId: string;
        t: number;
        playerA: { name: string; played: "ROCK" | "PAPER" | "SCISSORS" };
        playerB: { name: string; played: "ROCK" | "PAPER" | "SCISSORS" };
    };

    // The API sends each event as an escaped string that needs to first be
    // unescaped and then parsed. Easiest to just call `JSON.parse` twice.
    const json = JSON.parse(data);
    const event = JSON.parse(json) as GameBegin | GameResult;

    return event.type === "GAME_BEGIN"
        ? {
              type: "GAME_BEGIN",
              id: await normaliseGameId(event.gameId),
              aPlayer: event.playerA.name,
              bPlayer: event.playerB.name,
          }
        : {
              type: "GAME_RESULT",
              id: await normaliseGameId(event.gameId),
              t: event.t,
              aPlayer: event.playerA.name,
              bPlayer: event.playerB.name,
              aGesture:
                  GestureId[
                      event.playerA.played.toLowerCase() as
                          | "rock"
                          | "paper"
                          | "scissors"
                  ],
              bGesture:
                  GestureId[
                      event.playerB.played.toLowerCase() as
                          | "rock"
                          | "paper"
                          | "scissors"
                  ],
          };
}

export default sock;
