import type {
    PlayerStatsRecord,
    HistoryRecordByPage,
} from "bad-api-service/history";
import type { GetServerSideProps } from "next";

import Link from "next/link";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { usePlayerWatcher } from "bad-api-service/live/hook";
import { refreshDatabase, getHistoryByPage } from "bad-api-service/history";

type props = {
    name: string;
    page: number;
    history: HistoryRecordByPage;
};

export default function Player({ name, page, history }: props) {
    const stats = useSWR<PlayerStatsRecord>(`/api/${name}/stats`);

    const [updatesAvailable, setUpdatesAvailable] = useState(false);
    useEffect(() => setUpdatesAvailable(false), [name]);
    usePlayerWatcher(name, {
        onResolvesGame: () => {
            setUpdatesAvailable(true);
            stats.mutate();
        },
    });

    return (
        <>
            <h1>{name}</h1>
            <p>{page}</p>
            <p>{stats.data?.overall.count}</p>
            {updatesAvailable && (
                <p>
                    <Link href={`/player/${name}?page=0`}>
                        <a>New data available</a>
                    </Link>
                </p>
            )}
            <nav>
                <Link href={`/player/${name}/?page=${page - 1}`}>
                    <a>Prev</a>
                </Link>{" "}
                <Link href={`/player/${name}/?page=${page + 1}`}>
                    <a>Next</a>
                </Link>
            </nav>
            <ul>
                {history.page.map((match) => (
                    <li key={match.id}>
                        {new Date(match.playedAt).toLocaleTimeString()}{" "}
                        {match.playedAt} {match.id} {match.winnerName}{" "}
                        {match.loserName}
                    </li>
                ))}
            </ul>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    params,
    query,
}) => {
    await refreshDatabase();

    const name = params!.name as string;
    const page = Number(query.page ?? 0);

    if (isNaN(page) || page < 0) return { notFound: true };

    const history = await getHistoryByPage(name, page);

    return {
        props: {
            name,
            page,
            history,
        },
    };
};
