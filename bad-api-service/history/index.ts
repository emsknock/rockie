export { default } from "./database/connection";

export { default as refreshDatabase } from "./update-db-from-api";

export { default as getLastCursor } from "./database/queries/bad-api-cursors";
export { default as getPlayerMatches } from "./database/queries/player-matches";
export { default as getPlayerStats } from "./database/queries/player-stats";

export type { MatchRecord } from "./database/queries/player-matches";
export type { StatsRecord } from "./database/queries/player-stats";
