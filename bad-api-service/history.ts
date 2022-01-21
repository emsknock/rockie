import { historyUrl } from "utils/env";

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

        const nextUrl = page.cursor ? new URL(page.cursor, url) : null;

        const currentCursor = url.searchParams.get("cursor");
        const nextCursor = nextUrl?.searchParams.get("cursor") ?? null;

        yield {
            data: page.data,
            cursor: currentCursor,
            nextCursor,
        };

        if (
            nextCursor === targetCursor ||
            nextCursor === null ||
            page.data.length === 0
        ) {
            return;
        }

        url = nextUrl!;
        // TODO: Dynamic rate limiting based on api responses
        await sleep(150);
    }
}

function sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}
