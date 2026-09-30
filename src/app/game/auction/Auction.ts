export interface Auction {
    propertyId: number;
    propertyCost: number;
    /** key: Player Id, value: player bid amount */
    bids: Record<number, number>;
    /** Time in seconds till auction closes */
    timeRemaining: number;
}
