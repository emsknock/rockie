import db from "../connection";
import type { StatsRecord } from "./types";
import { GestureId } from "utils/gestures";

export type PlayerStatsRecord = {
    overall: StatsRecord;
    tiedMatches: StatsRecord;
    wonMatches: StatsRecord;
    lostMatches: StatsRecord;
};

const countByCol = (column: string, value: any) =>
    db.raw<number>("count(case when ?? = ? then 1 end)", [column, value]);

const statSelectors = (column: string) =>
    [
        db.fn.count<number>("id").as("count"),
        countByCol(column, GestureId.rock).as("rockCount"),
        countByCol(column, GestureId.paper).as("paperCount"),
        countByCol(column, GestureId.scissors).as("scissorsCount"),
    ] as const;

/**
 * Determines gesture statistics for a given player separated by match outcome
 *
 * Counts the times a player has lost, won, or tied, and for each outcome,
 * which gestures the player has played. Also computes the sum of all three
 * into `overall` statistics.
 */
export default async function getPlayerStats(
    name: string
): Promise<PlayerStatsRecord | null> {
    const selectPlayerId = await db
        .selectFrom("players")
        .select("id")
        .where("full_name", "=", name)
        .executeTakeFirst();

    if (!selectPlayerId?.id) return null;

    const playerId = selectPlayerId.id;

    const statsByMatchType = {
        tiedMatches: await db
            .selectFrom("tied_matches")
            .select(statSelectors("gesture_id"))
            .where("player_a_id", "=", playerId)
            .orWhere("player_b_id", "=", playerId)
            .executeTakeFirstOrThrow(),
        wonMatches: await db
            .selectFrom("unequal_matches")
            .select(statSelectors("winner_gesture_id"))
            .where("winner_player_id", "=", playerId)
            .executeTakeFirstOrThrow(),
        lostMatches: await db
            .selectFrom("unequal_matches")
            .select(statSelectors("loser_gesture_id"))
            .where("loser_player_id", "=", playerId)
            .executeTakeFirstOrThrow(),
    };

    const tied = statsByMatchType.tiedMatches;
    const won = statsByMatchType.wonMatches;
    const lost = statsByMatchType.lostMatches;

    return {
        ...statsByMatchType,
        overall: {
            count: tied.count + won.count + lost.count,
            rockCount: tied.rockCount + won.rockCount + lost.rockCount,
            paperCount: tied.paperCount + won.paperCount + lost.paperCount,
            scissorsCount:
                tied.scissorsCount + won.scissorsCount + lost.scissorsCount,
        },
    };
}
