const WebSocket = require("ws");
const xxhash = require("@node-rs/xxhash");
const server = require("server");
const { port, liveUri } = require("./constants");
const { json } = server.reply;

const ws = new WebSocket(liveUri);
const currentGames = new Map();

function parseApiMessage(data) {
    // The API sends each event as an escaped string that needs to first be
    // unescaped and then parsed.
    const text = JSON.parse(data);
    const event = JSON.parse(text);
    event.gameId = xxhash.xxh32(event.gameId);
    return event;
}

ws.on("message", (data) => {
    try {
        const { type, gameId, ...game } = parseApiMessage(data);
        if (type === "GAME_RESULT") {
            currentGames.delete(gameId);
        } else if (type === "GAME_BEGIN") {
            currentGames.set(gameId, [game.playerA.name, game.playerB.name]);
        } else {
            throw Error(`Unknown event: ${type}`);
        }
    } catch (error) {
        console.error(
            "Couldn't parse event from live api:",
            error.message,
            data
        );
    }
});

server({ port }, () => json(Object.fromEntries(currentGames)));
