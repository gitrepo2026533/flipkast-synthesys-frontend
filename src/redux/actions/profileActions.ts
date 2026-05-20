import { ProfileModules } from "../../types/profile";

export const GET_MY_PROFILE_SERVER = "GET_MY_PROFILE_SERVER";
export const CHANGE_PASSWORD_SERVER = "CHANGE_PASSWORD_SERVER";
export const UPDATE_PROFILE_LOADING = "UPDATE_PROFILE_LOADING";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const UPDATE_PROFILE_SERVER = "UPDATE_PROFILE_SERVER";
export const UPLOAD_PROFILE_PIC_SERVER = "UPLOAD_PROFILE_PIC_SERVER";
export const UPLOAD_PROFILE_PIC = "UPLOAD_PROFILE_PIC";
export const DELETE_PROFILE_PIC_SERVER = "DELETE_PROFILE_PIC_SERVER";
export const CLONE_VOICE_SERVER = "CLONE_VOICE_SERVER";
export const GENERATE_API_KEY_SERVER = "GENERATE_API_KEY_SERVER";
export const REVOKE_API_KEY_SERVER = "REVOKE_API_KEY_SERVER";

interface UpdateProfileLoadingProps {
  module: ProfileModules;
  isLoading: boolean;
}

interface ChangePasswordSeverProps {
  oldPassword: string;
  newPassword: string;
}

interface UpdateProfileServerProps {
  country?: string;
  language?: string;
  timePreference?: string;
  name?: string;
  email?: string;
  contactNo?: string;
  receiveUpdates?: boolean;
  profilePic?: string;
}

export const getMyProfileServer = (checkCloneVoice?: boolean) => ({
  type: GET_MY_PROFILE_SERVER,
  payload: {
    request: {
      method: "GET",
      url: "/user/profile",
    },
    checkCloneVoice: checkCloneVoice || false,
  },
});

export const updateProfile = (data: UpdateProfileServerProps) => ({
  type: UPDATE_PROFILE,
  payload: data,
});

export const updateProfileServer = (data: UpdateProfileServerProps) => ({
  type: UPDATE_PROFILE_SERVER,
  payload: {
    request: {
      method: "POST",
      url: "/user/updateSettings",
      data,
    },
  },
});

export const uploadProfilePic = (formData: FormData) => ({
  type: UPLOAD_PROFILE_PIC,
  payload: formData,
});

export const uploadProfilePicServer = (formData: FormData) => ({
  type: UPLOAD_PROFILE_PIC_SERVER,
  payload: {
    request: {
      method: "POST",
      url: "/user/uploadProfilePic",
      data: formData,
    },
  },
});

export const deleteProfilePicServer = () => ({
  type: DELETE_PROFILE_PIC_SERVER,
  payload: {
    request: {
      method: "DELETE",
      url: "/user/deleteProfilePic",
    },
  },
});

export const changePasswordServer = (data: ChangePasswordSeverProps) => ({
  type: CHANGE_PASSWORD_SERVER,
  payload: {
    request: {
      method: "POST",
      url: `/user/changePassword`,
      data,
    },
  },
});

export const updateProfileLoading = ({ module, isLoading }: UpdateProfileLoadingProps) => ({
  type: UPDATE_PROFILE_LOADING,
  payload: {
    module,
    isLoading,
  },
});

export const cloneVoiceServer = (data: FormData) => ({
  type: CLONE_VOICE_SERVER,
  payload: {
    request: {
      method: "POST",
      url: "/user/cloneVoice",
      data,
    },
  },
});

export const generateApiKeyServer = () => ({
  type: GENERATE_API_KEY_SERVER,
  payload: {
    request: {
      method: "POST",
      url: "/user/generateApiKey",
    },
  },
});

export const revokeApiKeyServer = () => ({
  type: REVOKE_API_KEY_SERVER,
  payload: {
    request: {
      method: "POST",
      url: "/user/generateApiKey?revoke=true",
    },
  },
});
