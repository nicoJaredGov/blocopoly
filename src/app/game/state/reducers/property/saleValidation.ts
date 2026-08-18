import { OwnablePropertyDTO } from "@/app/game/property/OwnableProperty";
import { GameStateDTO } from "../../GameState";
import { getBlockPositions } from "@/app/game/board/board_configs/boardConfig";

/**
 * Validates the sale (or mortgage) of a property.
 */
export function isValidPropertySale(
    state: GameStateDTO,
    existing: OwnablePropertyDTO | undefined,
    playerId: number,
    propertyPosition: number
): boolean {
    // Property must exist and be owned by this player
    if (!existing) return false;
    if (existing.owner !== playerId) return false;

    // No houses may exist on any property in the block
    const blockPositions = getBlockPositions(propertyPosition);
    const hasSomeHouses = blockPositions.some((pos) => state.ownedProperties[pos]?.numHouses > 0);
    if (hasSomeHouses) return false;

    return true;
}
