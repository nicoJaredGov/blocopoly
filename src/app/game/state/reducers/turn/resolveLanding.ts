import { mutatePlayerOnVacation, mutatePlayerToJail, PlayerDTO } from "@/app/game/player/Player";
import { GameStateDTO } from "../../GameState";
import {
    getPropertyConfig,
    getRandomChanceCard,
    getRandomCommunityChestCard
} from "@/app/setup/BoardConfig";
import { boardConfig } from "@/app/game/board/board_configs/boardAccessor";
import { OWNABLE_PROPERTY_TYPES, PropertyType } from "@/app/game/property/PropertyType";
import { updatePlayerState } from "../utils";
import { payRent } from "../payRent";
import { resolveCard } from "./resolveCard";
import { payBank } from "../payBank";

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
            const chanceCard = getRandomChanceCard(boardConfig);
            return resolveCard(chanceCard.type, chanceCard.data, updated);

        case PropertyType.COMMUNITY_CHEST:
            const communityChestCard = getRandomCommunityChestCard(boardConfig);
            return resolveCard(communityChestCard.type, communityChestCard.data, updated);

        case PropertyType.INCOME_TAX:
            // TODO: Read tax percentage from config
            const incomeTax = Math.round(player.balance * 0.1);
            return payBank(updated, player, incomeTax);

        case PropertyType.WEALTH_TAX:
            // TODO: Read tax percentage from config
            const wealthTax = Math.round(player.balance * 0.15);
            return payBank(updated, player, wealthTax);
    }

    return updatePlayerState(updated, player);
}
