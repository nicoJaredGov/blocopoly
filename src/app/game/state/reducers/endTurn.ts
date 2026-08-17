import { GameStateDTO } from "../GameState";
import { getActivePlayer } from "../utils";

export function endTurn(state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);
    player.stage = "WAITING";
    const nextId = (player.id + 1) % Object.keys(state.players).length;

    return {
        ...state,
        activePlayer: nextId,
        players: {
            ...state.players,
            [player.id]: player,
            [nextId]: { ...state.players[nextId], stage: "ROLL_DICE" }
        }
    };
}
