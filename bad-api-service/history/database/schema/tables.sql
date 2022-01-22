/**
 * The gestures are expected to go in the exact order of rock, paper,
 * and scissors. Keeping this constant allows us to take some handy shortcuts
 * in other places (look at the references to utils/game-ids.ts)
 */
CREATE TABLE gestures (
    id         INTEGER PRIMARY KEY,
    shape_name TEXT    UNIQUE NOT NULL
);
INSERT INTO gestures
       (id, shape_name)
VALUES (0, 'rock'),
       (1, 'paper'),
       (2, 'scissors');

-------------------------------------------------------------------------------

/**
 * The Bad Api didn't give players any sort of ids, so we'll generate our own
 * ids for them.
 */
CREATE TABLE players (
    id        SERIAL PRIMARY KEY,
    full_name TEXT   UNIQUE NOT NULL
);

-------------------------------------------------------------------------------

/**
 * Tied and unequal games are stored in their own tables. This way we don't
 * need to constantly determine match results again and again when using our
 * data, nor do we need a separate column for match winner/loser
 */
CREATE TABLE unequal_matches (
    /**
     * The Bad Api has its own Game IDs, but they were variable length
     * hexadecimal strings, so it's easier (and probably more performant) to
     * use our own ids that are derived from Bad Api's ids.
     * Look at utils/game-ids.ts for more
     */
    id                INTEGER PRIMARY KEY,
    played_at         BIGINT,
    winner_player_id  INTEGER REFERENCES players,
    winner_gesture_id INTEGER REFERENCES gestures,
    loser_player_id   INTEGER REFERENCES players,
    loser_gesture_id  INTEGER REFERENCES gestures
);
CREATE INDEX unequal_matches_played_at_idx ON unequal_matches (played_at);

CREATE TABLE tied_matches (
    id          INTEGER PRIMARY KEY,
    played_at   BIGINT,
    player_a_id INTEGER REFERENCES players,
    player_b_id INTEGER REFERENCES players,
    gesture_id  INTEGER REFERENCES gestures
);
CREATE INDEX tied_matches_played_at_idx ON tied_matches (played_at);

-------------------------------------------------------------------------------

/**
 * This simply stores the last encountered Bad Api cursor so we don't
 * traverse the whole pageset every time we update our database
 */
CREATE TABLE app_meta (
    last_cursor TEXT
);