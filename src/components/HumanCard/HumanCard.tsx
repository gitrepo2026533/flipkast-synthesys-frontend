import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ActionMenu from "../ActionMenu/ActionMenu";
import MenuItem from "../ActionMenu/MenuItem";
import Button from "../Button/Button";
import IconButton, { IconButtonThemes } from "../Button/IconButton";
import { DownloadIcon } from "../Icons/DownloadIcon";
import { DropdownDelete } from "../Icons/DropdownDelete";
import { DuplicateIcon } from "../Icons/DuplicateIcon";
import { EditIcon } from "../Icons/EditIcon";
import { LikeActiveIcon, LikeIcon } from "../Icons/LikeIcon";
import { LinkIcon } from "../Icons/LinkIcon";
import { OptionsIcon } from "../Icons/OptionsIcon";
import { PlayIcon } from "../Icons/PlayIcon";

interface Props {
  id: number;
  parent: React.RefObject<HTMLDivElement>;
  imageSrc: string;
  flagSrc: string;
  name: string;
  active: boolean;
  handleActiveChange: (id: number) => void;
}

const HumanCard = ({ id, parent, imageSrc, flagSrc, name, active, handleActiveChange }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bottomDistance, setBottomDistance] = useState<number>();
  const [leftDistance, setLeftDistance] = useState<number>();

  const buttonRef = useRef<HTMLDivElement>(null);

  const handleOpenMenu = () => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const setMenuPosition = () => {
      if (parent.current && buttonRef.current) {
        const { bottom: bottomParent, left: leftParent } = parent.current.getBoundingClientRect();
        const { bottom: bottomButton, left: leftButton } = buttonRef.current.getBoundingClientRect();
        setBottomDistance(bottomParent - bottomButton);
        setLeftDistance(leftButton - leftParent);
      }
    };
    setMenuPosition();
    parent.current?.addEventListener("scroll", setMenuPosition);

    return () => parent?.current?.removeEventListener("scroll", setMenuPosition);
  }, [parent]);

  return (
    <Wrapper src={imageSrc}>
      <LikeIconWrapper active={active} onClick={() => handleActiveChange(id)}>
        {active ? <LikeActiveIcon /> : <LikeIcon />}
      </LikeIconWrapper>
      <FlagMobileWrapper>
        <Flag>
          <img src={flagSrc} alt="" />
        </Flag>
      </FlagMobileWrapper>
      <Bottom>
        <HumanInfo>
          <Name>{name}</Name>
          <FlagDesktopWrapper>
            <Flag>
              <img src={flagSrc} alt="" />
            </Flag>
          </FlagDesktopWrapper>
        </HumanInfo>
        <Actions>
          {/* <ActionMenu
            position={{
              x: leftDistance && leftDistance > 200 ? "left" : "right",
              y: bottomDistance && bottomDistance > 150 ? "bottom" : "top",
            }}
            open={menuOpen}
            handleClose={handleCloseMenu}
            trigger={ */}
          <IconButtonWrapper ref={buttonRef}>
            <IconButton iconButtonTheme={IconButtonThemes.Rounded} icon={<OptionsIcon />} onClick={handleOpenMenu} />
          </IconButtonWrapper>
          {/* }
          >
            <MenuWrapper>
              <MenuItem icon={<DownloadIcon />}>Download</MenuItem>
              <MenuItem icon={<EditIcon />}>Edit</MenuItem>
              <MenuItem icon={<DuplicateIcon />}>Duplicate</MenuItem>
              <MenuItem icon={<DropdownDelete />}>Delete (auto-delete in 5 days)</MenuItem>
              <MenuItem icon={<LinkIcon />}>Copy sharable link</MenuItem>
            </MenuWrapper>
          </ActionMenu> */}
          <IconButtonWrapper>
            <IconButton iconButtonTheme={IconButtonThemes.Rounded} icon={<PlayIcon />} />
          </IconButtonWrapper>
        </Actions>
      </Bottom>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ src: string }>`
  background-image: url(${({ src }) => src});
  background-position: center;
  background-size: cover;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  margin: 0 8px 8px 0;
  max-width: 216px;
  height: 220px;
  box-shadow: ${({ theme }) => theme.cardShadow};

  @media (max-width: 516px) {
    height: 136px;
    width: 100%;
  }
`;

const LikeIconWrapper = styled.div<{ active: boolean }>`
  cursor: pointer;
  position: absolute;
  top: 13px;
  left: 13px;

  ${({ active, theme }) =>
    !active &&
    `
      & > svg > path {
        fill: ${theme.icon};
      }
    `}
`;

const FlagMobileWrapper = styled.div`
  position: absolute;
  top: 13px;
  right: 13px;

  @media (min-width: 416px) {
    display: none;
  }
`;

const FlagDesktopWrapper = styled.div`
  @media (max-width: 415px) {
    display: none;
  }
`;

const Bottom = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 52px;
  background: ${({ theme }) => theme.humanCardBackground};
  padding: 20px 12px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 16px 16px;
`;

const HumanInfo = styled.div`
  display: flex;
  column-gap: 8px;
  align-items: center;
`;

const Name = styled.p`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.primaryText};
`;

const Flag = styled.div`
  & > img {
    width: 16px;
    height: 12px;
    border-radius: 2px;
  }
`;

const Actions = styled.div`
  display: flex;
  column-gap: 8px;
`;

const IconButtonWrapper = styled.div`
  button {
    width: 20px;
    height: 20px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const MenuWrapper = styled.div`
  min-width: 260px;
  display: flex;
  flex-direction: column;
  row-gap: 8px;

  @media (max-width: 540px) {
    min-width: 144px;
  }
`;

export default HumanCard;
