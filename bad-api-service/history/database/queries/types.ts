import { GestureId } from "utils/gestures";

export type MatchRecord = {
    id: number;
    winnerName: string | null;
    loserName: string | null;
    winnerHand: GestureId;
    loserHand: GestureId;
    playedAt: number;
    matchType: "tied" | "unequal";
};

export type StatsRecord = {
    count: number;
    rockCount: number;
    paperCount: number;
    scissorsCount: number;
};
