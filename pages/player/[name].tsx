import type { GetServerSideProps } from "next";
import type { HistoryRecordByPage } from "bad-api-service/history";

import clsx from "clsx";
import { refreshDatabase, getHistoryByPage } from "bad-api-service/history";

import Link from "next/link";
import { HistoryRow } from "components/history-row";
import { PaginationNav } from "components/pagination-nav";
import { PlayerStats } from "components/player-stats";
import { FaArrowLeft } from "react-icons/fa";

type props = {
    name: string;
    page: number;
    history: HistoryRecordByPage;
};

export default function Player({ name, page, history }: props) {
    return (
        <>
            <div className="px-2 py-4">
                <Link href="/">
                    <a
                        className={clsx(
                            "flex items-center gap-2",
                            "text-blue-500"
                        )}
                    >
                        <FaArrowLeft />
                        <span>Back</span>
                    </a>
                </Link>
            </div>
            <h1 className={clsx("mt-28", "font-semibold text-5xl")}>{name}</h1>
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
