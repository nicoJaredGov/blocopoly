import { PropertyType } from "@/app/game/property/PropertyType";
import { OwnablePropertyConfig } from "@/app/game/property/OwnableProperty";
import { Property } from "@/app/game/property/Property";
import { BoardConfig } from "../BoardConfig";
import { Card, CardData, CardType, CardTypeValue } from "@/app/game/cards";

function card(id: number, type: CardTypeValue, data: CardData, description: string): Card {
    return { id, type, data, description };
}

function prop(
    row: number,
    col: number,
    position: number,
    name: string,
    type: Property["type"]
): Property {
    return { row, col, position, name, type };
}

function owned(
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

export const customBoard: BoardConfig = {
    name: "Custom",
    propertyBlocks: {
        0: { name: "Brown", id: 0, color: "#804e16" },
        1: { name: "Light Green", id: 1, color: "#2ed850" },
        2: { name: "Pink", id: 2, color: "#FF69B4" },
        3: { name: "Orange", id: 3, color: "#FFA500" },
        4: { name: "Red", id: 4, color: "#FF0000" },
        5: { name: "Yellow", id: 5, color: "#FFFF00" },
        6: { name: "Green", id: 6, color: "#008000" },
        7: { name: "Dark Blue", id: 7, color: "#4141b3" },
        8: { name: "Railroad", id: 8, color: "black" },
        9: { name: "Utility", id: 9, color: "#D3D3D3" }
    },
    properties: [
        // Bottom row (row 11)
        prop(11, 1, 0, "GO", PropertyType.START),
        owned(11, 2, 1, "Tel Aviv", PropertyType.RESIDENTIAL, 0, 5, 10),
        prop(11, 3, 2, "Community Chest", PropertyType.COMMUNITY_CHEST),
        owned(11, 4, 3, "Haifa", PropertyType.RESIDENTIAL, 0, 10, 20),
        prop(11, 5, 4, "Income Tax", PropertyType.INCOME_TAX),
        owned(11, 6, 5, "Hormuz Tanker", PropertyType.AIRPORT, 8, 20, 40),
        owned(11, 7, 6, "Florida", PropertyType.RESIDENTIAL, 1, 20, 40),
        prop(11, 8, 7, "CHANCE", PropertyType.CHANCE),
        owned(11, 9, 8, "California", PropertyType.RESIDENTIAL, 1, 25, 50),
        owned(11, 10, 9, "New York", PropertyType.RESIDENTIAL, 1, 30, 60),
        prop(11, 11, 10, "Jail", PropertyType.JAIL),
        // Right column (col 11)
        owned(10, 11, 11, "Pretoria", PropertyType.RESIDENTIAL, 2, 30, 60),
        owned(9, 11, 12, "Eskom", PropertyType.POWER, 9, 10, 20),
        owned(8, 11, 13, "Sandton", PropertyType.RESIDENTIAL, 2, 35, 70),
        owned(7, 11, 14, "Wits", PropertyType.RESIDENTIAL, 2, 40, 80),
        owned(6, 11, 15, "Gautrain", PropertyType.AIRPORT, 8, 150, 300),
        owned(5, 11, 16, "Chatsworth", PropertyType.RESIDENTIAL, 3, 40, 80),
        prop(4, 11, 17, "Community Chest", PropertyType.COMMUNITY_CHEST),
        owned(3, 11, 18, "Cape Town", PropertyType.RESIDENTIAL, 3, 45, 90),
        owned(2, 11, 19, "PMB", PropertyType.RESIDENTIAL, 3, 50, 100),
        // Top row (row 1)
        prop(1, 11, 20, "Go to Jail", PropertyType.GO_TO_JAIL),
        owned(1, 10, 21, "Shenzhen", PropertyType.RESIDENTIAL, 4, 50, 100),
        prop(1, 9, 22, "CHANCE", PropertyType.CHANCE),
        owned(1, 8, 23, "Beijing", PropertyType.RESIDENTIAL, 4, 55, 110),
        owned(1, 7, 24, "Shanghai", PropertyType.RESIDENTIAL, 4, 60, 120),
        owned(1, 6, 25, "Zero Point", PropertyType.AIRPORT, 8, 20, 40),
        owned(1, 5, 26, "Misty Meadows", PropertyType.RESIDENTIAL, 5, 60, 120),
        owned(1, 4, 27, "Pleasant Park", PropertyType.RESIDENTIAL, 5, 65, 130),
        owned(1, 3, 28, "Loot Lake", PropertyType.WATER, 9, 10, 20),
        owned(1, 2, 29, "Tilted Towers", PropertyType.RESIDENTIAL, 5, 70, 140),
        // Left column (col 1)
        prop(1, 1, 30, "Bing Chilling", PropertyType.VACATION),
        owned(2, 1, 31, "Corposlavia", PropertyType.RESIDENTIAL, 6, 70, 140),
        owned(3, 1, 32, "Doomstadt", PropertyType.RESIDENTIAL, 6, 75, 150),
        prop(4, 1, 33, "Community Chest", PropertyType.COMMUNITY_CHEST),
        owned(5, 1, 34, "Stekistan", PropertyType.RESIDENTIAL, 6, 80, 160),
        owned(6, 1, 35, "Batmobile", PropertyType.AIRPORT, 8, 20, 40),
        prop(7, 1, 36, "CHANCE", PropertyType.CHANCE),
        owned(8, 1, 37, "The Pozi", PropertyType.RESIDENTIAL, 7, 85, 170),
        prop(9, 1, 38, "Luxury Tax", PropertyType.WEALTH_TAX),
        owned(10, 1, 39, "The Sections", PropertyType.RESIDENTIAL, 7, 90, 180)
    ],
    cardDeck: {
        0: card(0, CardType.PAY, { amount: 150 }, "You insurance amounts to 150"),
        1: card(1, CardType.GO_TO_JAIL, {}, "Tax evasion is never a good option."),
        2: card(2, CardType.EARN, { amount: 500 }, "You found a stash of money in your shoe!")
    },
    chanceCards: [0, 1],
    communityChestCards: [2]
};
