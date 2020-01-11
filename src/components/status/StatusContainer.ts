import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IAppSettings, IState } from '../../state/initialState';
import { AppAction } from '../app/duck/types';
import { BoardAction } from '../board/duck/types';
import StatusComponent from './StatusComponent';

const mapStateToProps = (store: IState) => {
    return {
        mood: store.app.mood
    };
};
const mapDispatchToProps = (dispatch: Dispatch<AppAction | BoardAction>) => ({});

const StatusContainer = connect(mapStateToProps, mapDispatchToProps)(StatusComponent);

export default StatusContainer;
