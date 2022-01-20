import { GestureId } from "utils/gestures";

export const enum GameResult {
    tie = 0,
    aWins = 1,
    bWins = 2,
}

export const gameResult = (a: GestureId, b: GestureId): GameResult =>
    (3 + a - b) % 3;
