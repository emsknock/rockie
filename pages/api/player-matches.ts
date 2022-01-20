import { getPlayerMatches, MatchRecord } from "database/queries/player-matches";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<MatchRecord[] | string>
) {
    const page = Number(req.query.page ?? 0);
    const name = req.query.name;
    if (isNaN(page)) return res.status(400).send("Page must be a number");
    if (typeof name !== "string")
        return res.status(400).send("Player name must be a string");

    const matches = await getPlayerMatches(name, page);
    return matches === null
        ? res.status(404).send("No such player")
        : res.json(matches);
}
