import Link from "next/link";
import { FC } from "react";
import useSWR from "swr";

export const PlayerSearchResults: FC<{ prefix: string }> = ({ prefix }) => {
    const { data } = useSWR<string[]>(`/api/find-names?name=${prefix}`);
    return (
        <>
            {data?.map((name) => (
                <li key={name} className="m-2">
                    <Link href={`/player/${name}`}>
                        <a
                            className={`
                                px-3 py-2
                                rounded-full
                                transition-colors duration-75
                                hover:bg-blue-100
                            `}
                        >
                            {name}
                        </a>
                    </Link>
                </li>
            ))}
        </>
    );
};
