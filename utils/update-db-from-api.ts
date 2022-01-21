import { fetchUntilCursor } from "bad-api-service/history";
import db from "database/connection";
import { GestureId } from "utils/gestures";
import { gameIdNormaliser } from "utils/hash-id";

export const updateDatabaseFromApi = async () => {
    const normalise = await gameIdNormaliser;

    db.transaction().execute(async (trx) => {
        const { lastCursor } = await trx
            .selectFrom("app_meta")
            .select("last_cursor as lastCursor")
            .executeTakeFirstOrThrow();

        let newLastCursor: string | null = null;

        for await (const page of fetchUntilCursor(lastCursor)) {
            if (newLastCursor === null) newLastCursor = page.nextCursor;

            await trx
                .insertInto("staging_matches")
                .values(
                    page.data.map((game) => ({
                        id: normalise(game.gameId),
                        played_at: game.t,
                        player_a_full_name: game.playerA.name,
                        player_b_full_name: game.playerB.name,
                        player_a_gesture_id:
                            GestureId[
                                game.playerA.played.toLowerCase() as
                                    | "rock"
                                    | "paper"
                                    | "scissors"
                            ],
                        player_b_gesture_id:
                            GestureId[
                                game.playerB.played.toLowerCase() as
                                    | "rock"
                                    | "paper"
                                    | "scissors"
                            ],
                    }))
                )
                .onConflict((oc) => oc.doNothing())
                .execute();

            await trx.raw("truncate table staging_matches").execute();
        }

        await trx.updateTable("app_meta").set({ last_cursor: newLastCursor });
    });
};
