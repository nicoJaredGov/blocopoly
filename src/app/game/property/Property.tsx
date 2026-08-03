import { PropertyTypeValue } from "./PropertyType";

export interface Property {
    row: number;
    col: number;
    position: number;
    name: string;
    type: PropertyTypeValue;
}
