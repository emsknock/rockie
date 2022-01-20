import { GestureId } from "database/utils";

export const enum GameResult {
    tie = 0,
    aWins = 1,
    bWins = 2,
}

export const gameResult = (a: GestureId, b: GestureId): GameResult =>
    (3 + a - b) % 3;
