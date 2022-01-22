import { historyUrl } from "utils/env";

/**
 * Traverses the Bad Api's pages, starting from the current first page and
 * yielding each encountered page and cursor.
 *
 * The Bad Api's first page is always volatile, but all pages that have been
 * assigned cursors seem stable and the path of cursors seems to always be the
 * same, so it's safe to fetch pages from the Api until we see a cursor we've
 * encountered before and stop there.
 */
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
