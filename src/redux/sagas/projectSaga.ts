import { put, select, take, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/react";

import {
  DELETE_PROJECT_SERVER,
  getProjectListServer,
  GET_PROJECT_LIST_SERVER,
  GET_PROJECT_SERVER,
  updateHasMoreProjects,
  updateProjectLoading,
  UPDATE_PROJECT_SERVER,
  CREATE_PROJECT_SERVER,
  CREATE_VIDEO_PROJECT_SERVER,
  createVideoProjectServer,
  GET_VIDEO_PROJECT_SERVER,
  DELETE_PROJECT_SLIDE_SERVER,
} from "../actions/projectAction";
import { ProjectModules } from "../../types/project";
import { Popups, updatePopup } from "../actions/popupsActions";
import { getProjectList } from "../reducers/projectReducer";
import { SentryErrors } from "../../lib/sentry";

const projectSagas = [
  takeEvery(`${GET_PROJECT_LIST_SERVER}_FAIL`, handleGetProjectListFail),
  takeEvery(`${GET_PROJECT_LIST_SERVER}_SUCCESS`, handleGetProjectListSuccess),

  takeEvery(`${GET_PROJECT_SERVER}`, handleGetProject),
  takeEvery(`${GET_PROJECT_SERVER}_FAIL`, handleGetProjectFail),
  takeEvery(`${GET_PROJECT_SERVER}_SUCCESS`, handleGetProjectSuccess),

  takeEvery(`${UPDATE_PROJECT_SERVER}`, handleUpdateProject),
  takeEvery(`${UPDATE_PROJECT_SERVER}_FAIL`, handleUpdateProjectFail),
  takeEvery(`${UPDATE_PROJECT_SERVER}_SUCCESS`, handleUpdateProjectSuccess),

  takeEvery(`${CREATE_PROJECT_SERVER}_FAIL`, handleUpdateProjectFail),

  takeEvery(`${DELETE_PROJECT_SERVER}_FAIL`, handleDeleteProjectFail),
  takeEvery(`${DELETE_PROJECT_SERVER}_SUCCESS`, handleDeleteProjectSuccess),

  takeEvery(`${GET_VIDEO_PROJECT_SERVER}_SUCCESS`, handleGetVideoProjectSuccess),

  takeEvery(`${DELETE_PROJECT_SLIDE_SERVER}_FAIL`, handleDeleteProjectSlideFail),

  takeEvery(`${DELETE_PROJECT_SLIDE_SERVER}_SUCCESS`, handleDeleteProjectSlideSuccess),
];

function* handleGetProjectListFail() {
  yield toast.error("Error while getting projects");
  yield put(updateProjectLoading({ module: ProjectModules.projectList, isLoading: false }));
}

function* handleGetProjectListSuccess(action: any) {
  const allProjects = getProjectList(yield select());
  const totalLength = action.payload.data.totalRecords;

  if (allProjects.length >= totalLength) yield put(updateHasMoreProjects({ hasMore: false }));

  yield put(updateProjectLoading({ module: ProjectModules.projectList, isLoading: false }));
}

function* handleGetProject() {
  yield put(updateProjectLoading({ module: ProjectModules.project, isLoading: true }));
}

function* handleGetProjectFail() {
  yield toast.error("Error while getting project");
  yield put(updateProjectLoading({ module: ProjectModules.project, isLoading: false }));
}

function* handleGetProjectSuccess() {
  yield put(updateProjectLoading({ module: ProjectModules.project, isLoading: false }));
}

function* handleUpdateProject() {
  yield put(updateProjectLoading({ module: ProjectModules.autoSave, isLoading: true }));
}

function* handleUpdateProjectFail(action: any) {
  const project = action?.meta?.previousAction?.payload?.request?.data;

  yield toast.error("Error while saving project");

  yield Sentry.captureException(new Error(SentryErrors.SERVER_ERROR_WHILE_SAVING_PROJECT.title), {
    tags: SentryErrors.SERVER_ERROR_WHILE_SAVING_PROJECT.tags,
    extra: {
      details: {
        responseFromApi: action?.error?.response?.data || null,
        project: JSON.stringify(project || []),
      },
    },
  });

  yield put(updateProjectLoading({ module: ProjectModules.autoSave, isLoading: false }));
}

function* handleUpdateProjectSuccess(action: any) {
  yield put(updateProjectLoading({ module: ProjectModules.autoSave, isLoading: false }));
  if (action?.meta?.previousAction?.payload?.event !== "projectSavingEvent") {
    yield put(getProjectListServer({ keyword: "" }));
  }
}

function* handleDeleteProjectFail() {
  yield toast.error("Error while deleting project");
  yield put(updatePopup({ popup: Popups.confirmationPopup, status: false }));
}

function* handleDeleteProjectSuccess() {
  yield put(getProjectListServer({ keyword: "" }));
  yield put(updatePopup({ popup: Popups.confirmationPopup, status: false }));
}

function* handleGetVideoProjectSuccess() {
  yield put(updateProjectLoading({ module: ProjectModules.projectList, isLoading: false }));
}

function* handleDeleteProjectSlideSuccess(action: any) {
  yield toast.success("Slide deleted successfully");
}

function* handleDeleteProjectSlideFail(action: any) {
  console.log(action.error);
  yield toast.error("Error while deleting slide");
}

// function* handleCreateVideoProjectSuccess(action: any): any {
//   try {
//     const projectId = action.payload.data.data.projectId;

//     yield put(push(`/ai-video/projects/${projectId}`));
//   } catch (error) {
//     console.log(error);
//   }
// }

export default projectSagas;
