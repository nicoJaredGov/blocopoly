import { GameStateDTO } from "../GameState";
import { getActivePlayer } from "../utils";

export function endTurn(state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);
    player.stage = "WAITING";

    const nextId = (player.id + 1) % Object.keys(state.players).length;
    state.activePlayer = nextId;
    const nextPlayer = { ...state.players[nextId] };
    nextPlayer.stage = "ROLL_DICE";

    return {
        ...state,
        players: {
            ...state.players,
            [player.id]: player,
            [nextId]: nextPlayer
        }
    };
}
