import { GameResult } from "utils/game-result";
import { GestureId } from "utils/gestures";

export type ParsedGameBeginEvent = {
    type: "GAME_BEGIN";
    id: number;
    aPlayer: string;
    bPlayer: string;
};
export type ParsedGameResultEvent = {
    type: "GAME_RESULT";
    id: number;
    t: number;
    aPlayer: string;
    bPlayer: string;
    aGesture: GestureId;
    bGesture: GestureId;
};

export type StateResolvedMatch = {
    isResolved: true;
    id: number;
    playedAt: number;
    aPlayer: string;
    bPlayer: string;
    result: GameResult;
    aGesture: GestureId;
    bGesture: GestureId;
};
export type StateOngoingMatch = {
    isResolved: false;
    id: number;
    startedAt: number;
    aPlayer: string;
    bPlayer: string;
};
