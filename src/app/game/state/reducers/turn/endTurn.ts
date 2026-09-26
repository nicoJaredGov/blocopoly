import { PlayerDTO } from "@/app/game/player/Player";
import { GameStateDTO } from "../../GameState";
import { getActivePlayer, getNextAvailablePlayer } from "../utils";

export function endTurn(state: GameStateDTO): GameStateDTO {
    const player = getActivePlayer(state);
    return endTurnForPlayer(state, player);
}

export function endTurnForPlayer(state: GameStateDTO, player: PlayerDTO): GameStateDTO {
    const nextId = getNextAvailablePlayer(state);

    return {
        ...state,
        activePlayer: nextId,
        players: {
            ...state.players,
            [player.id]: { ...player, stage: "WAITING" },
            [nextId]: { ...state.players[nextId], stage: "ROLL_DICE" }
        }
    };
}
