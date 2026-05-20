import React from "react";
import styled from "styled-components";
import { ShapeTypes } from "../../types/scene";
import {
  RectangleShapeIcon,
  CircleShapeIcon,
  TriangleShapeIcon,
  PolygonShapeIcon,
  StarShapeIcon,
  SquareShapeIcon,
  HeartShapeIcon,
  ArrowShapeIcon,
} from "../Icons/Icons";

interface Props {
  data: {
    id: number;
    shapeName: string;
  }[];
  handleAddShape: (shape: ShapeTypes) => void;
}

const getShape = {
  Circle: ShapeTypes.circle,
  Rectangle: ShapeTypes.rectangle,
  Triangle: ShapeTypes.triangle,
  Polygon: ShapeTypes.polygon,
  Star: ShapeTypes.star,
  Square: ShapeTypes.square,
  Heart: ShapeTypes.heart,
  Arrow: ShapeTypes.arrow,
};

const ShapesSidebar = ({ data, handleAddShape }: Props) => {
  return (
    <Wrapper>
      <Content>
        {data.map(({ id, shapeName }) => (
          <Item key={id} onClick={() => handleAddShape(getShape[shapeName as keyof typeof getShape])}>
            <Shape shapeName={shapeName} />
            <span>{shapeName}</span>
          </Item>
        ))}
      </Content>
    </Wrapper>
  );
};

const Shape = ({ shapeName }: any): any => {
  switch (shapeName) {
    case "Rectangle":
      return <RectangleShapeIcon />;
    case "Circle":
      return <CircleShapeIcon />;
    case "Triangle":
      return <TriangleShapeIcon />;
    case "Polygon":
      return <PolygonShapeIcon />;
    case "Star":
      return <StarShapeIcon />;
    case "Square":
      return <SquareShapeIcon />;
    case "Heart":
      return <HeartShapeIcon />;
    case "Arrow":
      return <ArrowShapeIcon />;
    default:
      break;
  }
};

const Wrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.activeMenu};
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  padding: 16px;
  border-radius: 20px;
  min-height: 150px;
  overflow: hidden auto;
  width: 272px;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: ${({ theme }) => theme.secondaryBackground}f;
  }

  ::-webkit-scrollbar-track {
    margin: 15px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 8px;
`;

const Item = styled.div`
  cursor: pointer;
  padding: 12px;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  width: calc(50% - 4px);

  svg {
    width: 28x;
    height: 28px;
  }

  span {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: ${({ theme }) => theme.primaryText};
  }
`;

export default ShapesSidebar;
