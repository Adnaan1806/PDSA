import React from 'react';
import './Chessboard.css';

const Chessboard = ({ board, onSquareClick }) => {
    return (
        <div className="chessboard-container">
            <div className="chessboard">
                {board.map((row, rowIndex) => (
                    <div className="row" key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`square ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'} ${cell === 1 ? 'queen' : ''}`}
                                onClick={() => onSquareClick(rowIndex, colIndex)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chessboard;
