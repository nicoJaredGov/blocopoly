export const MAX_TRADES = 10;

/**
 * Represents a pending trade proposal between two players.
 */
export interface Trade {
    id: number;
    initiator: number;
    recipient: number;
    /** Board positions of properties the initiator is offering */
    initiatorTradeIns: number[];
    initiatorCashOffer: number;
    /** Board positions of properties the recipient is offering */
    recipientTradeIns: number[];
    recipientCashOffer: number;
}
