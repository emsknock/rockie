import type { NextPage } from "next";
import { useState } from "react";
import clsx from "clsx";

import { PlayerSearchResults } from "components/player-search-results";
import { TextInput } from "components/text-input";
import { FaSearch } from "react-icons/fa";

const Home: NextPage = () => {
    const [name, setName] = useState("");
    return (
        <>
            <div
                className={clsx(
                    "sticky top-0",
                    "h-32",
                    "w-full",
                    "flex justify-center items-center",
                    "bg-white",
                    "border-b"
                )}
            >
                <TextInput
                    value={name}
                    onChange={(e) => setName(e)}
                    icon={<FaSearch />}
                />
            </div>
            {name !== "" ? (
                <PlayerSearchResults prefix={name} />
            ) : (
                <div className={clsx("max-w-md mx-auto my-4")}>
                    <h1 className={clsx("mb-4", "text-3xl")}>Hello!</h1>
                    <p className="my-2">
                        {"Here's"} Rockie — my Reaktor 2022 Summer Developer
                        pre-assignment project. I wrote it with a very
                        constrained schedule, and decided to focus my time and
                        energy more on learning something new (e.g. database
                        stuff) than on the parts {"I'm"} more at home with (i.e.
                        frontend stuff) — I wanted to make a really polished and
                        well organised UI with some nice little animations and
                        microinteractions with e.g. Framer Motion but ended up
                        learning a ton about things like keyset pagination (I
                        left some code related to it in the repo, even though{" "}
                        {"it's"} unused), synchronisation problems, and database
                        management!
                    </p>
                    <p className="my-2">
                        So, whoever is reading this, hope {"you'll"} like my
                        little code-contraption and hope I can call you{" "}
                        <q>colleague</q> in the summer 🤞🏻
                    </p>
                    <p className="my-2">~ Emma</p>
                </div>
            )}
        </>
    );
};

export default Home;
