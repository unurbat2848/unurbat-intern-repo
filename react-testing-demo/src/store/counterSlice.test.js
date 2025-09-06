/**
 * Unit tests for counter Redux slice
 * Demonstrates testing both synchronous reducers and asynchronous thunks
 */

const { configureStore } = require('@reduxjs/toolkit');
const {
  counterSlice,
  increment,
  decrement,
  incrementByAmount,
  reset,
  clearHistory,
  fetchInitialCount,
  default: counterReducer
} = require('./counterSlice');

// Helper function to create a test store
const createTestStore = (initialState = undefined) => {
  return configureStore({
    reducer: {
      counter: counterReducer
    },
    preloadedState: initialState ? { counter: initialState } : undefined
  });
};

describe('Counter Redux Slice', () => {
  describe('Reducer Tests', () => {
    const initialState = {
      value: 0,
      loading: false,
      error: null,
      history: []
    };

    test('should return initial state when called with undefined state', () => {
      const result = counterReducer(undefined, { type: 'unknown' });
      expect(result).toEqual(initialState);
    });

    test('should handle increment action', () => {
      const result = counterReducer(initialState, increment());
      
      expect(result.value).toBe(1);
      expect(result.history).toHaveLength(1);
      expect(result.history[0]).toEqual({
        action: 'increment',
        prevValue: 0
      });
    });

    test('should handle decrement action', () => {
      const startState = { ...initialState, value: 5 };
      const result = counterReducer(startState, decrement());
      
      expect(result.value).toBe(4);
      expect(result.history).toHaveLength(1);
      expect(result.history[0]).toEqual({
        action: 'decrement',
        prevValue: 5
      });
    });

    test('should handle incrementByAmount action', () => {
      const result = counterReducer(initialState, incrementByAmount(7));
      
      expect(result.value).toBe(7);
      expect(result.history).toHaveLength(1);
      expect(result.history[0]).toEqual({
        action: 'incrementByAmount',
        prevValue: 0,
        amount: 7
      });
    });

    test('should handle reset action', () => {
      const startState = { 
        ...initialState, 
        value: 25, 
        error: 'Some error',
        history: [{ action: 'increment', prevValue: 24 }]
      };
      const result = counterReducer(startState, reset());
      
      expect(result.value).toBe(0);
      expect(result.error).toBeNull();
      expect(result.history).toHaveLength(2); // Previous history + reset action
      expect(result.history[1]).toEqual({
        action: 'reset',
        prevValue: 25
      });
    });

    test('should handle clearHistory action', () => {
      const startState = { 
        ...initialState,
        history: [
          { action: 'increment', prevValue: 0 },
          { action: 'decrement', prevValue: 1 }
        ]
      };
      const result = counterReducer(startState, clearHistory());
      
      expect(result.history).toEqual([]);
      expect(result.value).toBe(0); // Value should remain unchanged
    });

    test('should handle multiple actions in sequence', () => {
      let state = initialState;
      
      // Increment twice
      state = counterReducer(state, increment());
      state = counterReducer(state, increment());
      
      expect(state.value).toBe(2);
      expect(state.history).toHaveLength(2);
      
      // Add 10
      state = counterReducer(state, incrementByAmount(10));
      
      expect(state.value).toBe(12);
      expect(state.history).toHaveLength(3);
      
      // Decrement
      state = counterReducer(state, decrement());
      
      expect(state.value).toBe(11);
      expect(state.history).toHaveLength(4);
    });
  });

  describe('Store Integration Tests', () => {
    test('should work with actual Redux store', () => {
      const store = createTestStore();
      
      expect(store.getState().counter.value).toBe(0);
      
      store.dispatch(increment());
      expect(store.getState().counter.value).toBe(1);
      
      store.dispatch(incrementByAmount(5));
      expect(store.getState().counter.value).toBe(6);
      
      store.dispatch(reset());
      expect(store.getState().counter.value).toBe(0);
    });

    test('should maintain history correctly in store', () => {
      const store = createTestStore();
      
      store.dispatch(increment());
      store.dispatch(incrementByAmount(3));
      store.dispatch(decrement());
      
      const history = store.getState().counter.history;
      expect(history).toHaveLength(3);
      expect(history[0].action).toBe('increment');
      expect(history[1].action).toBe('incrementByAmount');
      expect(history[2].action).toBe('decrement');
    });
  });

  describe('Async Thunk Tests', () => {
    test('should handle fetchInitialCount.pending', () => {
      const action = { type: fetchInitialCount.pending.type };
      const result = counterReducer(
        { value: 0, loading: false, error: null, history: [] },
        action
      );
      
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should handle fetchInitialCount.fulfilled', () => {
      const action = {
        type: fetchInitialCount.fulfilled.type,
        payload: 42
      };
      const result = counterReducer(
        { value: 0, loading: true, error: null, history: [] },
        action
      );
      
      expect(result.loading).toBe(false);
      expect(result.value).toBe(42);
      expect(result.history).toHaveLength(1);
      expect(result.history[0].action).toBe('fetchInitialCount');
    });

    test('should handle fetchInitialCount.rejected', () => {
      const action = {
        type: fetchInitialCount.rejected.type,
        error: { message: 'Network error' }
      };
      const result = counterReducer(
        { value: 0, loading: true, error: null, history: [] },
        action
      );
      
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Network error');
      expect(result.value).toBe(0); // Value should remain unchanged on error
    });
  });

  describe('Async Thunk Integration Tests', () => {
    test('should dispatch fetchInitialCount successfully', async () => {
      const store = createTestStore();
      
      // Dispatch the async action
      const resultAction = await store.dispatch(fetchInitialCount(5));
      
      // Check that the action was fulfilled
      expect(fetchInitialCount.fulfilled.match(resultAction)).toBe(true);
      expect(resultAction.payload).toBe(50); // 5 * 10 from our mock implementation
      
      // Check store state
      const finalState = store.getState().counter;
      expect(finalState.loading).toBe(false);
      expect(finalState.value).toBe(50);
      expect(finalState.error).toBeNull();
      expect(finalState.history).toHaveLength(1);
    });

    test('should handle multiple async actions', async () => {
      const store = createTestStore();
      
      // Dispatch multiple async actions
      await store.dispatch(fetchInitialCount(3));
      store.dispatch(increment());
      await store.dispatch(fetchInitialCount(2));
      
      const finalState = store.getState().counter;
      expect(finalState.value).toBe(20); // Last fetchInitialCount result (2 * 10)
      expect(finalState.loading).toBe(false);
      expect(finalState.history.length).toBeGreaterThan(1);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle negative increment amounts', () => {
      const result = counterReducer(
        { value: 10, loading: false, error: null, history: [] },
        incrementByAmount(-5)
      );
      
      expect(result.value).toBe(5);
      expect(result.history[0].amount).toBe(-5);
    });

    test('should handle zero increment amount', () => {
      const result = counterReducer(
        { value: 10, loading: false, error: null, history: [] },
        incrementByAmount(0)
      );
      
      expect(result.value).toBe(10);
      expect(result.history[0].amount).toBe(0);
    });

    test('should handle very large numbers', () => {
      const largeNumber = 999999999;
      const result = counterReducer(
        { value: 0, loading: false, error: null, history: [] },
        incrementByAmount(largeNumber)
      );
      
      expect(result.value).toBe(largeNumber);
    });

    test('should maintain immutability', () => {
      const initialState = {
        value: 5,
        loading: false,
        error: null,
        history: [{ action: 'increment', prevValue: 4 }]
      };
      
      const result = counterReducer(initialState, increment());
      
      // Original state should not be modified
      expect(initialState.value).toBe(5);
      expect(initialState.history).toHaveLength(1);
      
      // New state should be different
      expect(result.value).toBe(6);
      expect(result.history).toHaveLength(2);
      expect(result).not.toBe(initialState);
    });
  });
});