import db from "../connection";

export default async function getLastCursor(): Promise<string | null> {
    const { lastCursor } = await db
        .selectFrom("app_meta")
        .select("last_cursor as lastCursor")
        .executeTakeFirstOrThrow();
    return lastCursor;
}
