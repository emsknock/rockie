const { port, liveUrl, dbCronExpr } = require("./utils/env");

const WebSocket = require("ws");
const server = require("server");
const cron = require("node-cron");
const cors = require("cors");
const store = require("./live/game-store");
const updateDb = require("./history/update-db");

const ws = new WebSocket(liveUrl);
ws.on("message", store.handleEvent);

cron.schedule(dbCronExpr, updateDb);

const { json, header } = server.reply;
server({ port }, [
    server.utils.modern(cors()),
    // Safari doesn't respect "no-store", but does respect "Vary: *"
    () => header("Cache-Control", "no-store"),
    () => header("Vary", "*"),
    () => json(store.readout()),
]);
