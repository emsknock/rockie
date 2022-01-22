import type { NextPage } from "next";
import { useState } from "react";

import { PlayerSearchResults } from "components/player-search-results";
import { TextInput } from "components/text-input";
import { FaSearch } from "react-icons/fa";

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
                <TextInput
                    value={name}
                    onChange={(e) => setName(e)}
                    icon={<FaSearch />}
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
