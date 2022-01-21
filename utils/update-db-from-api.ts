import db from "database/connection";
import { fetchUntilCursor } from "bad-api-service/history";
import { gameIdNormaliser } from "utils/game-ids";
import { GestureId } from "utils/gestures";

export const updateDatabaseFromApi = async () => {
    const normalise = await gameIdNormaliser;

    await db.transaction().execute(async (trx) => {
        const { lastCursor } = await trx
            .selectFrom("app_meta")
            .select("last_cursor as lastCursor")
            .executeTakeFirstOrThrow();

        for await (const page of fetchUntilCursor(lastCursor)) {
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
    });
};
