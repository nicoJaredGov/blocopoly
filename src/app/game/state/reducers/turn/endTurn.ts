import { GameStateDTO } from "../../GameState";
import { getActivePlayer, getNextAvailablePlayer } from "../utils";

export function endTurn(state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);
    player.stage = "WAITING";
    const nextId = getNextAvailablePlayer(state);

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
