interface GameState {
    count: number;
}

type GameStateAction =
    | { type: "INCREMENT" }
    | { type: "DECREMENT" }
    | { type: "SET_COUNT"; payload: number };

export const initialState: GameState = { count: 0 };

export function gameStateReducer(state: GameState, action: GameStateAction): GameState {
    switch (action.type) {
        case "INCREMENT":
            return { count: state.count + 1 };
        case "DECREMENT":
            return { count: state.count - 1 };
        case "SET_COUNT":
            return { count: action.payload };
        default:
            return state;
    }
}
