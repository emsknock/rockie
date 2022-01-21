module.exports = function gestureId(name) {
    switch (name.toLowerCase()) {
        case "rock":
            return 0;
        case "paper":
            return 1;
        case "scissors":
            return 2;
        default:
            throw Error(`Unknown gesture "${name}"`);
    }
};
