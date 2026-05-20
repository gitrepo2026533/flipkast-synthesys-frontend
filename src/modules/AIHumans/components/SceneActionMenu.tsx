import React from "react";
import styled from "styled-components";

import ActionMenu from "../../../components/ActionMenu/ActionMenu";
import MenuItem from "../../../components/ActionMenu/MenuItem";
import IconButton, { IconButtonThemes } from "../../../components/Button/IconButton";
import { OptionsIcon } from "../../../components/Icons/Icons";

interface Props {
  menuOpen?: number;
  sceneId: number;
  handleCloseMenu: () => void;
  handleOpenMenu: (sceneId: number) => void;
  handleAddScene: (event: React.MouseEvent<HTMLElement>) => void;
  dublicateScene: (sceneId: number) => void;
  handleDeleteScene: (sceneId: number) => void;
}

const SceneActionMenu = ({
  menuOpen,
  sceneId,
  handleCloseMenu,
  handleOpenMenu,
  handleAddScene,
  dublicateScene,
  handleDeleteScene,
}: Props) => (
  <ActionMenu
    position={{
      x: "right",
      y: "bottom",
    }}
    open={menuOpen === sceneId}
    handleClose={handleCloseMenu}
    trigger={
      <MenuButtonWrapper>
        <IconButton
          iconButtonTheme={IconButtonThemes.Primary}
          icon={<OptionsIcon />}
          onClick={() => handleOpenMenu(sceneId)}
        />
      </MenuButtonWrapper>
    }
  >
    <MenuWrapper>
      <MenuItem onClick={handleAddScene}>Add Scene</MenuItem>
      <MenuItem onClick={() => dublicateScene(sceneId)}>Duplicate</MenuItem>
      <MenuItem onClick={() => handleDeleteScene(sceneId)}>Delete</MenuItem>
    </MenuWrapper>
  </ActionMenu>
);

const MenuButtonWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;

  & > button {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    border: none;
  }
`;

const MenuWrapper = styled.div`
  width: 115px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

export default SceneActionMenu;
