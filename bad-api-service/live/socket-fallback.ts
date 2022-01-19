const watcherUrl = process.env.LIVE_API_WATCHER_URL;

export default async function fallbackFetch() {
    if (!watcherUrl) throw Error("Please specify LIVE_API_WATCHER_URL in .env");
    const state = await fetch(watcherUrl).then((res) => res.json());
    return state;
}
