import { MessagesHistory } from "../../types/chat";
import { StoreType } from "../../types/store";
import { UPDATE_LAST_MESSAGE_LOADING, ADD_MESSAGE_TO_HISTORY, REMOVE_LAST_FROM_HISTORY } from "../actions/chatActions";

export interface chatStateType {
  history: MessagesHistory[];
  isLastMessageLoading: boolean;
}

const chatInitialState: chatStateType = {
  history: [],
  isLastMessageLoading: false,
};

const chatReducer = (state = chatInitialState, action: any) => {
  switch (action.type) {
    case ADD_MESSAGE_TO_HISTORY: {
      return {
        ...state,
        history: [...state.history, action.payload.history],
      };
    }
    case UPDATE_LAST_MESSAGE_LOADING: {
      return {
        ...state,
        isLastMessageLoading: action.payload.status,
      };
    }
    case REMOVE_LAST_FROM_HISTORY: {
      return { ...state, history: [...state.history.slice(0, -2)] };
    }
    default: {
      return { ...state };
    }
  }
};

export const getMessagesHistory = (state: StoreType) => state.chat.history;
export const getIsLastMessageLoading = (state: StoreType) => state.chat.isLastMessageLoading;

export default chatReducer;
