import type { NextApiRequest, NextApiResponse } from "next";
import { isValidCursor } from "utils/history-cursors";
import {
    refreshDatabase,
    getHistoryByCursor,
    getHistoryByPage,
} from "bad-api-service/history";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await refreshDatabase();

    const name = req.query.player as string;
    const page = Number(req.query.page ?? 0);
    const cursor = req.query.cursor as string | undefined;

    if (isNaN(page) || page < 0) return res.status(400).send("Invalid page");

    /**
     * The app doesn't use cursor pased pagination, but I decided to leave the
     * code for it here on display and possibly for later reference if I want
     * to look deeper into it as some point
     */
    if (cursor && !isValidCursor(cursor))
        return res.status(400).send("Invalid cursor");

    return res.json(
        cursor
            ? await getHistoryByCursor(name, cursor)
            : await getHistoryByPage(name, page)
    );
}
