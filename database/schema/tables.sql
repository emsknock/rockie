CREATE TABLE gestures (
    id         INTEGER PRIMARY KEY,
    shape_name TEXT    UNIQUE NOT NULL
);
INSERT INTO gestures
       (id, shape_name)
VALUES (0, 'rock'),
       (1, 'paper'),
       (2, 'scissors');

CREATE TABLE players (
    id        SERIAL PRIMARY KEY,
    full_name TEXT   UNIQUE NOT NULL
);

CREATE TABLE unequal_matches (
    id                BIGINT  PRIMARY KEY,
    winner_player_id  INTEGER REFERENCES players,
    winner_gesture_id INTEGER REFERENCES gestures,
    loser_player_id   INTEGER REFERENCES players,
    loser_gesture_id  INTEGER REFERENCES gestures
);

CREATE TABLE tied_matches (
    id          BIGINT  PRIMARY KEY,
    player_a_id INTEGER REFERENCES players,
    player_b_id INTEGER REFERENCES players,
    gesture_id  INTEGER REFERENCES gestures
);
