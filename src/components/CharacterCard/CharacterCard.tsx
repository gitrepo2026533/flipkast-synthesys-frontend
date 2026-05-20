import React from "react";
import styled from "styled-components";
import useAudioPlayer from "../../hooks/useAudioPlayer";
import { IActor } from "../../types/actor";
import IconButton, { IconButtonThemes } from "../Button/IconButton";
import { PlayIcon, LikeActiveIcon, LikeIcon, PauseIcon } from "../Icons/Icons";
import Tooltip from "../Tooltip/Tooltip";

interface Props {
  actor: IActor;
  flag?: string;
  name?: string;
  languageName?: string;
  audioSampleLink?: string;
  photo?: string;
  active?: boolean;
  activePlaying: boolean;
  isBookmarked?: boolean;
  handleActive?: () => void;
  handleActivePlaying: () => void;
  handleBookmarked?: (e: any) => void;
}

const CharacterCard = ({
  flag,
  actor,
  languageName,
  name,
  audioSampleLink,
  photo,
  active,
  activePlaying,
  isBookmarked,
  handleActive,
  handleActivePlaying,
  handleBookmarked,
}: Props) => {
  const isNew = actor.isNew;
  const hasStyles = (actor?.styles || "").length > 0;
  const isUltraLifeLike = actor.categoryType === "Premium";

  const {
    audioPlayer,
    currentTime,
    duration,
    seekValue,
    playing,
    setPlaying,
    onPlaying,
    toggleAudioPlay,
    handleProgressBarChange,
    onLoadedMetadata,
  } = useAudioPlayer();

  const handleClick = (e: any) => {
    e.stopPropagation();

    handleActivePlaying();

    if (playing) {
      if (!activePlaying) setPlaying(false);
      else setPlaying(false);
    } else {
      if (!activePlaying) setPlaying(true);
      else setPlaying(true);
    }
  };

  return (
    <Wrapper>
      {activePlaying && (
        <audio src={audioSampleLink} ref={audioPlayer} onTimeUpdate={onPlaying} onLoadedMetadata={onLoadedMetadata} />
      )}
      <Content active={active} onClick={handleActive}>
        <Actions>
          <LikeIconWrapper onClick={handleBookmarked}>
            {!isBookmarked ? <LikeIcon /> : <LikeActiveIcon />}
          </LikeIconWrapper>
          <Flag>
            <img src={flag} alt="" />
            {languageName && <Tooltip text={languageName} />}
          </Flag>
          <IconsRow>
            {isNew && <New active={!!active} />}
            {hasStyles && <Styles active={!!active} />}
            {isUltraLifeLike && <UltraLifeLike active={!!active} />}
          </IconsRow>
        </Actions>
        <ImageWrapper>
          <img src={photo} />
        </ImageWrapper>
        <Name>{name}</Name>
        {audioSampleLink && (
          <ProgressWrapper>
            <IconButtonWrapper>
              <IconButton
                className="icon-button"
                iconButtonTheme={IconButtonThemes.Rounded}
                icon={!playing || currentTime === duration || !activePlaying ? <PlayIcon /> : <PauseIcon />}
                onClick={handleClick}
              />
            </IconButtonWrapper>
            <ProgressBar>
              <ProgressBarLine
                type="range"
                min="0"
                max="100"
                step="1"
                value={seekValue || 0}
                width={seekValue || 0}
                onChange={handleProgressBarChange}
              />
            </ProgressBar>
          </ProgressWrapper>
        )}
      </Content>
    </Wrapper>
  );
};

const New = ({ active }: { active: boolean }) => {
  return (
    <NewWrapper active={active}>
      New
      <Tooltip text="New voice" />
    </NewWrapper>
  );
};

const NewWrapper = styled.div<{ active: boolean }>`
  position: relative;
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 600;
  font-size: 7px;
  line-height: 9px;
  color: #ffffff;
  background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
  border: 1px solid #f0f0f3;
  box-shadow: inset -1.89474px -1.89474px 3.78947px rgba(0, 0, 0, 0.1), inset 1.89474px 1.89474px 3.78947px #ffffff;
  border-radius: 5px;
  padding: 2px;

  :hover > div {
    opacity: 1;
    visibility: visible;
    right: 25px;
    top: -8px;
    padding: 6px 12px;
    min-width: max-content;

    span {
      font-size: 12px !important;
      line-height: 16px !important;
    }
  }

  ${({ active }) =>
    active &&
    `
    background: linear-gradient(142.13deg, #0063B4 16.78%, #009AF7 85.53%);
    border: 1px solid #F0F0F3;
    box-shadow: inset -1.89474px -1.89474px 3.78947px rgba(0, 0, 0, 0.1), inset 1.89474px 1.89474px 3.78947px #FFFFFF;
    border-radius: 2.33198px;
    color: #FFFFFF;
  `}
`;

const Styles = ({ active }: { active: boolean }) => {
  const path = active ? "/images/actors/emotion-active.svg" : "/images/actors/emotion.svg";
  return (
    <TooltipWrapper>
      <img src={path} />
      <Tooltip text="Speaking styles" />
    </TooltipWrapper>
  );
};

const UltraLifeLike = ({ active }: { active: boolean }) => {
  const path = !active ? "/images/actors/ultra-life-like.svg" : "/images/actors/ultra-life-like-active.svg";

  return (
    <TooltipWrapper>
      <img src={path} />
      <Tooltip text="Ultra lifelike voice" />
    </TooltipWrapper>
  );
};

const TooltipWrapper = styled.div`
  position: relative;

  :hover > div {
    opacity: 1;
    visibility: visible;
    right: 25px;
    top: -8px;
    padding: 6px 12px;
    min-width: max-content;

    span {
      font-size: 12px !important;
      line-height: 16px !important;
    }
  }
`;

const IconsRow = styled.div`
  position: absolute;
  top: 37px;
  right: 13px;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const Wrapper = styled.div`
  border-radius: 16px;
  padding-left: 4px;
  padding-right: 4px;
  margin-bottom: 8px;
  position: relative;
  &:last-child {
    margin-bottom: 85px;
  }

  @media (max-height: 740px) {
    &:last-child {
      margin-bottom: 110px;
    }
  }
  @media (max-width: 515px) and (max-height: 760px) {
    &:last-child {
      margin-bottom: 85px;
    }
  }
`;

const Content = styled.div<{ active?: boolean }>`
  padding: 10px 12px 20px 12px;
  width: 100%;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.characterCardShadow};
  border-radius: 16px;
  cursor: pointer;

  ${({ active, theme }) =>
    active &&
    `
    background: ${theme.button};

    h3 {
      color: ${theme.white};
    }

    svg > path {
      fill: ${theme.white};
    }

    .icon-button, .progress-bar, .progress-bar::after {
      box-shadow: none;
    }
  `}
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LikeIconWrapper = styled.div``;

const Flag = styled.div`
  position: relative;

  & > img {
    width: 16px;
    height: 12px;
    border-radius: 2px;
  }

  :hover > div {
    opacity: 1;
    visibility: visible;
    right: 20px;
    top: -8px;
    min-width: 75px;
    max-width: 120px;
    width: auto;
    padding: 6px 12px;

    span {
      font-size: 12px !important;
      line-height: 16px !important;
    }
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  img {
    width: 68px;
    height: 68px;
    border-radius: 50%;
  }

  @media (max-height: 720px) {
    img {
      width: 58px;
      height: 58px;
    }
  }
`;

const Name = styled.h3`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  margin: 8px auto 16px auto;
  color: ${({ theme }) => theme.primaryText};
`;

const ProgressWrapper = styled.div`
  max-width: 160px;
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0 auto;
  position: relative;
`;

const IconButtonWrapper = styled.div`
  position: absolute;
  left: 0;
  z-index: 10;

  button {
    width: 20px;
    height: 20px;

    svg {
      width: 12px;
      height: 12px;
      transform: translateX(1px);
    }
  }
`;

const ProgressBar = styled.div`
  height: 4px;
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.inputShadow};
  border-radius: 60px;
`;

const ProgressBarLine = styled.input<{ width: number }>`
  position: absolute;
  top: 0;
  left: 0;
  background: ${({ theme, width }) => `linear-gradient(to right, ${theme.activeMenu} ${width}%, transparent 0)`};
  box-shadow: ${({ theme }) => theme.iconButtonShadow};
  border-radius: 52px;
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 0px;
    height: 0px;
    cursor: pointer;
  }
`;

export default CharacterCard;
