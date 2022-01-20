import type { StatsRecord } from "database/queries/player-stats";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function Player() {
    const { query } = useRouter();
    const playerName = query.name as string;
    const stats = useSWR<StatsRecord>(`/api/player-stats?name=${playerName}`);

    return (
        <>
            <h1>{playerName}</h1>
            {stats.data?.wonMatches.count}
        </>
    );
}
