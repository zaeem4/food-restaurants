import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { createStateSyncMiddleware } from "redux-state-sync";

import userReducer from "./user";

const reducers = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage,
  transforms: [
    encryptTransform({
      secretKey: process.env.REACT_APP_SECRET_KEY,
      // eslint-disable-next-line
      onError: function (error) {
        console.log(error);
        // Handle the error.
      },
    }),
  ],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const config = {
  // Overwrite existing state with incoming state
  receiveState: (prevState, nextState) => nextState,
  blacklist: ["persist/PERSIST"],
};
const middlewares = [createStateSyncMiddleware(config)];

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: middlewares,
});

export const persistor = persistStore(store);
