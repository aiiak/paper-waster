import { shallow } from 'enzyme';
import CellContainer from './CellContainer';
import { IState, initialState } from '../../state/initialState';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../../state/reducer';
import React from 'react';

function createTestStore(state: IState = _.cloneDeep(initialState)) {
    return createStore(rootReducer, state, applyMiddleware(thunk));
}

describe('CellContainer', () => {
    it('', () => {
        //TODO: Need to find out why shallow doesn't take context
        // const store = createTestStore();
        // const { rowIdx, colIdx } = store.getState().board.activeCellPosition;
        // const cellComponent = shallow(<CellContainer rowIdx={rowIdx} colIdx={colIdx} />, {
        //     context: { store }
        // });
        // expect(cellComponent.hasClass('cell-active')).toBeTruthy();
    });
});
