import { put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { AuthModules } from "../../types/auth";

import {
  GET_TOKEN_USER,
  LOGOUT,
  RECOVER_PASSWORD_SERVER,
  RESET_PASSWORD_SERVER,
  setIsAuthorized,
  SIGN_IN_SERVER,
  SIGN_UP_SERVER,
  updateAuthLoading,
} from "../actions/authActions";
import Navigate from "../../lib/Navigate";
import { pages } from "../../lib/routeUtils";

const authSagas = [
  takeEvery(LOGOUT, logoutHandler),

  takeEvery(`${SIGN_IN_SERVER}`, handleSignIn),
  takeEvery(`${SIGN_IN_SERVER}_FAIL`, handleSignInFail),
  takeEvery(`${SIGN_IN_SERVER}_SUCCESS`, handleSignInSuccess),

  takeEvery(`${SIGN_UP_SERVER}`, handleSignUp),
  takeEvery(`${SIGN_UP_SERVER}_FAIL`, handleSignUpFail),
  takeEvery(`${SIGN_UP_SERVER}_SUCCESS`, handleSignUpSuccess),

  takeEvery(`${RECOVER_PASSWORD_SERVER}`, handleRecoverPassword),
  takeEvery(`${RECOVER_PASSWORD_SERVER}_FAIL`, handleRecoverPasswordFail),
  takeEvery(`${RECOVER_PASSWORD_SERVER}_SUCCESS`, handleRecoverPasswordSuccess),

  takeEvery(`${RESET_PASSWORD_SERVER}`, handleResetPassword),
  takeEvery(`${RESET_PASSWORD_SERVER}_FAIL`, handleResetPasswordFail),
  takeEvery(`${RESET_PASSWORD_SERVER}_SUCCESS`, handleResetPasswordSuccess),

  takeEvery(`${GET_TOKEN_USER}`, handleGetTokenUser),
  takeEvery(`${GET_TOKEN_USER}_FAIL`, handleGetTokenUserFail),
  takeEvery(`${GET_TOKEN_USER}_SUCCESS`, handleGetTokenUserSuccess),
];

function* logoutHandler() {
  yield Navigate.push(pages.signIn());
}

function* handleSignIn() {
  yield put(updateAuthLoading({ module: AuthModules.signIn, isLoading: true }));
}

function* handleSignInFail(action: any) {
  yield toast.error(
    action?.error?.response?.data?.message || "Sign in failed, check your credentials or try again later",
  );
  yield put(updateAuthLoading({ module: AuthModules.signIn, isLoading: false }));
}

function* handleSignInSuccess() {
  yield put(setIsAuthorized(true));
  yield put(updateAuthLoading({ module: AuthModules.signIn, isLoading: false }));
  yield Navigate.push(pages.main());
}

function* handleSignUp() {
  yield put(updateAuthLoading({ module: AuthModules.signUp, isLoading: true }));
}

function* handleSignUpFail(action: any) {
  yield toast.error(action?.error?.response?.data?.message || "Sign up failed");
  yield put(updateAuthLoading({ module: AuthModules.signUp, isLoading: false }));
}

function* handleSignUpSuccess() {
  yield put(setIsAuthorized(true));
  yield put(updateAuthLoading({ module: AuthModules.signUp, isLoading: false }));
  yield Navigate.push(pages.main());
}

function* handleRecoverPassword() {
  yield put(updateAuthLoading({ module: AuthModules.recoverPassword, isLoading: true }));
  yield put(updateAuthLoading({ module: AuthModules.checkMail, isLoading: false }));
}

function* handleRecoverPasswordFail(action: any) {
  yield toast.error(action?.error?.response?.data?.message || "Recover Password failed");
  yield put(updateAuthLoading({ module: AuthModules.recoverPassword, isLoading: false }));
}

function* handleRecoverPasswordSuccess(action: any) {
  const { message, succeeded } = action.payload.data;

  if (succeeded) {
    // yield toast.success(message);
    // yield Navigate.push(pages.signIn());
    yield put(updateAuthLoading({ module: AuthModules.checkMail, isLoading: true }));
  }

  yield put(updateAuthLoading({ module: AuthModules.recoverPassword, isLoading: false }));
}

function* handleResetPassword() {
  yield put(updateAuthLoading({ module: AuthModules.resetPassword, isLoading: true }));
}

function* handleResetPasswordFail() {
  yield toast.error("Reset Password failed");
  yield put(updateAuthLoading({ module: AuthModules.resetPassword, isLoading: false }));
}

function* handleResetPasswordSuccess(action: any) {
  const { message, succeeded } = action.payload.data;

  if (succeeded) {
    // yield toast.success(message);
    yield Navigate.push(pages.signIn());
  }

  yield put(updateAuthLoading({ module: AuthModules.resetPassword, isLoading: false }));
}

function* handleGetTokenUser() {
  yield put(updateAuthLoading({ module: AuthModules.getTokenUser, isLoading: true }));
}

function* handleGetTokenUserFail() {
  yield toast.error("Wrong token");
  yield put(updateAuthLoading({ module: AuthModules.getTokenUser, isLoading: false }));
}

function* handleGetTokenUserSuccess(action: any) {
  yield put(updateAuthLoading({ module: AuthModules.getTokenUser, isLoading: false }));
}

export default authSagas;
