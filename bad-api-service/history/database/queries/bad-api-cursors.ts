import db from "bad-api-service/history/database/connection";

export const getLastCursor = async (): Promise<string> => {
    const result = await db
        .selectFrom("app_meta")
        .select("last_cursor")
        .executeTakeFirst()!;
    return result!.last_cursor;
};

export const setLastCursor = (cursor: string) =>
    db.updateTable("app_meta").set({ last_cursor: cursor }).execute();
