import { Generated } from "kysely";

export interface RpsDatabase {
    gestures: {
        id: Generated<number>;
        shape_name: string;
    };

    players: {
        id: Generated<number>;
        full_name: string;
    };

    unequal_matches: {
        id: Generated<number>;
        played_at: Date;
        winner_player_id: number;
        loser_player_id: number;
        winner_gesture_id: number;
        loser_gesture_id: number;
    };
    tied_matches: {
        id: Generated<number>;
        played_at: Date;
        player_a_id: number;
        player_b_id: number;
        gesture_id: number;
    };

    staging_unequal_matches: {
        played_at: number;
        winner_player_name: string;
        loser_player_name: string;
        winner_gesture_name: string;
        loser_gesture_name: string;
    };
    staging_tied_matches: {
        played_at: number;
        player_a_name: string;
        player_b_name: string;
        gesture_name: string;
    };
}
