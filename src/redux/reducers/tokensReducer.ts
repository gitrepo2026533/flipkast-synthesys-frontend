import { SIGN_IN_SERVER, SIGN_UP_SERVER } from "../actions/authActions";
import { StoreType } from "../../types/store";

export interface tokensStateType {
  auth: {
    accessToken: string;
  };
}

const tokensInitialState: tokensStateType = {
  auth: {
    accessToken: "",
  },
};

const tokensReducer = (state = tokensInitialState, action: any) => {
  switch (action.type) {
    // case `${SIGN_UP_SERVER}_SUCCESS`:
    case `${SIGN_IN_SERVER}_SUCCESS`: {
      const { token } = action.payload.data.data;
      return { ...state, auth: { accessToken: token || state.auth.accessToken } };
    }
    default: {
      return { ...state };
    }
  }
};

export const getAuthToken = (state: StoreType) => state.tokens.auth.accessToken;

export default tokensReducer;
