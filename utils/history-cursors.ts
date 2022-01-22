// The app doesn't use cursor pased pagination, but I decided to leave the
// code for it here on display and possibly for later reference if I want
// to look deeper into it as some point

export const serialiseCursor = (playedAt: number, gameId: number) =>
    `${playedAt}:${gameId}`;

export const deserialiseCursor = (cursor: string) => {
    const [l, r] = cursor.split(":");
    const playedAt = Number(l);
    const gameId = Number(r);
    if (isNaN(playedAt) || isNaN(gameId)) throw Error("Invalid cursor");
    return [Number(l), Number(r)];
};

export const isValidCursor = (cursor: string) => {
    try {
        deserialiseCursor(cursor);
        return true;
    } catch (_) {
        return false;
    }
};
