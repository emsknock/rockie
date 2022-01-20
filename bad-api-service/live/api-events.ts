import { GestureId } from "utils/gestures";
import { normaliseGameId } from "utils/hash-id";

export type ParsedGameBeginEvent = {
    type: "GAME_BEGIN";
    id: number;
    aPlayer: string;
    bPlayer: string;
};
export type ParsedGameResultEvent = {
    type: "GAME_RESULT";
    id: number;
    t: number;
    aPlayer: string;
    bPlayer: string;
    aGesture: GestureId;
    bGesture: GestureId;
};

export async function parseApiMessage(
    data: any
): Promise<ParsedGameBeginEvent | ParsedGameResultEvent> {
    // FIXME: Git submodules would probably allow us to share the code between the
    //        nextjs app and bad-api-watcher. Unfortunately I don't have the time
    //        right now to look into it.

    type ApiGameBeginEvent = {
        type: "GAME_BEGIN";
        gameId: string;
        playerA: { name: string };
        playerB: { name: string };
    };
    type ApiGameResultEvent = {
        type: "GAME_RESULT";
        gameId: string;
        t: number;
        playerA: { name: string; played: "ROCK" | "PAPER" | "SCISSORS" };
        playerB: { name: string; played: "ROCK" | "PAPER" | "SCISSORS" };
    };

    // The API sends each event as an escaped string that needs to first be
    // unescaped and then parsed. Easiest to just call `JSON.parse` twice.
    const json = JSON.parse(data);
    const event = JSON.parse(json) as ApiGameBeginEvent | ApiGameResultEvent;

    // The API wasn't documented, so it's possible I've missed an event type
    if (event.type !== "GAME_BEGIN" && event.type !== "GAME_RESULT") {
        throw Error(`Unknown event type "${(event as any).type}"`);
    }

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
