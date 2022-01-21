import xxhash from "xxhash-wasm";

export const gameIdNormaliser = xxhash()
    .then((hasher) => hasher.h32)
    .then((hash) => (gameId: string) => hash(gameId) - 0x80000000);
