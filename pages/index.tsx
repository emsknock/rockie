import type { NextPage, GetServerSideProps } from "next";
import { getLatestMatches, MatchRecord } from "../database/queries/latest";

type props = {
    ongoingGames: Array<[number, [string, string]]>;
    latestMatches: MatchRecord[];
};

const Home: NextPage<props> = ({ latestMatches }) => {
    return (
        <>
            <h1>Latest matches</h1>
            <p>
                <ul>
                    {latestMatches.map((match) => (
                        <li key={match.id}>
                            {match.winnerName} ({match.winnerHand}) vs (
                            {match.loserHand}) {match.loserName}
                        </li>
                    ))}
                </ul>
            </p>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    const latestMatches = await getLatestMatches(50);

    return {
        props: {
            latestMatches,
        },
    };
};

export default Home;
