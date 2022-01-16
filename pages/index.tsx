import type { NextPage, GetServerSideProps } from "next";
import { getLatestMatches, MatchRecord } from "../database/queries/latest";
import { updateDatabaseFromApi } from "../utils/update-db-from-api";
const liveWatchUrl = process.env.LIVE_API_WATCHER_URL;

type props = {
    ongoingGames: Array<[number, [string, string]]>;
    latestMatches: MatchRecord[];
};

const Home: NextPage<props> = ({ ongoingGames, latestMatches }) => {
    return (
        <div>
            <h1>Ongoing matches</h1>
            <p>
                <ul>
                    {ongoingGames.map(([id, [aPlayerName, bPlayerName]]) => (
                        <li key={id}>
                            {aPlayerName} vs {bPlayerName}
                        </li>
                    ))}
                </ul>
            </p>
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
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    if (!liveWatchUrl)
        throw Error("Please specify LIVE_API_WATCHER_URL in .env");

    await updateDatabaseFromApi();

    const [liveGames, latestMatches] = await Promise.all([
        fetch(liveWatchUrl).then((res) => res.json()),
        getLatestMatches(50),
    ]);

    return {
        props: {
            ongoingGames: liveGames.ongoing,
            latestMatches,
        },
    };
};

export default Home;
