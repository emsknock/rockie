import type {
    ParsedGameBeginEvent,
    ParsedGameResultEvent,
    StateOngoingMatch,
    StateResolvedMatch,
} from "./types";

import create from "zustand";
import produce from "immer";
import sock from "./socket";
import parseMessage from "./api-events";
import { watcherUrl } from "utils/env";
import { gameResult } from "utils/game-result";

type State = {
    connected: boolean;
    watcherError: boolean;
    matches: (StateResolvedMatch | StateOngoingMatch)[];
    clearMatchById(id: number): void;
};

/** Fetches a list of currently ongoing matches from the bad-api-watcher. */
const getInitialMatches = () =>
    fetch(watcherUrl)
        .then(
            (r) =>
                r.json() as Promise<(StateOngoingMatch | StateResolvedMatch)[]>
        )
        .then(
            (l) => l.filter((game) => !game.isResolved) as StateOngoingMatch[]
        );

/** Keeps track of game events that come from the Bad Api */
const useSocketState = create<State>((set) => {
    // Hook doesn't need to run server-side
    if (!sock)
        return {
            connected: false,
            watcherError: false,
            matches: [],
            clearMatchById: () => null,
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
        const event = await parseMessage(message.data);
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
    };
});

export default useSocketState;
