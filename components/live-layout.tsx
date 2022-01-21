import { FC } from "react";
import useSocketState from "bad-api-service/live/socket-state";
import { LiveMatch } from "components/live-match-listing";

export const LiveLayout: FC = ({ children }) => {
    const matches = useSocketState((s) => s.matches);

    return (
        <>
            <h1>Live layout!</h1>
            <h2>Ongoing games</h2>
            <ul>
                {matches.map((match) => (
                    <LiveMatch key={match.id} {...match} />
                ))}
            </ul>
            {children}
        </>
    );
};
