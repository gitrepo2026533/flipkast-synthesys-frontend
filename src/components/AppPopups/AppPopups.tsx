import { useDispatch, useSelector } from "react-redux";

import { Popups, updatePopup } from "../../redux/actions/popupsActions";
import {
  getAddVoiceAudioPopupIsOpen,
  getAIHumansPopupIsOpen,
  getCharacterPopupIsOpen,
  getConfirmationPopupIsOpen,
  getCreateNewProjectPopupIsOpen,
  getGenerativeVideoPopupIsOpen,
  getShareVideoLinkPopupIsOpen,
  getTemplatePopupIsOpen,
  getVimeoPopupIsOpen,
} from "../../redux/reducers/popupsReducer";
import AddVoiceAudioPopup from "../Popups/AddVoiceAudioPopup";
import AIHumansPopup from "../Popups/AIHumansPopup";
import CharacterPopup from "../Popups/CharacterPopup";
import ConfirmationPopup from "../Popups/ConfirmationPopup";
import CreateNewProjectPopup from "../Popups/CreateNewProjectPopup";
import GenerativeVideoPopup from "../Popups/GenerativeVideoPopup";
import ShareVideoLinkPopup from "../Popups/ShareVideoLinkPopup";
import TemplatesPopup from "../Popups/TemplatesPopup";
import VimeoPopup from "../Popups/VimeoPopup";

const AppDialogs = () => {
  const сreateNewProjectPopupIsOpen = useSelector(getCreateNewProjectPopupIsOpen);
  const characterPopupIsOpen = useSelector(getCharacterPopupIsOpen);
  const aIHumansPopupIsOpen = useSelector(getAIHumansPopupIsOpen);
  const templatePopupIsOpen = useSelector(getTemplatePopupIsOpen);
  const generativeVideoPopupIsOpen = useSelector(getGenerativeVideoPopupIsOpen);
  const shareVideoLinkPopupIsOpen = useSelector(getShareVideoLinkPopupIsOpen);
  const confirmationPopupOpen = useSelector(getConfirmationPopupIsOpen);
  const isVimeoPopupVisible = useSelector(getVimeoPopupIsOpen);
  const addVoiceAudioPopupIsOpen = useSelector(getAddVoiceAudioPopupIsOpen);

  const dispatch = useDispatch();

  const handleClosePopup = (popup: Popups) => {
    switch (popup) {
      case Popups.createNewProjectPopup: {
        dispatch(updatePopup({ popup: Popups.createNewProjectPopup, status: false, prefilled: {} }));
        break;
      }
      case Popups.characterPopup: {
        dispatch(updatePopup({ popup: Popups.characterPopup, status: false, prefilled: {} }));
        break;
      }
      case Popups.aIHumansPopup: {
        dispatch(updatePopup({ popup: Popups.aIHumansPopup, status: false, prefilled: {} }));
        break;
      }
      case Popups.templatesPopup: {
        dispatch(updatePopup({ popup: Popups.templatesPopup, status: false, prefilled: {} }));
        break;
      }
      case Popups.generativeVideo: {
        dispatch(updatePopup({ popup: Popups.generativeVideo, status: false, prefilled: {} }));
        break;
      }
      case Popups.shareVideoLinkPopup: {
        dispatch(updatePopup({ popup: Popups.shareVideoLinkPopup, status: false, prefilled: {} }));
        break;
      }
      case Popups.addVoiceAudioPopup: {
        dispatch(updatePopup({ popup: Popups.addVoiceAudioPopup, status: false, prefilled: {} }));
        break;
      }
    }
  };

  return (
    <>
      {сreateNewProjectPopupIsOpen && (
        <CreateNewProjectPopup
          open={сreateNewProjectPopupIsOpen}
          onClose={() => handleClosePopup(Popups.createNewProjectPopup)}
        />
      )}
      {characterPopupIsOpen && (
        <CharacterPopup open={characterPopupIsOpen} onClose={() => handleClosePopup(Popups.characterPopup)} />
      )}
      {aIHumansPopupIsOpen && (
        <AIHumansPopup open={aIHumansPopupIsOpen} onClose={() => handleClosePopup(Popups.aIHumansPopup)} />
      )}
      {templatePopupIsOpen && (
        <TemplatesPopup open={templatePopupIsOpen} onClose={() => handleClosePopup(Popups.templatesPopup)} />
      )}
      {generativeVideoPopupIsOpen && (
        <GenerativeVideoPopup
          open={generativeVideoPopupIsOpen}
          onClose={() => handleClosePopup(Popups.generativeVideo)}
        />
      )}
      {shareVideoLinkPopupIsOpen && (
        <ShareVideoLinkPopup
          open={shareVideoLinkPopupIsOpen}
          onClose={() => handleClosePopup(Popups.shareVideoLinkPopup)}
        />
      )}
      {confirmationPopupOpen && <ConfirmationPopup />}
      {isVimeoPopupVisible && <VimeoPopup />}
      {addVoiceAudioPopupIsOpen && (
        <AddVoiceAudioPopup
          open={addVoiceAudioPopupIsOpen}
          onClose={() => handleClosePopup(Popups.addVoiceAudioPopup)}
        />
      )}
    </>
  );
};

export default AppDialogs;
