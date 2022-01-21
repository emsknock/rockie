import type { MatchRecord } from "database/queries/player-matches";
import type { StatsRecord } from "database/queries/player-stats";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import useLiveState from "bad-api-service/live/state";

const apiStatsPath = (name: string) => `/api/player-stats?name=${name}`;
const apiMatchesPath = (name: string, page: number) =>
    `/api/player-matches?name=${name}&page=${page}`;

export default function Player() {
    const { query } = useRouter();
    const playerName = query.name as string;
    const pageNumber = Number((query.page as string) ?? 0);

    const playerStats = useSWR<StatsRecord>(apiStatsPath(playerName));
    const playerHistory = useSWR<MatchRecord[]>(
        apiMatchesPath(playerName, pageNumber)
    );

    const liveMatches = useLiveState((s) => s.matches);
    const [isNewDataAvailbale, setNewDataAvailable] = useState(false);
    useEffect(() => {
        // Is there a resolved match where
        // * this player was a participant and
        // * it isn't included on this page already
        const newResolvedMatchExists = liveMatches.some(
            (match) =>
                match.isResolved &&
                (match.aPlayer === playerName ||
                    match.bPlayer === playerName) &&
                !playerHistory.data?.map((g) => g.id).includes(match.id)
        );
        if (newResolvedMatchExists) setNewDataAvailable(true);
    }, [liveMatches.map((game) => game.id), playerName, pageNumber]);

    useEffect(
        () => void (isNewDataAvailbale && playerStats.mutate()),
        [isNewDataAvailbale]
    );

    useEffect(() => void setNewDataAvailable(false), [playerName]);

    return (
        <>
            <h1>{playerName}</h1>
            <p>{playerStats.data?.wonMatches.count}</p>
            {isNewDataAvailbale && (
                <p>
                    <button onClick={() => playerHistory.mutate()}>
                        New data available — click to update
                    </button>
                </p>
            )}
            <nav>
                <Link href={`/player/${playerName}?page=${pageNumber - 1}`}>
                    <a>Prev ({pageNumber - 1})</a>
                </Link>{" "}
                Page {pageNumber}{" "}
                <Link href={`/player/${playerName}?page=${pageNumber + 1}`}>
                    <a>Next {pageNumber + 1}</a>
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
