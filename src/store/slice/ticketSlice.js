import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api-client";

export const createTicket = createAsyncThunk(
  "tickets/create",
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/tickets", ticketData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to submit ticket."
      );
    }
  }
);

export const fetchTickets = createAsyncThunk(
  "tickets/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/api/tickets");
      return response.data?.tickets || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load tickets."
      );
    }
  }
);

const initialState = {
  tickets: [],
  loading: false,
  creating: false,
  error: null,
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    clearTickets: (state) => {
      state.tickets = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.creating = false;
        if (action.payload?.ticket) {
          state.tickets.unshift(action.payload.ticket);
        }
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTickets } = ticketSlice.actions;
export default ticketSlice.reducer;
