import db from "../connection";

export default async function getLatestMatches(count = 50): Promise<
    Array<{
        match_id: number;
        winner_name: string | null;
        loser_name: string | null;
        winner_hand: string | null;
        loser_hand: string | null;
        played_at: Date;
        match_type: "tied" | "unequal";
    }>
> {
    return db
        .selectFrom((eb) =>
            eb
                .selectFrom("unequal_matches")
                .select([
                    "id",
                    "winner_player_id",
                    "loser_player_id",
                    "winner_gesture_id",
                    "loser_gesture_id",
                    "played_at",
                    db.raw<"unequal" | "tied">("'unequal'").as("match_type"),
                ])
                .unionAll(
                    db
                        .selectFrom("tied_matches")
                        .select([
                            "id",
                            "player_a_id as winner_player_id",
                            "player_b_id as loser_player_id",
                            "gesture_id as winner_gesture_id",
                            "gesture_id as loser_gesture_id",
                            "played_at",
                            db
                                .raw<"unequal" | "tied">("'tied'")
                                .as("match_type"),
                        ])
                )
                .as("normalised_matches")
        )
        .leftJoin(
            "players as winner_player",
            "winner_player.id",
            "normalised_matches.winner_player_id"
        )
        .leftJoin(
            "players as loser_player",
            "loser_player.id",
            "normalised_matches.loser_player_id"
        )
        .leftJoin(
            "gestures as winner_gesture",
            "winner_gesture.id",
            "normalised_matches.winner_gesture_id"
        )
        .leftJoin(
            "gestures as loser_gesture",
            "loser_gesture.id",
            "normalised_matches.loser_gesture_id"
        )
        .select([
            "normalised_matches.id as match_id",
            "winner_player.full_name as winner_name",
            "loser_player.full_name as loser_name",
            "winner_gesture.shape_name as winner_hand",
            "loser_gesture.shape_name as loser_hand",
            "played_at",
            "match_type",
        ])
        .limit(count)
        .orderBy("played_at", "desc")
        .execute();
}
