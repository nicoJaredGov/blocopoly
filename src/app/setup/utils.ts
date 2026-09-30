import { Card, CardData, CardTypeValue } from "../game/cards";
import { OwnablePropertyConfig } from "../game/property/OwnableProperty";
import { Property } from "../game/property/Property";

export function card(id: number, type: CardTypeValue, data: CardData, description: string): Card {
    return { id, type, data, description };
}

export function prop(
    row: number,
    col: number,
    position: number,
    name: string,
    type: Property["type"]
): Property {
    return { row, col, position, name, type };
}

export function owned(
    row: number,
    col: number,
    position: number,
    name: string,
    type: OwnablePropertyConfig["type"],
    blockId: number,
    baseRent: number,
    cost: number
): OwnablePropertyConfig {
    return { row, col, position, name, type, blockId, baseRent, cost };
}
