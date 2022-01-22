export { default } from "./database/connection";

export { default as refreshDatabase } from "./update-db-from-api";

export {
    default as getPlayerMatches,
    isValidCursor,
} from "./database/queries/player-matches";
export { default as getLastCursor } from "./database/queries/bad-api-cursors";
export { default as getPlayerStats } from "./database/queries/player-stats";

export type {
    MatchRecord,
    PlayerMatchesPage,
} from "./database/queries/player-matches";
export type { StatsRecord } from "./database/queries/player-stats";
