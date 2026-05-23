import { ProfileModules, User } from "../../types/profile";
import {
  GENERATE_API_KEY_SERVER,
  GET_MY_PROFILE_SERVER,
  REVOKE_API_KEY_SERVER,
  UPDATE_PROFILE,
  UPDATE_PROFILE_LOADING,
  UPDATE_PROFILE_SERVER,
  UPLOAD_PROFILE_PIC,
  UPLOAD_PROFILE_PIC_SERVER,
} from "../actions/profileActions";
import { StoreType } from "../../types/store";

export interface profileStateType {
  [ProfileModules.myProfile]: {
    profile: User;
  };
  [ProfileModules.changePassword]: {
    isLoading: boolean;
  };
  [ProfileModules.checkCloneVoice]: {
    isLoading: boolean;
  };
  [ProfileModules.generateApiKey]: {
    isLoading: boolean;
  };
}

const profileInitialState: profileStateType = {
  [ProfileModules.myProfile]: {
    profile: {} as User,
  },
  [ProfileModules.changePassword]: {
    isLoading: false,
  },
  [ProfileModules.checkCloneVoice]: {
    isLoading: false,
  },
  [ProfileModules.generateApiKey]: {
    isLoading: false,
  },
};

const profileReducer = (state = profileInitialState, action: any) => {
  switch (action.type) {
    case UPDATE_PROFILE_LOADING: {
      const { module, isLoading } = action.payload;
      return { ...state, [module]: { ...state[module as ProfileModules], isLoading } };
    }
    case `${GET_MY_PROFILE_SERVER}_SUCCESS`: {
      return {
        ...state,
        [ProfileModules.myProfile]: {
          ...state[ProfileModules.myProfile],
          profile: action.payload.data.data,
        },
      };
    }
    case `${GENERATE_API_KEY_SERVER}_SUCCESS`: {
      return {
        ...state,
        [ProfileModules.myProfile]: {
          ...state[ProfileModules.myProfile],
          profile: {
            ...state[ProfileModules.myProfile].profile,
            apiKey: action.payload.data.data,
          },
        },
      };
    }
    case `${REVOKE_API_KEY_SERVER}_SUCCESS`: {
      return {
        ...state,
        [ProfileModules.myProfile]: {
          ...state[ProfileModules.myProfile],
          profile: {
            ...state[ProfileModules.myProfile].profile,
            apiKey: "",
          },
        },
      };
    }
    case UPDATE_PROFILE: {
      return {
        ...state,
        [ProfileModules.myProfile]: {
          ...state[ProfileModules.myProfile],
          profile: action.payload,
        },
      };
    }
    case UPLOAD_PROFILE_PIC: {
      return {
        ...state,
        [ProfileModules.myProfile]: {
          ...state[ProfileModules.myProfile],
          profile: {
            ...state[ProfileModules.myProfile].profile,
            profilePic: action.payload,
          },
        },
      };
    }
    default: {
      return { ...state };
    }
  }
};

export const getProfile = (state: StoreType) => state.profile[ProfileModules.myProfile].profile;
export const getChangePasswordLoading = (state: StoreType) => state.profile[ProfileModules.changePassword].isLoading;

export const getCheckCloneVoiceLoading = (state: StoreType) => state.profile[ProfileModules.checkCloneVoice].isLoading;

export const getGenerateApiKeyLoading = (state: StoreType) => state.profile[ProfileModules.generateApiKey].isLoading;

export default profileReducer;
