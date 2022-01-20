export const gestureId = (name: string) => {
    switch (name.toLowerCase()) {
        case "rock":
            return 0;
        case "paper":
            return 1;
        case "scissors":
            return 2;
        default:
            throw Error(`Unknown gesture name: ${name}`);
    }
};

export const enum GestureId {
    rock = 0,
    paper = 1,
    scissors = 2,
}
