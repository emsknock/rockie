import { Generated } from "kysely";

export interface RpsDatabase {
    gestures: {
        id: number;
        shape_name: "rock" | "paper" | "scissors";
    };

    players: {
        id: Generated<number>;
        full_name: string;
    };

    unequal_matches: {
        id: BigInt;
        played_at: Date;
        winner_player_id: number;
        loser_player_id: number;
        winner_gesture_id: number;
        loser_gesture_id: number;
    };
    tied_matches: {
        id: BigInt;
        played_at: Date;
        player_a_id: number;
        player_b_id: number;
        gesture_id: number;
    };

    staging_matches: {
        id: BigInt;
        played_at_epoch: number;
        player_a_full_name: string;
        player_b_full_name: string;
        player_a_gesture_id: number;
        player_b_gesture_id: number;
    };
}
