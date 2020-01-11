import React, { useEffect } from 'react';
import CellContainer from '../cell/CellContainer';
import './Board.scss';
import { Row } from './duck/types';

type BoardProps = {
    rows: Row[];
    keyDown: (event: KeyboardEvent) => void;
};

const BoardComponent: React.FC<BoardProps> = props => {
    const rowsElements: JSX.Element[] = [];
    props.rows
        .filter(row => !row.isRemoved)
        .forEach(row => {
            row.items.forEach(c =>
                rowsElements.push(<CellContainer rowIdx={c.position.rowIdx} colIdx={c.position.colIdx}></CellContainer>)
            );
        });

    useEffect(() => {
        document.addEventListener('keydown', ev => props.keyDown(ev), false);

        // returned function will be called on component unmount
        return () => {
            document.removeEventListener('keydown', () => {});
        };
    }, []);

    return <div className="board">{rowsElements}</div>;
};

export default BoardComponent;
