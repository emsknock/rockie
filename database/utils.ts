import { xxh32 } from "@node-rs/xxhash";

export const normaliseMatchId = (gameId: string) => xxh32(gameId);

export const gestureId = (name: string) => {
    switch (name.toLowerCase()) {
        case "rock":
            return 0;
        case "paper":
            return 1;
        case "scissors":
            return 2;
        default:
            throw Error(`Unknown gesture name: ${name}`);
    }
};
