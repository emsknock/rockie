import { liveUrl } from "utils/env";

const isBrowser = typeof window !== "undefined";

// Socket related code doesn't need to run server side
const sock = isBrowser && new WebSocket(liveUrl);

export default sock;
