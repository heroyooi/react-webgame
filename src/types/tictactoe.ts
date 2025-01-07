export interface ReducerState {
  winner: 'O' | 'X' | '';
  turn: 'O' | 'X';
  tableData: string[][];
  recentCell: [number, number];
}

export const SET_WINNER = 'SET_WINNER';
export const CLICK_CELL = 'CLICK_CELL' as const;
export const CHANGE_TURN = 'CHANGE_TURN' as const;
export const RESET_GAME = 'RESET_GAME' as const;

export interface SetWinnerAction {
  type: typeof SET_WINNER;
  winner: 'O' | 'X';
}

export interface ClickCellAction {
  type: typeof CLICK_CELL;
  row: number;
  cell: number;
}

export interface ChangeTurnAction {
  type: typeof CHANGE_TURN;
}

export interface ResetGameAction {
  type: typeof RESET_GAME;
}

export type ReducerActions =
  | SetWinnerAction
  | ClickCellAction
  | ChangeTurnAction
  | ResetGameAction;
