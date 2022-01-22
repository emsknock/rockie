import xxhash from "xxhash-wasm";

// The Bad Api has its own Game IDs — variable length hexadecimal strings.
// Trying to use those in my own DB sounded like a recipe for even more
// lost sleep, so I needed some way to generate ids for games based on
// the Bad Api's ids. Since cryptographic hashes would be a waste of
// resources, I opted for xxhash, and tried to further minimise the
// performance hit of constantly hashing Bad Api's ids by using a wasm
// module instead of a pure js one.

/*
 * A promise that resolves into a wasm xxhash function that can be used
 * to turn Bad Api Game IDs into suitable ids for our database
 */
export const gameIdNormaliser = xxhash()
    .then((hasher) => hasher.h32)
    // A 32bit hash fits into a postgres Int4 column, but postgres only
    // accepts *signed* integers, and xxhash outputs *unsigned* integers,
    // so we'll have to apply some number magic to please postgres
    .then((hash) => (gameId: string) => hash(gameId) - 0x80000000);
