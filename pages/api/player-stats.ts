import { getPlayerStats, StatsRecord } from "database/queries/player";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StatsRecord | string>
) {
    const name = req.query.name;
    if (typeof name !== "string")
        return res.status(400).send("Player name must be a string");

    const stats = await getPlayerStats(name);
    return stats === null
        ? res.status(404).send("No such player")
        : res.json(stats);
}
