CREATE TABLE staging_matches (
    id                  BIGINT  PRIMARY KEY,
    player_a_full_name  TEXT,
    player_b_full_name  TEXT,
    player_a_gesture_id INTEGER,
    player_b_gesture_id INTEGER
);

/**
 * Compares two gestures to each other.
 * 
 * Returns 0 if gestures are equal, 1 if $1 wins, 2 if $2 wins.
 */
CREATE FUNCTION game_result(INTEGER, INTEGER) RETURNS INTEGER
     STRICT
     STABLE
   PARALLEL SAFE
   LANGUAGE PLPGSQL
AS $$
DECLARE
    n integer := (SELECT COUNT(*) FROM gestures);
BEGIN
    RETURN (n + $1 - $2) % n;
END;
$$;

/**
 * Selects the player id from the players table based on the full_name column.
 *
 * Separated into its own function to avoid code repetition.
 */
CREATE FUNCTION player_id_by_name(TEXT) RETURNS players.id%TYPE
    STRICT
    STABLE
  PARALLEL SAFE
  LANGUAGE SQL
AS $$ SELECT id FROM players WHERE players.full_name = $1; $$;

CREATE FUNCTION load_staged_matches()
    RETURNS TRIGGER 
   LANGUAGE PLPGSQL
AS $$
BEGIN
-- Upsert player names from staging area to the players table
     INSERT INTO players
            (full_name)
     SELECT staging.full_name
       FROM players
            RIGHT JOIN (SELECT a.player_a_full_name AS full_name
                          FROM staging_matches AS a
                         UNION
                        SELECT b.player_b_full_name AS full_name
                          FROM staging_matches AS b)
                       AS staging
                    ON players.full_name = staging.full_name
      WHERE players.id IS null
ON CONFLICT DO NOTHING;

-- All players in staging now definitely have an id, so it is safe to insert matches 
      INSERT INTO tied_matches
             (id, player_a_id, player_b_id, gesture_id)
      SELECT staging.id,
             player_id_by_name(staging.player_a_full_name),
             player_id_by_name(staging.player_b_full_name),
             player_a_gesture_id
        FROM staging_matches AS staging
       WHERE game_result(staging.player_a_gesture_id, staging.player_b_gesture_id) = 0
 ON CONFLICT DO NOTHING;

-- Unequal matches where player A won i.e. game_result(a, b) = 1
     INSERT INTO unequal_matches
            (id, winner_player_id, loser_player_id, winner_gesture_id, loser_gesture_id)
     SELECT staging.id,
            player_id_by_name(staging.player_a_full_name) AS winner_player_id,
            player_id_by_name(staging.player_b_full_name) AS loser_player_id,
            player_a_gesture_id AS winner_gesture_id,
            player_b_gesture_id AS loser_gesture_id
       FROM staging_matches AS staging
      WHERE game_result(staging.player_a_gesture_id, staging.player_b_gesture_id) = 1
ON CONFLICT DO NOTHING;

-- Unequal matches where player B won i.e. game_result(a, b) = 2
INSERT INTO unequal_matches
            (id, winner_player_id, loser_player_id, winner_gesture_id, loser_gesture_id)
     SELECT staging.id,
            player_id_by_name(staging.player_b_full_name) AS winner_player_id,
            player_id_by_name(staging.player_a_full_name) AS loser_player_id,
            player_b_gesture_id AS winner_gesture_id,
            player_a_gesture_id AS loser_gesture_id
       FROM staging_matches AS staging
      WHERE game_result(staging.player_a_gesture_id, staging.player_b_gesture_id) = 2
ON CONFLICT DO NOTHING;

RETURN NULL;
END;
$$;

  CREATE TRIGGER auto_load_staged_matches
   AFTER INSERT
      ON staging_matches
FOR EACH STATEMENT
 EXECUTE PROCEDURE load_staged_matches();
