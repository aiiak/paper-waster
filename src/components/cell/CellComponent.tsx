import React from 'react';
import './Cell.scss';
import { CellPosition } from '../../common/types';
import { Cell } from '../board/duck/types';

export type CellComponentProps = {
    cell: Cell;
    isActive: boolean;
    selectCell: (position: CellPosition) => object;
};

const CellComponent: React.FC<CellComponentProps> = props => {
    return props.cell.alive ? (
        <div
            className={props.isActive ? ' cell cell-active' : 'cell'}
            key={props.cell.id}
            onClick={() => props.selectCell(props.cell.position)}
        >
            {props.cell.value}
        </div>
    ) : (
        <div className="cell cell-squashed" key={props.cell.id}></div>
    );
};

export default CellComponent;
