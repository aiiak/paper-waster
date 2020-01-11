import { CellPosition } from '../common/types';
import { Row } from './Row';
import { assertIsDefined } from '../common/assertion';
import { CellModel, cellValue } from './CellModel';

const ROW_LENGTH = 9;
export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}
const mockData = _.concat(
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 1, 1, 2, 1, 3, 1, 4, 1]
    //   [5, 1, 6, 1, 7, 1, 8, 1, 9]
) as cellValue[];

class BoardModel {
    public rows: Row[] = [];
    //private rowMap: Map<number, Row> = new Map();
    public activeCellPosition: CellPosition = { rowIdx: 0, colIdx: 0 };

    public canUndo = false;
    public canRedo = false;

    constructor(seed: string) {
        this.createRows(this.getInitial(seed));
    }

    private getInitial(seed: string) {
        return _.shuffle(mockData);
    }

    private createRows(values: cellValue[], start = 0) {
        _.chunk(values, ROW_LENGTH).map((rowValues, i) => {
            const rowIndex = i + start;
            const row = new Row(rowIndex, rowValues);
            this.rows.push(row);
        });
    }
    private tryClearRows(...rowIdx: number[]) {
        let activeCellShift = 0;
        _(rowIdx)
            .uniq()
            .forEach(rowIdx => {
                let row = this.rows[rowIdx];
                assertIsDefined(row);
                if (_.every(row.cells, c => c.isSquashed)) {
                    row.removed = true;
                    //row.cells.forEach(c => c.removed = true);
                    rowIdx < this.activeCellPosition.rowIdx && activeCellShift++;
                }
            });
        this.activeCellPosition.rowIdx -= activeCellShift;
        this.rows = [...this.rows];
    }

    public refill() {
        const newValues = _(this.rows)
            .flatMap(r => r.cells)
            .filter(c => c.selectable)
            .map(c => c.value);

        const lasRow = this.rows.length - 1;
        const lastRowCells = this.rows[lasRow].cells;
        assertIsDefined(lastRowCells);
        const LastIdx = lastRowCells.length;
        const toPush = newValues
            .take(ROW_LENGTH - lastRowCells.length)
            .map((v, i) => {
                return new CellModel({ rowIdx: lasRow, colIdx: LastIdx + i }, v);
            })
            .value();
        _.isEmpty(toPush) && lastRowCells.push(...toPush);
        if (newValues.size() > toPush.length) {
            this.createRows(newValues.slice(ROW_LENGTH - lastRowCells.length).value(), lasRow + 1);
        }

        this.rows = _.cloneDeep(this.rows);
    }

    private getCellByIndx(indx: number): CellModel {
        return this.rows[~~(indx / ROW_LENGTH)].cells[indx % ROW_LENGTH];
    }
    private getCell(coords: CellPosition) {
        const row = this.rows[coords.rowIdx];
        assertIsDefined(row);
        return row.cells[coords.colIdx];
    }
    private get lastRowIndex(): number {
        return this.rows.length - 1;
    }

    private getCellCount(): number {
        return this.rows.length * ROW_LENGTH + this.rows[this.lastRowIndex].length;
    }

    private findNearest(dir: Direction): CellModel | undefined {
        let { rowIdx, colIdx } = this.activeCellPosition;
        let globalIdx = rowIdx * ROW_LENGTH + colIdx;
        const totalCellCount = this.getCellCount();
        let cell;
        switch (dir) {
            case Direction.UP:
                while (
                    --rowIdx >= 0 &&
                    !this.rows[rowIdx].removed &&
                    !(cell = this.getCell({ rowIdx, colIdx })).selectable
                ) {}
                break;
            case Direction.DOWN:
                while (
                    ++rowIdx < this.rows.length &&
                    !this.rows[rowIdx].removed &&
                    !(cell = this.getCell({ rowIdx, colIdx })).selectable
                ) {}
                break;
            case Direction.LEFT:
                while (--globalIdx >= 0 && !(cell = this.getCellByIndx(globalIdx)).selectable) {}
                break;
            case Direction.RIGHT:
                while (++globalIdx <= totalCellCount && !(cell = this.getCellByIndx(globalIdx)).selectable) {}
                break;
        }
        return cell?.selectable ? cell : undefined;
    }
    /**
     * Two cell ca be squashed if they have equal value or their values  sum equal  10
     * @param target Cell, that will be compared with currently active cell
     */
    private canSquashWith(target: CellModel): boolean {
        const current = this.getCell(this.activeCellPosition);
        return !!current && (current.value == target.value || current.value + target.value === 10);
    }

    private markCellRemoved(pos: CellPosition) {
        const row = this.rows[pos.rowIdx];
        assertIsDefined(row);
        const newCell = _.clone(row.cells[pos.colIdx]); //Immer doesn't  identify that cell props was changed
        newCell.isSquashed = true;
        row.cells[pos.colIdx] = newCell;
        //row.cells[pos.colIdx] = _.clone(row.cells[pos.colIdx]).isSquashed = true;
        console.log(`Cell squashed  row: ${pos.rowIdx}, col: ${pos.colIdx} `);
    }

    public moveFocus(dir: Direction) {
        const cell = this.findNearest(dir);
        if (cell) {
            this.activeCellPosition = { ...cell.location };
            return true;
        }
        return false;
    }

    public trySquash(dir: Direction) {
        const targetCell = this.findNearest(dir);
        if (targetCell && this.canSquashWith(targetCell)) {
            this.markCellRemoved(targetCell.location);
            this.markCellRemoved(this.activeCellPosition);

            this.moveFocus(Direction.RIGHT) ||
                this.moveFocus(Direction.LEFT) ||
                this.moveFocus(Direction.DOWN) ||
                this.moveFocus(Direction.UP);

            this.tryClearRows(targetCell.location.rowIdx, this.activeCellPosition.rowIdx);
        }
    }
}
export default BoardModel;
