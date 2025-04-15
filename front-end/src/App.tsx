import React from 'react';
import './App.css';
import { GameState as ImportedGameState, Cell } from './game';
import BoardCell from './Cell';

interface Props { }

interface EnhancedGameState extends ImportedGameState {
  currentPlayer?: string;
  winner?: string;
}

class App extends React.Component<Props, EnhancedGameState> {
  private initialized: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = { cells: [] };
  }

  newGame = async () => {
    const response = await fetch('/newgame');
    const json = await response.json();
    this.setState({ 
      cells: json['cells'],
      currentPlayer: json['currentPlayer'],
      winner: json['winner']
    });
  }
  
  undo = async () => {
    const response = await fetch('/undo');
    const json = await response.json();
    this.setState({ 
      cells: json['cells'],
      currentPlayer: json['currentPlayer'],
      winner: json['winner']
    });
  }
  
  play(x: number, y: number): React.MouseEventHandler {
    return async (e) => {
      e.preventDefault();
      const response = await fetch(`/play?x=${x}&y=${y}`);
      const json = await response.json();
      this.setState({ 
        cells: json['cells'],
        currentPlayer: json['currentPlayer'],
        winner: json['winner']
      });
    }
  }

  createCell(cell: Cell, index: number): React.ReactNode {
    const cellClass = `board-cell ${cell.text.toLowerCase()}`;
    
    if (cell.playable) {
      return (
        <div key={index}>
          <a href='/' onClick={this.play(cell.x, cell.y)} className={cellClass}>
            {cell.text}
          </a>
        </div>
      );
    } else {
      return (
        <div key={index} className={cellClass}>
          {cell.text}
        </div>
      );
    }
  }

  componentDidMount(): void {
    if (!this.initialized) {
      this.newGame();
      this.initialized = true;
    }
  }

  render(): React.ReactNode {
    return (
      <div className="game-container">
        <div id="game-status">
          {this.state.winner ? (
            <div className="winner-message">
              Player {this.state.winner} Wins!
            </div>
          ) : (
            <div className="current-player">
              Current Turn: <span>{this.state.currentPlayer || 'X'}</span>
            </div>
          )}
        </div>
        <div id="board">
          {this.state.cells.map((cell, i) => this.createCell(cell, i))}
        </div>
        <div id="bottombar">
          <button onClick={this.newGame} className="game-button new-game-button">New Game</button>
          <button onClick={this.undo} className="game-button undo-button">Undo</button>
        </div>
      </div>
    );
  }
}

export default App;