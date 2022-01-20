import useLiveState, {
    OngoingMatch,
    ResolvedMatch,
} from "bad-api-service/live/state";
import { useEffect, useState } from "react";

export function LiveMatch(props: ResolvedMatch | OngoingMatch) {
    const [ttl, setTtl] = useState(5000);
    const clearMatch = useLiveState((s) => s.clearMatch);
    useEffect(
        function matchAutoRemoveTimer() {
            if (props.isResolved) {
                const expireHandle = setTimeout(
                    () => clearMatch(props.gameId),
                    5000
                );
                setInterval(() => setTtl((t) => t - 10), 10);
                return () => clearTimeout(expireHandle);
            }
        },
        [clearMatch, props.gameId, props.isResolved]
    );

    return (
        <li>
            {props.isResolved ? (
                <>
                    {props.aPlayer} () vs () {props.bPlayer} {ttl}
                </>
            ) : (
                <>
                    {props.aPlayer} vs {props.bPlayer}
                </>
            )}
        </li>
    );
}
