import React from 'react';
import './Status.scss';
import { Cat, KawaiiMood } from 'react-kawaii';
import { faArrowDown, faArrowUp, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CELL_LIMIT } from '../board/duck/boardConstants';

type StatusProps = {
    mood: KawaiiMood;
};

const StatusComponent: React.FC<StatusProps> = props => {
    return (
        <div className="status-bar">
            <div className="logo">Paperwaster</div>
            <div className="catContainer">
                <Cat size={220} mood={props.mood} color="#596881" />
            </div>
            <div className="rules">
                <b>Rules: </b>
                <p>You need to clear bard by squashing all cells.</p>
                <p>Items can be squashed if they have same value or their sum equal 10.</p>
                <p>
                    Only 'neighbor' cell can be squashed. Two cell are considered 'neighbor' if they are adjacent, or
                    there is only empty cell between them. Rows are transparent, f.e. you can squash last cell in one
                    row with first one at next row.
                </p>
                <p>
                    You will automatically lose, if live cell count exceeded <b>{CELL_LIMIT}</b>
                </p>
            </div>
            <div className="navigation">
                <b>Navigation:</b>
                <p style={{ lineHeight: '18px' }}>
                    <FontAwesomeIcon icon={faArrowUp} border={true} />
                    <FontAwesomeIcon icon={faArrowDown} border={true} />
                    <FontAwesomeIcon icon={faArrowLeft} border={true} />
                    <FontAwesomeIcon icon={faArrowRight} border={true} /> to move between cells
                </p>
                <p>
                    <b> Ctrl + </b>&nbsp;
                    <FontAwesomeIcon icon={faArrowUp} border={true} />
                    <FontAwesomeIcon icon={faArrowDown} border={true} />
                    <FontAwesomeIcon icon={faArrowLeft} border={true} />
                    <FontAwesomeIcon icon={faArrowRight} border={true} /> to try squash cells
                </p>
                <p>
                    <b> Alt + </b>&nbsp;
                    <FontAwesomeIcon icon={faArrowLeft} border={true} />
                    <FontAwesomeIcon icon={faArrowRight} border={true} /> to try squash cells
                </p>
                <p>
                    <b> Enter </b> to refill the board
                </p>
            </div>
        </div>
    );
};

export default StatusComponent;
