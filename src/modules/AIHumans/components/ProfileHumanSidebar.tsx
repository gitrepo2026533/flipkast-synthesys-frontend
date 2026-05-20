import React, { useState } from "react";
import styled from "styled-components";
import { ProfileHumanSidebarType } from "../../../types/human";
import IconButton, { IconButtonThemes } from "../../../components/Button/IconButton";
import {
  CircleIcon,
  ImageIcon,
  LinkIcon,
  MusicIcon,
  ProfileIcon,
  TextIcon,
  Logo,
} from "../../../components/Icons/Icons";

interface Props {
  activeSidebarItem: ProfileHumanSidebarType;
  setActiveSidebarItem: (type: ProfileHumanSidebarType) => void;
}

const humansSidebar = [
  { id: 1, icon: <ProfileIcon />, type: ProfileHumanSidebarType.Humatar },
  { id: 2, icon: <ImageIcon />, type: ProfileHumanSidebarType.Background },
  { id: 3, icon: <TextIcon />, type: ProfileHumanSidebarType.Text },
  { id: 5, icon: <CircleIcon />, type: ProfileHumanSidebarType.Shapes },
  { id: 6, icon: <MusicIcon />, type: ProfileHumanSidebarType.Soundtrack },
  { id: 7, icon: <LinkIcon />, type: ProfileHumanSidebarType.Transitions },
];

const ProfileHumanSidebar = ({ activeSidebarItem, setActiveSidebarItem }: Props) => {
  const handleActive = (type: ProfileHumanSidebarType) => {
    const scrollElement = document.getElementById("pagewrapperid");
    if (scrollElement) {
      scrollElement.scrollTo({ top: 0, behavior: "smooth" });
    }

    setActiveSidebarItem(type);
  };

  return (
    <Wrapper>
      <Content>
        <ImageWrapper>
          <Logo />
        </ImageWrapper>
        <ButtonsWrapper>
          {humansSidebar.map(({ id, icon, type }) => (
            <IconButton
              key={id}
              iconButtonTheme={IconButtonThemes.Rounded}
              icon={icon}
              className={activeSidebarItem !== type ? "not-active" : "active"}
              onClick={() => handleActive(type)}
            />
          ))}
        </ButtonsWrapper>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-width: 60px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const ImageWrapper = styled.div`
  width: 60px;
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  button {
    box-shadow: ${({ theme }) => theme.secondaryCardShadow};
    border-radius: 16px;
    max-width: 60px;
    height: 60px;

    svg {
      width: 32px;
      height: 32px;

      path {
        fill: ${({ theme }) => theme.white};
      }

      g > rect {
        fill: ${({ theme }) => theme.white};
      }
    }

    &.not-active {
      background: ${({ theme }) => theme.secondaryBackground};

      svg {
        path {
          fill: ${({ theme }) => theme.primaryBackground};
        }

        g > rect {
          fill: ${({ theme }) => theme.primaryBackground};
        }
      }
    }
  }
`;

export default ProfileHumanSidebar;
