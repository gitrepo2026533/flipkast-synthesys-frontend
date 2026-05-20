import { put, select, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/react";

import {
  BOOKMARK_ACTOR_SERVER,
  clearActors,
  CLEAR_SEARCH,
  DOWNLOAD_VOICE_SERVER,
  filterActorLoading,
  GENERATE_VOICE_SERVER,
  getActorsServer,
  GET_ACTORS,
  GET_ACTORS_SERVER,
  searchActorResultLoading,
  updateActorLoading,
  updateHasMoreActors,
  ZIP_VOICE_SERVER,
} from "../actions/actorActions";
import { ActorModules } from "../../types/actor";
import { getActorsList } from "../reducers/actorReducer";
import { SentryErrors } from "../../lib/sentry";

const actorSagas = [
  takeEvery(GET_ACTORS, handleGetActors),

  takeEvery(`${GET_ACTORS_SERVER}`, handleGetActorsServer),
  takeEvery(`${GET_ACTORS_SERVER}_FAIL`, handleGetActorsServerFail),
  takeEvery(`${GET_ACTORS_SERVER}_SUCCESS`, handleGetActorsServerSuccess),

  takeEvery(`${GENERATE_VOICE_SERVER}_FAIL`, handleGenerateVoiceServerFail),

  takeEvery(`${DOWNLOAD_VOICE_SERVER}_FAIL`, handleDownloadVoiceServerFail),
  takeEvery(`${ZIP_VOICE_SERVER}_FAIL`, handleZipVoiceServerFail),

  takeEvery(`${BOOKMARK_ACTOR_SERVER}_FAIL`, handleBookmarkActorServerFail),
  takeEvery(`${BOOKMARK_ACTOR_SERVER}_SUCCESS`, handleBookmarkActorServerSuccess),

  takeEvery(CLEAR_SEARCH, handleClearSearch),
];

function* handleGetActors(action: any) {
  yield put(getActorsServer({ ...action.payload }));
}

function* handleGetActorsServer() {
  yield put(updateActorLoading({ module: ActorModules.actorList, isLoading: true }));
}

function* handleGetActorsServerFail(action: any) {
  yield toast.error(SentryErrors.SERVER_ERROR_WHILE_GETTING_ACTORS.toast);
  yield put(updateActorLoading({ module: ActorModules.actorList, isLoading: false }));

  yield Sentry.captureException(new Error(SentryErrors.SERVER_ERROR_WHILE_GETTING_ACTORS.title), {
    tags: SentryErrors.SERVER_ERROR_WHILE_GETTING_ACTORS.tags,
    extra: {
      details: {
        responseFromApi: action?.error?.response?.data || null,
      },
    },
  });
}

function* handleGetActorsServerSuccess(action: any) {
  const allActors = getActorsList(yield select());
  const totalLength = action.payload.data.totalRecords;

  if (allActors.length >= totalLength) yield put(updateHasMoreActors({ hasMore: false }));

  yield put(updateActorLoading({ module: ActorModules.actorList, isLoading: false }));
  yield put(searchActorResultLoading(false));
  yield put(filterActorLoading(false));
}

function* handleGenerateVoiceServerFail(action: any) {
  const zones = action?.meta?.previousAction?.payload?.request?.data?.data || [];

  yield toast.error(SentryErrors.SERVER_ERROR_WHILE_GENERATING_VOICE.toast);

  yield Sentry.captureException(new Error(SentryErrors.SERVER_ERROR_WHILE_GENERATING_VOICE.title), {
    tags: SentryErrors.SERVER_ERROR_WHILE_GENERATING_VOICE.tags,
    extra: {
      details: {
        responseFromApi: action?.error?.response?.data || null,
        zones: JSON.stringify(zones || []),
      },
    },
  });
}

function* handleDownloadVoiceServerFail(action: any) {
  const zones = action?.meta?.previousAction?.payload?.request?.data?.data || [];

  if (action?.error?.response?.data?.message === "Download limit reached") {
    yield toast.error("Download limit reached");
  } else {
    yield toast.error(SentryErrors.SERVER_ERROR_WHILE_DOWNLOADING_VOICE.toast);

    yield Sentry.captureException(new Error(SentryErrors.SERVER_ERROR_WHILE_DOWNLOADING_VOICE.title), {
      tags: SentryErrors.SERVER_ERROR_WHILE_DOWNLOADING_VOICE.tags,
      extra: {
        details: {
          responseFromApi: action?.error?.response?.data || null,
          zones: JSON.stringify(zones || []),
        },
      },
    });
  }
}

function* handleZipVoiceServerFail(action: any) {
  const zones = action?.meta?.previousAction?.payload?.request?.data?.data || [];
  if (action?.error?.response?.data?.message === "Download limit reached") {
    yield toast.error("Download limit reached");
  } else {
    yield toast.error(SentryErrors.SERVER_ERROR_WHILE_ZIPPING_VOICE.toast);

    yield Sentry.captureException(new Error(SentryErrors.SERVER_ERROR_WHILE_ZIPPING_VOICE.title), {
      tags: SentryErrors.SERVER_ERROR_WHILE_ZIPPING_VOICE.tags,
      extra: {
        details: {
          responseFromApi: action?.error?.response?.data || null,
          zones: JSON.stringify(zones || []),
        },
      },
    });
  }
}

function* handleBookmarkActorServerFail() {
  yield toast.error("Error while actor bookmarked");
}

function* handleBookmarkActorServerSuccess(action: any) {
  const isBookmarked = action.meta.previousAction.payload.isScreen;

  if (isBookmarked) {
    yield put(clearActors());
    yield put(filterActorLoading(true));
    yield put(getActorsServer({ pageNumber: 1, bookmarked: isBookmarked }));
  }
}

function* handleClearSearch() {
  yield put(clearActors());
  yield put(
    getActorsServer({
      keyword: "",
      pageNumber: 1,
      categoryType: [],
      voiceAge: [],
      mood: [],
      content: [],
      region: [],
      language: [],
      country: [],
      popular: true,
    }),
  );
}

export default actorSagas;
