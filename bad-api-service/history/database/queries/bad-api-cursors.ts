import db from "bad-api-service/history/database/connection";

export const getLastCursor = async (): Promise<string | null> => {
    const { lastCursor } = await db
        .selectFrom("app_meta")
        .select("last_cursor as lastCursor")
        .executeTakeFirstOrThrow();
    return lastCursor;
};
