const { historyUrl } = require("../utils/env");
const fetch = require("node-fetch");

function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

async function* fetchUntilCursor(targetCursor) {
    let url = new URL(historyUrl);

    while (true) {
        const response = await fetch(url.toString());
        const page = await response.json();

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

        url = nextUrl;
        // TODO: Dynamic rate limiting based on api responses
        await sleep(50);
    }
}

module.exports = fetchUntilCursor;
