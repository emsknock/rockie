import type { FC } from "react";
import Link from "next/link";
import useSWR from "swr";
import clsx from "clsx";

export const PlayerSearchResults: FC<{ prefix: string }> = ({ prefix }) => {
    const { data } = useSWR<string[]>(`/api/find-names?name=${prefix}`);
    return (
        <>
            {data?.map((name) => (
                <li key={name} className="m-2">
                    <Link href={`/player/${name}`}>
                        <a
                            className={clsx(
                                "px-3 py-2",
                                "font-bold text-blue-500"
                            )}
                        >
                            {name}
                        </a>
                    </Link>
                </li>
            ))}
        </>
    );
};
