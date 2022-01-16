import { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getPlayerStats, StatsRecord } from "../database/queries/player";

type props = {
    stats: StatsRecord | null;
};

const Player: NextPage<props> = ({ stats }) => {
    const router = useRouter();
    const playerName = router.query.player as string;

    // TODO: Actual 404 pages
    if (!stats) return <>No such player: {playerName}</>;

    const winCount = stats.wonMatches.count;
    const loseCount = stats.lostMatches.count;

    return (
        <>
            <h1>{playerName}</h1>
            <p>
                Win ratio: {(winCount / loseCount).toFixed(2)} ({winCount} wins
                / {loseCount} losses)
            </p>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<props> = async ({
    query,
}) => ({
    props: { stats: await getPlayerStats(query.player as string) },
});

export default Player;
