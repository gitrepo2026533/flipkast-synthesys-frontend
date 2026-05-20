import { useState } from "react";
import styled from "styled-components";

import { ProfileHumanSidebarType } from "../../../types/human";

import Button, { ButtonThemes } from "../../../components/Button/Button";
import IconButton, { IconButtonThemes } from "../../../components/Button/IconButton";
import BackgroundSidebar from "../../../components/HumanSidebars/BackgroundSidebar";
import HumatarSidebar from "../../../components/HumanSidebars/HumatarSidebar";
import ShapesSidebar from "../../../components/HumanSidebars/ShapesSidebar";
import SoundtrackSidebar from "../../../components/HumanSidebars/SoundtrackSidebar";
import TransitionSidebar from "../../../components/HumanSidebars/TransitionSidebar";
import HumanSwitcher from "../../../components/HumanSwitcher/HumanSwitcher";
import Textfield from "../../../components/Textfield/Textfield";
import TitleWithAction from "./TitleWithAction";
import AddTextPanel from "../../ScenesPoc/components/AddTextPanel";
import ObjectChips from "../../ScenesPoc/components/ObjectChips";
import PropertiesPanel from "../../ScenesPoc/components/PropertiesPanel";
import { DropdownDelete, ImportIcon, SearchFilterIcon, SearchIcon } from "../../../components/Icons/Icons";

import { BackgroundProps, humans } from "../../../mocks/humans";
import { ObjectTypes, SceneObject } from "../../../types/scene";
import { useDispatch } from "react-redux";
import { Popups, updatePopup } from "../../../redux/actions/popupsActions";

const Sidebar = ({
  element,
  handleBackgroundChange,
  handleAddText,
  currentScene,
  handleChangeActiveObject,
  handleRemoveTextChip,
  handleTextObjectChange,
  deleteAllText,
  handleAddAvatar,
  handleAddShape,
  updateSize,
}: any): any => {
  const dispatch = useDispatch();

  switch (element.type) {
    case ProfileHumanSidebarType.Background: {
      const [activeBackground, setActiveBackground] = useState(element?.data[0]?.type);
      const handleActiveBackground = (background: BackgroundProps) => setActiveBackground(background);

      return (
        <Wrapper>
          <TitleWithAction title="Background">
            <HumanSwitcher data={element.data} active={activeBackground} handleActive={handleActiveBackground} />
            <Textfield placeholder="Search for images/videos…" startAdornment={<SearchIcon />} />
            <BackgroundSidebar
              active={activeBackground}
              data={element.data}
              handleBackgroundChange={handleBackgroundChange}
            />
          </TitleWithAction>
        </Wrapper>
      );
    }
    case ProfileHumanSidebarType.Humatar:
      return (
        <Wrapper>
          <TitleWithAction
            type="humatar"
            title="Humatar"
            action={
              <>
                <IconButton
                  iconButtonTheme={IconButtonThemes.Transparent}
                  icon={<SearchFilterIcon />}
                  onClick={() =>
                    dispatch(
                      updatePopup({
                        popup: Popups.aIHumansPopup,
                        status: true,
                        prefilled: {
                          humans,
                        },
                      }),
                    )
                  }
                />
              </>
            }
          >
            <HumatarSidebar data={element.data} updateSize={updateSize} handleAddAvatar={handleAddAvatar} />
          </TitleWithAction>
        </Wrapper>
      );
    case ProfileHumanSidebarType.Shapes: {
      return (
        <Wrapper>
          <TitleWithAction title="Shapes">
            <ShapesSidebar data={element.data} handleAddShape={handleAddShape} />
          </TitleWithAction>
        </Wrapper>
      );
    }
    case ProfileHumanSidebarType.Soundtrack:
      return (
        <Wrapper>
          <TitleWithAction
            title="Soundtrack"
            action={<Button buttonTheme={ButtonThemes.Secondary} icon={<ImportIcon />} text="Upload" />}
          >
            <SoundtrackSidebar data={element.data} />
          </TitleWithAction>
        </Wrapper>
      );
    // case ProfileHumanSidebarType.Subtitle: {
    //   return (
    //     <Wrapper>
    //       <TitleWithAction title="Subtitle">
    //         <SubtitleSidebar data={element.data} />
    //       </TitleWithAction>
    //     </Wrapper>
    //   );
    // }
    // case ProfileHumanSidebarType.Templates: {
    //   return (
    //     <Wrapper>
    //       <TitleWithAction title="Templates">
    //         <Textfield placeholder="Search" startAdornment={<SearchIcon />} />
    //         <TemplateSidebar data={element.data} />
    //       </TitleWithAction>
    //     </Wrapper>
    //   );
    // }
    case ProfileHumanSidebarType.Text:
      return (
        <Wrapper>
          <TitleWithAction
            type="text"
            title="Text"
            action={
              <Button
                onClick={deleteAllText}
                buttonTheme={ButtonThemes.Secondary}
                icon={<DropdownDelete />}
                text="Delete all"
              />
            }
          >
            <Panel>
              <AddTextPanel handleAddText={handleAddText} />
              <ObjectChips
                objects={currentScene?.objects.filter((obj: SceneObject) => obj.type === ObjectTypes.texts) || []}
                activeId={currentScene?.activeObjectId || 0}
                handleChangeActive={handleChangeActiveObject}
                handleRemoveTextChip={handleRemoveTextChip}
              />
              <PropertiesPanel
                currentObject={
                  currentScene?.objects.find(
                    (obj: SceneObject) =>
                      obj.object.id === currentScene.activeObjectId && obj.type === ObjectTypes.texts,
                  )?.object
                }
                handleObjectsChange={handleTextObjectChange}
              />
            </Panel>
          </TitleWithAction>
        </Wrapper>
      );
    case ProfileHumanSidebarType.Transitions: {
      return (
        <Wrapper>
          <TitleWithAction title="Transitions">
            <TransitionSidebar data={element.data} />
          </TitleWithAction>
        </Wrapper>
      );
    }
    default:
      break;
  }
};

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  width: 272px;
  max-width: 100%;
`;

export default Sidebar;
