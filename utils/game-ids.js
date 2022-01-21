const { xxh32 } = require("@node-rs/xxhash");
module.exports = function normalise(gameId) {
    return xxh32(gameId) - 0x80000000;
};
