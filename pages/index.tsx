import type { NextPage, GetServerSideProps } from "next";
import { getMatches, MatchRecord } from "database/queries/history";

type props = {
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
    const latestMatches = await getMatches({ before: new Date(), limit: 50 });
    return {
        props: {
            latestMatches,
        },
    };
};

export default Home;
