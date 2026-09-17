import { mutatePlayerOnVacation, mutatePlayerToJail, PlayerDTO } from "@/app/game/player/Player";
import { GameStateDTO } from "../../GameState";
import { getPropertyConfig } from "@/app/setup/BoardConfig";
import { boardConfig } from "@/app/game/board/board_configs/boardAccessor";
import { OWNABLE_PROPERTY_TYPES, PropertyType } from "@/app/game/property/PropertyType";
import { updatePlayerState } from "../utils";
import { payRent } from "../payRent";

/**
 * Applies landing-cell effects after the player's boardPosition has been updated.
 * Handles GO_TO_JAIL, VACATION, and salary collection for passing GO.
 * TODO: add unowned property, owned property, surprise/community chest handling.
 */
export function resolveLanding(state: GameStateDTO, player: PlayerDTO): GameStateDTO {
    let updated = { ...state };
    const propertyType = getPropertyConfig(boardConfig, player.boardPosition)?.type;

    switch (propertyType) {
        case PropertyType.GO_TO_JAIL:
            mutatePlayerToJail(player);
            return updatePlayerState(updated, player);

        case PropertyType.VACATION:
            mutatePlayerOnVacation(player, state.vacationBalance);
            updated.vacationBalance = 0;
            break;

        case OWNABLE_PROPERTY_TYPES:
            const property = state.ownedProperties[player.boardPosition];
            if (!property || property.owner === -1 || property.isMortgaged) {
                break;
            }
            if (player.id !== property.owner) {
                return payRent(updated, player, property, property.rent);
            }
            break;

        case PropertyType.CHANCE:
            // TODO
            break;

        case PropertyType.COMMUNITY_CHEST:
            // TODO
            break;

        case PropertyType.INCOME_TAX:
            // TODO
            break;

        case PropertyType.WEALTH_TAX:
    }

    return updatePlayerState(updated, player);
}
