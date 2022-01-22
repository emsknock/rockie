import type { NextApiRequest, NextApiResponse } from "next";
import { findPlayerNamesLike } from "bad-api-service/history";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const name = req.query.name as string | undefined;

    if (!name || name.length > 32) return res.status(400).send("Invalid name");

    res.status(200).json(await findPlayerNamesLike(name));
}
