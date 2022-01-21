import { FC } from "react";
import { LiveMatch } from "components/live-match-listing";
import { useLiveState } from "bad-api-service/live/hook";

export const LiveLayout: FC = ({ children }) => {
    const { matches, isConnected } = useLiveState();

    return (
        <>
            <h1>Live layout!</h1>
            <h2>Ongoing games</h2>
            {!isConnected && <div>Fallback mode</div>}
            <ul>
                {matches.map((match) => (
                    <LiveMatch key={match.id} {...match} />
                ))}
            </ul>
            {children}
        </>
    );
};
