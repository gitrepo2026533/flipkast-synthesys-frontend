import React from "react";
import { Position, ResizableDelta } from "react-rnd";
import styled from "styled-components";
import DragResizeFrame from "../../../components/Frame/Frame";
import { ObjectTypes, ResizeDragObj } from "../../../types/scene";
import DragResizeWrapper from "./DragResizeWrapper";

interface Props {
  index: number;
  obj: ResizeDragObj;
  activeObjectId: number;
  objectType: ObjectTypes;
  dragHandleClassName?: string;
  editableTextId: number;
  updatePosition: (position: Position, id: number, objType: ObjectTypes) => void;
  updateSize: (size: { width: string | number; height: string | number }, id: number, objType: ObjectTypes) => void;
  handleChangeActiveObject: (id: number) => void;
  children: React.ReactNode;
  scale?: number;
}

const SceneObjectWrapper = ({
  index,
  obj,
  activeObjectId,
  objectType,
  dragHandleClassName,
  editableTextId,
  updateSize,
  updatePosition,
  handleChangeActiveObject,
  children,
  scale,
}: Props) => {
  const handlChangeActive = (event: React.MouseEvent<HTMLElement>, id: number) => {
    event.stopPropagation();
    if (objectType === ObjectTypes.texts) return;
    if (objectType === ObjectTypes.avatars) return;
    handleChangeActiveObject(id);
  };
  return (
    <DragResizeWrapper
      index={index}
      key={obj.id}
      id={obj.id}
      position={obj.position}
      size={obj.size}
      activeObjectId={activeObjectId}
      objType={objectType}
      updatePosition={updatePosition}
      updateSize={updateSize}
      handleChangeActiveObject={handleChangeActiveObject}
      dragHandleClassName={dragHandleClassName}
      editableTextId={editableTextId}
      scale={scale}
    >
      <ObjectWrapper
        onClick={(event) => handlChangeActive(event, obj.id)}
        active={activeObjectId === obj.id && objectType !== ObjectTypes.avatars}
      >
        <DragResizeFrameWrapper
          active={activeObjectId === obj.id && editableTextId !== obj.id && objectType !== ObjectTypes.avatars}
        >
          <DragResizeFrame />
        </DragResizeFrameWrapper>
        {children}
      </ObjectWrapper>
    </DragResizeWrapper>
  );
};

const ObjectWrapper = styled.div<{ active: boolean }>`
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  border: ${({ active }) => (active ? "2px solid #0066ce" : "2px solid transparent")};
`;

const DragResizeFrameWrapper = styled.div<{ active: boolean }>`
  visibility: ${({ active }) => (active ? "visible" : "hidden")};
`;

export default SceneObjectWrapper;
