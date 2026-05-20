import React from "react";
import styled from "styled-components";
import {
  BlurIcon,
  CloseTransitionIcon,
  CropIcon,
  FadeIcon,
  OpenIcon,
  SlideIcon,
  SmoothIcon,
  WipeIcon,
} from "../Icons/Icons";

interface Props {
  data: {
    id: number;
    transitionName: string;
  }[];
}

const TransitionSidebar = ({ data }: Props) => {
  return (
    <Wrapper>
      <Content>
        {data.map(({ id, transitionName }) => (
          <Item key={id}>
            <Transition transitionName={transitionName} />
            <span>{transitionName}</span>
          </Item>
        ))}
      </Content>
    </Wrapper>
  );
};

const Transition = ({ transitionName }: any): any => {
  switch (transitionName) {
    case "Fade":
      return <FadeIcon />;
    case "Close":
      return <CloseTransitionIcon />;
    case "Crop":
      return <CropIcon />;
    case "Blur":
      return <BlurIcon />;
    case "Open":
      return <OpenIcon />;
    case "Slide":
      return <SlideIcon />;
    case "Wipe":
      return <WipeIcon />;
    case "Smooth":
      return <SmoothIcon />;
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

export default TransitionSidebar;
