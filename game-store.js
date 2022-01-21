const parseApiMessage = require("./api-events");

// JS maps are iterated in insertion order, so it's safe to use here
const games = new Map();

const beginGame = ({ id, ...game }) => {
    ongoingGames.set(game.id, {
        id,
        isResolved: false,
        startedAt: Date.now(),
        aPlayer: game.aPlayer,
        bPlayer: game.bPlayer,
    });
};

const resolveGame = ({ id, ...game }) => {
    setTimeout(() => games.delete(id), 5000);
    ongoingGames.delete(id);
    resolvedGames.set(id, {
        id,
        isResolved: true,
        playedAt: game.t,
        aPlayer: game.aPlayer,
        bPlayer: game.bPlayer,
        result: (3 + game.aGesture - game.bGesture) % 3,
        aGesture: game.aGesture,
        bGesture: game.bGesture,
    });
};

module.exports = {
    handleEvent: (data) => {
        const { type, ...game } = parseApiMessage(data);
        switch (type) {
            case "GAME_BEGIN":
                return beginGame(game);
            case "GAME_RESULT":
                return resolveGame(game);
        }
    },
    readout: () => Array.from(games.values()),
};
