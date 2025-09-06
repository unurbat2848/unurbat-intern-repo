/**
 * Redux slice for counter functionality
 * Demonstrates basic Redux operations for testing
 */

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

// Async thunk for demonstration - simulates API call
const fetchInitialCount = createAsyncThunk(
  'counter/fetchInitialCount',
  async (userId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    // Simulate fetching user's saved count from API
    return userId * 10; // Mock response based on userId
  }
);

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    loading: false,
    error: null,
    history: []
  },
  reducers: {
    increment: (state) => {
      state.history.push({ action: 'increment', prevValue: state.value });
      state.value += 1;
    },
    decrement: (state) => {
      state.history.push({ action: 'decrement', prevValue: state.value });
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      const amount = action.payload;
      state.history.push({ action: 'incrementByAmount', prevValue: state.value, amount });
      state.value += amount;
    },
    reset: (state) => {
      state.history.push({ action: 'reset', prevValue: state.value });
      state.value = 0;
      state.error = null;
    },
    clearHistory: (state) => {
      state.history = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitialCount.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
        state.history.push({ action: 'fetchInitialCount', prevValue: state.value });
      })
      .addCase(fetchInitialCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

// Export actions
const { increment, decrement, incrementByAmount, reset, clearHistory } = counterSlice.actions;

// Export async thunk
module.exports = {
  counterSlice,
  increment,
  decrement,
  incrementByAmount,
  reset,
  clearHistory,
  fetchInitialCount,
  // Export reducer as default
  default: counterSlice.reducer
};