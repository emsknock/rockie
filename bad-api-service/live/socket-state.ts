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
import { watcherUrl } from "utils/env";

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
    watcherError: boolean;
    matches: (ResolvedMatch | OngoingMatch)[];
    clearMatchById(id: number): void;
    clearResolvedMatchesByPlayer(name: string): void;
};

const getInitialMatches = () =>
    fetch(watcherUrl)
        .then((r) => r.json() as Promise<(OngoingMatch | ResolvedMatch)[]>)
        .then((l) => l.filter((game) => !game.isResolved) as OngoingMatch[]);

const useSocketState = create<State>((set) => {
    // Hook doesn't need to run server-side
    if (!sock)
        return {
            connected: false,
            watcherError: false,
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

    async function handleSocketMessage(message: MessageEvent<any>) {
        const event = await parseApiMessage(message.data);
        return event.type === "GAME_BEGIN"
            ? beginGame(event)
            : resolveGame(event);
    }

    sock.addEventListener("open", () => {
        getInitialMatches()
            .then((list) => set({ matches: list }))
            .catch(() => set({ watcherError: true }))
            .finally(() => {
                set({ connected: true });
                sock!.addEventListener("message", handleSocketMessage);
            });
    });

    sock.addEventListener("close", () => {
        set({ connected: false });
        sock!.removeEventListener("message", handleSocketMessage);
    });

    return {
        connected: false,
        watcherError: false,
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
