import type { NextApiRequest, NextApiResponse } from "next";
import { refreshDatabase, getPlayerMatches } from "bad-api-service/history";
import {
    isValidCursor,
    PlayerMatchesPage,
} from "bad-api-service/history/database/queries/player-matches";
import useSWR from "swr";

export const usePlayerMatches = (name: string, cursor?: string) =>
    useSWR<PlayerMatchesPage>(
        cursor
            ? `/api/${name}/matches?cursor=${cursor}`
            : `/api/${name}/matches`
    );

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
