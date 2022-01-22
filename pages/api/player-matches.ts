import type { NextApiRequest, NextApiResponse } from "next";
import { getPlayerMatches, MatchRecord } from "bad-api-service/history";
import { refreshDatabase } from "bad-api-service/history";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<MatchRecord[] | string>
) {
    await refreshDatabase();

    const rawCursor = req.query.cursor as string | undefined;
    const name = req.query.name as string | undefined;
    if (typeof name !== "string")
        return res.status(400).send("Player name must be a string");

    const [playedAtStr, matchIdStr] = rawCursor?.split(":") ?? [null, null];
    const playedAt = playedAtStr ? Number(playedAtStr) : Date.now();
    const matchId = matchIdStr ? Number(matchIdStr) : null;

    const { page } = await getPlayerMatches(name, [playedAt, matchId]);

    return res.json(page);
}
