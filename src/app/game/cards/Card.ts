import { CardData } from "./CardData";
import { CardTypeValue } from "./CardType";

/**
 * A Community Chest or Chance card of a specific type
 * Contains static configuration data set during card creation.
 */
export interface Card {
    type: CardTypeValue;
    description: string;
    data: CardData;
}
