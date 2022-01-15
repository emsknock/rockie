const server = require("server");
const { json } = server.reply;
const port = Number(process.env.PORT || 3001);

server({ port }, () => json({ hello: "world" }));
