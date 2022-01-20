const { port, liveUrl } = require("./constants");
const WebSocket = require("ws");
const server = require("server");
const store = require("./game-store");
const { json } = server.reply;

const ws = new WebSocket(liveUrl);

ws.on("message", store.handleEvent);

server({ port }, () => json(store.readout()));