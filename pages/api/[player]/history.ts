import type { NextApiRequest, NextApiResponse } from "next";
import { refreshDatabase, getPlayerMatches } from "bad-api-service/history";
import { isValidCursor } from "bad-api-service/history";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await refreshDatabase();

    const name = req.query.player as string;
    const cursor = req.query.cursor as string | undefined;

    if (cursor && !isValidCursor(cursor))
        return res.status(400).send("Invalid cursor");

    const page = await getPlayerMatches(name, cursor);

    return res.json(page);
}
