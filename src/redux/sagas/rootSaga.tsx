import { all } from "redux-saga/effects";

import authSaga from "./authSaga";
import profileSagas from "./profileSaga";
import actorSagas from "./actorSaga";
import projectSagas from "./projectSaga";
import chatSagas from "./chatSaga";

function* rootSaga() {
  yield all([...authSaga, ...profileSagas, ...actorSagas, ...projectSagas, ...chatSagas]);
}

export default rootSaga;
