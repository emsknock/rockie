import type { MatchRecord } from "database/queries/player-matches";
import type { StatsRecord } from "database/queries/player-stats";
import { useRouter } from "next/router";
import useSWR from "swr";

const apiStatsPath = (name: string) => `/api/player-stats?name=${name}`;
const apiMatchesPath = (name: string, page: number) =>
    `/api/player-matches?name=${name}&page=${page}`;

export default function Player() {
    const { query } = useRouter();
    const playerName = query.name as string;
    const page = Number((query.page as string) ?? 0);

    const stats = useSWR<StatsRecord>(apiStatsPath(playerName));
    const matches = useSWR<MatchRecord[]>(apiMatchesPath(playerName, page));

    return (
        <>
            <h1>{playerName}</h1>
            <p>{stats.data?.wonMatches.count}</p>
            <ul>
                {matches.data?.map((match) => (
                    <li key={match.id}>{match.id}</li>
                ))}
            </ul>
        </>
    );
}
