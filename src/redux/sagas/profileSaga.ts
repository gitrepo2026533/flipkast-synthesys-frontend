import { put, select, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";

import {
  CHANGE_PASSWORD_SERVER,
  CLONE_VOICE_SERVER,
  DELETE_PROFILE_PIC_SERVER,
  getMyProfileServer,
  GET_MY_PROFILE_SERVER,
  updateProfile,
  updateProfileLoading,
  UPDATE_PROFILE_SERVER,
  uploadProfilePic,
  UPLOAD_PROFILE_PIC_SERVER,
  GENERATE_API_KEY_SERVER,
} from "../actions/profileActions";
import { ProfileModules } from "../../types/profile";
import { Popups, updatePopup } from "../actions/popupsActions";
import { getProfile } from "../reducers/profileReducer";

const profileSagas = [
  takeEvery(`${CHANGE_PASSWORD_SERVER}`, handleChangePassword),
  takeEvery(`${CHANGE_PASSWORD_SERVER}_FAIL`, handleChangePasswordFail),
  takeEvery(`${CHANGE_PASSWORD_SERVER}_SUCCESS`, handleChangePasswordSuccess),

  takeEvery(`${UPDATE_PROFILE_SERVER}_SUCCESS`, updateProfileSuccessHandler),
  takeEvery(`${UPDATE_PROFILE_SERVER}_FAIL`, updateProfileFailHandler),

  takeEvery(`${UPLOAD_PROFILE_PIC_SERVER}_SUCCESS`, uploadProfilePicSuccessHandler),
  takeEvery(`${UPLOAD_PROFILE_PIC_SERVER}_FAIL`, uploadProfilePicFailHandler),

  takeEvery(`${GET_MY_PROFILE_SERVER}`, getMyProfileServerHandler),
  takeEvery(`${GET_MY_PROFILE_SERVER}_SUCCESS`, getMyProfileServerSuccessHandler),
  // takeEvery(`${DELETE_PROFILE_PIC_SERVER}_SUCCESS`, deleteProfilePicSuccessHandler),
  // takeEvery(`${DELETE_PROFILE_PIC_SERVER}_FAIL`, deleteProfilePicFailHandler),
  takeEvery(`${CLONE_VOICE_SERVER}_SUCCESS`, cloneVoiceServerSuccessHandler),

  takeEvery(`${GENERATE_API_KEY_SERVER}`, handleGenerateApiKey),
  takeEvery(`${GENERATE_API_KEY_SERVER}_FAIL`, handleGenerateApiKeyFail),
  takeEvery(`${GENERATE_API_KEY_SERVER}_SUCCESS`, handleGenerateApiKeySuccess),
];

function* handleChangePassword() {
  yield put(updateProfileLoading({ module: ProfileModules.changePassword, isLoading: true }));
}

function* handleChangePasswordFail() {
  yield toast.error("Changing password was failed");
  yield put(updateProfileLoading({ module: ProfileModules.changePassword, isLoading: false }));
}

function* handleChangePasswordSuccess(action: any) {
  const { succeeded, message } = action.payload.data;

  if (succeeded) {
    // yield toast.success(message);
    yield put(updateProfileLoading({ module: ProfileModules.changePassword, isLoading: false }));
  }
}

function* updateProfileSuccessHandler(action: any) {
  const { country, language, timePreference, name, email, contactNo, receiveUpdates } = action.payload.data.data;
  yield put(updateProfile({ country, language, timePreference, name, email, contactNo, receiveUpdates }));

  yield put(getMyProfileServer());
  // yield toast.success("Update profile successfully");
}

function* updateProfileFailHandler() {
  yield toast.error("Update profile was failed");
}

function* uploadProfilePicSuccessHandler(action: any) {
  const profilePic = action.meta.previousAction.payload.request.data;
  yield put(uploadProfilePic(profilePic));

  yield put(getMyProfileServer());
  // yield toast.success("Upload profile picture successfully");
}

function* uploadProfilePicFailHandler() {
  yield toast.error("Upload profile picture was failed");
}

// function* deleteProfilePicSuccessHandler(action: any) {
//   const profilePic = action.meta.previousAction.payload.request.data;
//   yield put(uploadProfilePic(profilePic));

//   yield put(getMyProfileServer());
//   yield toast.success("Delete profile picture successfully");
// }

// function* deleteProfilePicFailHandler() {
//   yield toast.error("Delete profile picture was failed");
// }

function* getMyProfileServerHandler(action: any) {
  const { checkCloneVoice } = action.payload;

  if (checkCloneVoice) {
    yield put(updateProfileLoading({ module: ProfileModules.checkCloneVoice, isLoading: true }));
  }
}

function* getMyProfileServerSuccessHandler(action: any) {
  const { checkCloneVoice } = action.meta.previousAction.payload;
  const { voiceCloneAllowed = 0, voiceCloneUsed = 0 } = getProfile(yield select());

  if (checkCloneVoice) {
    if (voiceCloneAllowed > voiceCloneUsed) yield put(updatePopup({ popup: Popups.addVoiceAudioPopup, status: true }));
    else yield toast.error("You already cloned voices for this account");

    yield put(updateProfileLoading({ module: ProfileModules.checkCloneVoice, isLoading: false }));
  }
}

function* cloneVoiceServerSuccessHandler() {
  yield put(updatePopup({ popup: Popups.addVoiceAudioPopup, status: false }));
}

function* handleGenerateApiKey() {
  yield put(updateProfileLoading({ module: ProfileModules.generateApiKey, isLoading: true }));
}

function* handleGenerateApiKeyFail() {
  yield toast.error("The api key generation failed");
  yield put(updateProfileLoading({ module: ProfileModules.generateApiKey, isLoading: false }));
}

function* handleGenerateApiKeySuccess() {
  yield put(updateProfileLoading({ module: ProfileModules.generateApiKey, isLoading: false }));
}

export default profileSagas;
