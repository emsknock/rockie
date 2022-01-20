import { GameBegin, GameResult } from "bad-api-service/types";
import create from "zustand";
import sock, { parseApiMessage } from "./socket";
import fallbackFetch from "./socket-fallback";

type State = {
    connected: boolean;
    ongoing: { gameId: string; a: string; b: string }[];
    resolved: { gameId: string; a: string; b: string }[];
};

const initialState: State = {
    connected: false,
    ongoing: [],
    resolved: [],
};

const useLiveState = create<State>((set) => {
    // Hook doesn't need to run server-side
    if (!sock) return initialState;

    function beginGame(event: GameBegin) {
        set((s) => ({
            ongoing: [
                ...s.ongoing,
                {
                    gameId: event.gameId,
                    a: event.playerA.name,
                    b: event.playerB.name,
                },
            ],
        }));
    }
    function resolveGame(event: GameResult) {
        set((s) => ({
            ongoing: s.ongoing.filter((g) => g.gameId !== event.gameId),
            resolved: [
                ...s.resolved,
                {
                    gameId: event.gameId,
                    a: event.playerA.name,
                    b: event.playerB.name,
                },
            ],
        }));
    }

    async function fallback() {
        set(await fallbackFetch());
    }
    let fallbackIntervalHandle: number;
    const stopFallback = () => window.clearInterval(fallbackIntervalHandle);
    const startFallback = () =>
        (fallbackIntervalHandle = window.setInterval(fallback));

    sock.addEventListener("open", () => {
        set({ connected: true });
        stopFallback();
    });
    sock.addEventListener("close", () => {
        set({ connected: false });
        startFallback();
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

    // Populate the state with currently ongoing matches from the api watcher
    fallback();
    startFallback();
    return initialState;
});

export default useLiveState;
