import { GestureId } from "utils/gestures";

export function Gesture({ id }: { id: GestureId }) {
    switch (id) {
        case GestureId.rock:
            return <>Rock</>;
        case GestureId.paper:
            return <>Paper</>;
        case GestureId.scissors:
            return <>Scissors</>;
    }
}
