import React from 'react';
import { Cell } from './game';

interface BoardCellProps {
  cell: Cell;
}

class BoardCell extends React.Component<BoardCellProps> {
  render() {
    const { cell } = this.props;
    const cellClass = `board-cell ${cell.text.toLowerCase()}`;
    
    return (
      <div className={cellClass}>
        {cell.text}
      </div>
    );
  }
}

export default BoardCell;