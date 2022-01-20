import { watcherUrl } from "utils/constants";

export default async function fallbackFetch() {
    const state = await fetch(watcherUrl).then((res) => res.json());
    return state;
}
