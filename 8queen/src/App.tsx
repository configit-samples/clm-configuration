import React, { useState } from 'react';
import './styles.css';
import {
  INITIAL_BOARD,
  INITIAL_QUEENS,
  CellType,
  CompletionMode,
  toggleQueen,
  makeBoard as placeQueens,
  countQueensPlacedByRules,
} from './board';

import { QueenIcon } from './QueenIcon';
import { InvalidIcon } from './InvalidIcon';
import { ModesSelect } from './ModeSelect';

export default function App() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [userQueens, setUserQueens] = useState(INITIAL_QUEENS);
  const [mode, setMode] = useState<CompletionMode>('configurator');

  async function handleClick(col: number, row: number) {
    const cell = board[col][row];
    if (cell === CellType.Incompatible) {
      return;
    }
    const newQueens = toggleQueen(board, userQueens, col, row);
    const newBoard = await placeQueens(newQueens, mode);

    setUserQueens(newQueens);
    setBoard(newBoard);
  }

  function handleReset() {
    setUserQueens(INITIAL_QUEENS);
    setBoard(INITIAL_BOARD);
  }

  function handleModeChange(newMode) {
    handleReset();
    setMode(newMode);
  }

  async function handlePlaceHintQueen() {
    const newQueens = toggleQueen(INITIAL_BOARD, new Map(), 3, 0);
    const newBoard = await placeQueens(newQueens, 'configurator');

    setUserQueens(newQueens);
    setBoard(newBoard);
    setMode('configurator');
  }

  return (
    <>
      <div className="App">
        <Welcome />
        <div className="board-and-hints">
          <div className="menu-board-progress">
            <div className="menu">
              <ModesSelect
                onSelect={(value, e) => {
                  handleModeChange(value);
                }}
                value={mode}
              />
              <button className="button" onClick={handleReset}>
                Start Over
              </button>
            </div>
            <div className="board">
              <ColumnNames />
              {board.map((rv, col) => (
                <React.Fragment key={col}>
                  <div className="board-label" key={`start_label_${col}`}>
                    {(col - 8) * -1}
                  </div>
                  <div className="row">
                    {rv.map((cv, row) => (
                      <Piece
                        key={`${col}_${row}`}
                        onClick={() => handleClick(col, row)}
                        value={board[col][row]}
                        mode={mode}
                      />
                    ))}
                  </div>
                  <div className="board-label" key={`end_label_${col}`}>
                    {(col - 8) * -1}
                  </div>
                </React.Fragment>
              ))}
              <ColumnNames />
            </div>
            <Progress
              user={userQueens.size}
              rule={countQueensPlacedByRules(board)}
            />
          </div>
          <Hints onPlaceQueen={handlePlaceHintQueen} />
        </div>
      </div>
      <Footer />
    </>
  );
}

function ColumnNames() {
  return (
    <>
      <div className="board-label"></div>
      <div className="board-label">A</div>
      <div className="board-label">B</div>
      <div className="board-label">C</div>
      <div className="board-label">D</div>
      <div className="board-label">E</div>
      <div className="board-label">F</div>
      <div className="board-label">G</div>
      <div className="board-label">H</div>
      <div className="board-label"></div>
    </>
  );
}

function Progress({ user, rule }) {
  return (
    <div className="progress">
      {Array.from({ length: 8 }, (_, i) => i).map((i) =>
        i < user ? (
          <QueenIcon width="40" height="32" key={i} />
        ) : i < user + rule ? (
          <QueenIcon width="40" height="32" opacity={0.5} key={i} />
        ) : (
          <QueenIcon width="40" height="32" outline opacity={0.5} key={i} />
        )
      )}
    </div>
  );
}

function Piece({ onClick, value, mode }) {
  return (
    <button onClick={onClick} className="col">
      {value === CellType.User ? (
        <QueenIcon width="50%" height="50%" />
      ) : value === CellType.Rule ? (
        <QueenIcon width="50%" height="50%" opacity={0.6} />
      ) : value === CellType.Incompatible && mode !== 'no-help' ? (
        <InvalidIcon width="100%" height="100%" />
      ) : (
        ''
      )}
    </button>
  );
}

function Footer() {
  return (
    <footer>
      <div>
        For details on this classic puzzle, go to{' '}
        <a
          href="https://en.wikipedia.org/wiki/Eight_queens_puzzle"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://en.wikipedia.org/wiki/Eight_queens_puzzle
        </a>
      </div>
      <div className="no-wrap">
        <a href="https://www.configit.com">Configit A/S</a> - 2020
      </div>
    </footer>
  );
}

function Welcome() {
  return (
    <div className="welcome">
      <h1>Eight queens game</h1>
      <p className="lead">
        In this game, your goal is to place eight queens on the chessboard
        without any of the queens capturing each other.
      </p>
    </div>
  );
}

function Hints({ onPlaceQueen }) {
  return (
    <div className="hints">
      <h2>You might be surprised…</h2>
      <p>
        <button className="button" onClick={onPlaceQueen}>
          Place a <QueenIcon width="20" height="12" /> on A5
        </button>
      </p>
      <p>
        In Configurator mode, E6 becomes blocked! That’s because{' '}
        <strong>Configit’s Virtual Tabulation®</strong> configuration engine{' '}
        knows there are no solutions with queens on both A5 and E6. Even though
        it may look possible, no matter where you place the remaining queens,
        you will reach a dead end.
      </p>
      <p>
        This demonstrates the power of using Configit’s VT technology.{' '}
        <strong>
          No more false leads, backtracking, or incompatible choices
        </strong>{' '}
        — you are guided to a valid solution, every time.
      </p>

      <p className="call-to-action">
        <a
          href="https://www.configit.com/solution-space"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about Virtual Tabulation®
        </a>
      </p>
    </div>
  );
}
