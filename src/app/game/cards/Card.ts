import { CardData } from "./CardData";
import { CardTypeValue } from "./CardType";

/**
 * A Community Chest or Chance card of a specific type
 */
export interface Card {
    id: number;
    type: CardTypeValue;
    description: string;
    data: CardData;
}
