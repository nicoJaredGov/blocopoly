import { PlayerDTO } from "@/app/game/player/Player";
import { GameStateDTO } from "../../GameState";
import { OwnablePropertyDTO } from "@/app/game/property/OwnableProperty";
import { getPlayerById, updateMultiplePlayerStates } from "../utils";

export function payRent(
    state: GameStateDTO,
    player: PlayerDTO,
    property: OwnablePropertyDTO
): GameStateDTO {
    const owner = getPlayerById(state, property.owner);
    const diff = player.balance - property.rent;

    if (diff < 0) {
        player.stage = "NEGATIVE_BALANCE";
        owner.balance += player.balance;
        player.balance = diff;
    } else {
        player.balance -= property.rent;
        owner.balance += property.rent;
    }

    return updateMultiplePlayerStates(state, [player, owner]);
}
