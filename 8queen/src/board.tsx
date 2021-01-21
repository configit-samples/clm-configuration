import * as api from './api';

export enum CellType {
  None,
  User,
  Rule,
  Incompatible,
}
type BoardType = CellType[][];

export type CompletionMode = 'no-help' | 'validation' | 'configurator';

export const INITIAL_QUEENS: Map<number, number> = new Map();

export const INITIAL_BOARD: BoardType = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

function emptyBoard() {
  return INITIAL_BOARD.map((col) => [...col]);
}

export function toggleQueen(
  board: BoardType,
  queens: Map<number, number>,
  row: number,
  col: number
) {
  const newQueens = new Map(queens);

  if (board[row][col] === CellType.User) {
    newQueens.delete(row);
  } else {
    newQueens.set(row, col);
  }
  return newQueens;
}

export async function makeBoard(queens, mode: CompletionMode) {
  if (mode === 'configurator') {
    const board = await configure(queens);
    return board;
  } else {
    const board = emptyBoard();
    queens.forEach((row1, col1) => {
      board[col1][row1] = CellType.User;

      board.forEach((cells, col2) =>
        cells.forEach((v, row2) => {
          if (v === CellType.None) {
            if (col2 === col1) {
              board[col2][row2] = CellType.Incompatible;
            }
            if (row2 === row1) {
              board[col2][row2] = CellType.Incompatible;
            }
            if (Math.abs(row2 - row1) === Math.abs(col2 - col1)) {
              board[col2][row2] = CellType.Incompatible;
            }
          }
        })
      );
    });
    return board;
  }
}

async function configure(queens: Map<number, number>) {
  const board = emptyBoard();
  const assignments = toAssignments(queens);
  const { phases } = await api.assign(assignments);
  const variables = phases[0].sections[0].variables;

  variables.forEach((variable) => {
    if (variable.id.startsWith('COL_')) {
      mark(board, variable);
    }
  });
  return board;
}

function mark(board, variable) {
  const colLetter = variable.id.split('COL_')[1];
  const colIndex = colLetter.charCodeAt(0) - 'A'.charCodeAt(0);
  const isUserAssigned = hasUserAssignedValue(variable);
  variable.values.forEach((v, rowIdx) => {
    if (v.assigned === 'byUser') {
      board[colIndex][rowIdx] = CellType.User;
    } else if (isUserAssigned || v.incompatible) {
      board[colIndex][rowIdx] = CellType.Incompatible;
    } else if (v.assigned === 'byRule') {
      board[colIndex][rowIdx] = CellType.Rule;
    } else {
      board[colIndex][rowIdx] = CellType.None;
    }
  });
}

function hasUserAssignedValue(variable) {
  return variable.values.some((v) => {
    return v.assigned === 'byUser';
  });
}

function colIndexToColLetter(colIdx: number) {
  return String.fromCharCode('A'.charCodeAt(0) + colIdx);
}

function toVariableId(colIdx: number) {
  return 'COL_' + colIndexToColLetter(colIdx);
}

function toValue(colIdx: number, rowIdx: number) {
  const rowLetter = colIndexToColLetter(colIdx);
  return rowLetter + (rowIdx + 1);
}

function toAssignments(queens: Map<number, number>) {
  const assignments = [];
  queens.forEach((row1, col1) => {
    const variableId = toVariableId(col1);
    const value = toValue(col1, row1);
    assignments.push({
      variableId,
      value,
    });
  });
  return assignments;
}

export function countQueensPlacedByRules(board) {
  let count = 0;
  board.forEach((col) => {
    count += col.filter((cell) => cell === CellType.Rule).length;
  });
  return count;
}
