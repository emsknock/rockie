import { GestureId } from "utils/gestures";
import {
    FaHandPaper,
    FaHandRock,
    FaHandScissors,
    FaRegHandPaper,
    FaRegHandRock,
    FaRegHandScissors,
} from "react-icons/fa";

export function Gesture({
    id,
    fill = true,
    flip = false,
}: {
    id: GestureId;
    fill?: boolean;
    flip?: boolean;
}) {
    const props = flip ? { transform: "scale(-1, 1)" } : {};

    switch (id) {
        case GestureId.rock:
            return fill ? (
                <FaHandRock {...props} />
            ) : (
                <FaRegHandRock {...props} />
            );
        case GestureId.paper:
            return fill ? (
                <FaHandPaper {...props} />
            ) : (
                <FaRegHandPaper {...props} />
            );
        case GestureId.scissors:
            return fill ? (
                <FaHandScissors {...props} />
            ) : (
                <FaRegHandScissors {...props} />
            );
    }
}
