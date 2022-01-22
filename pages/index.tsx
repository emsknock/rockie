import type { NextPage } from "next";
import { useState } from "react";
import useSWR from "swr";

import { PlayerSearchResults } from "components/player-search-results";

const Home: NextPage = () => {
    const [name, setName] = useState("");

    return (
        <>
            <div
                className={`
                    sticky top-0
                    h-32
                    w-full
                    flex justify-center items-center
                    bg-white
                    border-b
                `}
            >
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`
                        px-4 py-2
                        w-80
                        rounded-full
                        border border-gray-300
                    `}
                />
            </div>
            <ol
                className={`
                    p-2
                    flex flex-wrap gap-2 justify-center
                `}
            >
                <PlayerSearchResults prefix={name} />
            </ol>
        </>
    );
};

export default Home;
