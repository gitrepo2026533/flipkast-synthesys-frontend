import { StoreType } from "../../types/store";
import { ActorModules, IActor } from "../../types/actor";
import {
  CLEAR_ACTORS,
  GET_ACTORS_SERVER,
  SET_PAGE_ACTORS,
  UPDATE_ACTOR_LOADING,
  UPDATE_HAS_MORE_ACTORS,
  DOWNLOAD_VOICE_SERVER,
  BOOKMARK_ACTOR_SERVER,
  SEARCH_RESULT_LOADING,
  CLEAR_SEARCH,
  FILTER_ACTOR_LOADING,
  RESET_DOWNLOAD_LINK,
  ZIP_VOICE_SERVER,
} from "../actions/actorActions";

export interface actorStateType {
  [ActorModules.actorList]: {
    data: IActor[];
    search: string;
    isLoading: boolean;
    hasMore: boolean;
    pageNumber: number;
    searchLoading: boolean;
    filterLoading: boolean;
  };
  [ActorModules.downloadAudio]: {
    data: string;
    extension?: "mp3" | "zip";
    isLoading: boolean;
    isError: boolean;
  };
  isHydrated: boolean;
}

const actorInitialState: actorStateType = {
  [ActorModules.actorList]: {
    data: [],
    search: "",
    isLoading: false,
    hasMore: true,
    pageNumber: 0,
    searchLoading: false,
    filterLoading: false,
  },
  [ActorModules.downloadAudio]: {
    data: "",
    isLoading: false,
    isError: false,
  },
  isHydrated: false,
};

const profileReducer = (state = actorInitialState, action: any) => {
  switch (action.type) {
    case GET_ACTORS_SERVER: {
      return {
        ...state,
        [ActorModules.actorList]: {
          ...state[ActorModules.actorList],
          hasMore: true,
        },
      };
    }
    case DOWNLOAD_VOICE_SERVER: {
      return {
        ...state,
        [ActorModules.downloadAudio]: {
          ...state[ActorModules.downloadAudio],
          data: "",
          extension: "mp3",
          isLoading: true,
          isError: false,
        },
      };
    }
    case `${DOWNLOAD_VOICE_SERVER}_SUCCESS`: {
      return {
        ...state,
        [ActorModules.downloadAudio]: {
          ...state[ActorModules.downloadAudio],
          data: action.payload.data.data,
          isLoading: false,
        },
      };
    }
    case `${DOWNLOAD_VOICE_SERVER}_FAIL`:
    case `${ZIP_VOICE_SERVER}_FAIL`: {
      return {
        ...state,
        [ActorModules.downloadAudio]: {
          ...state[ActorModules.downloadAudio],
          isLoading: false,
          isError: true,
        },
      };
    }
    case ZIP_VOICE_SERVER: {
      return {
        ...state,
        [ActorModules.downloadAudio]: {
          ...state[ActorModules.downloadAudio],
          data: "",
          extension: "zip",
          isLoading: true,
          isError: false,
        },
      };
    }
    case `${ZIP_VOICE_SERVER}_SUCCESS`: {
      return {
        ...state,
        [ActorModules.downloadAudio]: {
          ...state[ActorModules.downloadAudio],
          data: action.payload.data.data,
          isLoading: false,
        },
      };
    }
    case RESET_DOWNLOAD_LINK: {
      return {
        ...state,
        [ActorModules.downloadAudio]: {
          ...state[ActorModules.downloadAudio],
          data: "",
          extension: undefined,
          isLoading: false,
        },
      };
    }
    case CLEAR_ACTORS: {
      return {
        ...state,
        [ActorModules.actorList]: {
          ...state[ActorModules.actorList],
          data: [],
          pageNumber: 0,
        },
      };
    }
    case CLEAR_SEARCH: {
      return {
        ...state,
        [ActorModules.actorList]: {
          ...state[ActorModules.actorList],
          search: "",
        },
      };
    }

    case `${BOOKMARK_ACTOR_SERVER}_SUCCESS`: {
      const { id, action: isBookmarked } = action.meta.previousAction.payload;
      const actors = state[ActorModules.actorList].data;
      const newIsBoormarkedValue = actors.map((actor) => (actor.actorId === id ? { ...actor, isBookmarked } : actor));

      return {
        ...state,
        [ActorModules.actorList]: {
          ...state[ActorModules.actorList],
          data: newIsBoormarkedValue,
        },
      };
    }

    case UPDATE_ACTOR_LOADING: {
      const { module, isLoading } = action.payload;
      return { ...state, [module]: { ...state[module as ActorModules.actorList], isLoading } };
    }
    case UPDATE_HAS_MORE_ACTORS: {
      return {
        ...state,
        [ActorModules.actorList]: {
          ...state[ActorModules.actorList],
          hasMore: action.payload.hasMore,
        },
      };
    }
    case `${GET_ACTORS_SERVER}_SUCCESS`: {
      const { pageNumber, data } = action.payload.data;

      return {
        ...state,
        [ActorModules.actorList]: {
          ...state[ActorModules.actorList],
          data: pageNumber === 1 ? data : [...state[ActorModules.actorList].data, ...data],
          search: action.meta.previousAction.payload.request.data.keyword,
          pageNumber: state[ActorModules.actorList].pageNumber + 1,
        },
      };
    }
    case SET_PAGE_ACTORS: {
      return {
        ...state,
        [ActorModules.actorList]: {
          ...state[ActorModules.actorList],
          pageNumber: action.payload.pageNumber,
        },
      };
    }
    case SEARCH_RESULT_LOADING: {
      return {
        ...state,
        [ActorModules.actorList]: {
          ...state[ActorModules.actorList],
          searchLoading: action.payload,
        },
      };
    }
    case FILTER_ACTOR_LOADING: {
      return {
        ...state,
        [ActorModules.actorList]: {
          ...state[ActorModules.actorList],
          filterLoading: action.payload,
        },
      };
    }
    default: {
      return { ...state };
    }
  }
};

export const getActorsList = (state: StoreType) => state.actor[ActorModules.actorList].data;
export const getActorsListLoading = (state: StoreType) => state.actor[ActorModules.actorList].isLoading;

export const getHasMoreActors = (state: StoreType) => state.actor[ActorModules.actorList].hasMore;
export const getCurrentPageActors = (state: StoreType) => state.actor[ActorModules.actorList].pageNumber;

export const searchResultLoading = (state: StoreType) => state.actor[ActorModules.actorList].searchLoading;
export const filterResultLoading = (state: StoreType) => state.actor[ActorModules.actorList].filterLoading;

export const getDownloadData = (state: StoreType) => state.actor[ActorModules.downloadAudio];

export default profileReducer;
