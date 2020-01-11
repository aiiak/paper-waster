import React from 'react';
import './Toolbar.scss';

type ToolbarProps = {
    turn: number;
    seed: string;
    canUndo: boolean;
    canRedo: boolean;
    cellLeft: number;
    concede: () => object;
    next: () => void;
    undo: () => object;
    redo: () => object;
};

const ToolbarComponent: React.FC<ToolbarProps> = props => {
    return (
        <div className="toolbar">
            <p>
                <b>Seed:</b> {props.seed}
            </p>
            <p>
                <b>Turn:</b> {props.turn}
            </p>
            <p>
                <b>Left:</b> {props.cellLeft}
            </p>
            <div style={{ display: 'flex', alignContent: 'stretch', flexDirection: 'row', paddingTop: 10 }}>
                <div
                    className={props.canUndo ? 'button' : 'button button-disabled'}
                    onClick={() => props.canUndo && props.undo()}
                >
                    Undo
                </div>
                <div
                    className={props.canRedo ? 'button' : 'button button-disabled'}
                    onClick={() => props.canRedo && props.redo()}
                >
                    Redo
                </div>
                <div className="button" onClick={() => props.next()}>
                    Refill
                </div>
                <div className="button bg-red" onClick={() => props.concede()}>
                    Concede
                </div>
            </div>
        </div>
    );
};

export default ToolbarComponent;
