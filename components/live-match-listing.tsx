import useLiveState, {
    OngoingMatch,
    ResolvedMatch,
} from "bad-api-service/live/state";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Gesture } from "./gesture";

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
                    <Link href={`/player/${props.aPlayer}`}>
                        {props.aPlayer}
                    </Link>{" "}
                    (<Gesture id={props.aPlayerGesture} />){" "}
                    {props.winner === "a" ? "←" : "→"} (
                    <Gesture id={props.bPlayerGesture} />){" "}
                    <Link href={`/player/${props.bPlayer}`}>
                        {props.bPlayer}
                    </Link>{" "}
                    {ttl}
                </>
            ) : (
                <>
                    <Link href={`/player/${props.aPlayer}`}>
                        {props.aPlayer}
                    </Link>{" "}
                    vs{" "}
                    <Link href={`/player/${props.bPlayer}`}>
                        {props.bPlayer}
                    </Link>
                </>
            )}
        </li>
    );
}
