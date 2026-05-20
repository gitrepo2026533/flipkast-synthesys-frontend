import React from "react";
import styled from "styled-components";

import { SceneObject, Text } from "../../../types/scene";

import Chip from "../../../components/Chip/Chip";

import { cutText } from "../../../lib/textUtils";

interface Props {
  objects: SceneObject[];
  activeId: number;
  handleChangeActive: (id: number) => void;
  handleRemoveTextChip: (id: number) => void;
}

const ObjectChips = ({ objects, activeId, handleChangeActive, handleRemoveTextChip }: Props) => {
  // setScenes((scenes) => scenes.map((scene) => (scene.id === currentScene.id ? { ...scene, texts: newObj } : scene)));
  const handleRemove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number) => {
    event.stopPropagation();
    handleRemoveTextChip(id);
  };
  return (
    <ChipsWrapper>
      {objects.map(({ object: obj }) => (
        <ChipWrapper key={obj.id} active={obj.id === activeId}>
          <Chip
            onRemove={() => handleChangeActive(obj.id)}
            onClose={(event) => handleRemove(event, obj.id)}
            title={cutText((obj as Text).text)}
          />
        </ChipWrapper>
      ))}
    </ChipsWrapper>
  );
};

const ChipsWrapper = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  width: 100%;
`;

const ChipWrapper = styled.div<{ active: boolean }>`
  & span {
    ${({ active, theme }) =>
      active
        ? `background: ${theme.button};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;`
        : `color: ${theme.primaryText}66;`}
  }

  & > div {
    cursor: pointer;
    ${({ active }) => (!active ? "border: none" : "")}
  }

  & svg path {
    fill: #9a9b9e;
  }
`;

export default ObjectChips;
