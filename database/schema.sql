CREATE TABLE gestures (
    id         INTEGER PRIMARY KEY,
    shape_name TEXT    UNIQUE NOT NULL
);

INSERT INTO gestures
       (id, shape_name)
VALUES (0,  'rock'),
       (1,  'paper'),
       (2,  'scissors');

--------------------------------------------------------------------------------

CREATE TABLE players (
    id        SERIAL PRIMARY KEY,
    full_name TEXT   UNIQUE NOT NULL
);

--------------------------------------------------------------------------------

CREATE TABLE unequal_matches (
    id                BIGINT      PRIMARY KEY,
    played_at         TIMESTAMPTZ NOT NULL,
    winner_player_id  INTEGER     NOT NULL REFERENCES players,
    loser_player_id   INTEGER     NOT NULL REFERENCES players,
    winner_gesture_id INTEGER     NOT NULL REFERENCES gestures,
    loser_gesture_id  INTEGER     NOT NULL REFERENCES gestures,
    INDEX (winner_player_id),
    INDEX (loser_player_id),
);

CREATE TABLE tied_matches (
    id          BIGINT      PRIMARY KEY,
    played_at   TIMESTAMPTZ NOT NULL,
    player_a_id INTEGER     NOT NULL REFERENCES players,
    player_b_id INTEGER     NOT NULL REFERENCES players,
    gesture_id  INTEGER     NOT NULL REFERENCES gestures,
    INDEX (player_a_id),
    INDEX (player_b_id)
);