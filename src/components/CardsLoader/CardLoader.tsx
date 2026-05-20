import React from "react";
import styled from "styled-components";
import IconButton, { IconButtonThemes } from "../Button/IconButton";
import { PlayIcon, LikeActiveIcon, LikeIcon } from "../Icons/Icons";

const CardLoader = () => {
  return (
    <Wrapper>
      <Content>
        <Actions>
          <LikeIconWrapper>
            <LikeIcon />
          </LikeIconWrapper>
          <Flag>
            <div />
          </Flag>
        </Actions>
        <ImageWrapper>
          <div />
        </ImageWrapper>
        <Name />
        <ProgressWrapper>
          <IconButtonWrapper>
            <IconButton iconButtonTheme={IconButtonThemes.Rounded} icon={<PlayIcon />} />
          </IconButtonWrapper>
          <ProgressBar />
        </ProgressWrapper>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border-radius: 16px;
  padding-left: 4px;
  padding-right: 4px;
  margin-bottom: 8px;
  overflow: hidden;
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

const Content = styled.div`
  padding: 10px 12px 20px 12px;
  width: 100%;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.characterCardShadow};
  border-radius: 16px;

  @media (max-height: 720px) {
    padding: 8px 10px 16px 10px;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LikeIconWrapper = styled.div``;

const Flag = styled.div`
  & > div {
    width: 16px;
    height: 12px;
    border-radius: 2px;
    background: ${({ theme }) => theme.disableIcon}33;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  & > div {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background: ${({ theme }) => theme.disableIcon}33;
  }

  @media (max-height: 720px) {
    & > div {
      width: 48px;
      height: 48px;
    }
  }
`;

const Name = styled.div`
  max-width: 160px;
  width: 50%;
  height: 16px;
  background: ${({ theme }) => theme.disableIcon}33;
  margin: 8px auto 16px auto;
  border-radius: 3px;
  color: ${({ theme }) => theme.primaryText};

  @media (max-height: 720px) {
    margin: 8px auto 10px;
  }
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
  z-index: 2;

  button {
    width: 20px;
    height: 20px;
    background: ${({ theme }) => theme.disableIcon}33;

    svg {
      width: 12px;
      height: 12px;
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

  :after {
    content: "";
    position: absolute;
    background: ${({ theme }) => theme.disableIcon}33;
    box-shadow: ${({ theme }) => theme.iconButtonShadow};
    border-radius: 52px;
    height: 4px;
    width: 50%;
    left: 0;
    top: 0;
  }
`;

export default CardLoader;
