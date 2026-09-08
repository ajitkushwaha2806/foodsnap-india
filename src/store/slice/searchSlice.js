import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  page: 1,
  limit: 12,
  searchTrigger: 0,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    clearSearch: (state) => {
      state.query = "";
      state.page = 1;
    },
    triggerSearch: (state) => {
      state.searchTrigger = (state.searchTrigger || 0) + 1;
    },
  },
});

export const { setQuery, setPage, setLimit, clearSearch, triggerSearch } =
  searchSlice.actions;

export default searchSlice.reducer;
