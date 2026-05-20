import React from "react";
import { Position, ResizableDelta } from "react-rnd";
import styled from "styled-components";

import { BackgroundColor, ObjectTypes, Scene as SceneType } from "../../../types/scene";

import SceneObject from "./SceneObject";
import SceneObjectWrapper from "./SceneObjectWrapper";

interface Props {
  handleInputChange: (value: string, id: number) => void;
  updatePosition: (position: Position, id: number, objType: ObjectTypes) => void;
  updateSize: (size: ResizableDelta, id: number, objType: ObjectTypes) => void;
  handleChangeActiveObject: (id: number) => void;
  setEditableTextId: (id: number) => void;
}

const Scene = ({
  id,
  background,
  activeObjectId,
  objects,
  editableTextId,
  handleInputChange,
  updatePosition,
  updateSize,
  handleChangeActiveObject,
  setEditableTextId,
}: SceneType & Props) => {
  const handleDisactivateObjects = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (activeObjectId === editableTextId) {
      setEditableTextId(NaN);
      return;
    }
    handleChangeActiveObject(NaN);
  };

  return (
    <Wrapper onClick={handleDisactivateObjects} src={background}>
      {objects.map(({ object: obj, type }, index) => (
        <SceneObjectWrapper
          index={index}
          key={obj.id}
          obj={obj}
          objectType={type}
          activeObjectId={activeObjectId}
          updatePosition={updatePosition}
          updateSize={updateSize}
          handleChangeActiveObject={handleChangeActiveObject}
          dragHandleClassName={type === ObjectTypes.texts && activeObjectId !== obj.id ? "text-object" : undefined}
          editableTextId={editableTextId}
        >
          <ObjectWrapper>
            <SceneObject
              object={{ object: obj, type }}
              activeObjectId={activeObjectId}
              editableTextId={editableTextId}
              handleChangeActiveObject={handleChangeActiveObject}
              handleInputChange={handleInputChange}
              setEditableTextId={setEditableTextId}
            />
          </ObjectWrapper>
        </SceneObjectWrapper>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ src: string | BackgroundColor }>`
  user-select: none;
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 20px;
  background-image: url(${({ src }) =>
    !Object.values(BackgroundColor).includes(src as BackgroundColor) ? src : "none"});
  background-color: ${({ src }) => (Object.values(BackgroundColor).includes(src as BackgroundColor) ? src : "none")};
  background-size: cover;
  width: 100%;
  height: 100%;
  padding: 10px;
  margin: 0 auto;

  & .react-resizable-handle {
    bottom: -10px;
    right: -10px;
  }
`;

const ObjectWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

export default Scene;
