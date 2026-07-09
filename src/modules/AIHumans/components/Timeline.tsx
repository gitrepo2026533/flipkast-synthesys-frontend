import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
// ActionMenu/MenuItem not used here
import IconButton, { IconButtonThemes } from "../../../components/Button/IconButton";
import { AnimatedTransitionIcon, PlusIcon } from "../../../components/Icons/Icons";
import { PlayIcon } from "../../../components/Icons/PlayIcon";
import { Popups, updatePopup } from "../../../redux/actions/popupsActions";
import { ProfileHumanSidebarType } from "../../../types/human";
import { BackgroundColor, Scene } from "../../../types/scene";
import SceneActionMenu from "./SceneActionMenu";

interface Props {
  scenes: Scene[];
  activeSceneId?: number;
  addScene: () => void;
  dublicateScene: (id: number) => void;
  handleDeleteScene: (id: number) => void;
  handleChangeActiveScene: (id: number) => void;
  setActiveSidebarItem: (type: ProfileHumanSidebarType) => void;
  orientation?: "vertical" | "horizontal";
  responsive?: boolean;
}

type Orientation = "vertical" | "horizontal";

const Timeline = ({
  scenes,
  activeSceneId,
  addScene,
  dublicateScene,
  handleDeleteScene,
  handleChangeActiveScene,
  setActiveSidebarItem,
  orientation: orientationProp,
  responsive = true,
}: Props) => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState<number>();
  const defaultOrientation = () =>
    typeof window !== "undefined" && window.innerWidth < 720 ? "horizontal" : "vertical";

  const [orientationState, setOrientationState] = useState((orientationProp ?? defaultOrientation()) as Orientation);

  React.useEffect(() => {
    if (!responsive || orientationProp) return;

    const onResize = () => setOrientationState(window.innerWidth < 720 ? "horizontal" : "vertical");
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [responsive, orientationProp]);

  const orientation = (orientationProp ?? orientationState) as Orientation;

  const handleOpenMenu = (id: number) => {
    setMenuOpen(id);
  };

  const handleCloseMenu = () => {
    setMenuOpen(-1);
  };

  const handleAddScene = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    addScene();
  };

  const handleOpenTemplatePopup = () => {
    dispatch(updatePopup({ popup: Popups.templatesPopup, status: true }));
  };

  const handleOpenTransitionTab = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    setActiveSidebarItem(ProfileHumanSidebarType.Transitions);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (orientation === "horizontal") {
      event.currentTarget.scrollLeft += event.deltaY;
    }
  };

  return (
    <Wrapper className={`orientation-${orientation}`} onWheel={handleWheel}>
      <ImagesWrapper className={`orientation-${orientation}`}>
        {scenes.map((scene, index: number) => (
          <ScenesItem
            className={`orientation-${orientation}`}
            isActive={activeSceneId === scene.id}
            src={"/images/mock.png"}
            key={scene.id}
            onClick={() => handleChangeActiveScene(scene.id)}
          >
            <SceneActionMenu
              sceneId={scene.id}
              menuOpen={menuOpen}
              handleCloseMenu={handleCloseMenu}
              handleOpenMenu={handleOpenMenu}
              handleAddScene={handleAddScene}
              dublicateScene={dublicateScene}
              handleDeleteScene={handleDeleteScene}
            />
            <SceneButtonWrapper
              className={`orientation-${orientation} ${index === scenes.length - 1 ? "is-last" : ""}`}
            >
              {index === scenes.length - 1 ? (
                <IconButton onClick={handleAddScene} icon={<PlusIcon />} />
              ) : (
                <IconButton
                  onClick={handleOpenTransitionTab}
                  iconButtonTheme={IconButtonThemes.Secondary}
                  icon={<AnimatedTransitionIcon />}
                />
              )}
            </SceneButtonWrapper>
          </ScenesItem>
        ))}
        {!scenes.length && (
          <EmptyState>
            <IconButton onClick={addScene} icon={<PlusIcon />} />
          </EmptyState>
        )}
        {/* horizontal add button moved to last slide's SceneButtonWrapper */}
      </ImagesWrapper>
      {/* <Bottom className={`orientation-${orientation}`}>
        <TimeLineWrapper className={`orientation-${orientation}`}>
          <IconButton iconButtonTheme={IconButtonThemes.Rounded} icon={<PlayIcon />} />
          <TimeLine>
            {timelineMap.map((time) => (
              <span key={time}>{time}</span>
            ))}
          </TimeLine>
        </TimeLineWrapper>
        <EstimatedTime className={`orientation-${orientation}`}>Estimated time: 00:49</EstimatedTime>
      </Bottom> */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 120px;
  flex-direction: column;
  gap: 16px;
  position: relative;
  max-height: calc(100% - 89px);
  overflow-y: auto;

  &.orientation-horizontal {
    width: 100%;
    flex-direction: row;
    align-items: flex-start;
    height: 140px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  ::-webkit-scrollbar {
    width: 0;
    height: 8px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: ${({ theme }) => theme.activeMenu};
  }

  ::-webkit-scrollbar-track {
    margin: 0 15px;
  }
`;

const ImagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  &.orientation-horizontal {
    flex-direction: row;
    align-items: center;
    padding: 8px;
  }

  img {
    width: 120px;
    height: 70px;
    border-radius: 16px;
  }

  &.orientation-horizontal img {
    width: 160px;
    height: 90px;
  }
`;

const ScenesItem = styled.div<{ src: string | BackgroundColor; isActive: boolean }>`
  width: 120px;
  height: 70px;
  border-radius: 16px;
  flex-shrink: 0;
  background-image: url(${({ src }) =>
    !Object.values(BackgroundColor).includes(src as BackgroundColor) ? src : "none"});
  background-color: ${({ src }) => (Object.values(BackgroundColor).includes(src as BackgroundColor) ? src : "none")};
  background-size: cover;
  position: relative;
  cursor: pointer;
  border: 2px solid ${({ isActive }) => (isActive ? "rgb(0, 154, 247)" : "transparent")};
  &.orientation-horizontal {
    width: 160px;
    height: 90px;
    margin-bottom: 8px;
  }
`;

const SceneButtonWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
  z-index: 10;

  & > button {
    width: 24px;
    height: 24px;
  }

  &.orientation-horizontal.is-last {
    bottom: auto;
    left: auto;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const TimeLineWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;

  button {
    width: 24px;
    height: 24px;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  &.orientation-horizontal {
    margin-top: 0;
    width: auto;
    margin-left: 8px;
  }
`;

const Bottom = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  border-radius: 10px 10px 0 0;
  background: ${({ theme }) => theme.primaryBackground};
  z-index: 10;
  margin-top: auto;

  &.orientation-horizontal {
    width: auto;
    margin-top: auto;
    margin-left: auto; /* pushes to end of row */
  }

  &.orientation-vertical {
    width: 120px;
  }
`;

const TimeLine = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 12px;
  padding: 4px 8px;
  gap: 4px;
  max-width: 92px;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ::-webkit-scrollbar {
    height: 2px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: ${({ theme }) => theme.activeMenu};
  }

  ::-webkit-scrollbar-track {
    margin: 0 15px;
  }

  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.primaryText};
  }
`;

const EstimatedTime = styled.span`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.4;
  width: 97px;
  margin-top: -10px;

  &.orientation-horizontal {
    margin-top: 0;
    width: auto;
    margin-left: 8px;
  }
`;

const EmptyState = styled.div`
  width: 100%;
  min-height: 90px;

  display: flex;
  align-items: center;
  justify-content: center;

  button {
    width: 32px;
    height: 32px;
  }
`;

const timelineMap = [
  "00:00",
  "00:10",
  "00:20",
  "00:30",
  "00:40",
  "00:50",
  "01:00",
  "01:10",
  "01:20",
  "01:30",
  "01:40",
  "01:50",
  "02:00",
  "02:10",
  "02:20",
  "02:30",
];

export default Timeline;
