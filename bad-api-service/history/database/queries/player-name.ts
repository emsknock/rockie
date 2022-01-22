import db from "../connection";

/** Finds all players in the database whose names begin with `prefix` */
export default async function findPlayerNamesLike(
    prefix: string
): Promise<string[]> {
    const results = await db
        .selectFrom("players")
        .select("full_name as fullName")
        .where("full_name", "ilike", `${prefix}%`)
        .orderBy("full_name", "asc")
        .execute();
    return results.map((r) => r.fullName);
}
