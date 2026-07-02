import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button, { ButtonThemes } from "../../components/Button/Button";
import IconButton, { IconButtonThemes } from "../../components/Button/IconButton";
import { ArrowRight, DesktopIcon } from "../../components/Icons/Icons";
import { MobileIcon } from "../../components/Icons/MobileIcon";
import { useVideoEditor } from "../../hooks/useVideoEditor";
import DashboardLayout from "../../layouts/DashboardLayout";
import { featuresSettings, sidebar } from "../../mocks/humans";
import { getActorsServer } from "../../redux/actions/actorActions";
import { getActorsList } from "../../redux/reducers/actorReducer";
import { getAllUserAssetsServer } from "../../redux/actions/profileActions";
import {
  getVideoByProjectIdServer,
  getProjectSlideServer,
  clearCurrentProject,
} from "../../redux/actions/projectAction";
import { getProject } from "../../redux/reducers/projectReducer";
import { IActor } from "../../types/actor";
import { ProfileHumanSidebarType } from "../../types/human";
import { Paragraphs } from "../../types/project";
import Scene from "../ScenesPoc/components/Scene";
import Modal from "../../components/Modal/Modal";
import ProfileHumanSidebar from "./components/ProfileHumanSidebar";
import Sidebar from "./components/Sidebar";
import SoundFeaturesSettingsCard from "./components/SoundFeaturesSettingsCard";
import Timeline from "./components/Timeline";

const screens = [
  { id: 1, icon: <DesktopIcon /> },
  { id: 2, icon: <MobileIcon /> },
];

const initialParagraphsData = [
  {
    actorId: 1,
    order: 1,
    data: [
      {
        text: "",
        features: [
          {
            key: "",
            value: "",
          },
        ],
      },
    ],
  },
];

const AIHumansPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const actorsList = useSelector(getActorsList);
  const projectData = useSelector(getProject);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [activeSidebarItem, setActiveSidebarItem] = useState(ProfileHumanSidebarType.Background);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [paragraphs, setParagraphs] = useState<Paragraphs[]>(initialParagraphsData);
  const [paragraphActive, setParagraphActive] = useState<number>();

  const actorId = paragraphs?.find((paragraph) => paragraph.order === paragraphActive)?.actorId;
  const actor = actorsList?.find((actor) => actor.actorId === actorId);
  const paragraphActor = paragraphs[(paragraphActive as number) - 1]?.actor;
  const paragraphActorsList = paragraphs[(paragraphActive as number) - 1]?.actorsList;

  const handleLeftSidebarOpen = () => setLeftSidebarOpen(!leftSidebarOpen);

  const handleActorPopupClick = (actors: IActor[]) => {
    const selectedActor = actors?.[0];
    setParagraphs(
      paragraphs?.map((paragraph) =>
        paragraph.order === paragraphActive
          ? {
              ...paragraph,
              actorId: selectedActor.actorId,
              actor: selectedActor,
              actorsList: actors,
            }
          : paragraph,
      ),
    );
  };

  const handleParagraphActive = (id: number) => {
    setParagraphActive(id);
  };

  const [active, setActive] = useState(screens[0].id);
  const handleActive = (id: number) => setActive(id);

  useEffect(() => {
    dispatch(
      getActorsServer({
        keyword: "",
        pageNumber: 1,
        categoryType: [],
        voiceAge: [],
        mood: [],
        content: [],
        region: [],
        country: [],
        language: [],
      }),
    );
    dispatch(
      getAllUserAssetsServer({
        pageNumber: 1,
        pageSize: 60,
        assetTypeId: 11,
        sortWith: "insertDateTime",
        sortByDesc: true,
      }),
    );
    if (projectId) {
      dispatch(getVideoByProjectIdServer(Number(projectId)));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch]);

  const element = sidebar.find(({ type }: any) => type === activeSidebarItem);

  const {
    dublicateScene,
    addScene,
    handleDeleteScene,
    handleAddText,
    handleAddShape,
    handleAddAvatar,
    handleRemoveTextChip,
    handleInputChange,
    updatePosition,
    updateSize,
    handleChangeActiveObject,
    handleTextObjectChange,
    handleChangeActiveScene,
    handleBackgroundChange,
    deleteAllText,
    setEditableTextId,
    handleScriptChange,
    scenes,
    currentScene,
    activeSceneId,
    setScenesExternal,
  } = useVideoEditor();

  useEffect(() => {
    if (projectData && projectData.projectId === Number(projectId)) {
      const projectSlides: any[] = projectData.slides || [];

      if (projectSlides.length > 0) {
        const mappedScenes = projectSlides.map((slide: any) => {
          let text = "";
          if (slide.projectParagraphs) {
            text = slide.projectParagraphs
              .map((p: any) => p.data?.map((z: any) => z.text).join(" ") || p.text || "")
              .join(" ");
          }

          const objects: any[] = [];
          if (slide.aiHumanActor) {
            objects.push({
              type: "avatars",
              object: {
                id: slide.aiHumanActorId || Math.random(),
                position: {
                  x: slide.actorPositionX != null ? slide.actorPositionX : 0,
                  y: slide.actorPositionY != null ? slide.actorPositionY : 0,
                },
                size: {
                  width: slide.actorSizeWidth != null ? slide.actorSizeWidth : "100%",
                  height: slide.actorSizeHeight != null ? slide.actorSizeHeight : "100%",
                },
                src: slide.aiHumanActor.photo?.startsWith("http")
                  ? slide.aiHumanActor.photo
                  : `https://dev.synthesys.live${slide.aiHumanActor.photo}`,
              },
            });
          }

          if (slide.customTexts && slide.customTexts.length > 0) {
            slide.customTexts.forEach((ct: any) => {
              objects.push({
                type: "texts",
                object: {
                  id: ct.customTextId || Math.random(),
                  position: { x: ct.positionX || 50, y: ct.positionY || 50 },
                  size: { width: ct.width || 160, height: ct.height || 40 },
                  text: ct.text || "",
                  style: {
                    color: ct.textColor || "#000",
                    fontSize: ct.fontSize ? `${ct.fontSize}px` : "24px",
                    fontWeight: ct.isBold ? "bold" : "normal",
                    fontStyle: ct.isItalic ? "italic" : "normal",
                    fontFamily: ct.fontFamily || "Arial",
                  },
                },
              });
            });
          }

          return {
            id: slide.slideId || Math.random(),
            background:
              slide.backgroundAsset?.path || slide.slideBackgroundColor || slide.backGroundColor || "/images/mock1.png",
            activeObjectId: 0,
            editableTextId: 0,
            objects: objects,
            script: text,
          };
        });
        setScenesExternal(mappedScenes);
      }
    }
  }, [projectData, projectId]);

  useEffect(() => {
    if (activeSceneId && projectData && projectData.projectId === Number(projectId)) {
      const activeSlide = projectData.slides?.find((s: any) => s.slideId === activeSceneId);
      if (activeSlide && !activeSlide.projectParagraphs) {
        dispatch(getProjectSlideServer(Number(projectId), activeSceneId));
      }
    }
  }, [activeSceneId, projectData, projectId, dispatch]);

  if (!scenes.length && !projectId) addScene();

  return (
    <Wrapper>
      <ProfileHumanSidebar activeSidebarItem={activeSidebarItem} setActiveSidebarItem={setActiveSidebarItem} />
      <PageWrapper id="pagewrapperid">
        <DashboardLayout
          startAdornment={
            <Heading>
              <Button
                className="btn-back"
                buttonTheme={ButtonThemes.Secondary}
                icon={<img src="/images/arrow-left.svg" />}
                text="Back"
                onClick={() => navigate("/ai-avatar")}
              />
              {/* <ScreenButton>
                {screens.map(({ id, icon }) => (
                  <IconButton
                    key={id}
                    iconButtonTheme={IconButtonThemes.Rounded}
                    icon={icon}
                    className={active === id ? "not-active" : "active"}
                    onClick={() => handleActive(id)}
                  />
                ))}
              </ScreenButton> */}
            </Heading>
          }
          navActions={
            <ButtonWrapper>
              <Button
                buttonTheme={ButtonThemes.Secondary}
                text="Preview"
                onClick={() => setIsPreviewOpen(true)}
                disabled={!projectData?.output || projectData?.projectId !== Number(projectId)}
              />
              <Button buttonTheme={ButtonThemes.Transparent} text="Save as draft" />
              <Button text="Create Video" />
            </ButtonWrapper>
          }
        >
          <Content>
            {leftSidebarOpen && (
              <Left>
                <Sidebar
                  element={element}
                  handleBackgroundChange={handleBackgroundChange}
                  handleAddText={handleAddText}
                  currentScene={currentScene}
                  updateSize={updateSize}
                  handleChangeActiveObject={handleChangeActiveObject}
                  handleRemoveTextChip={handleRemoveTextChip}
                  handleTextObjectChange={handleTextObjectChange}
                  deleteAllText={deleteAllText}
                  handleAddAvatar={handleAddAvatar}
                  handleAddShape={handleAddShape}
                  handleScriptChange={handleScriptChange}
                />
              </Left>
            )}
            <Right>
              <div>
                <ImageWrapper>
                  {currentScene && (
                    <Scene
                      handleInputChange={handleInputChange}
                      updatePosition={updatePosition}
                      updateSize={updateSize}
                      handleChangeActiveObject={handleChangeActiveObject}
                      setEditableTextId={setEditableTextId}
                      canvasWidth={projectData?.canvasWidth}
                      {...currentScene}
                    />
                  )}
                </ImageWrapper>
                <Timeline
                  scenes={scenes}
                  activeSceneId={activeSceneId}
                  addScene={addScene}
                  dublicateScene={dublicateScene}
                  handleDeleteScene={handleDeleteScene}
                  handleChangeActiveScene={handleChangeActiveScene}
                  setActiveSidebarItem={setActiveSidebarItem}
                  orientation="horizontal"
                />
              </div>
              {/* <SoundFeaturesSettingsCard
                actors={actorsList}
                active={actorId}
                paragraphs={paragraphs}
                setActorActive={handleActorPopupClick}
                featuresSettings={featuresSettings}
                currentParagraphActor={actor || paragraphActor}
                currentParagraphActorsList={paragraphActorsList || []}
              /> */}
            </Right>
          </Content>
        </DashboardLayout>
        <IconButtonWrapper active={leftSidebarOpen}>
          <IconButton icon={<ArrowRight />} onClick={handleLeftSidebarOpen} />
        </IconButtonWrapper>
      </PageWrapper>
      <Modal open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} maxWidth={800}>
        {isPreviewOpen && (
          <VideoPreviewWrapper>
            {projectData?.output && projectData?.projectId === Number(projectId) ? (
              <video width="100%" controls autoPlay key={projectData.output}>
                <source src={`http://192.168.1.80:7132${projectData.output}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p style={{ color: "#fff", padding: 20 }}>No video available</p>
            )}
          </VideoPreviewWrapper>
        )}
      </Modal>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.secondaryBackground};
  width: 100%;
  height: 100vh;
  padding: 24px 24px 12px 24px;
  display: flex;
  position: relative;
  overflow: hidden;
  gap: 24px;
`;

const PageWrapper = styled.div`
  background: ${({ theme }) => theme.primaryBackground};
  border-radius: 32px;
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  max-width: 272px;
  gap: 24px;

  & > button {
    max-width: 272px;
    width: 100%;
    justify-content: flex-start;
  }

  & > div {
    width: 100%;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  height: 100%;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 272px;
  width: 100%;

  .btn-back {
    margin-right: auto;
    height: 48px;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 16px;

  & > div:first-of-type {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 80%;
`;

const IconButtonWrapper = styled.div<{ active?: boolean }>`
  position: absolute;
  top: calc(50% - 18px);
  left: 0;
  transform: rotate(-180deg);
  transition: 0.4s;
  width: 20px;

  & > button {
    width: 20px;
    height: 32px;
    border: 2px solid ${({ theme }) => theme.primaryBackground};
    border-radius: 12px 0 0 12px;

    &:focus {
      border: 2px solid ${({ theme }) => theme.primaryBackground};
    }

    svg {
      transform: translateX(1px);
    }
  }

  ${({ active }) =>
    active &&
    `
      & > button > svg {
        transform: rotate(180deg);
      }
  `}
`;

const ScreenButton = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 50%;

  button {
    box-shadow: ${({ theme }) => theme.secondaryButtonShadow};
    background: ${({ theme }) => theme.primaryBackground};
    border-radius: 12px;
    max-width: 48px;
    height: 48px;

    svg {
      width: 24px;
      height: 24px;
    }

    &.active {
      opacity: 0.4;
    }
  }
`;

const VideoPreviewWrapper = styled.div`
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-height: 80vh;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  /* justify-content: flex-end; */

  button {
    max-width: 152px;
    min-width: 152px;
  }

  button:first-of-type {
    display: flex;
    justify-content: flex-end;
    background: ${({ theme }) => theme.button};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;

    span {
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.41px;
    }
  }
`;

export default AIHumansPage;
