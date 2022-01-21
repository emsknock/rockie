const db = require("./database");
const fetchUntilCursor = require("./fetch-until-cursor");

const normalise = require("../utils/game-ids");
const gestureId = require("../utils/gestures");

const updateDatabaseFromApi = async () => {
    console.log("Starting");
    await db.transaction().execute(async (trx) => {
        const { lastCursor } = await trx
            .selectFrom("app_meta")
            .select("last_cursor as lastCursor")
            .executeTakeFirstOrThrow();

        console.log("Started", lastCursor);
        let newLastCursor = null;

        for await (const page of fetchUntilCursor(lastCursor)) {
            console.log("Found page", page.cursor);
            if (newLastCursor === null) {
                newLastCursor = page.nextCursor;
            }

            await trx
                .insertInto("staging_matches")
                .values(
                    page.data.map((game) => ({
                        id: normalise(game.gameId),
                        played_at: game.t,
                        player_a_full_name: game.playerA.name,
                        player_b_full_name: game.playerB.name,
                        player_a_gesture_id: gestureId(game.playerA.played),
                        player_b_gesture_id: gestureId(game.playerB.played),
                    }))
                )
                .onConflict((oc) => oc.doNothing())
                .execute();

            await trx.raw("truncate table staging_matches").execute();
        }

        await trx
            .updateTable("app_meta")
            .set({ last_cursor: newLastCursor })
            .execute();
    });
    console.log("Exit");
};

updateDatabaseFromApi();
