import './App.scss';
import '../../style/common.scss';
import React from 'react';
import { Provider } from 'react-redux';
import BoardContainer from '../board/BoardContainer';
import ToolbarContainer from '../toolbar/ToolbarContainer';
import store from '../../state/store';
import StatusContainer from '../status/StatusContainer';
import StatisticContainer from '../statistic/StatisticContainer';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <StatusContainer />
            <div className="container">
                <ToolbarContainer />
                <BoardContainer />
            </div>
            <StatisticContainer />
        </Provider>
    );
};

export default App;
