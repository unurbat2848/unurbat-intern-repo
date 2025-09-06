/**
 * Redux store configuration
 */

const { configureStore } = require('@reduxjs/toolkit');
const counterReducer = require('./counterSlice').default;

const store = configureStore({
  reducer: {
    counter: counterReducer
  },
  // For testing, we might want to disable serializability checks
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

module.exports = store;