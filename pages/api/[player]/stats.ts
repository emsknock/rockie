import type { NextApiRequest, NextApiResponse } from "next";
import { refreshDatabase, getPlayerStats } from "bad-api-service/history";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await refreshDatabase();

    const name = req.query.player as string;
    const page = await getPlayerStats(name);
    return page !== null ? res.json(page) : res.send("No such player");
}
