import { fetchUntilCursor } from "../bad-api-service/history";
import db from "../database/connection";
import { gestureNameToId, normaliseMatchId } from "../database/utils";

export const updateDatabaseFromApi = async () => {
    // TODO: Store the latest saved cursor somewhere and only traverse that far
    for await (const page of fetchUntilCursor(
        "/rps/history?cursor=KDpAtv7_Hd36"
    )) {
        await db
            .insertInto("staging_matches")
            .values(
                page.data.map((match) => ({
                    id: normaliseMatchId(match.gameId),
                    played_at_epoch: match.t,
                    player_a_full_name: match.playerA.name,
                    player_b_full_name: match.playerB.name,
                    player_a_gesture_id: gestureNameToId(match.playerA.played),
                    player_b_gesture_id: gestureNameToId(match.playerB.played),
                }))
            )
            .onConflict((oc) => oc.doNothing())
            .execute();
        await db.raw("truncate table ??", ["staging_matches"]).execute();
    }
};
