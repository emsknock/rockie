import type {
    StateOngoingMatch,
    StateResolvedMatch,
} from "bad-api-service/live/types";

import clsx from "clsx";
import { useEffect } from "react";
import { useLiveState } from "bad-api-service/live/hook";
import { useRouter } from "next/router";
import { Gesture } from "components/gesture";
import { GameResult } from "utils/game-result";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import Link from "next/link";

type props = {
    game: StateOngoingMatch | StateResolvedMatch;
};

export function LiveGame({ game }: props) {
    const { query } = useRouter();
    const { clearGame } = useLiveState();

    const currentPlayer = (query.name as string) ?? false;
    const aWin = game.isResolved && game.result === GameResult.aWins;
    const bWin = game.isResolved && game.result === GameResult.bWins;

    useEffect(
        function autoRemoveSelf() {
            if (!game.isResolved) return;
            const expire = setTimeout(() => clearGame(game.id), 5000);
            return () => {
                clearTimeout(expire);
            };
        },
        [game.isResolved, game.id]
    );

    return (
        <li
            className={clsx(
                "px-3 py-2",
                "flex gap-2 items-center",
                "bg-gray-100 dark:bg-gray-800",
                "border border-gray-200 dark:border-gray-700",
                "rounded",
                "group"
            )}
        >
            {game.isResolved ? <DoneIndicator /> : <LiveIndicator />}
            <span
                className={clsx(
                    "basis-0 grow",
                    "text-sm",
                    "flex items-center gap-2 justify-end"
                )}
            >
                <span className={clsx(game.isResolved && aWin && "font-bold")}>
                    {currentPlayer === game.aPlayer ? (
                        game.aPlayer
                    ) : (
                        <LinkToPlayer name={game.aPlayer} />
                    )}
                </span>
                {game.isResolved && (
                    <Gesture id={game.aGesture} fill={aWin} flip={true} />
                )}
            </span>
            <span className="text-sm">vs</span>
            <span
                className={clsx(
                    "basis-0 grow",
                    "text-sm",
                    "flex items-center gap-2 justify-start"
                )}
            >
                {game.isResolved && (
                    <Gesture id={game.bGesture} fill={bWin} flip={false} />
                )}
                <span className={clsx(game.isResolved && bWin && "font-bold")}>
                    {currentPlayer === game.bPlayer ? (
                        game.bPlayer
                    ) : (
                        <LinkToPlayer name={game.bPlayer} />
                    )}
                </span>
            </span>
        </li>
    );
}

const LiveIndicator = () => (
    <FaCircle
        className={clsx(
            "align-middle animate-pulse",
            "text-red-600",
            "dark:text-red-500"
        )}
    />
);

const DoneIndicator = () => (
    <FaCheckCircle
        className={clsx(
            "align-middle",
            "text-green-600",
            "dark:text-green-500"
        )}
    />
);

const LinkToPlayer = ({ name }: { name: string }) => (
    <Link href={`/player/${name}`}>
        <a className="group-hover:text-blue-500 transition-colors">{name}</a>
    </Link>
);
