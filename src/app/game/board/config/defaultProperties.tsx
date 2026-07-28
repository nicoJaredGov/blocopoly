import { PropertyType } from "../../constants";
import { PropertyBlock } from "../PropertyBlock";

export const defaultPropertyBlocks = new Map<number, PropertyBlock>([
    [0, new PropertyBlock("Brown", 0, "#8B4513")],
    [1, new PropertyBlock("Light Blue", 1, "#87CEFA")],
    [2, new PropertyBlock("Pink", 2, "#FF69B4")],
    [3, new PropertyBlock("Orange", 3, "#FFA500")],
    [4, new PropertyBlock("Red", 4, "#FF0000")],
    [5, new PropertyBlock("Yellow", 5, "#FFFF00")],
    [6, new PropertyBlock("Green", 6, "#008000")],
    [7, new PropertyBlock("Dark Blue", 7, "#00008B")],
    [8, new PropertyBlock("Railroad", 8, "#000000")],
    [9, new PropertyBlock("Utility", 9, "#D3D3D3")],
]);

export const defaultProperties = [
    // Bottom row (row 11)
    { row: 11, col: 1, position: 0, name: "GO", type: PropertyType.START, blockId: undefined },
    { row: 11, col: 2, position: 1, name: "Mediterranean Avenue", type: PropertyType.RESIDENTIAL, blockId: 0 },
    { row: 11, col: 3, position: 2, name: "Community Chest", type: PropertyType.SURPRISE, blockId: undefined },
    { row: 11, col: 4, position: 3, name: "Baltic Avenue", type: PropertyType.RESIDENTIAL, blockId: 0 },
    { row: 11, col: 5, position: 4, name: "Income Tax", type: PropertyType.TAX, blockId: undefined },
    { row: 11, col: 6, position: 5, name: "Reading Railroad", type: PropertyType.AIRPORT, blockId: 8 },
    { row: 11, col: 7, position: 6, name: "Oriental Avenue", type: PropertyType.RESIDENTIAL, blockId: 1 },
    { row: 11, col: 8, position: 7, name: "Chance", type: PropertyType.SURPRISE, blockId: undefined },
    { row: 11, col: 9, position: 8, name: "Vermont Avenue", type: PropertyType.RESIDENTIAL, blockId: 1 },
    { row: 11, col: 10, position: 9, name: "Connecticut Avenue", type: PropertyType.RESIDENTIAL, blockId: 1 },
    { row: 11, col: 11, position: 10, name: "Jail", type: PropertyType.JAIL, blockId: undefined },
    // Left column (col 1)
    { row: 10, col: 1, position: 11, name: "St. Charles Place", type: PropertyType.RESIDENTIAL, blockId: 2 },
    { row: 9, col: 1, position: 12, name: "Electric Company", type: PropertyType.POWER, blockId: 9 },
    { row: 8, col: 1, position: 13, name: "States Avenue", type: PropertyType.RESIDENTIAL, blockId: 2 },
    { row: 7, col: 1, position: 14, name: "Virginia Avenue", type: PropertyType.RESIDENTIAL, blockId: 2 },
    { row: 6, col: 1, position: 15, name: "Pennsylvania Railroad", type: PropertyType.AIRPORT, blockId: 8 },
    { row: 5, col: 1, position: 16, name: "St. James Place", type: PropertyType.RESIDENTIAL, blockId: 3 },
    { row: 4, col: 1, position: 17, name: "Community Chest", type: PropertyType.SURPRISE, blockId: undefined },
    { row: 3, col: 1, position: 18, name: "Tennessee Avenue", type: PropertyType.RESIDENTIAL, blockId: 3 },
    { row: 2, col: 1, position: 19, name: "New York Avenue", type: PropertyType.RESIDENTIAL, blockId: 3 },
    { row: 1, col: 1, position: 20, name: "Free Parking", type: PropertyType.VACATION, blockId: undefined },
    // Top row (row 1)
    { row: 1, col: 2, position: 21, name: "Kentucky Avenue", type: PropertyType.RESIDENTIAL, blockId: 4 },
    { row: 1, col: 3, position: 22, name: "Chance", type: PropertyType.SURPRISE, blockId: undefined },
    { row: 1, col: 4, position: 23, name: "Indiana Avenue", type: PropertyType.RESIDENTIAL, blockId: 4 },
    { row: 1, col: 5, position: 24, name: "Illinois Avenue", type: PropertyType.RESIDENTIAL, blockId: 4 },
    { row: 1, col: 6, position: 25, name: "B&O Railroad", type: PropertyType.AIRPORT, blockId: 8 },
    { row: 1, col: 7, position: 26, name: "Atlantic Avenue", type: PropertyType.RESIDENTIAL, blockId: 5 },
    { row: 1, col: 8, position: 27, name: "Ventnor Avenue", type: PropertyType.RESIDENTIAL, blockId: 5 },
    { row: 1, col: 9, position: 28, name: "Water Works", type: PropertyType.WATER, blockId: 9 },
    { row: 1, col: 10, position: 29, name: "Marvin Gardens", type: PropertyType.RESIDENTIAL, blockId: 5 },
    { row: 1, col: 11, position: 30, name: "Go to Jail", type: PropertyType.GO_TO_JAIL, blockId: undefined },
    // Right column (col 11)
    { row: 2, col: 11, position: 31, name: "Pacific Avenue", type: PropertyType.RESIDENTIAL, blockId: 6 },
    { row: 3, col: 11, position: 32, name: "North Carolina Avenue", type: PropertyType.RESIDENTIAL, blockId: 6 },
    { row: 4, col: 11, position: 33, name: "Community Chest", type: PropertyType.SURPRISE, blockId: undefined },
    { row: 5, col: 11, position: 34, name: "Pennsylvania Avenue", type: PropertyType.RESIDENTIAL, blockId: 6 },
    { row: 6, col: 11, position: 35, name: "Short Line Railroad", type: PropertyType.AIRPORT, blockId: 8 },
    { row: 7, col: 11, position: 36, name: "Chance", type: PropertyType.SURPRISE, blockId: undefined },
    { row: 8, col: 11, position: 37, name: "Park Place", type: PropertyType.RESIDENTIAL, blockId: 7 },
    { row: 9, col: 11, position: 38, name: "Luxury Tax", type: PropertyType.TAX, blockId: undefined },
    { row: 10, col: 11, position: 39, name: "Boardwalk", type: PropertyType.RESIDENTIAL, blockId: 7 },
];
