import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  firstname: string;
  lastname: string;
  email: string;
}

interface Task {
  name: string;
  members: User[];
  description: string;
  deadline: Date;
  createdAt: Date;
  _id: string;
}

interface Column {
  name: string;
  tasks: Task[];
  _id: string;
}

interface Board {
  _id: string;
  name: string;
  columnId: Column[];
  createdAt: string;
  updatedAt: string;
  userId: User[];
}

interface BoardState {
  value: Board[];
  currentBoardId: string | null;
}

const initialState: BoardState = {
  value: [],
  currentBoardId: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addAnBoard: (state, action: PayloadAction<Board>) => {
      state.value.unshift(action.payload);
    },
    addBoards: (state, action: PayloadAction<Board[]>) => {
      state.value = [...state.value, ...action.payload];
    },
    deleteAnBoard: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter(
        (element) => element._id !== action.payload
      );
    },
    renameBoard: (
      state,
      action: PayloadAction<{ name: string; boardId: string }>
    ) => {
      const boardSelected = state.value.find(
        (element) => element._id === action.payload.boardId
      );
      if (boardSelected) {
        boardSelected.name = action.payload.name;
      }
    },
    selectedBoard: (state, action: PayloadAction<string>) => {
      state.currentBoardId = action.payload;
    },
    addColumn: (
      state,
      action: PayloadAction<{ column: Column; boardId: string }>
    ) => {
      const boardSelected = state.value.find(
        (element) => element._id === action.payload.boardId
      );
      if (boardSelected) {
        boardSelected.columnId.push(action.payload.column);
      }
    },
    renameColumn: (
      state,
      action: PayloadAction<{ boardId: string; name: string; columnId: string }>
    ) => {
      const boardSelected = state.value.find(
        (board) => board._id === action.payload.boardId
      );
      if (boardSelected) {
        const columnSelected = boardSelected.columnId.find(
          (column) => column._id === action.payload.columnId
        );
        if (columnSelected) {
          columnSelected.name = action.payload.name;
        }
      }
    },
    addTask: (
      state,
      action: PayloadAction<{ columnId: string; task: Task; boardId: string }>
    ) => {
      const board = state.value.find(
        (element) => element._id === action.payload.boardId
      );
      console.log("je suis dans le reducer");
      if (board) {
        console.log(board);
        const column = board.columnId.find(
          (element) => element._id === action.payload.columnId
        );
        if (column) {
          console.log(column);
          console.log(action.payload.task);
          column.tasks.push(action.payload.task);
        }
      }
    },
  },
});

export const {
  addAnBoard,
  addBoards,
  selectedBoard,
  addColumn,
  deleteAnBoard,
  renameBoard,
  renameColumn,
  addTask,
} = boardSlice.actions;
export default boardSlice.reducer;
