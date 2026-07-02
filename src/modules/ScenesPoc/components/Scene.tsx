import React from "react";
import { Position, ResizableDelta } from "react-rnd";
import styled from "styled-components";

import { BackgroundColor, ObjectTypes, Scene as SceneType } from "../../../types/scene";

import SceneObject from "./SceneObject";
import SceneObjectWrapper from "./SceneObjectWrapper";

interface Props {
  handleInputChange: (value: string, id: number) => void;
  updatePosition: (position: Position, id: number, objType: ObjectTypes) => void;
  updateSize: (size: { width: string | number; height: string | number }, id: number, objType: ObjectTypes) => void;
  handleChangeActiveObject: (id: number) => void;
  setEditableTextId: (id: number) => void;
  canvasWidth?: number;
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
  canvasWidth,
}: SceneType & Props) => {
  const [scale, setScale] = React.useState(1);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!wrapperRef.current || !canvasWidth) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const scaleX = entry.contentRect.width / canvasWidth;
        const scaleY = entry.contentRect.height / (canvasWidth * (9 / 16));
        // Fit within the container by choosing the smallest scale
        setScale(Math.min(scaleX, scaleY));
      }
    });
    if (wrapperRef.current.parentElement) {
      observer.observe(wrapperRef.current.parentElement);
    }
    return () => observer.disconnect();
  }, [canvasWidth]);

  const handleDisactivateObjects = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (activeObjectId === editableTextId) {
      setEditableTextId(NaN);
      return;
    }
    handleChangeActiveObject(NaN);
  };

  return (
    <Wrapper
      ref={wrapperRef}
      onClick={handleDisactivateObjects}
      src={background}
      canvasWidth={canvasWidth}
      scale={scale}
    >
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
          scale={scale}
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

const Wrapper = styled.div<{ src: string | BackgroundColor; canvasWidth?: number; scale?: number }>`
  user-select: none;
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 20px;
  background-image: url(${({ src }) =>
    !Object.values(BackgroundColor).includes(src as BackgroundColor) ? src : "none"});
  background-color: ${({ src }) => (Object.values(BackgroundColor).includes(src as BackgroundColor) ? src : "none")};
  background-size: cover;
  background-position: center;

  position: absolute;
  top: 50%;
  left: 50%;

  /* Virtual canvas dimensions */
  width: ${({ canvasWidth }) => (canvasWidth ? `${canvasWidth}px` : "100%")};
  height: ${({ canvasWidth }) => (canvasWidth ? `${canvasWidth * (9 / 16)}px` : "100%")};

  /* Visually scale to fit the parent container */
  transform: translate(-50%, -50%) ${({ scale }) => (scale ? `scale(${scale})` : "none")};
  transform-origin: center center;

  padding: 10px;
  overflow: hidden;

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
