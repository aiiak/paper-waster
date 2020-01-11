import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import shortid from 'shortid';
import { IState } from '../../state/initialState';
import { thunkActions } from '../../state/thunkActions';
import { appActionTypes } from '../app/duck/appActions';
import { AppAction } from '../app/duck/types';
import StatisticComponent from './StatisticComponent';

const mapStateToProps = (store: IState) => {
    return {
        isShown: store.app.isStatShown,
        isWin: store.app.isWin
    };
};
const mapDispatchToProps = (dispatch: ThunkDispatch<IState, void, AppAction>) => ({
    reset: () => dispatch(thunkActions.restart(appActionTypes.RESET, '')),
    startNew: (seed?: string) =>
        dispatch(thunkActions.restart(appActionTypes.START_NEW, seed || shortid.generate()) as any),
    cancel: () => dispatch({ type: appActionTypes.HIDE_STATISTIC })
});

const StatisticContainer = connect(mapStateToProps, mapDispatchToProps)(StatisticComponent);

export default StatisticContainer;
