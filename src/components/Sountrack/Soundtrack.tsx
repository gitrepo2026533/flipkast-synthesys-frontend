import React from "react";
import styled from "styled-components";
import useAudioPlayer from "../../hooks/useAudioPlayer";

import Button, { ButtonThemes } from "../Button/Button";
import IconButton, { IconButtonThemes } from "../Button/IconButton";
import { PauseIcon, PlayIcon, TrashIcon } from "../Icons/Icons";
import { formatNumberToDuration } from "../../lib/formatDuration";

interface Props {
  title: string;
  active?: boolean;
  soundtrack: string;
  onClick: () => void;
  variant?: "aiHumans" | "addVoiceAudioPopup";
  actionClick?: () => void;
}

const Soundtrack = ({ title, active, soundtrack, onClick, variant = "aiHumans", actionClick }: Props) => {
  const { audioPlayer, currentTime, duration, playing, onPlaying, setPlaying, toggleAudioPlay, onLoadedMetadata } =
    useAudioPlayer();

  const handleClick = () => {
    onClick();
    if (playing) {
      if (!active) setPlaying(false);
      else setPlaying(false);
    } else {
      if (!active) setPlaying(true);
      else setPlaying(true);
    }
  };

  return (
    <Wrapper>
      {active && (
        <audio src={soundtrack} ref={audioPlayer} onTimeUpdate={onPlaying} onLoadedMetadata={onLoadedMetadata}>
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      )}
      <IconButtonWrapper>
        <IconButton
          iconButtonTheme={IconButtonThemes.Rounded}
          icon={!playing || currentTime === duration || !active ? <PlayIcon /> : <PauseIcon />}
          onClick={handleClick}
        />
      </IconButtonWrapper>
      <TitleWrapper>
        <span>{title}</span>
        <span>{formatNumberToDuration(duration)}</span>
      </TitleWrapper>
      <ButtonWrapper variant={variant}>
        {variant === "aiHumans" ? (
          <Button buttonTheme={ButtonThemes.Outline} text="Select" />
        ) : (
          <Button text="Delete" icon={<TrashIcon />} buttonTheme={ButtonThemes.Transparent} onClick={actionClick} />
        )}
      </ButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const IconButtonWrapper = styled.div`
  button {
    width: 32px;
    height: 32px;

    svg {
      width: 20px;
      height: 20px;
      transform: translate(2px, 0.5px);
    }
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 9px;

  span:first-of-type {
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: ${({ theme }) => theme.primaryText};
  }

  span:last-of-type {
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.primaryText};
    opacity: 0.4;
  }
`;

const ButtonWrapper = styled.div<{ variant?: string }>`
  margin-left: auto;

  button {
    width: 88px;
    height: 36px;
    box-shadow: none;

    span {
      font-family: "Montserrat", sans-serif;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: -0.41px;
      background: ${({ theme }) => theme.button};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  }

  ${({ variant }) =>
    variant === "addVoiceAudioPopup" &&
    `
    button {
      gap: 8px;

      span {
        font-weight: 600;
        background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }

      svg {
        display: flex;

        & > path {
          fill: url("#paint0_linear_2305_10104");
        }
      }
    }
  `}
`;

export default Soundtrack;
