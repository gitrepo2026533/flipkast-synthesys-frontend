import { StoreType } from "../../types/store";
import { Project, ProjectList, LoadingStyles, ProjectModules, Zone } from "../../types/project";
import {
  CLEAR_CURRENT_PROJECT,
  CREATE_PROJECT_SERVER,
  CREATE_VIDEO_PROJECT_SERVER,
  DELETE_PROJECT_SERVER,
  GET_PROJECT_LIST_SERVER,
  GET_PROJECT_SERVER,
  GET_VIDEO_PROJECT_SERVER,
  PLAY_AUDIO,
  SET_PAGE_PROJECTS,
  UPDATE_HAS_MORE_PROJECTS,
  UPDATE_PROJECT_LOADING,
} from "../actions/projectAction";
import { GENERATE_VOICE_SERVER } from "../actions/actorActions";
import { checkIfZoneCached } from "../../lib/editorUtils";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/react";
import { SentryErrors } from "../../lib/sentry";
import { da } from "date-fns/locale";

export interface projectStateType {
  [ProjectModules.projectList]: {
    data: Project[];
    isLoading: boolean;
    isDeleteLoading: boolean;
    hasMore: boolean;
    pageNumber: number;
  };
  [ProjectModules.project]: {
    project: Project | null;
    audio: {
      isAudioReady: boolean;
      loadingZonesAudio: Zone[]; // all loading zones at the moment
      cachedZonesAudio: Zone[]; // all cached zones
    };
    isLoading: boolean;
  };
  [ProjectModules.autoSave]: {
    isLoading: boolean;
  };
  isHydrated: boolean;
}

const projectInitialState: projectStateType = {
  [ProjectModules.projectList]: {
    data: [],
    isLoading: false,
    isDeleteLoading: false,
    hasMore: true,
    pageNumber: 0,
  },
  [ProjectModules.project]: {
    project: null,
    audio: {
      isAudioReady: false,
      loadingZonesAudio: [],
      cachedZonesAudio: [],
    },
    isLoading: false,
  },
  [ProjectModules.autoSave]: {
    isLoading: false,
  },
  isHydrated: false,
};

const profileReducer = (state = projectInitialState, action: any) => {
  switch (action.type) {
    case UPDATE_PROJECT_LOADING: {
      const { module, isLoading } = action.payload;
      return { ...state, [module]: { ...state[module as ProjectModules], isLoading } };
    }
    case UPDATE_HAS_MORE_PROJECTS: {
      return {
        ...state,
        [ProjectModules.projectList]: {
          ...state[ProjectModules.projectList],
          hasMore: action.payload.hasMore,
        },
      };
    }
    case GET_PROJECT_LIST_SERVER: {
      return {
        ...state,
        [ProjectModules.projectList]: {
          ...state[ProjectModules.projectList],
          hasMore: true,
        },
      };
    }
    case `${GET_PROJECT_LIST_SERVER}_SUCCESS`: {
      const { pageNumber, data } = action.payload.data;

      return {
        ...state,
        [ProjectModules.projectList]: {
          ...state[ProjectModules.projectList],
          data: pageNumber === 1 ? data : [...state[ProjectModules.projectList].data, ...data],
          pageNumber: state[ProjectModules.projectList].pageNumber + 1,
        },
      };
    }
    case SET_PAGE_PROJECTS: {
      return {
        ...state,
        [ProjectModules.projectList]: {
          ...state[ProjectModules.projectList],
          pageNumber: action.payload.pageNumber,
        },
      };
    }
    case DELETE_PROJECT_SERVER: {
      return {
        ...state,
        [ProjectModules.projectList]: {
          ...state[ProjectModules.projectList],
          isDeleteLoading: true,
        },
      };
    }
    case `${DELETE_PROJECT_SERVER}_SUCCESS`: {
      return {
        ...state,
        [ProjectModules.projectList]: {
          ...state[ProjectModules.projectList],
          isDeleteLoading: false,
        },
      };
    }
    case GENERATE_VOICE_SERVER: {
      const audiosToGenerate: Zone[] = action.payload.request.data.data.map((zone: Zone) => ({
        ...zone,
        isLoading: true,
      }));
      const loadingZonesAudio: Zone[] = state[ProjectModules.project].audio.loadingZonesAudio;
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          audio: {
            ...state[ProjectModules.project].audio,
            loadingZonesAudio: [...loadingZonesAudio, ...audiosToGenerate],
          },
        },
      };
    }
    case `${GENERATE_VOICE_SERVER}_SUCCESS`: {
      if (!action?.payload?.data?.data || !Array.isArray(action?.payload?.data?.data)) {
        toast.error("Please contact support, error happened while generating voice");

        Sentry.captureException(new Error(SentryErrors.SERVER_ERROR_WHILE_GENERATING_VOICE.title), {
          tags: SentryErrors.SERVER_ERROR_WHILE_GENERATING_VOICE.tags,
          extra: {
            details: {
              responseFromApi: action?.error?.response?.data || null,
            },
          },
        });

        return {
          ...state,
          [ProjectModules.project]: {
            ...state[ProjectModules.project],
            audio: {
              ...state[ProjectModules.project].audio,
              loadingZonesAudio: [],
            },
          },
        };
      } else {
        // Here we will cache newly generated voices
        const generatedZones: Zone[] = action.payload.data.data;
        const cachedZones: Zone[] = state[ProjectModules.project].audio.cachedZonesAudio;
        const loadedZones = action.meta.previousAction.payload.request.data.data;
        const loadingZonesAudio: Zone[] = state[ProjectModules.project].audio.loadingZonesAudio.filter(
          (zone) => !checkIfZoneCached(zone, loadedZones),
        );

        return {
          ...state,
          [ProjectModules.project]: {
            ...state[ProjectModules.project],
            audio: {
              ...state[ProjectModules.project].audio,
              loadingZonesAudio,
              cachedZonesAudio: [...cachedZones, ...generatedZones],
            },
          },
        };
      }
    }
    case `${GENERATE_VOICE_SERVER}_FAIL`: {
      const loadedZones = action.meta.previousAction.payload.request.data.data;
      const loadingZonesAudio: Zone[] = state[ProjectModules.project].audio.loadingZonesAudio.filter(
        (zone) => !checkIfZoneCached(zone, loadedZones),
      );
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          audio: {
            ...state[ProjectModules.project].audio,
            loadingZonesAudio,
          },
        },
      };
    }
    case `${CREATE_VIDEO_PROJECT_SERVER}__SUCCESS`:
    case PLAY_AUDIO: {
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          audio: {
            ...state[ProjectModules.project].audio,
            isAudioReady: true,
          },
        },
      };
    }
    // case `${DOWNLOAD_VOICE_SERVER}_SUCCESS`: {
    //   return {
    //     ...state,
    //     [ActorModules.downloadAudio]: {
    //       ...state[ActorModules.downloadAudio],
    //       data: action.payload.data,
    //     },
    //   };
    // }
    // case CLEAR_VOICE: {
    //   return {
    //     ...state,
    //     [ActorModules.audioList]: {
    //       ...state[ActorModules.audioList],
    //       data: [],
    //     },
    //   };
    // }

    case CLEAR_CURRENT_PROJECT: {
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          project: null,
          isLoading: false,
        },
      };
    }
    case `${CREATE_PROJECT_SERVER}_SUCCESS`:
    case `${GET_PROJECT_SERVER}_SUCCESS`: {
      console.log("action.payload.data.data: ", action.payload.data.data);
      const { paragraphs, title, projectId } = action.payload.data.data;
      const paragraphsData = paragraphs.map(({ data, actorId, order, actor }: any) => ({
        data,
        actorId,
        order,
        actor,
      }));

      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          project: {
            ...state[ProjectModules.project].project,
            paragraphs: paragraphsData,
            title,
            projectId,
          },
        },
      };
    }
    case `${GET_VIDEO_PROJECT_SERVER}_SUCCESS`: {
      console.log("GET_VIDEO_PROJECT_SERVER GET_VIDEO_PROJECT_SERVER GET_VIDEO_PROJECT_SERVER:");
      console.log("action.payload.data.data: ", action.payload);

      return {
        ...state,
        [ProjectModules.projectList]: {
          data: action.payload.data.data,
          isLoading: false,
          pageNumber: 0,
          hasMore: true,
          isDeleteLoading: false,
        },
      };
    }
    default: {
      return { ...state };
    }
  }
};

export const getProjectList = (state: StoreType) => state.project[ProjectModules.projectList].data;
export const getProjectListLoading = (state: StoreType) => state.project[ProjectModules.projectList].isLoading;
export const getIsDeleteLoading = (state: StoreType) => state.project[ProjectModules.projectList].isDeleteLoading;

export const getProject = (state: StoreType) => state.project[ProjectModules.project].project;
export const getProjectLoading = (state: StoreType) => state.project[ProjectModules.project].isLoading;
export const getProjectAudio = (state: StoreType) => state.project[ProjectModules.project].audio;

export const getAutoSaveLoading = (state: StoreType) => state.project[ProjectModules.autoSave].isLoading;

export const getHasMoreProjects = (state: StoreType) => state.project[ProjectModules.projectList].hasMore;
export const getCurrentPageProjects = (state: StoreType) => state.project[ProjectModules.projectList].pageNumber;

export default profileReducer;
