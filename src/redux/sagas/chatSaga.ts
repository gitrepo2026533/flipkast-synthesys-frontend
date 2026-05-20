import { put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import {
  SEND_MESSAGE_SERVER,
  updateMessageLoading,
  addMessageToHistory,
  REFRESH_LAST_MESSAGE,
  removeLastFromHistory,
  sendMessageServer,
} from "../actions/chatActions";

const chatSagas = [
  takeEvery(`${SEND_MESSAGE_SERVER}`, handleSendMessageServer),
  takeEvery(`${SEND_MESSAGE_SERVER}_FAIL`, handleSendMessageServerFail),
  takeEvery(`${SEND_MESSAGE_SERVER}_SUCCESS`, handleSendMessageServerSuccess),

  takeEvery(`${REFRESH_LAST_MESSAGE}`, handleRefreshLastMessage),
];

function* handleSendMessageServer(action: any) {
  yield put(updateMessageLoading({ status: true }));
  yield put(addMessageToHistory({ history: { is_sent: true, message: action.payload.text, image_urls: [] } }));
}

function* handleSendMessageServerFail() {
  yield put(updateMessageLoading({ status: false }));
  toast.error("Did not receive an answer. Try again later!");
}

function* handleSendMessageServerSuccess(action: any) {
  yield put(updateMessageLoading({ status: false }));
  const { image_urls, message: botMessage } = action.payload.data;
  if (!image_urls && !botMessage) {
    return toast.error("Did not receive an answer. Try again later!");
  }
  yield put(addMessageToHistory({ history: { is_sent: false, message: botMessage, image_urls } }));
}

function* handleRefreshLastMessage(action: any) {
  const { history, lastUserMessage } = action.payload;
  yield put(removeLastFromHistory());
  yield put(sendMessageServer({ text: lastUserMessage, history: history.slice(0, -2) }));
}

export default chatSagas;
