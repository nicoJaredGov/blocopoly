/**
 * Interface for card data passed to resolvers.
 * Different card types use different fields.
 */
export interface CardData {
    /** Amount of money for PAY, EARN, COLLECT_FROM_EVERYONE, PAY_EVERYONE */
    amount?: number;
    /** Target board position for GO_TO */
    position?: number;
    /** Number of spaces to go back for GO_BACK */
    spaces?: number;
    /** Cost per house for HOUSE_REPAIRS */
    costPerHouse?: number;
    /** Cost per hotel for HOUSE_REPAIRS */
    costPerHotel?: number;
}
