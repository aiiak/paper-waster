import shortid from 'shortid';
import { CellPosition } from '../common/types';

export type cellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export class CellModel {
    public readonly id = shortid.generate();
    public isSquashed = false;
    public removed = false;

    constructor(public readonly location: CellPosition, public readonly value: cellValue) {}

    public get caption() {
        return this.value;
    }

    public get selectable() {
        return !this.isSquashed;
    }
}
