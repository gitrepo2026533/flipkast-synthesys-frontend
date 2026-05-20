import { AuthModules } from "../../types/auth";

export const SET_IS_AUTHORIZED = "SET_IS_AUTHORIZED";
export const UPDATE_AUTH_LOADING = "UPDATE_AUTH_LOADING";
export const SIGN_IN_SERVER = "SIGN_IN_SERVER";
export const SIGN_UP_SERVER = "SIGN_UP_SERVER";
export const RECOVER_PASSWORD_SERVER = "RECOVER_PASSWORD_SERVER";
export const RESET_PASSWORD_SERVER = "RESET_PASSWORD_SERVER";
export const LOGOUT = "LOGOUT";
export const GET_TOKEN_USER = "GET_TOKEN_USER";

interface UpdateAuthLoadingProps {
  module: AuthModules;
  isLoading: boolean;
}

interface SignInProps {
  email: string;
  password: string;
}

interface SignUpProps {
  email: string;
  name: string;
  password: string;
  token: string;
}

interface RecoverPasswordProps {
  email: string;
}

interface ResetPasswordProps {
  password: string;
  token: string;
}

export const setIsAuthorized = (isAuthorized: boolean) => ({
  type: SET_IS_AUTHORIZED,
  payload: isAuthorized,
});

export const updateAuthLoading = ({ module, isLoading }: UpdateAuthLoadingProps) => ({
  type: UPDATE_AUTH_LOADING,
  payload: {
    module,
    isLoading,
  },
});

export const signInServer = (data: SignInProps) => ({
  type: SIGN_IN_SERVER,
  payload: {
    request: {
      method: "POST",
      url: `/auth/login`,
      data,
    },
  },
});

export const signUpServer = (data: SignUpProps) => ({
  type: SIGN_UP_SERVER,
  payload: {
    request: {
      method: "POST",
      url: `/auth/register`,
      data,
    },
  },
});

export const recoverPasswordServer = (data: RecoverPasswordProps) => ({
  type: RECOVER_PASSWORD_SERVER,
  payload: {
    request: {
      method: "POST",
      url: `/auth/forgotPassword`,
      data,
    },
  },
});

export const resetPasswordServer = (data: ResetPasswordProps) => ({
  type: RESET_PASSWORD_SERVER,
  payload: {
    request: {
      method: "POST",
      url: `/auth/updateUserPassword`,
      data,
    },
  },
});

export const getTokenUser = (token: string) => ({
  type: GET_TOKEN_USER,
  payload: {
    request: {
      method: "GET",
      url: `/auth/tokenUser?Token=${token}`,
    },
  },
});

export const logout = () => ({
  type: LOGOUT,
});
