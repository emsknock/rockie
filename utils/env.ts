const isBrowser = typeof window !== "undefined";
const isNode = !isBrowser;
const missing = ([varName]: TemplateStringsArray) =>
    `Please specify ${varName} in .env`;

export const postgresUrl = process.env.POSTGRES_URL!;
if (isNode && !postgresUrl) throw Error(missing`POSTGRES_URL`);
export const historyUrl = process.env.BAD_API_HISTORY_URL!;
if (isNode && !historyUrl) throw Error(missing`BAD_API_HISTORY_URL`);
export const liveUrl = process.env.NEXT_PUBLIC_BAD_API_LIVE_URL!;
if (isBrowser && !liveUrl) throw Error(missing`NEXT_PUBLIC_BAD_API_LIVE_URL`);
export const watcherUrl = process.env.NEXT_PUBLIC_LIVE_API_WATCHER_URL!;
if (isBrowser && !watcherUrl)
    throw Error(missing`NEXT_PUBLIC_LIVE_API_WATCHER_URL`);
