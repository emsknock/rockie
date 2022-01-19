import { useRouter } from "next/router";

export function Player() {
    const { query } = useRouter();
    const playerName = query.name as string;

    return <>{playerName} — Statistics</>;
}
