import type { StateResolvedMatch, StateOngoingMatch } from "./types";
import useSocketState from "./socket-state";
import { EffectCallback, useEffect } from "react";
import { watcherUrl } from "utils/env";
import useSWR from "swr";

/**
 * Provides a list of currently ongoing and recently resolved games.
 *
 * If the WebSocket connection goes down, falls back to pinging
 * bad-api-watcher and providing the list of current games from there.
 */
export const useLiveState = () => {
    const socket = useSocketState();
    const fallback = useSWR<(StateResolvedMatch | StateOngoingMatch)[]>(
        !socket.connected && watcherUrl,
        { refreshInterval: 5000 }
    );

    // If socket is connected, we can just show the up-to-date matches,
    // otherwise we'll show stale data from the socket until fallback loads.
    const matches = socket.connected
        ? socket.matches
        : fallback.data ?? socket.matches;

    return {
        isConnected: socket.connected,
        matches,
        // In fallback mode games are cleared fallback-server-side
        clearGame: socket.clearMatchById,
    };
};

/**
 * This hook was supposed to help with a feature where, if the user had a
 * player's page open and that a WebSocket event indicated that player taking
 * part in a new game, the app would show a "new data available" button to
 * refresh the view. It turned out, however, that more often than not, the
 * bad api history *already had results of games that weren't resolved yet
 * according to the WebSocket*. Thus the "new data available" would've been
 * a lie.
 */
export const usePlayerWatcher = (
    name: string,
    callbacks: {
        onBeginsGame?: EffectCallback;
        onResolvesGame?: EffectCallback;
    }
) => {
    const { matches } = useLiveState();

    const isOngoing = matches.some(
        (g) => !g.isResolved && [g.aPlayer, g.bPlayer].includes(name)
    );
    const isResolved = matches.some(
        (g) => g.isResolved && [g.aPlayer, g.bPlayer].includes(name)
    );

    useEffect(() => {
        if (isOngoing) return callbacks.onBeginsGame?.();
    }, [isOngoing]);

    useEffect(() => {
        if (isResolved) return callbacks.onResolvesGame?.();
    }, [isResolved]);

    return { isOngoing, isResolved };
};
