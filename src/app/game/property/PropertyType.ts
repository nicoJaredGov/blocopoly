export const PropertyType = {
    START: 0,
    RESIDENTIAL: 1,
    CHANCE: 2,
    COMMUNITY_CHEST: 3,
    INCOME_TAX: 4,
    WEALTH_TAX: 5,
    AIRPORT: 6,
    JAIL: 7,
    VACATION: 8,
    GO_TO_JAIL: 9,
    POWER: 10,
    WATER: 11
} as const;

export type PropertyTypeValue = (typeof PropertyType)[keyof typeof PropertyType];

export const OWNABLE_PROPERTY_TYPES =
    PropertyType.RESIDENTIAL | PropertyType.AIRPORT | PropertyType.POWER | PropertyType.WATER;
