import Link from "next/link";
import { useEffect, useState } from "react";
import { Gesture } from "components/gesture";
import { OngoingMatch, ResolvedMatch } from "bad-api-service/live/socket-state";
import { useLiveState } from "bad-api-service/live/hook";

export function LiveMatch(props: ResolvedMatch | OngoingMatch) {
    const [ttl, setTtl] = useState(5000);
    const { clearGame } = useLiveState();
    useEffect(
        function matchAutoRemoveTimer() {
            if (props.isResolved) {
                const expireHandle = setTimeout(
                    () => clearGame(props.id),
                    5000
                );
                const ttlUpdateInterval = setInterval(
                    () => setTtl((t) => t - 10),
                    10
                );
                return () => {
                    window.clearTimeout(expireHandle);
                    window.clearInterval(ttlUpdateInterval);
                };
            }
        },
        [clearGame, props.id, props.isResolved]
    );

    return (
        <li>
            {props.isResolved ? (
                <>
                    <Link href={`/player/${props.aPlayer}`}>
                        {props.aPlayer}
                    </Link>{" "}
                    (<Gesture id={props.aGesture} />) vs (
                    <Gesture id={props.bGesture} />){" "}
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
