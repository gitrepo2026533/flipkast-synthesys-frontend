import { useState } from "react";
import styled from "styled-components";

import { ProfileHumanSidebarType } from "../../../types/human";

import Button, { ButtonThemes } from "../../../components/Button/Button";
import BackgroundSidebar from "../../../components/HumanSidebars/BackgroundSidebar";
import HumatarSidebar from "../../../components/HumanSidebars/HumatarSidebar";
import ScriptSidebar from "../../../components/HumanSidebars/ScriptSidebar";
import ShapesSidebar from "../../../components/HumanSidebars/ShapesSidebar";
import SoundtrackSidebar from "../../../components/HumanSidebars/SoundtrackSidebar";
import TransitionSidebar from "../../../components/HumanSidebars/TransitionSidebar";
import HumanSwitcher from "../../../components/HumanSwitcher/HumanSwitcher";
import { DropdownDelete, ImportIcon, SearchIcon } from "../../../components/Icons/Icons";
import Textfield from "../../../components/Textfield/Textfield";
import AddTextPanel from "../../ScenesPoc/components/AddTextPanel";
import ObjectChips from "../../ScenesPoc/components/ObjectChips";
import PropertiesPanel from "../../ScenesPoc/components/PropertiesPanel";
import TitleWithAction from "./TitleWithAction";

import { useDispatch, useSelector } from "react-redux";
import { getUserAssets } from "../../../redux/reducers/profileReducer";
import { BackgroundProps } from "../../../mocks/humans";
import { ObjectTypes, SceneObject } from "../../../types/scene";

import { useEffect } from "react";

const HumatarSidebarWrapper = ({ updateSize, handleAddAvatar }: any) => {
  const dispatch = useDispatch();
  const [aiHumanActors, setAiHumanActors] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActors = async () => {
      if (loading || (!hasMore && pageNumber > 1)) return;
      setLoading(true);
      try {
        const response: any = await dispatch({
          type: "GET_AI_HUMAN_ACTORS_SERVER",
          payload: {
            request: {
              method: "POST",
              url: "/aIHumanActor/list",
              data: {
                pageNumber,
                keyword: "",
                bookmarked: false,
                pageSize: 34,
                category: ["Humatars", "Professional", "Seated", "Casual", "Mobile", "Photo"],
              },
            },
          },
        });
        const data = response?.payload?.data?.data || [];
        const formattedData = data.map((actor: any) => ({
          id: actor.aiHumanActorId,
          image: actor.photo,
        }));

        if (pageNumber === 1) {
          setAiHumanActors(formattedData);
        } else {
          setAiHumanActors((prev) => [...prev, ...formattedData]);
        }

        if (data.length < 34) {
          setHasMore(false);
        }
      } catch (e) {
        console.error("Failed to fetch AI human actors", e);
      } finally {
        setLoading(false);
      }
    };
    fetchActors();
  }, [dispatch, pageNumber]);

  const onLoadMore = () => {
    if (hasMore && !loading) {
      setPageNumber((prev) => prev + 1);
    }
  };

  return (
    <HumatarSidebar
      data={aiHumanActors}
      updateSize={updateSize}
      handleAddAvatar={handleAddAvatar}
      onLoadMore={onLoadMore}
    />
  );
};

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
  handleScriptChange,
}: any): any => {
  const dispatch = useDispatch();

  switch (element.type) {
    case ProfileHumanSidebarType.Background: {
      const userAssets = useSelector(getUserAssets);
      const mockBgData = element.data || [];
      const backgroundData = mockBgData.map((category: any) => {
        const assets =
          userAssets?.map((asset: any) => ({
            id: asset.userAssetID,
            image: asset.path,
            video: asset.path,
          })) || [];
        return {
          ...category,
          data: assets,
        };
      });

      const [activeBackground, setActiveBackground] = useState(backgroundData[0]?.type);
      const handleActiveBackground = (background: BackgroundProps) => setActiveBackground(background);

      return (
        <Wrapper>
          <TitleWithAction title="Background">
            {/* <HumanSwitcher data={backgroundData} active={activeBackground} handleActive={handleActiveBackground} />
            <Textfield placeholder="Search for images/videos…" startAdornment={<SearchIcon />} /> */}
            <BackgroundSidebar
              active={activeBackground}
              data={backgroundData}
              hideEdit={true}
              handleBackgroundChange={handleBackgroundChange}
            />
          </TitleWithAction>
        </Wrapper>
      );
    }
    case ProfileHumanSidebarType.Humatar:
      return (
        <Wrapper>
          <TitleWithAction type="humatar" title="Humatar">
            <HumatarSidebarWrapper updateSize={updateSize} handleAddAvatar={handleAddAvatar} />
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
    case ProfileHumanSidebarType.Script:
      return (
        <Wrapper>
          <TitleWithAction title="Script">
            <ScriptSidebar currentScript={currentScene?.script} handleScriptChange={handleScriptChange} />
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
