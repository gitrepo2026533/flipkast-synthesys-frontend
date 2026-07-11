import * as Sentry from "@sentry/react";
import { toast } from "react-toastify";
import { checkIfZoneCached } from "../../lib/editorUtils";
import { SentryErrors } from "../../lib/sentry";
import { Project, ProjectModules, Slide, Zone } from "../../types/project";
import { StoreType } from "../../types/store";
import { GENERATE_VOICE_SERVER } from "../actions/actorActions";
import {
  CLEAR_ACTIVE_DRAFT_SLIDE,
  CLEAR_CURRENT_PROJECT,
  CREATE_AVATAR_PROJECT_SERVER,
  CREATE_PROJECT_SERVER,
  CREATE_VIDEO_PROJECT_SERVER,
  CREATE_AI_HUMAN_PROJECT_SERVER,
  DELETE_PROJECT_SERVER,
  DELETE_PROJECT_SLIDE_SERVER,
  GET_PREVIEW_PROJECT_SERVER,
  GET_PROJECT_LIST_SERVER,
  GET_PROJECT_SERVER,
  GET_PROJECT_SLIDE_SERVER,
  GET_VIDEO_BY_PROJECT_ID_SERVER,
  GET_VIDEO_PROJECT_SERVER,
  LOCK_VIDEO_PROJECT_SERVER,
  MERGE_VIDEOS_PROJECT_SERVER,
  PLAY_AUDIO,
  RESET_CREATED_PROJECT,
  SET_ACTIVE_DRAFT_SLIDE,
  SET_PAGE_PROJECTS,
  UPDATE_HAS_MORE_PROJECTS,
  UPDATE_PROJECT_LOADING,
  UPDATE_SLIDE_STATUS_SERVER,
  UPDATE_VIDEO_PROJECT_SERVER,
} from "../actions/projectAction";

export interface projectStateType {
  [ProjectModules.projectList]: {
    data: Project[];
    isLoading: boolean;
    isDeleteLoading: boolean;
    hasMore: boolean;
    pageNumber: number;
    totalPages: number;
    currentProjectTypeId?: number;
  };
  [ProjectModules.videoProjectList]: {
    data: Project[];
    isLoading: boolean;
    isDeleteLoading: boolean;
    hasMore: boolean;
    pageNumber: number;
    totalPages: number;
  };
  [ProjectModules.avatarProjectList]: {
    data: Project[];
    isLoading: boolean;
    isDeleteLoading: boolean;
    hasMore: boolean;
    pageNumber: number;
    totalPages: number;
  };
  [ProjectModules.project]: {
    project: Project | null;
    createdProject: Project | null;
    slidesData: Slide[] | null;
    isDraftSlide: boolean;
    draftSlideData: Slide | null;
    audio: {
      isAudioReady: boolean;
      loadingZonesAudio: Zone[]; // all loading zones at the moment
      cachedZonesAudio: Zone[]; // all cached zones
    };
    preview: string[];
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
    totalPages: 0,
    currentProjectTypeId: undefined,
  },
  [ProjectModules.videoProjectList]: {
    data: [],
    isLoading: false,
    isDeleteLoading: false,
    hasMore: true,
    pageNumber: 0,
    totalPages: 0,
  },
  [ProjectModules.avatarProjectList]: {
    data: [],
    isLoading: false,
    isDeleteLoading: false,
    hasMore: true,
    pageNumber: 0,
    totalPages: 0,
  },
  [ProjectModules.project]: {
    project: null,
    slidesData: null,
    createdProject: null,
    isDraftSlide: false,
    draftSlideData: null,
    audio: {
      isAudioReady: false,
      loadingZonesAudio: [],
      cachedZonesAudio: [],
    },
    preview: [],
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
            isLoding: false,
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
            isLoding: false,
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
    case `GET_VIDEO_PROJECT_SERVER`: {
      const isFirstPage = action.payload?.request?.data?.pageNumber === 1;
      const projectTypeId = action.payload?.request?.data?.projectTypeId;
      const moduleKey =
        projectTypeId === 2
          ? ProjectModules.videoProjectList
          : projectTypeId === 6
          ? ProjectModules.avatarProjectList
          : ProjectModules.projectList;

      return {
        ...state,
        [moduleKey]: {
          ...state[moduleKey],
          data: isFirstPage ? [] : state[moduleKey].data,
          isLoading: true,
        },
      };
    }
    case `${GET_VIDEO_PROJECT_SERVER}_SUCCESS`: {
      const projectTypeId = action.meta?.previousAction?.payload?.request?.data?.projectTypeId;
      const moduleKey =
        projectTypeId === 2
          ? ProjectModules.videoProjectList
          : projectTypeId === 6
          ? ProjectModules.avatarProjectList
          : ProjectModules.projectList;

      return {
        ...state,
        [moduleKey]: {
          ...state[moduleKey],
          data: action.payload.data.data,
          isLoading: false,
          pageNumber: action.payload.data.pageNumber,
          hasMore: action.payload.data.HasMore || false,
          totalPages: action.payload.data.totalPages,
          isDeleteLoading: false,
        },
      };
    }
    case `${GET_VIDEO_PROJECT_SERVER}_FAIL`: {
      const projectTypeId = action.meta?.previousAction?.payload?.request?.data?.projectTypeId;
      const moduleKey =
        projectTypeId === 2
          ? ProjectModules.videoProjectList
          : projectTypeId === 6
          ? ProjectModules.avatarProjectList
          : ProjectModules.projectList;

      return {
        ...state,
        [moduleKey]: {
          ...state[moduleKey],
          isLoading: false,
        },
      };
    }
    case CREATE_VIDEO_PROJECT_SERVER:
    case CREATE_AVATAR_PROJECT_SERVER:
    case CREATE_AI_HUMAN_PROJECT_SERVER: {
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          isLoading: true,
        },
      };
    }
    case `${CREATE_VIDEO_PROJECT_SERVER}_SUCCESS`:
    case `${CREATE_AVATAR_PROJECT_SERVER}_SUCCESS`:
    case `${CREATE_AI_HUMAN_PROJECT_SERVER}_SUCCESS`: {
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          createdProject: action.payload.data.data,
          isLoading: false,
        },
      };
    }
    case `${CREATE_VIDEO_PROJECT_SERVER}_FAIL`:
    case `${CREATE_AVATAR_PROJECT_SERVER}_FAIL`:
    case `${CREATE_AI_HUMAN_PROJECT_SERVER}_FAIL`: {
      toast.error("Failed to create project. Please try again.");
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          isLoading: false,
        },
      };
    }
    case `${GET_VIDEO_BY_PROJECT_ID_SERVER}_SUCCESS`: {
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          project: action.payload.data.data,
          slidesData: action.payload.data.data.slides || [],
          isLoading: false,
          isDraftSlide: false,
          draftSlideData: null,
        },
      };
    }
    case GET_PROJECT_SLIDE_SERVER: {
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          // isLoading: true,
        },
      };
    }
    case `${GET_PROJECT_SLIDE_SERVER}_SUCCESS`: {
      const fetchedProject = action.payload.data.data;
      const currentProject = state[ProjectModules.project].project;
      let newSlides = currentProject?.slides ? [...currentProject.slides] : [];
      if (fetchedProject?.slides?.length > 0) {
        const fetchedSlide = fetchedProject.slides[0];
        const slideIndex = newSlides.findIndex((s: any) => s.slideId === fetchedSlide.slideId);
        if (slideIndex !== -1) {
          newSlides[slideIndex] = fetchedSlide;
        } else {
          newSlides.push(fetchedSlide);
        }
      }

      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          project: {
            ...(currentProject || {}),
            ...fetchedProject,
            slides: newSlides,
          },
          isLoading: false,
        },
      };
    }
    case RESET_CREATED_PROJECT: {
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          createdProject: null,
        },
      };
    }
    case UPDATE_VIDEO_PROJECT_SERVER: {
      const newSlide = action.payload.request.data.slides[0];
      const newParagraph = newSlide?.projectParagraphs?.[0];

      if (!newParagraph) return state;

      const currentProject = state[ProjectModules.project].project;
      const currentSlidesData = state[ProjectModules.project].slidesData || [];

      // Optimistically append the new paragraph to the relevant slide
      const updatedSlidesData = currentSlidesData.map((slide) => {
        if (slide.slideId === newSlide.slideId) {
          return {
            ...slide,
            projectParagraphs: [...(slide.projectParagraphs || []), newParagraph],
          };
        }
        return slide;
      });

      const updatedProjectSlides = currentProject?.slides?.map((slide: any) => {
        if (slide.slideId === newSlide.slideId) {
          return {
            ...slide,
            projectParagraphs: [...(slide.projectParagraphs || []), newParagraph],
          };
        }
        return slide;
      });

      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          slidesData: updatedSlidesData,
          project: currentProject
            ? {
                ...currentProject,
                slides: updatedProjectSlides,
              }
            : currentProject,
          // We do not set isLoading: true to prevent unmounting the UI
        },
      };
    }
    // case `${UPDATE_VIDEO_PROJECT_SERVER}_SUCCESS`: {
    //   // check slides is new
    //   const updatedProject = action.payload.data.data;
    //   const updatedSlides =
    //     state[ProjectModules.project].slidesData?.map((slide) => {
    //       const updatedSlide = action.payload.data.data.slides?.find(
    //         (s: any) => s.slideId === updatedProject?.slides?.[0]?.slideId,
    //       );
    //       return updatedSlide || slide;
    //     }) || [];

    //   return {
    //     ...state,
    //     [ProjectModules.project]: {
    //       ...state[ProjectModules.project],
    //       slidesData: updatedSlides,
    //       project: {
    //         ...state[ProjectModules.project].project,
    //         title: action.payload.data.data.title,
    //       },
    //       isLoading: false,
    //     },
    //   };
    // }
    case `${UPDATE_VIDEO_PROJECT_SERVER}_SUCCESS`: {
      const updatedProject = action.payload.data.data;
      const projectSlide = updatedProject?.slides?.[0];

      const currentSlides = state[ProjectModules.project].slidesData || [];

      const slideExists = currentSlides.some((slide) => slide.slideId === projectSlide?.slideId);
      let updatedSlides: Slide[] = [];
      if (!slideExists) {
        updatedSlides = [...currentSlides, projectSlide];
      }
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          slidesData: slideExists ? currentSlides : updatedSlides,
          project: updatedProject,
          isLoading: false,
          draftSlideData: null,
          isDraftSlide: false,
        },
      };
    }
    case `${GET_PREVIEW_PROJECT_SERVER}_SUCCESS`: {
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          preview: action.payload.data.data,
          isLoading: false,
        },
      };
    }
    case `${LOCK_VIDEO_PROJECT_SERVER}_SUCCESS`: {
      const fetchedProject = action.payload.data.data;
      const currentProject = state[ProjectModules.project].project;
      let newSlides = currentProject?.slides ? [...currentProject.slides] : [];
      if (fetchedProject?.slides?.length > 0) {
        const fetchedSlide = fetchedProject.slides[0];
        const slideIndex = newSlides.findIndex((s: any) => s.slideId === fetchedSlide.slideId);
        if (slideIndex !== -1) {
          newSlides[slideIndex] = fetchedSlide;
        } else {
          newSlides.push(fetchedSlide);
        }
      }

      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          project: {
            ...(currentProject || {}),
            ...fetchedProject,
            slides: newSlides,
          },
          isLoading: false,
        },
      };
    }
    case `${MERGE_VIDEOS_PROJECT_SERVER}_SUCCESS`: {
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          project: {
            ...state[ProjectModules.project].project,
            output: action.payload.data.data,
            status: 3,
          },
          isLoading: false,
        },
      };
    }
    case SET_ACTIVE_DRAFT_SLIDE: {
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          isDraftSlide: true,
          draftSlideData: action.payload.slide,
        },
      };
    }
    case CLEAR_ACTIVE_DRAFT_SLIDE: {
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          isDraftSlide: false,
          draftSlideData: null,
        },
      };
    }
    case `${DELETE_PROJECT_SLIDE_SERVER}_SUCCESS`: {
      const deletedSlideId = action.meta.previousAction.payload.request.data.slideId;

      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          project: {
            ...state[ProjectModules.project].project,
            slides:
              state[ProjectModules.project].project?.slides?.filter((slide: any) => slide.slideId !== deletedSlideId) ||
              [],
          },
        },
      };
    }
    case `${UPDATE_SLIDE_STATUS_SERVER}_SUCCESS`: {
      const updatedSlide = action.payload.data.data;

      const slide = state[ProjectModules.project].project?.slides?.map((slide: any) =>
        slide.slideId === updatedSlide.slides[0].slideId
          ? {
              ...slide,
              isActive: updatedSlide.slides[0].isActive,
            }
          : slide,
      );
      return {
        ...state,
        [ProjectModules.project]: {
          ...state[ProjectModules.project],
          project: {
            ...state[ProjectModules.project].project,
            slides: slide,
          },
          slidesData: state[ProjectModules.project].slidesData?.map((slide: any) =>
            slide.slideId === updatedSlide.slides[0].slideId
              ? {
                  ...slide,
                  isActive: updatedSlide.slides[0].isActive,
                }
              : slide,
          ),
          isLoading: false,
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
export const getTotalPages = (state: StoreType) => state.project[ProjectModules.projectList].totalPages;
export const getHasMore = (state: StoreType) => state.project[ProjectModules.projectList].hasMore;
export const getProjectListPageNumber = (state: StoreType) => state.project[ProjectModules.projectList].pageNumber;

export const getVideoProjectList = (state: StoreType) => state.project[ProjectModules.videoProjectList].data;
export const getVideoProjectListLoading = (state: StoreType) =>
  state.project[ProjectModules.videoProjectList].isLoading;
export const getVideoTotalPages = (state: StoreType) => state.project[ProjectModules.videoProjectList].totalPages;

export const getAvatarProjectList = (state: StoreType) => state.project[ProjectModules.avatarProjectList].data;
export const getAvatarProjectListLoading = (state: StoreType) =>
  state.project[ProjectModules.avatarProjectList].isLoading;
export const getAvatarTotalPages = (state: StoreType) => state.project[ProjectModules.avatarProjectList].totalPages;

export const getProject = (state: StoreType) => state.project[ProjectModules.project].project;
export const getProjectLoading = (state: StoreType) => state.project[ProjectModules.project].isLoading;
export const getProjectAudio = (state: StoreType) => state.project[ProjectModules.project].audio;

export const getAutoSaveLoading = (state: StoreType) => state.project[ProjectModules.autoSave].isLoading;

export const getHasMoreProjects = (state: StoreType) => state.project[ProjectModules.projectList].hasMore;
export const getCurrentPageProjects = (state: StoreType) => state.project[ProjectModules.projectList].pageNumber;

export const getCreatedProject = (state: StoreType) => state.project[ProjectModules.project].createdProject;
export const getSlidesData = (state: StoreType) => state.project[ProjectModules.project].slidesData;
export const getProjectPreview = (state: StoreType) => state.project[ProjectModules.project]?.preview;
export const getIsDraftSlide = (state: StoreType) => state.project[ProjectModules.project]?.isDraftSlide;
export const getDraftSlideData = (state: StoreType) => state.project[ProjectModules.project]?.draftSlideData;

export const createProjectLoading = (state: StoreType) => state.project[ProjectModules.project].isLoading;

export default profileReducer;
