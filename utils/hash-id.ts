import xxhash from "xxhash-wasm";

export const gameIdNormaliser = new Promise<(gameId: string) => number>(
    async () => {
        const { h32 } = await xxhash();
        return (gameId: string) => h32(gameId) - 0x80000000;
    }
);
