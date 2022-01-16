import { GameResult } from "./types";
const historyUrl = process.env.BAD_API_HISTORY_URL;

export async function* fetchUntilCursor(targetCursor: string | null) {
    type ApiPage = {
        cursor: string | null;
        data: GameResult[];
    };

    if (!historyUrl) throw Error("Please specify BAD_API_HISTORY_URL in .env");

    let url = new URL(historyUrl);

    while (true) {
        const response = await fetch(url.toString());
        const page: ApiPage = await response.json();

        if (page.data.length === 0) return;

        yield page;

        const nextCursor = page.cursor;
        if (nextCursor === targetCursor || nextCursor === null) {
            return;
        }

        url = new URL(nextCursor, url);
        // TODO: Dynamic rate limiting based on api responses
        await sleep(150);
    }
}

function sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}
