import type { FC } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { LiveGame } from "components/live-match-listing";
import { useLiveState } from "bad-api-service/live/hook";
import clsx from "clsx";

export const LiveLayout: FC = ({ children }) => {
    const { matches, isConnected } = useLiveState();

    return (
        <div
            className={clsx(
                "max-w-5xl mx-auto px-2",
                "flex gap-8 justify-between"
            )}
        >
            <div className={clsx("grow px-2")}>{children}</div>
            <div className={clsx("py-2", "sticky top-0 self-start")}>
                <div className={clsx("sticky top-0 bg-white z-10")}>
                    <h1 className="h-10 text-2xl text-center">Live Games</h1>
                </div>
                <ul className={clsx("flex flex-col gap-2", "w-96")}>
                    {matches.map((match) => (
                        <LiveGame key={match.id} game={match} />
                    ))}
                </ul>
                {!isConnected && matches.length > 0 && (
                    <div className="p-2 flex gap-4 justify-center items-center text-gray-500">
                        <FaExclamationTriangle />
                        <div>
                            <div>WebSocket disconnected</div>
                            <div>Using (slower) HTTP fallback</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
