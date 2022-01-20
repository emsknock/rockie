const { xxh32 } = require("@node-rs/xxhash");
const normaliseGameId = xxh32;

module.exports = function parseApiMessage(data) {
    // FIXME: Git submodules would probably allow us to share the code between the
    //        nextjs app and bad-api-watcher. Unfortunately I don't have the time
    //        right now to look into it.

    // The API sends each event as an escaped string that needs to first be
    // unescaped and then parsed. Easiest to just call `JSON.parse` twice.
    const json = JSON.parse(data);
    const event = JSON.parse(json);

    // The API wasn't documented, so it's possible I've missed an event type
    if (event.type !== "GAME_BEGIN" && event.type !== "GAME_RESULT") {
        throw Error(`Unknown event type "${event.type}"`);
    }

    return event.type === "GAME_BEGIN"
        ? {
              type: "GAME_BEGIN",
              id: normaliseGameId(event.gameId),
              aPlayer: event.playerA.name,
              bPlayer: event.playerB.name,
          }
        : {
              type: "GAME_RESULT",
              id: normaliseGameId(event.gameId),
              t: event.t,
              aPlayer: event.playerA.name,
              bPlayer: event.playerB.name,
              aGesture: gestureId(event.playerA.played),
              bGesture: gestureId(event.playerB.played),
          };
};

function gestureId(name) {
    switch (name.toLowerCase()) {
        case "rock":
            return 0;
        case "paper":
            return 1;
        case "scissors":
            return 2;
        default:
            throw Error(`Unknown gesture "${name}"`);
    }
}
