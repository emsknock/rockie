import useSocketState, { OngoingMatch, ResolvedMatch } from "./socket-state";
import { useEffect, useState } from "react";
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

export const usePlayerUpdateWatcher = (name: string) => {
    const [available, setAvailable] = useState(false);
    const { matches } = useLiveState();

    const playersWithNewData = new Set(
        matches.map((g) => (g.isResolved ? [g.aPlayer, g.aPlayer] : [])).flat()
    );

    useEffect(() => {
        if (playersWithNewData.has(name)) setAvailable(true);
    }, Array.from(playersWithNewData));

    const clearNotification = () => setAvailable(false);

    return [available, clearNotification] as const;
};
