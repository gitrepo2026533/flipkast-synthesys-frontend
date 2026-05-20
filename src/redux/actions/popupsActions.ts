export const UPDATE_POPUP = "UPDATE_POPUP";

export enum Popups {
  createNewProjectPopup = "createNewProjectPopup",
  estimatedPopup = "estimatedPopup",
  characterPopup = "characterPopup",
  aIHumansPopup = "aIHumansPopup",
  templatesPopup = "templatesPopup",
  generativeVideo = "generativeVideo",
  shareVideoLinkPopup = "shareVideoLinkPopup",
  confirmationPopup = "confirmationPopup",
  chatPopup = "chatPopup",
  vimeoPopup = "vimeoPopup",
  addVoiceAudioPopup = "addVoiceAudioPopup",
}

interface UpdatePopupProps {
  popup: Popups;
  status: boolean;
  prefilled?: any;
}

export const updatePopup = ({ popup, status, prefilled }: UpdatePopupProps) => ({
  type: UPDATE_POPUP,
  payload: {
    popup,
    status,
    prefilled,
  },
});
