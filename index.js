const { port, liveUrl } = require("./constants");
const WebSocket = require("ws");
const server = require("server");
const cors = require("cors");
const store = require("./game-store");
const { json, header } = server.reply;

const ws = new WebSocket(liveUrl);
ws.on("message", store.handleEvent);

server({ port }, [
    server.utils.modern(cors()),
    // Safari doesn't respect "no-store", but does respect "Vary: *"
    () => header("Cache-Control", "no-store"),
    () => header("Vary", "*"),
    () => json(store.readout()),
]);
