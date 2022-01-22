export { default } from "./database/connection";

export { default as refreshDatabase } from "./update-db-from-api";

export { default as getHistoryByCursor } from "./database/queries/history-cursor";
export { default as getLastCursor } from "./database/queries/bad-api-cursors";
export { default as getPlayerStats } from "./database/queries/player-stats";

export type {
    MatchRecord,
    PlayerMatchesPage,
} from "./database/queries/history-cursor";
export type { StatsRecord } from "./database/queries/player-stats";
