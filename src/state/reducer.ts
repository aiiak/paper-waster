import { appReducer } from '../components/app/duck/appReducer';
import { boardReducer } from '../components/board/duck/boardReducer';
import { IState, initialState } from './initialState';
import { AppAction } from '../components/app/duck/types';
import { BoardAction } from '../components/board/duck/types';
import { PWThunkAction } from './thunkActions';

const rootReducer = (state: IState = initialState, action: AppAction | BoardAction | PWThunkAction) => {
    return {
        app: appReducer(state.app, action as AppAction),
        board: boardReducer(state.board, action as BoardAction)
    } as any; // Reducer<CombinedState<IState>, AppAction | BoardAction>;
};

//const rootReducer = combineReducers({ app: appReducer, board: boardReducer });

export default rootReducer;
