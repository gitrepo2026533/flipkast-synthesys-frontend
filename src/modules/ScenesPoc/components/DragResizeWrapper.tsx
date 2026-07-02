import React from "react";
import { Position, ResizableDelta, Rnd } from "react-rnd";

import { removePx } from "../../../lib/stylesHelper";

import { ObjectTypes, ResizeDragObj } from "../../../types/scene";

interface Props {
  index: number;
  activeObjectId: number;
  children: React.ReactNode;
  objType: ObjectTypes;
  lockRatio?: boolean;
  dragHandleClassName?: string;
  editableTextId: number;
  updatePosition: (position: Position, id: number, objType: ObjectTypes) => void;
  updateSize: (size: { width: string | number; height: string | number }, id: number, objType: ObjectTypes) => void;
  handleChangeActiveObject: (id: number) => void;
  scale?: number;
}

const DragResizeWrapper = ({
  index,
  id,
  position,
  size,
  activeObjectId,
  children,
  objType,
  lockRatio,
  dragHandleClassName,
  editableTextId,
  updatePosition,
  updateSize,
  handleChangeActiveObject,
  scale,
}: ResizeDragObj & Props) => (
  <Rnd
    scale={scale || 1}
    onClick={(event: any) => event.stopPropagation()}
    dragHandleClassName={dragHandleClassName}
    default={{
      ...position,
      ...size,
    }}
    onDragStop={(e, d) => {
      updatePosition({ x: d.x, y: d.y }, id, objType);
    }}
    onDrag={() => {
      handleChangeActiveObject(NaN);
    }}
    onResize={(e, direction, ref) => {
      updateSize({ width: +removePx(ref.style.width), height: +removePx(ref.style.height) }, id, objType);
    }}
    size={size}
    position={position}
    bounds="parent"
    enableResizing={activeObjectId === id && editableTextId !== id}
    disableDragging={editableTextId === id}
    style={{ zIndex: index }}
    lockAspectRatio={lockRatio}
    maxWidth="100%"
    maxHeight="100%"
  >
    {children}
  </Rnd>
);

export default DragResizeWrapper;
