export class Player {
    constructor(
        public id: number,
        public name: string,
        public piece: string,
        public balance: number,
        public isHost: boolean,
        public inJail: boolean,
        public propertiesOwned: number[]
    ) { }
}