import create from "zustand";
import sock from "./socket";
import { GestureId } from "utils/gestures";
import { GameResult } from "utils/game-result";
import {
    parseApiMessage,
    ParsedGameResultEvent,
    ParsedGameBeginEvent,
} from "./api-events";

export type ResolvedMatch = {
    isResolved: true;
    id: number;
    playedAt: number;
    aPlayer: string;
    bPlayer: string;
    result: GameResult;
    aGesture: GestureId;
    bGesture: GestureId;
};
export type OngoingMatch = {
    isResolved: false;
    id: number;
    startedAt: number;
    aPlayer: string;
    bPlayer: string;
};

export type State = {
    connected: boolean;
    matches: (ResolvedMatch | OngoingMatch)[];
    clearMatch(id: number): void;
};

const useLiveState = create<State>((set) => {
    // Hook doesn't need to run server-side
    if (!sock)
        return {
            connected: false,
            matches: [],
            clearMatch: () => null,
        };

    function beginGame(event: ParsedGameBeginEvent) {
        set((s) => ({
            matches: [
                ...s.matches,
                {
                    isResolved: false,
                    ...event,
                    startedAt: Date.now(),
                },
            ],
        }));
    }
    function resolveGame(event: ParsedGameResultEvent) {
        set((s) => ({
            matches: s.matches.map((match) =>
                match.id !== event.id
                    ? match
                    : {
                          ...match,
                          isResolved: true,
                          playedAt: event.t,
                          result: GameResult.tie,
                          aGesture: event.aGesture,
                          bGesture: event.bGesture,
                      }
            ),
        }));
    }

    sock.addEventListener("open", () => {
        set({ connected: true });
    });
    sock.addEventListener("close", () => {
        set({ connected: false });
    });
    sock.addEventListener("message", async (message) => {
        const event = await parseApiMessage(message.data);
        switch (event.type) {
            case "GAME_BEGIN":
                return beginGame(event);
            case "GAME_RESULT":
                return resolveGame(event);
            default:
                throw Error(
                    `Unknown event from bad api: ${(event as any).type}`
                );
        }
    });

    return {
        connected: false,
        matches: [],
        clearMatch: (id) =>
            set((s) => ({
                matches: s.matches.filter((match) => match.id !== id),
            })),
    };
});

export default useLiveState;
