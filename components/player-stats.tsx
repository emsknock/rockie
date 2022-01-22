import { FC, ReactElement } from "react";
import clsx from "clsx";
import useSWR from "swr";
import { PlayerStatsRecord } from "bad-api-service/history";
import { GestureId } from "utils/gestures";
import { Gesture } from "./gesture";

export const PlayerStats: FC<{ name: string }> = ({ name }) => {
    const { data } = useSWR<PlayerStatsRecord>(`/api/${name}/stats`, {
        refreshInterval: 100,
    });
    const totalGames = data ? data.overall.count : null;
    const winRatio = data ? data.wonMatches.count / data.overall.count : null;

    // Gestures can be tied, so we'll show all the gestures
    // that have been played this many times
    const mostPlayedNumber = data
        ? Math.max(
              data.overall.rockCount,
              data.overall.paperCount,
              data.overall.scissorsCount
          )
        : null;

    return (
        <div className={clsx("flex justify-around my-6")}>
            <StatContainer
                title="Win ratio"
                component={
                    winRatio !== null && <BigPercentage ratio={winRatio} />
                }
            />
            <StatContainer
                title="Games played"
                component={totalGames !== null && <BigNumber n={totalGames} />}
            />
            <StatContainer
                title="Most played"
                component={
                    !!data && (
                        <BigGestures
                            r={data.overall.rockCount === mostPlayedNumber}
                            p={data.overall.paperCount === mostPlayedNumber}
                            s={data.overall.scissorsCount === mostPlayedNumber}
                        />
                    )
                }
            />
        </div>
    );
};

const StatContainer: FC<{ title: string; component: ReactElement | false }> = ({
    title,
    component,
}) => (
    <div className={clsx("w-40")}>
        <div
            className={clsx(
                "text-center",
                "uppercase text-sm",
                "text-gray-600"
            )}
        >
            {title}
        </div>
        {component}
        {!component && (
            <div
                className={clsx(
                    "w-full h-9",
                    "rounded",
                    "bg-gray-200 dark:bg-gray-700 animate-pulse"
                )}
            />
        )}
    </div>
);

const BigPercentage: FC<{ ratio: number }> = ({ ratio }) => {
    const [left, right] = (ratio * 100).toFixed(1).split(".");
    return (
        <div className="text-center">
            <span className="text-4xl">{left}</span>.
            <span className="text-xl">{right}</span>
            <span className="text-xl">%</span>
        </div>
    );
};

const BigNumber: FC<{ n: number }> = ({ n }) => (
    <div className="text-center">
        <span className="text-4xl">{n}</span>
    </div>
);

const BigGestures: FC<{ r: boolean; p: boolean; s: boolean }> = ({
    r,
    p,
    s,
}) => (
    <div className="flex justify-center gap-2 text-4xl">
        {r && <Gesture fill={false} id={GestureId.rock} />}
        {p && <Gesture fill={false} id={GestureId.paper} />}
        {s && <Gesture fill={false} id={GestureId.scissors} />}
    </div>
);
