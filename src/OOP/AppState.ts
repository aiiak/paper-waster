import BoardModel from './BoardModel';

export class AppModel {
    public board: BoardModel;
    constructor(public seed: string) {
        this.board = new BoardModel(seed);
    }
}
