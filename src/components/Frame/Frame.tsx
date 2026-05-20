import React from "react";
import styled from "styled-components";

import { FrameCircle } from "../Icons/Icons";

enum FrameCirclePosOptions {
  topLeft = "topLeft",
  topCenter = "top",
  topRight = "topRight",
  rightCenter = "right",
  bottomRight = "bottomRight",
  bottomCenter = "bottom",
  bottomLeft = "bottomLeft",
  leftCenter = "left",
}

const DragResizeFrame = () => (
  <>
    {Object.keys(FrameCirclePosOptions).map((value) => (
      <CircleWrapper key={value} pos={value as FrameCirclePosOptions}>
        <FrameCircle />
      </CircleWrapper>
    ))}
  </>
);

const CircleWrapper = styled.div<{ pos: FrameCirclePosOptions }>`
  position: absolute;
  width: 8px;
  height: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ pos }) => customPosition[pos as keyof typeof customPosition]}
`;

const customPosition = {
  topLeft: `
        top: -5px;
        left: -5px;
    `,
  topCenter: `
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
    `,
  topRight: `
      top: -5px;
      right: -5px;
    `,
  rightCenter: `
      right: -5px;
      top: 50%;
      transform: translateY(-50%);
    `,
  bottomRight: `
      bottom: -5px;
      right: -5px;
    `,
  bottomCenter: `
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
    `,
  bottomLeft: `
      bottom: -5px;
      left: -5px;
    `,
  leftCenter: `
      left: -5px;
      top: 50%;
      transform: translateY(-50%);
    `,
};

export default DragResizeFrame;
