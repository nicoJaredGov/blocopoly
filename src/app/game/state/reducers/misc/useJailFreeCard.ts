import { GameStateDTO } from "../../GameState";
import { addOrUpdatePlayer, getActivePlayer } from "../utils";

export function useJailFreeCard(state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);

    if (player.stage !== "JAIL") return state;
    if (player.numJailFreeCards === 0) return state;

    player.numJailFreeCards -= 1;
    player.jailTurnsElapsed = 0;
    player.stage = "ROLL_DICE";

    return {
        ...state,
        players: addOrUpdatePlayer(state, player)
    };
}
