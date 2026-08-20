import { GameStateDTO } from "../../GameState";
import { getActivePlayer } from "../utils";

export function useJailFreeCard(state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);

    if (player.stage != "JAIL") return state;
    if (player.numJailFreeCards == 0) return state;

    player.numJailFreeCards -= 1;
    player.jailTurnsElapsed = 0;
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
