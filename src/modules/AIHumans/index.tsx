import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Button, { ButtonThemes } from "../../components/Button/Button";
import IconButton, { IconButtonThemes } from "../../components/Button/IconButton";
import { ArrowRight, DesktopIcon, SquareIcon, ThreeSectionLayout } from "../../components/Icons/Icons";
import { MobileIcon } from "../../components/Icons/MobileIcon";
import ProfileHumanSidebar from "./components/ProfileHumanSidebar";
import DashboardLayout from "../../layouts/DashboardLayout";
import { featuresSettings, sidebar } from "../../mocks/humans";
import { getActorsServer } from "../../redux/actions/actorActions";
import { getActorsList } from "../../redux/reducers/actorReducer";
import { ProfileHumanSidebarType } from "../../types/human";
import { Paragraphs } from "../../types/project";
import SoundFeaturesSettingsCard from "./components/SoundFeaturesSettingsCard";
import Timeline from "./components/Timeline";
import { useVideoEditor } from "../../hooks/useVideoEditor";
import Scene from "../ScenesPoc/components/Scene";
import Sidebar from "./components/Sidebar";
import { IActor } from "../../types/actor";

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
  const dispatch = useDispatch();
  const actorsList = useSelector(getActorsList);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [activeSidebarItem, setActiveSidebarItem] = useState(ProfileHumanSidebarType.Background);

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
  }, []);

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
    scenes,
    currentScene,
    activeSceneId,
  } = useVideoEditor();

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
              />
              <ScreenButton>
                {screens.map(({ id, icon }) => (
                  <IconButton
                    key={id}
                    iconButtonTheme={IconButtonThemes.Rounded}
                    icon={icon}
                    className={active === id ? "active" : "not-active"}
                    onClick={() => handleActive(id)}
                  />
                ))}
              </ScreenButton>
            </Heading>
          }
          navActions={
            <ButtonWrapper>
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
                      {...currentScene}
                    />
                  )}
                </ImageWrapper>
                <SoundFeaturesSettingsCard
                  actors={actorsList}
                  active={actorId}
                  paragraphs={paragraphs}
                  setActorActive={handleActorPopupClick}
                  featuresSettings={featuresSettings}
                  currentParagraphActor={actor || paragraphActor}
                  currentParagraphActorsList={paragraphActorsList || []}
                />
              </div>
              <Timeline
                scenes={scenes}
                activeSceneId={activeSceneId}
                addScene={addScene}
                dublicateScene={dublicateScene}
                handleDeleteScene={handleDeleteScene}
                handleChangeActiveScene={handleChangeActiveScene}
                setActiveSidebarItem={setActiveSidebarItem}
              />
            </Right>
          </Content>
        </DashboardLayout>
        <IconButtonWrapper active={leftSidebarOpen}>
          <IconButton icon={<ArrowRight />} onClick={handleLeftSidebarOpen} />
        </IconButtonWrapper>
      </PageWrapper>
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
  height: 100%;
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
