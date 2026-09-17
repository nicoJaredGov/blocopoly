export const CardType = {
    PAY: 0,
    EARN: 1,
    GO_TO: 2,
    JAIL_FREE_CARD: 3,
    GO_TO_JAIL: 4,
    COLLECT_FROM_EVERYONE: 5,
    HOUSE_REPAIRS: 6,
    GO_BACK: 7,
    PAY_EVERYONE: 8
} as const;

export type CardTypeValue = (typeof CardType)[keyof typeof CardType];

export const COMMUNITY_CHEST_TYPES =
    CardType.EARN |
    CardType.GO_TO |
    CardType.GO_BACK |
    CardType.JAIL_FREE_CARD |
    CardType.COLLECT_FROM_EVERYONE;
