import { Property } from "./Property";

export class OwnableProperty extends Property {
    public numHouses: number = 0;
    public isMortgaged: boolean = false;
    public owner: number | undefined;
    public baseRent: number = 0;
    public rent: number = 0;

    constructor(
        public row: number,
        public col: number,
        public position: number,
        public name: string,
        public type: number,
        public blockId: number,
        public baseRentWeighting: number,
    ) {
        super(row, col, position, name, type)
    }

    private calculateBaseRent(marketCap: number) {
        return marketCap * (this.baseRentWeighting / 100)
    }

    public buyProperty(playerId: number, marketCap: number) {
        this.owner = playerId
        this.baseRent = this.calculateBaseRent(marketCap)
        this.rent = this.baseRent
    }

    public buyHouse(hasWholeBlock: boolean) {
        if (this.numHouses == 5) {
            return
        }

        this.numHouses += 1
        this.rent = this.baseRent * this.numHouses
        if (hasWholeBlock) {
            this.rent *= 2
        }
    }
}