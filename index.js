const dotenv = require("dotenv");
const server = require("server");
const { json } = server.reply;

dotenv.config();
const port = Number(process.env.PORT || 3001);

server({ port }, () => json({ hello: "world" }));
