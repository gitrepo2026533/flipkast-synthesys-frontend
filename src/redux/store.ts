import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import createSagaMiddleware from "redux-saga";
import { applyMiddleware, createStore } from "redux";

import options from "./axiosConfig";

import rootReducer from "./reducers/rootReducer";
import rootSaga from "./sagas/rootSaga";
import logger from "redux-logger";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_LINK,
  responseType: "json",
});

const makeStore: any = () => {
  const sagaMiddleware = createSagaMiddleware();
  const { persistStore, persistReducer } = require("redux-persist");
  const storage = require("redux-persist/lib/storage").default;

  const persistConfig = {
    key: "nextjs",
    whitelist: ["auth", "theme"],
    storage,
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store: any = createStore<any, any, any, any>(
    persistedReducer,
    {},
    applyMiddleware(axiosMiddleware(client, options), logger, sagaMiddleware),
  );

  store.__persistor = persistStore(store);
  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

const store = makeStore();

export default store;
