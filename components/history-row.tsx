import type { MatchRecord } from "bad-api-service/history";
import type { FC } from "react";

import dayJS from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import clsx from "clsx";
import { Gesture } from "./gesture";

dayJS.extend(relativeTime);

const groupHoverUp =
    "translate-y-2 group-hover:translate-y-0 transition-transform";
const groupHoverOpacity =
    "opacity-0 group-hover:opacity-100 transition-opacity";
const winnerText = "text-black dark:text-white font-bold";
const loserText = "text-900 dark:text-gray-300";

export const HistoryRow: FC<{ game: MatchRecord; player: string }> = ({
    game: { winnerName, loserName, matchType, playedAt, winnerHand, loserHand },
    player,
}) => {
    const ownWin = winnerName === player;
    const isTie = matchType === "tied";

    const leftName = player;
    const leftGesture = ownWin ? winnerHand : loserHand;
    const rightName = ownWin ? loserName : winnerName;
    const rightGesture = ownWin ? loserHand : winnerHand;
    const timestamp = new Date(playedAt);

    return (
        <li
            className={`
                grid grid-cols-[1fr_2rem_1fr] grid-rows-[1fr_1rem]
                px-3 py-2
                bg-gray-100 dark:bg-gray-800
                border-gray-200 dark:border-gray-700
                group
            `}
        >
            <span
                className={clsx(
                    "col-span-1 text-right",
                    "flex gap-2 justify-end items-center",
                    "align-bottom",
                    !isTie && ownWin ? winnerText : loserText,
                    groupHoverUp
                )}
            >
                <span>{leftName}</span>
                <Gesture id={leftGesture} fill={!isTie && ownWin} flip={true} />
            </span>
            <span
                className={clsx(
                    "col-span-1 text-center",
                    "self-center",
                    groupHoverUp
                )}
            >
                vs
            </span>
            <span
                className={clsx(
                    "col-span-1 text-left",
                    "flex gap-2 justify-start items-center",
                    "align-bottom",
                    !isTie && !ownWin ? winnerText : loserText,
                    groupHoverUp
                )}
            >
                <Gesture
                    id={rightGesture}
                    fill={!isTie && !ownWin}
                    flip={false}
                />
                {rightName === player ? (
                    <span>{rightName}</span>
                ) : (
                    <Link href={`/player/${rightName}`}>
                        <a className="group-hover:text-blue-500">{rightName}</a>
                    </Link>
                )}
            </span>
            <div
                className={clsx(
                    "col-span-3 text-center",
                    "text-xs text-gray-500",
                    groupHoverOpacity
                )}
            >
                {dayJS(timestamp).fromNow()}
            </div>
        </li>
    );
};
