import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import AvatarCircle from "../../../components/AvatarCircle/AvatarCircle";
import Button, { ButtonThemes } from "../../../components/Button/Button";
import IconButton, { IconButtonThemes } from "../../../components/Button/IconButton";
import { PlayIcon } from "../../../components/Icons/PlayIcon";
import ProgressBar from "../../../components/ProgressBar/ProgressBar";
import { Popups, updatePopup } from "../../../redux/actions/popupsActions";
import { IActor } from "../../../types/actor";
import { FeaturesSettings } from "../../../types/human";
import { Paragraphs } from "../../../types/project";

interface Props {
  featuresSettings: FeaturesSettings;
  paragraphs: Paragraphs[];
  actors: IActor[];
  active?: number;
  setActorActive?: (actor: any) => void;
  currentParagraphActor?: IActor;
  currentParagraphActorsList: IActor[];
}

const SoundFeaturesSettingsCard = ({
  featuresSettings,
  actors,
  active,
  paragraphs,
  setActorActive,
  currentParagraphActor,
  currentParagraphActorsList,
}: Props) => {
  const dispatch = useDispatch();
  const [width, setWidth] = useState<any>([
    { id: 1, num: 0 },
    { id: 2, num: 0 },
  ]);

  const handleChange = (e: any, order: number) => {
    const newWidth = width.find((w: any) => (w.id === order + 1 ? { num: e.target.value } : w));
    // setWidth(newWidth);
  };

  const hanldeOpenCharacterPopup = () => {
    dispatch(
      updatePopup({
        popup: Popups.characterPopup,
        status: true,
        prefilled: {
          actors,
          paragraphs,
          active,
          currentParagraphActor,
          currentParagraphActorsList,
          setActorActive,
        },
      }),
    );
  };

  return (
    <CardWrapper>
      <CardContent>
        <CardHeading>
          <CardHumanInformation>
            <AvatarCircle image={featuresSettings.image} width={33} height={33} />
            <span>{featuresSettings.name}</span>
            <Flag src={featuresSettings.flag} alt="" />
          </CardHumanInformation>
          <Button buttonTheme={ButtonThemes.Transparent} text="See all" onClick={hanldeOpenCharacterPopup} />
        </CardHeading>
        <ProgressBarWrapper>
          {featuresSettings.features.map((feature) => (
            <ProgressBar key={feature.id} title={feature.title} values={feature.values} />
          ))}
        </ProgressBarWrapper>
        <ButtonWrapper>
          <Button
            buttonTheme={ButtonThemes.Outline}
            text="Play Script"
            icon={<IconButton iconButtonTheme={IconButtonThemes.Rounded} icon={<PlayIcon />} />}
          />
        </ButtonWrapper>
      </CardContent>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 12px;
  width: 253px;
  flex-shrink: 0;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 4px;
`;

const CardHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;

  button {
    width: auto;
    display: flex;
    justify-content: flex-end;
    background: ${({ theme }) => theme.button};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;

    span {
      font-weight: 600;
      font-size: 14px;
      line-height: 24px;
    }
  }
`;

const CardHumanInformation = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    margin-left: 4px;
    font-family: "Montserrat", sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: ${({ theme }) => theme.primaryText};
    opacity: 0.6;
  }
`;

const Flag = styled.img`
  width: 16px;
  height: 12px;
  border-radius: 2px;
`;

const ButtonWrapper = styled.div`
  margin-top: 26px;

  button {
    height: 36px;
    gap: 8px;

    button {
      width: 20px;
      height: 20px;

      svg {
        width: 14px;
        height: 14px;
        transform: translateX(1px);
      }
    }

    span {
      font-size: 14px;
      background: ${({ theme }) => theme.button};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  }
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 23px;
`;

export default SoundFeaturesSettingsCard;
