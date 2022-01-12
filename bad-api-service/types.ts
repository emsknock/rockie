export type Gesture = "ROCK" | "PAPER" | "SCISSORS";

export type GameBegin = {
    type: "GAME_BEGIN";
    gameId: string;
    playerA: { name: string };
    playerB: { name: string };
};

export type GameResult = {
    type: "GAME_RESULT";
    gameId: string;
    t: number;
    playerA: { name: string; played: Gesture };
    playerB: { name: string; played: Gesture };
};
