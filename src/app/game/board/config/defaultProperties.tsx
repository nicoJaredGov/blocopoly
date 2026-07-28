import { PropertyType } from "../../constants";
import { Property } from "../Property";
import { PropertyBlock } from "../PropertyBlock";

export const defaultPropertyBlocks = new Map<number, PropertyBlock>([
    [0, new PropertyBlock("Brown", 0, "#804e16")],
    [1, new PropertyBlock("Light Green", 1, "#2ed850")],
    [2, new PropertyBlock("Pink", 2, "#FF69B4")],
    [3, new PropertyBlock("Orange", 3, "#FFA500")],
    [4, new PropertyBlock("Red", 4, "#FF0000")],
    [5, new PropertyBlock("Yellow", 5, "#FFFF00")],
    [6, new PropertyBlock("Green", 6, "#008000")],
    [7, new PropertyBlock("Dark Blue", 7, "#4141b3")],
    [8, new PropertyBlock("Railroad", 8, "black")],
    [9, new PropertyBlock("Utility", 9, "#D3D3D3")],
]);

export const defaultProperties = [
    // Bottom row (row 11)
    new Property(11, 1, 0, "GO", PropertyType.START),
    new Property(11, 2, 1, "Tel Aviv", PropertyType.RESIDENTIAL, 0),
    new Property(11, 3, 2, "CHANCE", PropertyType.SURPRISE),
    new Property(11, 4, 3, "Haifa", PropertyType.RESIDENTIAL, 0),
    new Property(11, 5, 4, "Income Tax", PropertyType.TAX),
    new Property(11, 6, 5, "Hormuz Tanker", PropertyType.AIRPORT, 8),
    new Property(11, 7, 6, "Florida", PropertyType.RESIDENTIAL, 1),
    new Property(11, 8, 7, "Chance", PropertyType.SURPRISE),
    new Property(11, 9, 8, "California", PropertyType.RESIDENTIAL, 1),
    new Property(11, 10, 9, "New York", PropertyType.RESIDENTIAL, 1),
    new Property(11, 11, 10, "Jail", PropertyType.JAIL),
    // Right column (col 11)
    new Property(10, 11, 11, "Pretoria", PropertyType.RESIDENTIAL, 2),
    new Property(9, 11, 12, "Eskom", PropertyType.POWER, 9),
    new Property(8, 11, 13, "Sandton", PropertyType.RESIDENTIAL, 2),
    new Property(7, 11, 14, "Wits", PropertyType.RESIDENTIAL, 2),
    new Property(6, 11, 15, "Gautrain", PropertyType.AIRPORT, 8),
    new Property(5, 11, 16, "Brackenfell", PropertyType.RESIDENTIAL, 3),
    new Property(4, 11, 17, "Community Chest", PropertyType.SURPRISE),
    new Property(3, 11, 18, "Cape Town", PropertyType.RESIDENTIAL, 3),
    new Property(2, 11, 19, "PMB", PropertyType.RESIDENTIAL, 3),
    // Top row (row 1)
    new Property(1, 11, 20, "Go to Jail", PropertyType.GO_TO_JAIL),
    new Property(1, 10, 21, "Shenzen", PropertyType.RESIDENTIAL, 4),
    new Property(1, 9, 22, "CHANCE", PropertyType.SURPRISE),
    new Property(1, 8, 23, "Beijing", PropertyType.RESIDENTIAL, 4),
    new Property(1, 7, 24, "Shanghai", PropertyType.RESIDENTIAL, 4),
    new Property(1, 6, 25, "Zero Point", PropertyType.AIRPORT, 8),
    new Property(1, 5, 26, "Misty Meadows", PropertyType.RESIDENTIAL, 5),
    new Property(1, 4, 27, "Pleasant Park", PropertyType.RESIDENTIAL, 5),
    new Property(1, 3, 28, "Loot Lake", PropertyType.WATER, 9),
    new Property(1, 2, 29, "Tilted Towers", PropertyType.RESIDENTIAL, 5),
    // Left column (col 1)
    new Property(1, 1, 30, "Bing Chilling", PropertyType.VACATION),
    new Property(2, 1, 31, "Corposlavia", PropertyType.RESIDENTIAL, 6),
    new Property(3, 1, 32, "Doomstadt", PropertyType.RESIDENTIAL, 6),
    new Property(4, 1, 33, "Community Chest", PropertyType.SURPRISE),
    new Property(5, 1, 34, "Stekistan", PropertyType.RESIDENTIAL, 6),
    new Property(6, 1, 35, "Batmobile", PropertyType.AIRPORT, 8),
    new Property(7, 1, 36, "CHANCE", PropertyType.SURPRISE),
    new Property(8, 1, 37, "The Pozi", PropertyType.RESIDENTIAL, 7),
    new Property(9, 1, 38, "Luxury Tax", PropertyType.TAX),
    new Property(10, 1, 39, "The Sections", PropertyType.RESIDENTIAL, 7),
];
