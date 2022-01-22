export { default } from "./database/connection";

export { default as refreshDatabase } from "./update-db-from-api";

export { default as getHistoryByCursor } from "./database/queries/history-cursor";
export { default as getHistoryByPage } from "./database/queries/history-paged";
export { default as getLastCursor } from "./database/queries/bad-api-cursors";
export { default as getPlayerStats } from "./database/queries/player-stats";

export type { MatchRecord, StatsRecord } from "./database/queries/types";
export type { HistoryRecord as HistoryRecordByCursor } from "./database/queries/history-cursor";
export type { HistoryRecord as HistoryRecordByPage } from "./database/queries/history-paged";
