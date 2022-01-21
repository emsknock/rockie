import useSWR from "swr";
import { watcherUrl } from "utils/env";
import useSocketState, { OngoingMatch, ResolvedMatch } from "./socket-state";

export const useLiveState = () => {
    const socket = useSocketState();
    const fallback = useSWR<(ResolvedMatch | OngoingMatch)[]>(
        !socket.connected && watcherUrl,
        {
            refreshInterval: 5000,
        }
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
