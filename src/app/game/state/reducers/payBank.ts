import { PlayerDTO } from "@/app/game/player/Player";
import { GameStateDTO } from "../GameState";
import { updatePlayerState } from "./utils";

/**
 * Transfers the provided amount from the player to the bank (vacation pot)
 * if the player has sufficient funds, otherwise transfers the player's whole balance.
 */
export function payBank(state: GameStateDTO, player: PlayerDTO, amount: number): GameStateDTO {
    const amountTransferred = Math.min(player.balance, amount);
    state.vacationBalance += amountTransferred;
    player.balance -= amountTransferred;

    return updatePlayerState(state, player);
}
