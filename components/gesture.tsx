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
}: {
    id: GestureId;
    fill?: boolean;
}) {
    switch (id) {
        case GestureId.rock:
            return fill ? <FaHandRock /> : <FaRegHandRock />;
        case GestureId.paper:
            return fill ? <FaHandPaper /> : <FaRegHandPaper />;
        case GestureId.scissors:
            return fill ? <FaHandScissors /> : <FaRegHandScissors />;
    }
}
