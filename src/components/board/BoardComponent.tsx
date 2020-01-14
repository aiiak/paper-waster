import React, { useEffect } from 'react';
import CellContainer from '../cell/CellContainer';
import './Board.scss';
import { Row } from './duck/types';

type BoardProps = {
    rows: Row[];
    keyDown: (event: KeyboardEvent) => void;
    mouseDrag: (dX: number, dY: number) => boolean;
};

const BoardComponent: React.FC<BoardProps> = props => {
    let isDrag = false;
    let x: number, y: number;

    function onPointerMove(e: React.PointerEvent<HTMLElement>) {
        if (isDrag) {
            const isFired = props.mouseDrag(e.clientX - x, e.clientY - y);
            isDrag = !isFired;
        }
    }

    function onPointerDown(e: React.PointerEvent<HTMLElement>) {
        isDrag = true;
        x = e.clientX;
        y = e.clientY;
    }

    function onPointerUp(e: React.PointerEvent<HTMLElement>) {
        isDrag = false;
    }
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

    return (
        <div className="board" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
            {rowsElements}
        </div>
    );
};

export default BoardComponent;
