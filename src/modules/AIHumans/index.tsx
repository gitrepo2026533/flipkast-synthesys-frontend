import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button, { ButtonThemes } from "../../components/Button/Button";
import Textfield, { TextfieldVariant } from "../../components/Textfield/Textfield";
import { toast } from "react-toastify";
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
  createAiHumanProjectServer,
  updateAiHumanProjectServer,
  resetCreatedProject,
  generateVideoProjectServer,
} from "../../redux/actions/projectAction";
import { getProject, getCreatedProject, getProjectLoading } from "../../redux/reducers/projectReducer";
import { getUserAssets } from "../../redux/reducers/profileReducer";
import { pages } from "../../lib/routeUtils";
import { IActor } from "../../types/actor";
import { ProfileHumanSidebarType } from "../../types/human";
import { Paragraphs } from "../../types/project";
import { StoreType } from "../../types/store";
import { ProfileModules } from "../../types/profile";
import Scene from "../ScenesPoc/components/Scene";
import Modal from "../../components/Modal/Modal";
import ProfileHumanSidebar from "./components/ProfileHumanSidebar";
import Sidebar from "./components/Sidebar";
import SoundFeaturesSettingsCard from "./components/SoundFeaturesSettingsCard";
import Timeline from "./components/Timeline";
import { CheckIcon } from "../../components/Icons/CheckIcon";
import CircularProgress from "../../components/Icons/CircularProgress";

const screens = [
  { id: 1, icon: <DesktopIcon /> },
  { id: 2, icon: <MobileIcon /> },
];

const ProjectStatus: Record<number, string> = {
  1: "pending",
  2: "in progress",
  3: "completed",
};

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
  const createdProject = useSelector(getCreatedProject);
  const isLoading = useSelector(getProjectLoading);
  const userAssets = useSelector(getUserAssets);
  const userAssetsLoading = useSelector((state: StoreType) => state.profile[ProfileModules.userAssets]?.isLoading);
  const [hasFetchedAssets, setHasFetchedAssets] = useState(false);
  const [initialSceneAdded, setInitialSceneAdded] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [activeSidebarItem, setActiveSidebarItem] = useState(ProfileHumanSidebarType.Background);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [generatedVideoPath, setGeneratedVideoPath] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<"idle" | "pending" | "in progress" | "completed" | "failed">(
    "idle",
  );
  const [title, setTitle] = useState("");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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
                  : `${process.env.REACT_APP_SYNTHESYS_URL}${slide.aiHumanActor.photo}`,
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
            projectParagraphId: slide.projectParagraphs?.[0]?.projectParagraphId,
            thumbnailImage: slide.thumbnailImage,
          };
        });
        setScenesExternal((prevScenes: any[]) => {
          if (prevScenes.length === 0) return mappedScenes;

          const hasCommonId = prevScenes.some((p) => mappedScenes.some((m) => m.id === p.id));
          if (!hasCommonId) {
            return mappedScenes;
          }

          const newScenes = [...prevScenes];
          mappedScenes.forEach((mapped) => {
            const index = newScenes.findIndex((p) => p.id === mapped.id);
            if (index === -1) {
              newScenes.push(mapped);
            } else {
              newScenes[index] = {
                ...mapped,
                script: prevScenes[index].script || mapped.script,
                objects: prevScenes[index].objects.length > 0 ? prevScenes[index].objects : mapped.objects,
                background:
                  prevScenes[index].background !== "/images/mock1.png"
                    ? prevScenes[index].background
                    : mapped.background,
                projectParagraphId: prevScenes[index].projectParagraphId || mapped.projectParagraphId,
              };
            }
          });
          return newScenes;
        });
        if (projectData.title) {
          setTitle(projectData.title);
        }
        if (projectData.status) {
          setGenerationStatus(ProjectStatus[Number(projectData.status)] as any);
        }
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

  const handleCreateVideo = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSavingDraft(true);
    try {
      const payloadSlides = scenes.map((scene: any) => {
        let bgId: string | number | undefined = undefined;

        const userAssetMatch = userAssets?.find((a: any) => a.path === scene.background);
        if (userAssetMatch) {
          bgId = userAssetMatch.userAssetID;
        } else {
          const mockBgData = sidebar.find((s) => s.type === ProfileHumanSidebarType.Background)?.data || [];
          mockBgData.forEach((category: any) => {
            if (category.data) {
              const match = category.data.find(
                (b: any) => b.image === scene.background || b.video === scene.background,
              );
              if (match) bgId = match.id;
            }
          });
        }

        const avatarObj = scene.objects?.find((o: any) => o.type === "avatars");
        const selectedActorId = avatarObj ? avatarObj.object.id : undefined;

        return {
          ...(projectId ? { SlideId: scene.id > 1 ? scene.id : 0 } : {}),
          backGroundAssetId: bgId,
          aiHumanActorId: selectedActorId,
          projectParagraphs: [
            {
              ...(scene.projectParagraphId ? { projectParagraphId: scene.projectParagraphId } : {}),
              actorId: selectedActorId || 12270,
              Text: scene.script || "",
            },
          ],
        };
      });

      const numericStatus = Number(
        Object.keys(ProjectStatus).find((key) => ProjectStatus[Number(key)] === generationStatus) ||
          projectData?.status ||
          1,
      );

      if (projectId) {
        const response: any = await dispatch(
          updateAiHumanProjectServer({
            projectId: Number(projectId),
            title: title,
            Status: numericStatus,
            slides: payloadSlides,
          }),
        );
        if (response?.error) {
          toast.error("Failed to save project as draft");
        } else {
          toast.success("Project saved as draft successfully");
        }
      } else {
        const response: any = await dispatch(
          createAiHumanProjectServer({
            title: title,
            Status: numericStatus,
            slides: payloadSlides,
          }),
        );
        if (response?.error) {
          toast.error("Failed to save project as draft");
        } else {
          toast.success("Project saved as draft successfully");
        }
      }
    } finally {
      setIsSavingDraft(false);
    }
  };

  const onGenerate = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setGenerationStatus("pending");
    setIsGenerating(true);

    try {
      const payloadSlides = scenes.map((scene: any) => {
        let bgId: string | number | undefined = undefined;

        const userAssetMatch = userAssets?.find((a: any) => a.path === scene.background);
        if (userAssetMatch) {
          bgId = userAssetMatch.userAssetID;
        } else {
          const mockBgData = sidebar.find((s) => s.type === ProfileHumanSidebarType.Background)?.data || [];
          mockBgData.forEach((category: any) => {
            if (category.data) {
              const match = category.data.find(
                (b: any) => b.image === scene.background || b.video === scene.background,
              );
              if (match) bgId = match.id;
            }
          });
        }

        const avatarObj = scene.objects?.find((o: any) => o.type === "avatars");
        const selectedActorId = avatarObj ? avatarObj.object.id : undefined;

        return {
          ...(projectId ? { SlideId: scene.id > 1 ? scene.id : 0 } : {}),
          backGroundAssetId: bgId,
          aiHumanActorId: selectedActorId,
          projectParagraphs: [
            {
              ...(scene.projectParagraphId ? { projectParagraphId: scene.projectParagraphId } : {}),
              actorId: selectedActorId || 12270,
              Text: scene.script || "",
            },
          ],
        };
      });

      let targetProjectId = projectId;
      let didApikeyError = null;

      const numericStatus = Number(
        Object.keys(ProjectStatus).find((key) => ProjectStatus[Number(key)] === generationStatus) ||
          projectData?.status ||
          1,
      );

      if (projectId) {
        const response: any = await dispatch(
          updateAiHumanProjectServer({
            projectId: Number(projectId),
            title: title,
            Status: numericStatus,
            slides: payloadSlides,
          }),
        );
        if (response?.error) {
          setGenerationStatus("failed");
          toast.error("Failed to update project");
          return;
        }
        didApikeyError = response?.payload?.data?.data?.didApikeyError || response?.payload?.data?.didApikeyError;
        if (didApikeyError) {
          toast.error(didApikeyError);
        } else {
          toast.success("Project updated successfully");
        }
      } else {
        const response: any = await dispatch(
          createAiHumanProjectServer({
            title: title,
            Status: numericStatus,
            slides: payloadSlides,
          }),
        );
        if (response?.error) {
          setGenerationStatus("failed");
          toast.error("Failed to create project");
          return;
        }
        didApikeyError = response?.payload?.data?.data?.didApikeyError || response?.payload?.data?.didApikeyError;
        if (didApikeyError) {
          toast.error(didApikeyError);
        } else {
          toast.success("Project created successfully");
        }
        targetProjectId = response?.payload?.data?.data?.projectId;
      }

      if (targetProjectId && !didApikeyError) {
        setGenerationStatus("in progress");
        try {
          const response: any = await dispatch(generateVideoProjectServer(Number(targetProjectId)));
          const result = response?.payload?.data;
          if (result?.succeeded && result?.data?.path) {
            setGeneratedVideoPath(result.data.path);
            setGenerationStatus("completed");
          } else {
            setGenerationStatus("failed");
          }
        } catch (error) {
          console.error("Error generating video", error);
          setGenerationStatus("failed");
        }
      } else {
        setGenerationStatus("failed");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (createdProject?.projectId) {
      navigate(pages.aiHumansProject().replace(":projectId", createdProject.projectId.toString()));
      dispatch(resetCreatedProject());
    }
  }, [createdProject, navigate, dispatch]);

  useEffect(() => {
    if (userAssetsLoading) {
      setHasFetchedAssets(true);
    }
  }, [userAssetsLoading]);

  const handleAddScene = () => {
    const firstAssetPath = userAssets && userAssets.length > 0 ? userAssets[0].path : undefined;
    addScene(firstAssetPath);
  };

  useEffect(() => {
    if (!scenes.length && !projectId && hasFetchedAssets && !userAssetsLoading && !initialSceneAdded) {
      handleAddScene();
      setInitialSceneAdded(true);
    }
  }, [scenes.length, projectId, hasFetchedAssets, userAssetsLoading, initialSceneAdded, userAssets, addScene]);
  return (
    <Wrapper>
      {(isSavingDraft || isGenerating || isLoading) && (
        <LoaderWrapper>
          <CircularProgress color="#fff" />
        </LoaderWrapper>
      )}
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
              <Textfield
                variant={TextfieldVariant.noneAdornment}
                placeholder="Enter project title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
              {generationStatus !== "idle" && (
                <StatusBadge status={generationStatus === "in progress" ? "inprogress" : generationStatus}>
                  {generationStatus}
                </StatusBadge>
              )}
              <Button
                buttonTheme={ButtonThemes.Secondary}
                text="Preview"
                onClick={() => setIsPreviewOpen(true)}
                disabled={
                  !(generatedVideoPath || (projectData?.output && projectData?.projectId === Number(projectId)))
                }
              />
              <Button
                buttonTheme={ButtonThemes.Transparent}
                text={isSavingDraft ? <CircularProgress color="#fff" /> : "Save as draft"}
                onClick={handleCreateVideo}
                disabled={isSavingDraft || isGenerating}
              />
              {/* <Button text="Generate" onClick={handleCreateVideo} /> */}
              <Button
                text={isGenerating ? <CircularProgress color="#fff" /> : "Generate"}
                icon={!isGenerating && <CheckIcon />}
                onClick={onGenerate}
                disabled={
                  // Number(projectData?.status) === 2 ||
                  // Number(projectData?.status) === 3 ||
                  generationStatus === "in progress"
                }
                buttonTheme={ButtonThemes.Outline}
                style={{
                  height: "40px",
                  padding: "0 14px",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                  borderRadius: "8px",
                  width: "auto",
                  minWidth: "100px",
                }}
              />
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
                  addScene={handleAddScene}
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
            {generatedVideoPath || (projectData?.output && projectData?.projectId === Number(projectId)) ? (
              <video width="100%" controls autoPlay key={generatedVideoPath || projectData?.output}>
                <source
                  src={
                    generatedVideoPath
                      ? `${process.env.REACT_APP_API_BASE_URL}/${generatedVideoPath}`
                      : `${process.env.REACT_APP_MEDIA_BASE_URL}/${projectData?.output}`
                  }
                  type="video/mp4"
                />
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
  width: auto;
  gap: 24px;

  & > button {
    width: fit-content;
    padding: 0 16px;
    justify-content: flex-start;
  }

  & > div {
    min-width: 300px;
    width: 100%;

    input {
      border-radius: 12px;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  height: 100%;
  min-width: 0;
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
  min-width: 0;

  & > div:first-of-type {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    min-width: 0;
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

const StatusBadge = styled.div<{ status?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  border-radius: 999px;
  font-family: "Montserrat", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
  white-space: nowrap;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  text-transform: capitalize;

  background: ${({ status }) => {
    switch (status) {
      case "pending":
        return "rgba(255, 159, 10, 0.12)";
      case "inprogress":
        return "rgba(0, 122, 255, 0.12)";
      case "completed":
        return "rgba(52, 199, 89, 0.12)";
      default:
        return "rgba(140,140,140,0.12)";
    }
  }};

  color: ${({ status }) => {
    switch (status) {
      case "pending":
        return "#FF9F0A";
      case "inprogress":
        return "#007AFF";
      case "completed":
        return "#34C759";
      default:
        return "#999999";
    }
  }};

  border-color: ${({ status }) => {
    switch (status) {
      case "pending":
        return "rgba(255, 159, 10, 0.25)";
      case "inprogress":
        return "rgba(0, 122, 255, 0.25)";
      case "completed":
        return "rgba(52, 199, 89, 0.25)";
      default:
        return "rgba(140,140,140,0.2)";
    }
  }};
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.primaryBackground};
  z-index: 9999;
`;

const FullPageLoader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 10, 12, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

export default AIHumansPage;
