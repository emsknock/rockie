const ongoingGames = new Map();
const resolvedGames = new Map();

function parseApiMessage(data) {
    // The API sends each event as an escaped string that needs to first be
    // unescaped and then parsed. Easiest to just call `JSON.parse` twice.
    const json = JSON.parse(data);
    const event = JSON.parse(json);
    return event;
}

const startGame = ({ id, ...game }) => {
    ongoingGames.set(id, [game.playerA.name, game.playerB.name]);
};

const endGame = ({ id, ...game }) => {
    const wasOngoing = ongoingGames.delete(id);
    if (wasOngoing) {
        resolvedGames.set(id, game);
    }
};

setInterval(function dropOldResolvedGames() {
    const now = new Date();
    for (const [id, game] of resolvedGames.entries()) {
        const gameTime = new Date(game.t);
        if (now - gameTime > 180 * 1000) resolvedGames.delete(id);
    }
}, 1000 * 5);

module.exports = {
    handleEvent: (data) => {
        const { type, ...game } = parseApiMessage(data);
        switch (type) {
            case "GAME_BEGIN":
                startGame(game);
                break;
            case "GAME_RESULT":
                endGame(game);
                break;
            default:
                throw Error("Unknown event type from live API:", type, game);
        }
    },
    readout: () => ({
        ongoing: Array.from(ongoingGames.entries()),
        resolved: Array.from(resolvedGames.entries()),
    }),
};
