import db, { getLastCursor } from ".";
import { fetchUntilCursor } from "./fetch-until-cursor";
import { gameIdNormaliser } from "utils/game-ids";
import { GestureId } from "utils/gestures";

/** Automatically fetches all *new* data from Bad Api and pushes it into the database */
export default async function updateDatabaseFromBadApi() {
    const normalise = await gameIdNormaliser;
    const lastCursor = await getLastCursor();

    for await (const page of fetchUntilCursor(lastCursor)) {
        db.insertInto("staging_matches")
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

        await db.raw("truncate table staging_matches").execute();
    }
}
