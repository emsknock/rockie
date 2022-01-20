import xxhash from "xxhash-wasm";
const hasher = xxhash();

export const normaliseGameId = async (gameId: string) => {
    const { h32 } = await hasher;
    return h32(gameId) - 0x80000000;
};
