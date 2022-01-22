import useSocketState, { OngoingMatch, ResolvedMatch } from "./socket-state";
import { EffectCallback, useEffect, useState } from "react";
import { watcherUrl } from "utils/env";
import useSWR from "swr";

export const useLiveState = () => {
    const socket = useSocketState();
    const fallback = useSWR<(ResolvedMatch | OngoingMatch)[]>(
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
