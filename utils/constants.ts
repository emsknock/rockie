const missing = ([varName]: TemplateStringsArray) =>
    `Please specify ${varName} in .env`;

export const postgresUrl = process.env.POSTGRES_URL!;
if (!postgresUrl) throw Error(missing`POSTGRES_URL`);
export const historyUrl = process.env.BAD_API_HISTORY_URL!;
if (!historyUrl) throw Error(missing`BAD_API_HISTORY_URL`);
export const liveUrl = process.env.NEXT_PUBLIC_BAD_API_LIVE_URL!;
if (!liveUrl) throw Error(missing`NEXT_PUBLIC_BAD_API_LIVE_URL`);
export const watcherUrl = process.env.LIVE_API_WATCHER_URL!;
if (!watcherUrl) throw Error(missing`LIVE_API_WATCHER_URL`);
