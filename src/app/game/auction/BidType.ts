export const BidType = {
    TEN: 0,
    FIFTY: 1,
    HUNDRED: 2
} as const;

export type BidTypeValue = (typeof BidType)[keyof typeof BidType];
