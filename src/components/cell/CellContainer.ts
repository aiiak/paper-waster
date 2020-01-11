import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { assertIsDefined } from '../../common/assertion';
import { CellPosition } from '../../common/types';
import { IState } from '../../state/initialState';
import { boardActionTypes } from '../board/duck/boardActions';
import { BoardAction } from '../board/duck/types';
import CellComponent from './CellComponent';

const mapStateToProps = (store: IState, ownProps: CellPosition) => {
    const row = store.board.rows[ownProps.rowIdx];
    assertIsDefined(row);
    const cell = row.items[ownProps.colIdx];
    assertIsDefined(cell);
    const pos = cell.position;
    const active = store.board.activeCellPosition;
    return {
        cell: row.items[ownProps.colIdx],
        isActive: active.rowIdx === pos.rowIdx && active.colIdx === pos.colIdx
    };
};

const mapDispatchToProps = (dispatch: Dispatch<BoardAction>, ownProps: CellPosition) => ({
    selectCell: (position: CellPosition) => dispatch({ type: boardActionTypes.SELECT_CELL, payload: position })
});

const CellContainer = connect(mapStateToProps, mapDispatchToProps)(CellComponent);

export default CellContainer;
