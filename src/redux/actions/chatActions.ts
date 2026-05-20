import { MessagesHistory } from "../../types/chat";

export const SEND_MESSAGE_SERVER = "SEND_MESSAGE_SERVER";
export const ADD_MESSAGE_TO_HISTORY = "ADD_MESSAGE_TO_HISTORY";
export const UPDATE_LAST_MESSAGE_LOADING = "UPDATE_LAST_MESSAGE_LOADING";
export const REFRESH_LAST_MESSAGE = "REFRESH_LAST_MESSAGE";
export const REMOVE_LAST_FROM_HISTORY = "REMOVE_LAST_FROM_HISTORY";

interface SendMessageProps {
  text: string;
  history: MessagesHistory[];
}

interface AddToHistoryProps {
  history: MessagesHistory;
}

interface UpdateStatusProps {
  status: boolean;
}

interface RefreshMessageProps {
  history: MessagesHistory[];
  lastUserMessage: string;
}

export const sendMessageServer = ({ text, history }: SendMessageProps) => ({
  type: SEND_MESSAGE_SERVER,
  payload: {
    request: {
      method: "POST",
      url: "/chat/output",
      data: {
        input_text: text,
        history_data: history.map(({ message, is_sent }) => ({ message, is_sent })),
      },
    },
    text,
  },
});

export const addMessageToHistory = ({ history }: AddToHistoryProps) => ({
  type: ADD_MESSAGE_TO_HISTORY,
  payload: { history },
});

export const updateMessageLoading = ({ status }: UpdateStatusProps) => ({
  type: UPDATE_LAST_MESSAGE_LOADING,
  payload: { status },
});

export const refreshMessage = ({ history, lastUserMessage }: RefreshMessageProps) => ({
  type: REFRESH_LAST_MESSAGE,
  payload: { history, lastUserMessage },
});

export const removeLastFromHistory = () => ({
  type: REMOVE_LAST_FROM_HISTORY,
});
