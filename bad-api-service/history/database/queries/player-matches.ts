import db from "../connection";
import { GestureId } from "utils/gestures";

export type MatchRecord = {
    id: number;
    winnerName: string | null;
    loserName: string | null;
    winnerHand: GestureId;
    loserHand: GestureId;
    playedAt: number;
    matchType: "tied" | "unequal";
};

export default async function getPlayerMatches(
    name: string,
    [cursorTime, cursorId]: [number, number],
    direction: "forwards" | "backwards" = "forwards",
    limit = 50
): Promise<MatchRecord[]> {
    const isForwards = direction === "forwards";

    const selectPlayerId = db
        .selectFrom("players")
        .select("id")
        .where("full_name", "=", name);

    return db
        .selectFrom((subquery) =>
            subquery
                .selectFrom("unequal_matches")
                .select([
                    "id",
                    "winner_player_id",
                    "loser_player_id",
                    "winner_gesture_id",
                    "loser_gesture_id",
                    "played_at",
                    subquery
                        .raw<"unequal" | "tied">("'unequal'")
                        .as("match_type"),
                ])
                .unionAll(
                    subquery
                        .selectFrom("tied_matches")
                        .select([
                            "id",
                            "player_a_id as winner_player_id",
                            "player_b_id as loser_player_id",
                            "gesture_id as winner_gesture_id",
                            "gesture_id as loser_gesture_id",
                            "played_at",
                            subquery
                                .raw<"unequal" | "tied">("'tied'")
                                .as("match_type"),
                        ])
                )
                .where("winner_player_id", "=", selectPlayerId)
                .orWhere("loser_player_id", "=", selectPlayerId)
                .orderBy("played_at", "desc")
                .orderBy("id", "asc")
                .where("played_at", isForwards ? "<=" : ">=", cursorTime)
                .where("id", isForwards ? ">" : "<=", cursorId)
                .limit(limit)
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
        .select([
            "normalised_matches.id as id",
            "winner_player.full_name as winnerName",
            "loser_player.full_name as loserName",
            "normalised_matches.winner_gesture_id as winnerHand",
            "normalised_matches.loser_gesture_id as loserHand",
            "played_at as playedAt",
            "match_type as matchType",
        ])
        .execute();
}
