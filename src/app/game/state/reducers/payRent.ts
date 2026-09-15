import { PlayerDTO } from "@/app/game/player/Player";
import { GameStateDTO } from "../GameState";
import { OwnablePropertyDTO } from "@/app/game/property/OwnableProperty";
import { getPlayerById, updateMultiplePlayerStates } from "./utils";

/**
 * Transfers the provided rentDue amount from the player to the property owner
 * if the player has sufficient funds, otherwise transfers the player's whole balance.
 */
export function payRent(
    state: GameStateDTO,
    player: PlayerDTO,
    property: OwnablePropertyDTO,
    rentDue: number
): GameStateDTO {
    const owner = getPlayerById(state, property.owner);
    const diff = player.balance - rentDue;

    if (diff < 0) {
        owner.balance += player.balance;
        player.balance = diff;
    } else {
        player.balance -= rentDue;
        owner.balance += rentDue;
    }

    return updateMultiplePlayerStates(state, [player, owner]);
}
