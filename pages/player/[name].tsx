import type { StatsRecord, PlayerMatchesPage } from "bad-api-service/history";
import useSocketState from "bad-api-service/live/socket-state";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";

export default function Player() {
    const { query } = useRouter();
    const name = query.name as string;
    const cursor = query.cursor as string | undefined;

    const stats = useSWR<StatsRecord>(`/api/${name}/stats`);
    const history = useSWR<PlayerMatchesPage>(
        cursor
            ? `/api/${name}/history?cursor=${cursor}`
            : `/api/${name}/history`
    );

    const liveMatches = useSocketState((s) => s.matches);
    const [isNewDataAvailbale, setNewDataAvailable] = useState(false);
    useEffect(() => {
        // Is there a resolved match where
        // * this player was a participant and
        // * it isn't included on this page already
        const newResolvedMatchExists = liveMatches.some(
            (match) =>
                match.isResolved &&
                (match.aPlayer === name || match.bPlayer === name) &&
                !history.data?.page.map((g) => g.id).includes(match.id)
        );
        if (newResolvedMatchExists) setNewDataAvailable(true);
    }, [liveMatches.map((game) => game.id), name, cursor]);

    useEffect(
        () => void (isNewDataAvailbale && stats.mutate()),
        [isNewDataAvailbale]
    );

    useEffect(() => void setNewDataAvailable(false), [name]);

    return (
        <>
            <h1>{name}</h1>
            <p>{stats.data?.wonMatches.count}</p>
            {isNewDataAvailbale && (
                <p>
                    <button onClick={() => history.mutate()}>
                        New data available — click to update
                    </button>
                </p>
            )}
            <nav>
                <Link
                    href={`/player/${name}/?cursor=${history.data?.cursorBackwards}`}
                >
                    <a>Prev</a>
                </Link>{" "}
                <Link
                    href={`/player/${name}/?cursor=${history.data?.cursorForwards}`}
                >
                    <a>Next</a>
                </Link>
            </nav>
            <ul>
                {history.data?.page.map((match) => (
                    <li key={match.id}>{match.id}</li>
                ))}
            </ul>
        </>
    );
}
