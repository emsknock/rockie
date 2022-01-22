import type { GetServerSideProps } from "next";
import type { HistoryRecordByPage } from "bad-api-service/history";

import clsx from "clsx";
import { refreshDatabase, getHistoryByPage } from "bad-api-service/history";

import { HistoryRow } from "components/history-row";
import { PaginationNav } from "components/pagination-nav";
import { PlayerStats } from "components/player-stats";

type props = {
    name: string;
    page: number;
    history: HistoryRecordByPage;
};

export default function Player({ name, page, history }: props) {
    return (
        <>
            <h1
                className={clsx(
                    "h-12 mt-32",
                    "font-semibold text-5xl",
                    "sticky top-0",
                    "bg-white z-10"
                )}
            >
                {name}
            </h1>
            <PlayerStats name={name} />
            <ul
                className={clsx(
                    "my-2",
                    "divide-y border border-gray-200 dark:border-gray-700",
                    "rounded overflow-hidden"
                )}
            >
                {history.page.map((game) => (
                    <HistoryRow key={game.id} game={game} player={name} />
                ))}
            </ul>
            <PaginationNav
                page={page}
                name={name}
                canGoPrev={history.prevAvailable}
                canGoNext={history.nextAvailable}
            />
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
