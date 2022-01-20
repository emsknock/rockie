import db from "database/connection";
import { GestureId } from "utils/gestures";

type ResultTypeStats = {
    count: number;
    rockCount: number;
    paperCount: number;
    scissorsCount: number;
};
export type StatsRecord = {
    tiedMatches: ResultTypeStats;
    wonMatches: ResultTypeStats;
    lostMatches: ResultTypeStats;
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

export const getPlayerStats = async (
    name: string
): Promise<StatsRecord | null> => {
    const selectPlayerId = await db
        .selectFrom("players")
        .select("id")
        .where("full_name", "=", name)
        .executeTakeFirst();

    if (!selectPlayerId?.id) return null;

    const playerId = selectPlayerId.id;

    return {
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
};
