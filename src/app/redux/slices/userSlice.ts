import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  favoriteBoards: string[];
}

const initialState: UserState = {
  token: null,
  email: null,
  firstname: null,
  lastname: null,
  favoriteBoards: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.firstname = action.payload.firstname;
      state.lastname = action.payload.lastname;
      state.favoriteBoards = action.payload.favoriteBoards;
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.firstname = null;
      state.lastname = null;
    },
    addBoardToFavorite: (state, action: PayloadAction<string>) => {
      state.favoriteBoards.push(action.payload);
    },
    removeBoardFromFavorite: (state, action: PayloadAction<string>) => {
      state.favoriteBoards = state.favoriteBoards.filter(
        (element) => element !== action.payload
      );
    },
  },
});

export const { login, logout, addBoardToFavorite, removeBoardFromFavorite } =
  userSlice.actions;
export default userSlice.reducer;
