import './Statistic.scss';
import React from 'react';
import ReactModal from 'react-modal';
import { Cat } from 'react-kawaii';

export type StatisticProps = {
    isShown: boolean;
    isWin: boolean;
    reset: () => void;
    startNew: (seed?: string) => object;
    cancel: () => object;
};

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const StatisticComponent: React.FC<StatisticProps> = props => {
    return (
        <ReactModal isOpen={props.isShown} contentLabel="Game results" style={customStyles} ariaHideApp={false}>
            <div className="statistic">
                <p className="resultCaption">{props.isWin ? 'Excellent!' : "Let's try new one ? "}</p>
                <Cat size={220} mood={props.isWin ? 'excited' : 'sad'} color="#596881" />
                <div className="toolbar">
                    <div className="button" onClick={() => props.reset()}>
                        Restart
                    </div>
                    <div className="button" onClick={() => props.startNew('initial')}>
                        Classic
                    </div>
                    <div className="button" onClick={() => props.startNew('test')}>
                        Test seed
                    </div>
                    <div className="button" onClick={() => props.startNew()}>
                        Try another one
                    </div>
                </div>
            </div>
        </ReactModal>
    );
};

export default StatisticComponent;
