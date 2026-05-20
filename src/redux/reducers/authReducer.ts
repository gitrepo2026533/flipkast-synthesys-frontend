import { AuthModules } from "../../types/auth";
import {
  GET_TOKEN_USER,
  LOGOUT,
  SET_IS_AUTHORIZED,
  SIGN_IN_SERVER,
  SIGN_UP_SERVER,
  UPDATE_AUTH_LOADING,
} from "../actions/authActions";
import { StoreType } from "../../types/store";
import { REHYDRATE } from "redux-persist";
import { parseISO } from "date-fns";
import { getAuthStatusData } from "../../lib/getAuthStatusData";
import { toast } from "react-toastify";
import Navigate from "../../lib/Navigate";
import { pages } from "../../lib/routeUtils";

export interface authStateType {
  [AuthModules.signIn]: {
    isLoading: boolean;
  };
  [AuthModules.signUp]: {
    isLoading: boolean;
  };
  [AuthModules.recoverPassword]: {
    isLoading: boolean;
  };
  [AuthModules.checkMail]: {
    isLoading: boolean;
  };
  [AuthModules.resetPassword]: {
    isLoading: boolean;
  };
  [AuthModules.getTokenUser]: {
    isLoading: boolean;
  };
  isAuthorized: boolean;
  tokens: {
    access: string;
    accessExpiration: Date | null;
  };
  user: {
    email: string;
    name: string;
  };
  isHydrated: boolean;
}

const authInitialState: authStateType = {
  [AuthModules.signIn]: {
    isLoading: false,
  },
  [AuthModules.signUp]: {
    isLoading: false,
  },
  [AuthModules.recoverPassword]: {
    isLoading: false,
  },
  [AuthModules.checkMail]: {
    isLoading: false,
  },
  [AuthModules.resetPassword]: {
    isLoading: false,
  },
  [AuthModules.getTokenUser]: {
    isLoading: false,
  },
  isAuthorized: false,
  tokens: {
    access: "",
    accessExpiration: null,
  },
  user: {
    email: "",
    name: "",
  },
  isHydrated: false,
};

const authReducer = (state = authInitialState, action: any) => {
  switch (action.type) {
    case REHYDRATE: {
      const data = action.payload;
      if (data) {
        const { access, accessExpiration } = data?.auth?.tokens || {};

        return {
          ...state,
          ...getAuthStatusData({ access, accessExpiration }),
          isHydrated: true,
        };
      }
      return { ...state, isHydrated: true };
    }

    case LOGOUT: {
      return { ...state, ...authInitialState };
    }

    case SET_IS_AUTHORIZED: {
      return { ...state, isAuthorized: action.payload };
    }
    case UPDATE_AUTH_LOADING: {
      const { module, isLoading } = action.payload;
      return { ...state, [module]: { ...state[module as AuthModules], isLoading } };
    }
    // case GET_TOKEN_USER: {
    //   return {
    //     ...state,
    //     user: {
    //       email: "",
    //       name: "",
    //     },
    //   };
    // }
    case `${GET_TOKEN_USER}_SUCCESS`: {
      if (action.payload) {
        const { email, firstName, lastName } = action.payload.data.data;

        return {
          ...state,
          user: {
            email,
            name: `${firstName} ${lastName}`,
          },
        };
      } else {
        toast.error("User already exists!");
        Navigate.push(pages.main());
        return { ...state };
      }
    }
    case `${SIGN_UP_SERVER}_SUCCESS`:
    case `${SIGN_IN_SERVER}_SUCCESS`: {
      const { token, expiration: expirationString } = action.payload.data.data;

      return {
        ...state,
        tokens: { access: token || state.tokens.access, accessExpiration: parseISO(expirationString) },
      };
    }
    default: {
      return { ...state };
    }
  }
};

export const getIsAuthorized = (state: StoreType) => state.auth.isAuthorized;
export const getIsSignInLoading = (state: StoreType) => state.auth[AuthModules.signIn].isLoading;
export const getIsSignUpLoading = (state: StoreType) => state.auth[AuthModules.signUp].isLoading;
export const getIsRecoverPasswordLoading = (state: StoreType) => state.auth[AuthModules.recoverPassword].isLoading;
export const getIsResetPasswordLoading = (state: StoreType) => state.auth[AuthModules.resetPassword].isLoading;
export const getIsTokenUserLoading = (state: StoreType) => state.auth[AuthModules.getTokenUser].isLoading;
export const getIsHydrated = (state: StoreType) => state.auth.isHydrated;
export const getUser = (state: StoreType) => state.auth.user;
export const getIsCheckMailLoading = (state: StoreType) => state.auth[AuthModules.checkMail].isLoading;

export default authReducer;
