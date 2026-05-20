import { ActorModules } from "../../types/actor";
import { Zone } from "../../types/project";

export const GET_ACTORS = "GET_ACTORS";
export const GET_ACTORS_SERVER = "GET_ACTORS_SERVER";
export const UPDATE_ACTOR_LOADING = "UPDATE_ACTOR_LOADING";

export const UPDATE_HAS_MORE_ACTORS = "UPDATE_HAS_MORE_ACTORS";
export const SET_PAGE_ACTORS = "SET_PAGE_ACTORS";
export const CLEAR_ACTORS = "CLEAR_ACTORS";

export const GENERATE_VOICE_SERVER = "GENERATE_VOICE_SERVER";
export const CLEAR_VOICE = "CLEAR_VOICE";
export const DOWNLOAD_VOICE_SERVER = "DOWNLOAD_VOICE_SERVER";
export const ZIP_VOICE_SERVER = "ZIP_VOICE_SERVER";
export const BOOKMARK_ACTOR_SERVER = "BOOKMARK_ACTOR_SERVER";
export const RESET_DOWNLOAD_LINK = "RESET_DOWNLOAD_LINK";

export const SEARCH_RESULT_LOADING = "SEARCH_RESULT_LOADING";
export const FILTER_ACTOR_LOADING = "FILTER_ACTOR_LOADING";
export const CLEAR_SEARCH = "CLEAR_SEARCH";

interface UpdateActorLoadingProps {
  module: ActorModules;
  isLoading: boolean;
}

interface GetActorsProps {
  keyword?: string;
  pageNumber?: number;
  categoryType?: string[];
  voiceAge?: string[];
  isFeMale?: boolean | null;
  mood?: string[];
  content?: string[];
  region?: string[];
  country?: string[];
  language?: string[];
  bookmarked?: boolean | null;
  history?: boolean | null;
  popular?: boolean | null;
}

interface UpdateHasMoreActorsProps {
  hasMore: boolean;
}
interface SetPageActorsProps {
  pageNumber: number;
}

interface GenerateVoiceProps {
  data: Zone[];
}

interface DownloadVoiceProps {
  voices: string[];
  fileName: string;
  projectId: string | number;
}

export const updateHasMoreActors = ({ hasMore }: UpdateHasMoreActorsProps) => ({
  type: UPDATE_HAS_MORE_ACTORS,
  payload: {
    hasMore,
  },
});

export const setPageActors = ({ pageNumber }: SetPageActorsProps) => ({
  type: SET_PAGE_ACTORS,
  payload: { pageNumber },
});

export const updateActorLoading = ({ module, isLoading }: UpdateActorLoadingProps) => ({
  type: UPDATE_ACTOR_LOADING,
  payload: {
    module,
    isLoading,
  },
});

export const getActors = ({
  keyword,
  pageNumber,
  categoryType,
  voiceAge,
  isFeMale,
  mood,
  content,
  region,
  country,
  language,
  bookmarked,
  history,
  popular,
}: GetActorsProps) => ({
  type: GET_ACTORS,
  payload: {
    pageNumber,
    keyword,
    categoryType,
    voiceAge,
    isFeMale,
    mood,
    content,
    region,
    country,
    language,
    bookmarked,
    history,
    popular,
    pageSize: 16,
  },
});

export const getActorsServer = ({
  keyword,
  pageNumber,
  categoryType,
  voiceAge,
  isFeMale,
  mood,
  content,
  region,
  country,
  language,
  bookmarked,
  history,
  popular,
}: GetActorsProps) => ({
  type: GET_ACTORS_SERVER,
  payload: {
    pageNumber,
    request: {
      method: "POST",
      url: "/actor/list",
      data: {
        pageNumber,
        keyword,
        categoryType: categoryType?.map((item) => (item === "Premium" ? "Standard" : "Premium")),
        voiceAge,
        isFeMale,
        mood,
        content,
        region,
        country,
        language,
        bookmarked,
        history,
        popular,
        pageSize: 16,
      },
    },
  },
});

export const clearActors = () => ({
  type: CLEAR_ACTORS,
});

export const clearSearch = () => ({
  type: CLEAR_SEARCH,
});

export const generateVoiceServer = ({ data }: GenerateVoiceProps) => ({
  type: GENERATE_VOICE_SERVER,
  payload: {
    request: {
      method: "POST",
      url: "/actor/generateVoice",
      data: {
        data,
      },
    },
  },
});

export const clearVoice = () => ({
  type: CLEAR_VOICE,
});

export const downloadVoiceServer = ({ voices, fileName, projectId }: DownloadVoiceProps) => ({
  type: DOWNLOAD_VOICE_SERVER,
  payload: {
    request: {
      method: "POST",
      url: `/actor/downloadVoice?fileName=${fileName}&projectId=${projectId}`,
      data: voices,
    },
  },
});

export const zipVoiceServer = ({ voices, fileName, projectId }: DownloadVoiceProps) => ({
  type: ZIP_VOICE_SERVER,
  payload: {
    request: {
      method: "POST",
      url: `/actor/zipVoices?fileName=${fileName}&projectId=${projectId}`,
      data: voices,
    },
  },
});

export const resetDownloadLink = () => ({
  type: RESET_DOWNLOAD_LINK,
});

export const bookmarkActorServer = (id: number, action: boolean, isScreen?: boolean) => ({
  type: BOOKMARK_ACTOR_SERVER,
  payload: {
    request: {
      method: "GET",
      url: `/actor/bookmarkActor?actorId=${id}&add=${action}`,
    },
    id,
    action,
    isScreen,
  },
});

export const searchActorResultLoading = (loading: boolean) => ({
  type: SEARCH_RESULT_LOADING,
  payload: loading,
});

export const filterActorLoading = (loading: boolean) => ({
  type: FILTER_ACTOR_LOADING,
  payload: loading,
});
