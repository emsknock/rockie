import { historyUrl } from "utils/env";
import { GameResult } from "./types";

export async function* fetchUntilCursor(targetCursor: string | null) {
    type ApiPage = {
        cursor: string | null;
        data: Array<{
            gameId: string;
            t: number;
            playerA: { name: string; played: "ROCK" | "PAPER" | "SCISSORS" };
            playerB: { name: string; played: "ROCK" | "PAPER" | "SCISSORS" };
        }>;
    };

    let url = new URL(historyUrl);

    while (true) {
        const response = await fetch(url.toString());
        const page: ApiPage = await response.json();
        const currentCursor = url.searchParams.get("cursor");
        const nextCursor = page.cursor;

        const yieldValue = {
            data: page.data,
            cursor: currentCursor,
            nextCursor,
        };

        if (
            nextCursor === targetCursor ||
            nextCursor === null ||
            page.data.length === 0
        ) {
            return yieldValue;
        } else {
            yield yieldValue;
        }

        url = new URL(nextCursor, url);
        // TODO: Dynamic rate limiting based on api responses
        await sleep(150);
    }
}

function sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}
