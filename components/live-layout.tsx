import { FC } from "react";
import useLiveState from "bad-api-service/live/state";
import { LiveMatch } from "./live-match-listing";

export const LiveLayout: FC = ({ children }) => {
    const matches = useLiveState((s) => s.matches);

    return (
        <>
            <h1>Live layout!</h1>
            <h2>Ongoing games</h2>
            <ul>
                {matches.map((match) => (
                    <LiveMatch key={match.gameId} {...match} />
                ))}
            </ul>
            {children}
        </>
    );
};
