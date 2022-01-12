const baseUrl = process.env.API_BASE_URL;
const firstCursor = process.env.API_HISTORY_ENDPOINT;
if (!firstCursor) throw Error("Please specify API_HISTORY_ENDPOINT in .env");
if (!baseUrl) throw Error("Please specify API_BASE_URL in .env");

export async function* fetchUntilCursor(targetCursor: string | null) {
    let currentCursor: string | null = firstCursor!;
    while (currentCursor) {
        const response = await fetch(`${baseUrl}${currentCursor}`);
        const page = await response.json();

        const nextCursor = page.cursor as string;
        if (nextCursor === targetCursor) return page;

        yield page;
        currentCursor = nextCursor;
    }
}
