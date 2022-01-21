import create from "zustand";
import produce from "immer";
import sock from "./socket";
import { GestureId } from "utils/gestures";
import { gameResult, GameResult } from "utils/game-result";
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
    clearMatchById(id: number): void;
    clearResolvedMatchesByPlayer(name: string): void;
};

const useSocketState = create<State>((set) => {
    // Hook doesn't need to run server-side
    if (!sock)
        return {
            connected: false,
            matches: [],
            clearMatchById: () => null,
            clearResolvedMatchesByPlayer: () => null,
        };

    function beginGame(event: ParsedGameBeginEvent) {
        set(
            produce<State>((s) => {
                s.matches.push({
                    ...event,
                    isResolved: false,
                    startedAt: Date.now(),
                });
            })
        );
    }
    function resolveGame(event: ParsedGameResultEvent) {
        set(
            produce<State>((s) => {
                const idx = s.matches.findIndex((game) => game.id === event.id);
                if (idx !== -1) {
                    s.matches[idx] = {
                        ...s.matches[idx],
                        isResolved: true,
                        playedAt: event.t,
                        result: gameResult(event.aGesture, event.bGesture),
                        aGesture: event.aGesture,
                        bGesture: event.bGesture,
                    };
                }
            })
        );
    }

    sock.addEventListener("open", () => {
        set({ connected: true });
    });
    sock.addEventListener("close", () => {
        set({ connected: false });
    });
    sock.addEventListener("message", async (message) => {
        const event = await parseApiMessage(message.data);
        return event.type === "GAME_BEGIN"
            ? beginGame(event)
            : resolveGame(event);
    });

    return {
        connected: false,
        matches: [],
        clearMatchById: (id) =>
            set((s) => ({
                matches: s.matches.filter((match) => match.id !== id),
            })),
        clearResolvedMatchesByPlayer: (name) =>
            set((s) => ({
                matches: s.matches.filter(
                    (match) =>
                        match.isResolved &&
                        match.aPlayer !== name &&
                        match.bPlayer !== name
                ),
            })),
    };
});

export default useSocketState;
