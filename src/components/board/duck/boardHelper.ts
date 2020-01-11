import shortid from 'shortid';
import { CellPosition, Direction } from '../../../common/types';
import { BOARD_SEED, DEFAULT_BOARD_VALUES, ROW_LENGTH } from './boardConstants';
import { boardInitialState } from './boardReducer';
import { Board, Cell, cellValue, Row, rowClearResult, squashResult, refillResult } from './types';

module BoardHelper {
    //#region Factory Methods
    export function createCell(location: CellPosition, value: cellValue): Cell {
        return {
            id: shortid.generate(),
            alive: true,
            position: location,
            value
        };
    }

    export function createRow(rowIdx: number, cellValues: cellValue[]): Row {
        return {
            items: cellValues.map((value, colIdx) => createCell({ rowIdx, colIdx }, value)),
            isRemoved: false
        };
    }

    export function createBoardRows(values: cellValue[], start = 0): Row[] {
        return _.chunk(values, ROW_LENGTH).map((cellValues, i) => createRow(i + start, cellValues));
    }

    export function createBoard(seed: string): Board {
        const values = BOARD_SEED.get(seed) || _.shuffle(DEFAULT_BOARD_VALUES);
        return {
            ...boardInitialState,
            rows: createBoardRows(values),
            cellLeft: values.length
        };
    }
    //#ednregion

    /**
     *Check if cell can be squashed.
     *Two cell ca be squashed if they have equal value or their values  sum equal  10
     *
     * @export
     * @param {Cell} source
     * @param {Cell} target
     * @returns {boolean}
     */
    function canSquash(source: Cell, target: Cell): boolean {
        return !!source && (source.value == target.value || source.value + target.value === 10);
    }

    function getCellCount(rows: Row[]): number {
        return rows.length * ROW_LENGTH + rows[rows.length - 1].items.length;
    }

    function getCellByIndx(rows: Row[], indx: number): Cell | null {
        const cell = rows[~~(indx / ROW_LENGTH)]?.items[indx % ROW_LENGTH];

        return cell ? { ...cell } : null;
    }

    function getCell(rows: Row[], pos: CellPosition): Cell | null {
        const cell = rows[pos.rowIdx].items[pos.colIdx];
        return cell ? { ...cell } : null;
    }

    function replaceCell(rows: Row[], pos: CellPosition, newCell: Cell): void {
        rows[pos.rowIdx].items[pos.colIdx] = newCell;
    }

    export function findNearest(rows: Row[], fromPos: CellPosition, dir: Direction): CellPosition | null {
        let { rowIdx, colIdx } = fromPos;
        let globalIdx = rowIdx * ROW_LENGTH + colIdx;
        const totalCellCount = getCellCount(rows);
        let cell;
        switch (dir) {
            case Direction.UP:
                while (
                    --rowIdx >= 0 &&
                    //!rows[rowIdx].isRemoved &&
                    !(cell = getCell(rows, { rowIdx, colIdx }))?.alive
                ) {}
                break;
            case Direction.DOWN:
                while (
                    ++rowIdx < rows.length &&
                    //!rows[rowIdx].isRemoved &&
                    !(cell = getCell(rows, { rowIdx, colIdx }))?.alive
                ) {}
                break;
            case Direction.LEFT:
                while (--globalIdx >= 0 && !(cell = getCellByIndx(rows, globalIdx))?.alive) {}
                break;
            case Direction.RIGHT:
                while (++globalIdx <= totalCellCount && !(cell = getCellByIndx(rows, globalIdx))?.alive) {}
                break;
        }
        return cell?.alive ? { ...cell.position } : null;
    }

    //TODO: this method mutate rows
    export function trySquash(rows: Row[], activePos: CellPosition, dir: Direction): squashResult {
        const squashResult = { wasSquashed: false, rows, activePos };
        const targetPos = findNearest(rows, activePos, dir);
        // No target cell, return default result
        if (!targetPos) return squashResult;

        const [current, target] = [activePos, targetPos].map(pos => getCell(rows, pos));
        if (!current || !target || !canSquash(current, target)) return squashResult;

        // following methods will mutate row
        replaceCell(rows, activePos, { ...current, alive: false });
        replaceCell(rows, targetPos, { ...target, alive: false });
        tryClearRows(rows, activePos.rowIdx, activePos.rowIdx, targetPos.rowIdx);
        const newActivePosition =
            findNearest(rows, activePos, Direction.RIGHT) ||
            findNearest(rows, activePos, Direction.LEFT) ||
            findNearest(rows, activePos, Direction.DOWN) ||
            findNearest(rows, activePos, Direction.UP) ||
            activePos;

        return {
            rows: rows,
            wasSquashed: true,
            activePos: newActivePosition
        };
        //this.tryClearRows(targetCell.location.rowIdx, this.activeCellPosition.rowIdx);
    }

    //TODO: this method mutate rows
    export function refill(rows: Row[]): refillResult {
        const newValues = _(rows)
            .flatMap(r => r.items)
            .filter(c => c.alive)
            .map(c => c.value)
            .value();

        const lasRow = rows.length - 1;
        const lastRowCells = rows[lasRow].items;
        const LastIdx = lastRowCells.length;

        const toPush = _(newValues)
            .take(ROW_LENGTH - lastRowCells.length)
            .map((value, colIdx) => createCell({ rowIdx: lasRow, colIdx: LastIdx + colIdx }, value))
            .value();

        !_.isEmpty(toPush) && lastRowCells.push(...toPush);
        if (newValues.length > toPush.length) {
            rows.push(...createBoardRows(newValues.slice(toPush.length), lasRow + 1));
        }

        return {
            rows,
            cellAddedCount: newValues.length
        };
    }

    export function tryClearRows(rows: Row[], activeRowIdx: number, ...rowIdx: number[]): rowClearResult {
        let wasCleared = false;
        let rowIdxDif = 0;
        _(rowIdx)
            .uniq()
            .forEach(rowIdx => {
                const row = rows[rowIdx];
                if (row.items.length === ROW_LENGTH && _.every(row.items, c => !c.alive)) {
                    row.isRemoved = true;
                    //row.cells.forEach(c => c.removed = true);
                    rowIdx < activeRowIdx && rowIdxDif++;
                }
            });

        return {
            rows,
            wasCleared,
            rowIdxDif
        };
    }
}
export default BoardHelper;
