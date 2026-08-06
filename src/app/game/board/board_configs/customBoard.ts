import { PropertyType } from "../../property/PropertyType";
import { OwnablePropertyConfig } from "../../property/OwnableProperty";
import { Property } from "../../property/Property";
import { PropertyBlock } from "../../property/PropertyBlock";

export const customPropertyBlocks: Record<number, PropertyBlock> = {
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
};

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
    baseRentWeighting: number
): OwnablePropertyConfig {
    return { row, col, position, name, type, blockId, baseRentWeighting };
}

export const customProperties: (Property | OwnablePropertyConfig)[] = [
    // Bottom row (row 11)
    prop(11, 1, 0, "GO", PropertyType.START),
    owned(11, 2, 1, "Tel Aviv", PropertyType.RESIDENTIAL, 0, 5),
    prop(11, 3, 2, "CHANCE", PropertyType.SURPRISE),
    owned(11, 4, 3, "Haifa", PropertyType.RESIDENTIAL, 0, 10),
    prop(11, 5, 4, "Income Tax", PropertyType.TAX),
    owned(11, 6, 5, "Hormuz Tanker", PropertyType.AIRPORT, 8, 20),
    owned(11, 7, 6, "Florida", PropertyType.RESIDENTIAL, 1, 20),
    prop(11, 8, 7, "Chance", PropertyType.SURPRISE),
    owned(11, 9, 8, "California", PropertyType.RESIDENTIAL, 1, 25),
    owned(11, 10, 9, "New York", PropertyType.RESIDENTIAL, 1, 30),
    prop(11, 11, 10, "Jail", PropertyType.JAIL),
    // Right column (col 11)
    owned(10, 11, 11, "Pretoria", PropertyType.RESIDENTIAL, 2, 30),
    owned(9, 11, 12, "Eskom", PropertyType.POWER, 9, 10),
    owned(8, 11, 13, "Sandton", PropertyType.RESIDENTIAL, 2, 35),
    owned(7, 11, 14, "Wits", PropertyType.RESIDENTIAL, 2, 40),
    owned(6, 11, 15, "Gautrain", PropertyType.AIRPORT, 8, 150),
    owned(5, 11, 16, "Chatsworth", PropertyType.RESIDENTIAL, 3, 40),
    prop(4, 11, 17, "Community Chest", PropertyType.SURPRISE),
    owned(3, 11, 18, "Cape Town", PropertyType.RESIDENTIAL, 3, 45),
    owned(2, 11, 19, "PMB", PropertyType.RESIDENTIAL, 3, 50),
    // Top row (row 1)
    prop(1, 11, 20, "Go to Jail", PropertyType.GO_TO_JAIL),
    owned(1, 10, 21, "Shenzhen", PropertyType.RESIDENTIAL, 4, 50),
    prop(1, 9, 22, "CHANCE", PropertyType.SURPRISE),
    owned(1, 8, 23, "Beijing", PropertyType.RESIDENTIAL, 4, 55),
    owned(1, 7, 24, "Shanghai", PropertyType.RESIDENTIAL, 4, 60),
    owned(1, 6, 25, "Zero Point", PropertyType.AIRPORT, 8, 20),
    owned(1, 5, 26, "Misty Meadows", PropertyType.RESIDENTIAL, 5, 60),
    owned(1, 4, 27, "Pleasant Park", PropertyType.RESIDENTIAL, 5, 65),
    owned(1, 3, 28, "Loot Lake", PropertyType.WATER, 9, 10),
    owned(1, 2, 29, "Tilted Towers", PropertyType.RESIDENTIAL, 5, 70),
    // Left column (col 1)
    prop(1, 1, 30, "Bing Chilling", PropertyType.VACATION),
    owned(2, 1, 31, "Corposlavia", PropertyType.RESIDENTIAL, 6, 70),
    owned(3, 1, 32, "Doomstadt", PropertyType.RESIDENTIAL, 6, 75),
    prop(4, 1, 33, "Community Chest", PropertyType.SURPRISE),
    owned(5, 1, 34, "Stekistan", PropertyType.RESIDENTIAL, 6, 80),
    owned(6, 1, 35, "Batmobile", PropertyType.AIRPORT, 8, 20),
    prop(7, 1, 36, "CHANCE", PropertyType.SURPRISE),
    owned(8, 1, 37, "The Pozi", PropertyType.RESIDENTIAL, 7, 85),
    prop(9, 1, 38, "Luxury Tax", PropertyType.TAX),
    owned(10, 1, 39, "The Sections", PropertyType.RESIDENTIAL, 7, 90)
];
