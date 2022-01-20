import { FC } from "react";
import useLiveState from "bad-api-service/live/state";

export const LiveLayout: FC = ({ children }) => {
    const matches = useLiveState((s) => s.matches);
    return (
        <>
            <h1>Live layout!</h1>
            <h2>Ongoing games</h2>
            <ul>
                {matches.map((match) => (
                    <li key={match.gameId}>
                        {match.isResolved ? (
                            <>
                                {match.aPlayer} ({match.aPlayerGesture}) vs (
                                {match.bPlayerGesture}) {match.bPlayer}
                            </>
                        ) : (
                            <>
                                {match.aPlayer} vs {match.bPlayer}
                            </>
                        )}
                    </li>
                ))}
            </ul>
            {children}
        </>
    );
};
