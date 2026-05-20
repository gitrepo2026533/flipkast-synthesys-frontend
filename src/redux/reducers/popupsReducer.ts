import { StoreType } from "../../types/store";
import { Popups, UPDATE_POPUP } from "../actions/popupsActions";

export interface popupsStateType {
  popups: {
    [key in Popups]: boolean;
  };
  prefilled: any;
}

export const popupsInitialState: popupsStateType = {
  popups: {
    [Popups.createNewProjectPopup]: false,
    [Popups.estimatedPopup]: false,
    [Popups.characterPopup]: false,
    [Popups.aIHumansPopup]: false,
    [Popups.templatesPopup]: false,
    [Popups.generativeVideo]: false,
    [Popups.shareVideoLinkPopup]: false,
    [Popups.confirmationPopup]: false,
    [Popups.chatPopup]: false,
    [Popups.vimeoPopup]: false,
    [Popups.addVoiceAudioPopup]: false,
  },
  prefilled: {},
};

const popupsReducer = (state = popupsInitialState, action: any) => {
  switch (action.type) {
    case UPDATE_POPUP: {
      const { popup, status, prefilled } = action.payload;
      return {
        ...state,
        prefilled,
        popups: {
          [popup]: status,
        },
      };
    }
    default:
      return { ...state };
  }
};

export const getCreateNewProjectPopupIsOpen = (state: StoreType) => state.popups.popups[Popups.createNewProjectPopup];
export const getEstimatedPopupIsOpen = (state: StoreType) => state.popups.popups[Popups.estimatedPopup];
export const getCharacterPopupIsOpen = (state: StoreType) => state.popups.popups[Popups.characterPopup];
export const getAIHumansPopupIsOpen = (state: StoreType) => state.popups.popups[Popups.aIHumansPopup];
export const getTemplatePopupIsOpen = (state: StoreType) => state.popups.popups[Popups.templatesPopup];
export const getGenerativeVideoPopupIsOpen = (state: StoreType) => state.popups.popups[Popups.generativeVideo];
export const getShareVideoLinkPopupIsOpen = (state: StoreType) => state.popups.popups[Popups.shareVideoLinkPopup];
export const getConfirmationPopupIsOpen = (state: StoreType) => state.popups.popups[Popups.confirmationPopup];
export const getChatPopupIsOpen = (state: StoreType) => state.popups.popups[Popups.chatPopup];
export const getVimeoPopupIsOpen = (state: StoreType) => state.popups.popups[Popups.vimeoPopup];
export const getAddVoiceAudioPopupIsOpen = (state: StoreType) => state.popups.popups[Popups.addVoiceAudioPopup];

export const getPrefilled = (state: StoreType) => state.popups.prefilled;

export default popupsReducer;
