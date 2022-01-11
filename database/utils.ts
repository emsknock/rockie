import db from "./connection";

export const getMatchesBeforeTimestamp = async (
    ts: Date,
    limit = 50
): Promise<
    Array<{
        played_at: Date;
        winner_player_name: string;
        loser_player_name: string;
        winner_gesture_name: string;
        loser_gesture_name: string;
    }>
> =>
    db
        .selectFrom(
            db
                .selectFrom("unequal_matches")
                .select([
                    "played_at",
                    "winner_player_id",
                    "loser_player_id",
                    "winner_gesture_id",
                    "loser_gesture_id",
                ])
                .unionAll(
                    db
                        .selectFrom("tied_matches")
                        .select([
                            "played_at",
                            "player_a_id as winner_player_id",
                            "player_b_id as loser_player_id",
                            "gesture_id as winner_gesture_id",
                            "gesture_id as loser_gesture_id",
                        ])
                )
                .as("matches")
        )
        .select([
            "played_at",
            (subquery) =>
                subquery
                    .selectFrom("players")
                    .select("full_name")
                    .whereRef("id", "=", "matches.winner_player_id")
                    .as("winner_player_name"),
            (subquery) =>
                subquery
                    .selectFrom("players")
                    .select("full_name")
                    .whereRef("id", "=", "matches.loser_player_id")
                    .as("loser_player_name"),
            (subquery) =>
                subquery
                    .selectFrom("gestures")
                    .select("shape_name")
                    .whereRef("id", "=", "matches.winner_gesture_id")
                    .as("winner_gesture_name"),
            (subquery) =>
                subquery
                    .selectFrom("gestures")
                    .select("shape_name")
                    .whereRef("id", "=", "matches.loser_gesture_id")
                    .as("loser_gesture_name"),
        ])
        .where("played_at", "<", ts)
        .limit(limit)
        .execute();
