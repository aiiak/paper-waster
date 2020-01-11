import { cellValue, CellModel } from './CellModel';

export class Row {
    private items: CellModel[];

    public removed = false;

    constructor(private rowIdx: number, cellValues: cellValue[]) {
        //assert(cellValues && cellValues.length < 9);
        this.items = cellValues.map((v, i) => new CellModel({ rowIdx: this.rowIdx, colIdx: i }, v));
    }

    public get cells(): CellModel[] {
        return this.items;
    }

    public get length(): number {
        return this.cells.length;
    }
}
