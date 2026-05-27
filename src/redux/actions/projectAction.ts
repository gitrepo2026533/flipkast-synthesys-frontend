import { Paragraphs, ProjectModules } from "../../types/project";

export const GET_PROJECT_SERVER = "GET_PROJECT_SERVER";
export const GET_PROJECT_LIST_SERVER = "GET_PROJECT_LIST_SERVER";
export const CREATE_PROJECT_SERVER = "CREATE_PROJECT_SERVER";
export const UPDATE_PROJECT_LOADING = "UPDATE_PROJECT_LOADING";
export const UPDATE_PROJECT_SERVER = "UPDATE_PROJECT_SERVER";
export const CLEAR_CURRENT_PROJECT = "CLEAR_CURRENT_PROJECT";
export const PLAY_AUDIO = "PLAY_AUDIO";
export const DELETE_PROJECT_SERVER = "DELETE_PROJECT_SERVER";
export const DELETE_PROJECT_SLIDE_SERVER = "DELETE_PROJECT_SLIDE_SERVER";
export const UPDATE_HAS_MORE_PROJECTS = "UPDATE_HAS_MORE_PROJECTS";
export const SET_PAGE_PROJECTS = "SET_PAGE_PROJECTS";
export const CREATE_VIDEO_PROJECT = "CREATE_VIDEO_PROJECT";
// video project actions
export const CREATE_VIDEO_PROJECT_SERVER = "CREATE_VIDEO_PROJECT_SERVER";
export const GET_VIDEO_PROJECT_SERVER = "GET_VIDEO_PROJECT_SERVER";
export const GET_PROJECT_SLIDE_SERVER = "GET_PROJECT_SLIDE_SERVER";
export const GET_VIDEO_BY_PROJECT_ID_SERVER = "GET_VIDEO_BY_PROJECT_ID_SERVER";
export const UPDATE_VIDEO_PROJECT_SERVER = "UPDATE_VIDEO_PROJECT_SERVER";
export const RESET_CREATED_PROJECT = "RESET_CREATED_PROJECT";
export const GET_PREVIEW_PROJECT_SERVER = "GET_PREVIEW_PROJECT_SERVER";
export const LOCK_VIDEO_PROJECT_SERVER = "LOCK_VIDEO_PROJECT_SERVER";
export const MERGE_VIDEOS_PROJECT_SERVER = "MERGE_VIDEOS_PROJECT_SERVER";
export const SET_ACTIVE_DRAFT_SLIDE = "DRAFT_SLIDE";
export const CLEAR_ACTIVE_DRAFT_SLIDE = "CLEAR_DRAFT_SLIDE";
export const UPDATE_SLIDE_STATUS_SERVER = "UPDATE_SLIDE_STATUS_SERVER";
interface UpdateProjectLoadingProps {
  module: ProjectModules;
  isLoading: boolean;
}

interface GetProjectListServerProps {
  keyword?: string;
  pageSize?: number;
  pageNumber?: number;
}

interface UpdateHasMoreProjectsProps {
  hasMore: boolean;
}
interface SetPageProjectsProps {
  pageNumber: number;
}

interface CreateProjectServerProps {
  projectTypeId: ProjectType | undefined;
  projectId?: number;
  title: string | undefined;
  paragraphs?: Paragraphs[];
}

interface createVideoProjectServerProps {
  prompt: string;
}

interface GetVideoProjectServerProps {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  projectTypeId?: number;
  status?: number | null;
  sortWith?: string | null;
  sortByDesc?: boolean;
}

interface lockVideoProjectServerProps {
  projectId: number;
  slideId: number;
  ParagraphId: number;
}

export enum ProjectType {
  TTI = 1, //AI Voices
  HSS = 2, //AI Humans
  FS = 3, //Faceswap
  T2I = 4, //Synthesys Visual
  BG = 5, //Change Image/Video Background
}

interface DeleteProjectProps {
  projectId: string;
}
export interface updateVideoProjectPayload {
  title?: string;
  slides?: {
    slideId: number;
    order: number;
    slideBackgroundColor?: string;
    audioPath?: string;
    projectParagraphs?: {
      projectParagraphId: number;
      order?: number;
      actorId?: number;
      text: string;
    }[];
  }[];
  status?: number;
  projectId: number;
  slideId?: number;
  projectParagraphId?: number;
}

interface DeleteProjectSlideProps {
  projectId: number | string;
  slideId: number | string;
}

export const updateHasMoreProjects = ({ hasMore }: UpdateHasMoreProjectsProps) => ({
  type: UPDATE_HAS_MORE_PROJECTS,
  payload: {
    hasMore,
  },
});

export const setPageProjects = ({ pageNumber }: SetPageProjectsProps) => ({
  type: SET_PAGE_PROJECTS,
  payload: { pageNumber },
});

export const updateProjectLoading = ({ module, isLoading }: UpdateProjectLoadingProps) => ({
  type: UPDATE_PROJECT_LOADING,
  payload: {
    module,
    isLoading,
  },
});

export const getProjectListServer = ({ keyword, pageSize, pageNumber }: GetProjectListServerProps) => ({
  type: GET_PROJECT_LIST_SERVER,
  payload: {
    request: {
      method: "POST",
      url: "/project/list",
      data: {
        pageNumber: pageNumber || 1,
        pageSize: pageSize || 10,
        keyword,
        sortWith: "updateDateTime",
        sortByDesc: true,
      },
    },
  },
});

export const clearCurrentProject = () => ({
  type: CLEAR_CURRENT_PROJECT,
});

export const getProjectServer = (projectId: number) => ({
  type: GET_PROJECT_SERVER,
  payload: {
    request: {
      method: "GET",
      url: `/project/get?Id=${projectId}`,
    },
  },
});

export const createProjectServer = ({ projectTypeId, title, paragraphs }: CreateProjectServerProps) => ({
  type: CREATE_PROJECT_SERVER,
  payload: {
    request: {
      method: "POST",
      url: "/project/create",
      data: {
        projectTypeId,
        title,
        paragraphs,
      },
    },
  },
});

export const updateProjectServer = (
  projectTypeId: ProjectType | undefined,
  projectId?: number,
  title?: string | undefined,
  paragraphs?: Paragraphs[],
  event?: "projectSavingEvent",
) => ({
  type: UPDATE_PROJECT_SERVER,
  payload: {
    event,
    request: {
      method: "POST",
      url: "/project/update",
      data: {
        projectId,
        projectTypeId,
        title,
        paragraphs,
      },
    },
  },
});

export const deleteProjectserver = ({ projectId }: DeleteProjectProps) => ({
  type: DELETE_PROJECT_SERVER,
  payload: {
    request: {
      method: "POST",
      url: `/project/delete?Id=${projectId}`,
    },
  },
});

export const deleteProjectSlideServer = ({ projectId, slideId }: DeleteProjectSlideProps) => ({
  type: DELETE_PROJECT_SLIDE_SERVER,
  payload: {
    request: {
      method: "DELETE",
      url: `/Project/deleteSlides?projectId=${projectId}&slideId=${slideId}`,
      data: {
        projectId,
        slideId,
      },
    },
  },
});

export const playAudio = () => ({
  type: PLAY_AUDIO,
});

// video project actions
export const createVideoProjectServer = ({ prompt }: createVideoProjectServerProps) => ({
  type: CREATE_VIDEO_PROJECT_SERVER,
  payload: {
    request: {
      method: "POST",
      url: "/project/create",
      data: {
        slides: [
          {
            slideId: 0,
            order: 1,
            projectParagraphs: [
              {
                projectParagraphId: 0,
                order: 0,
                actorId: 12270,
                text: prompt,
              },
            ],
          },
        ],
      },
    },
  },
});

export const getVideoProjectServer = ({
  pageNumber,
  pageSize,
  keyword,
  projectTypeId,
  status,
  sortWith,
  sortByDesc,
}: GetVideoProjectServerProps) => ({
  type: GET_VIDEO_PROJECT_SERVER,
  payload: {
    request: {
      method: "POST",
      url: `/project/list`,
      data: {
        pageNumber: pageNumber || 1,
        pageSize: pageSize || 10,
        keyword: keyword || "",
        projectTypeId: projectTypeId || 0,
        status: status || null,
        sortWith: sortWith,
        sortByDesc: sortByDesc || true,
      },
    },
  },
});

export const getVideoByProjectIdServer = (projectId: number) => ({
  type: GET_VIDEO_BY_PROJECT_ID_SERVER,
  payload: {
    request: {
      method: "GET",
      url: `/project/get?id=${projectId}`,
    },
  },
});

export const getProjectSlideServer = (projectId: number, slideId?: number) => ({
  type: GET_PROJECT_SLIDE_SERVER,
  payload: {
    request: {
      method: "GET",
      url: `/Project/get?id=${projectId}&SlideId=${slideId}`,
    },
  },
});

export const resetCreatedProject = () => ({
  type: RESET_CREATED_PROJECT,
});

export const updateVideoProjectServer = (data: updateVideoProjectPayload) => ({
  type: UPDATE_VIDEO_PROJECT_SERVER,
  payload: {
    request: {
      method: "POST",
      url: `/project/update`,
      data,
    },
  },
});

export const getPreviewProjectServer = (projectId: number) => ({
  type: GET_PREVIEW_PROJECT_SERVER,
  payload: {
    request: {
      method: "GET",
      url: `/project/preview?projectId=${projectId}`,
    },
  },
});

export const lockVideoProjectServer = ({ projectId, slideId, ParagraphId }: lockVideoProjectServerProps) => ({
  type: LOCK_VIDEO_PROJECT_SERVER,
  payload: {
    request: {
      method: "GET",
      url: `/Project/lockVideo?projectId=${projectId}&slideId=${slideId}&ParagraphId=${ParagraphId}`,
    },
  },
});

export const mergeVideosProjectServer = (projectId: number) => ({
  type: MERGE_VIDEOS_PROJECT_SERVER,
  payload: {
    request: {
      method: "POST",
      url: `/Actor/MergeVideos?projectId=${projectId}`,
    },
  },
});

export const setActiveDraftSlide = (slide: any) => ({
  type: SET_ACTIVE_DRAFT_SLIDE,
  payload: {
    slide,
  },
});

export const clearActiveDraftSlide = () => ({
  type: CLEAR_ACTIVE_DRAFT_SLIDE,
});

export const updateSlideStatusServer = (projectId: number, slideId: number, active: boolean) => ({
  type: UPDATE_SLIDE_STATUS_SERVER,
  payload: {
    request: {
      method: "POST",
      url: `/slide/active?slideId=${slideId}&active=${active}&projectId=${projectId}`,
    },
  },
});
