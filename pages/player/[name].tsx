import type { MatchRecord } from "bad-api-service/history/database/queries/player-matches";
import type { StatsRecord } from "bad-api-service/history/database/queries/player-stats";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import useSocketState from "bad-api-service/live/socket-state";

export default function Player() {
    const { query } = useRouter();
    const name = query.name as string;
    const page = Number((query.page as string) ?? 0);

    const playerStats = useSWR<StatsRecord>(`/api/player-stats?name=${name}`);
    const playerHistory = useSWR<MatchRecord[]>(
        `/api/player-matches?name=${name}&page=${page}`
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
                !playerHistory.data?.map((g) => g.id).includes(match.id)
        );
        if (newResolvedMatchExists) setNewDataAvailable(true);
    }, [liveMatches.map((game) => game.id), name, page]);

    useEffect(
        () => void (isNewDataAvailbale && playerStats.mutate()),
        [isNewDataAvailbale]
    );

    useEffect(() => void setNewDataAvailable(false), [name]);

    return (
        <>
            <h1>{name}</h1>
            <p>{playerStats.data?.wonMatches.count}</p>
            {isNewDataAvailbale && (
                <p>
                    <button onClick={() => playerHistory.mutate()}>
                        New data available — click to update
                    </button>
                </p>
            )}
            <nav>
                <Link href={`/player/${name}?page=${page - 1}`}>
                    <a>Prev ({page - 1})</a>
                </Link>{" "}
                Page {page}{" "}
                <Link href={`/player/${name}?page=${page + 1}`}>
                    <a>Next {page + 1}</a>
                </Link>
            </nav>
            <ul>
                {playerHistory.data?.map((match) => (
                    <li key={match.id}>{match.id}</li>
                ))}
            </ul>
        </>
    );
}
