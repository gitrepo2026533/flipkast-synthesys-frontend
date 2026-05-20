import React from "react";
import styled, { useTheme } from "styled-components";
import { getFullImageUrl } from "../../lib/getFullImageUrl";
import { IActor } from "../../types/actor";
import Tooltip from "../Tooltip/Tooltip";

interface Props {
  actor: IActor;
  active?: boolean;
  onClick?: () => void;
}

const ActorCard = ({ actor, active, onClick }: Props) => {
  const isNew = actor.isNew;
  const hasStyles = (actor?.styles || "").length > 0;
  const isUltraLifeLike = actor.categoryType === "Premium";

  return (
    <Wrapper active={active} onClick={onClick}>
      <IconsRow>
        {isNew && <New active={!!active} />}
        {hasStyles && <Styles active={!!active} />}
        {isUltraLifeLike && <UltraLifeLike active={!!active} />}
      </IconsRow>
      <Content>
        <img src={actor?.photo} alt="" />
        <Name>{actor?.name}</Name>
      </Content>
      <Flag>
        <img src={actor?.flagPath ? getFullImageUrl(actor.flagPath) : "/images/flag.png"} alt="" />
        {/* {actor?.languageName && <Tooltip text={actor.languageName.split(" ")[0]} />} */}
      </Flag>
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
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 600;
  font-size: 7px;
  line-height: 9px;
  color: #ffffff;
  background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
  border: 1.51579px solid #f0f0f3;
  box-shadow: inset -1.89474px -1.89474px 3.78947px rgba(0, 0, 0, 0.1), inset 1.89474px 1.89474px 3.78947px #ffffff;
  border-radius: 2.33198px;
  padding: 2px;

  :hover > div {
    opacity: 1;
    visibility: visible;
    left: 25px;
    top: -3px;
    padding: 3px;
    display: flex;
    align-items: center;
    border-radius: 7px;
    min-width: max-content;

    span {
      font-size: 10px !important;
      line-height: 12px !important;
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
    left: 25px;
    top: -3px;
    padding: 3px;
    display: flex;
    align-items: center;
    border-radius: 7px;
    min-width: 70px;

    span {
      font-size: 10px !important;
      line-height: 12px !important;
    }
  }
`;

const IconsRow = styled.div`
  position: absolute;
  top: 8px;
  left: 12px;
  display: flex;
  flex-direction: column;
  row-gap: 2px;

  @media (max-width: 1000px) {
    display: none;
  }
`;

const Wrapper = styled.div<{ active?: boolean }>`
  width: 114px;
  max-height: 88px;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  z-index: 4;

  ${({ active, theme }) =>
    active &&
    `
    background: ${theme.button};

    span {
      color: ${theme.white};
    }
  `}

  @media (max-width: 1001px) {
    width: auto;
    height: 48px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    border-radius: 52px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;

  & > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  @media (max-width: 1001px) {
    flex-direction: row;
    padding: 4px;
  }
`;

const Name = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.primaryText};
`;

const Flag = styled.div`
  position: absolute;
  top: 8px;
  right: 12px;
  border-radius: 2px;

  img {
    width: 16px;
    height: 12px;
  }

  @media (max-width: 1001px) {
    position: initial;
    padding-right: 18px;
  }

  /* :hover > div {
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
  } */
`;

export default ActorCard;
