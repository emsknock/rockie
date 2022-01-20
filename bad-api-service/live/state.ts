import { GameBegin, GameResult } from "bad-api-service/types";
import { GestureId } from "database/utils";
import create from "zustand";
import sock, { parseApiMessage } from "./socket";

export type ResolvedMatch = {
    isResolved: true;
    gameId: string;
    played_at: number;
    winner: "a" | "b";
    aPlayer: string;
    bPlayer: string;
    aPlayerGesture: GestureId;
    bPlayerGesture: GestureId;
};
export type OngoingMatch = {
    isResolved: false;
    gameId: string;
    started_at: number;
    aPlayer: string;
    bPlayer: string;
};

export type State = {
    connected: boolean;
    matches: (ResolvedMatch | OngoingMatch)[];
    clearMatch(id: string): void;
};

const useLiveState = create<State>((set) => {
    // Hook doesn't need to run server-side
    if (!sock)
        return {
            connected: false,
            matches: [],
            clearMatch: () => null,
        };

    function beginGame(event: GameBegin) {
        set((s) => ({
            matches: [
                ...s.matches,
                {
                    isResolved: false,
                    gameId: event.gameId,
                    started_at: Date.now(),
                    aPlayer: event.playerA.name,
                    bPlayer: event.playerB.name,
                },
            ],
        }));
    }
    function resolveGame(event: GameResult) {
        set((s) => ({
            matches: s.matches.map((match) =>
                match.gameId !== event.gameId
                    ? match
                    : {
                          ...match,
                          isResolved: true,
                          played_at: event.t,
                          winner: "a",
                          aPlayerGesture: GestureId.rock,
                          bPlayerGesture: GestureId.rock,
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
    sock.addEventListener("message", (message) => {
        const event = parseApiMessage(message.data);
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
                matches: s.matches.filter((match) => match.gameId !== id),
            })),
    };
});

export default useLiveState;