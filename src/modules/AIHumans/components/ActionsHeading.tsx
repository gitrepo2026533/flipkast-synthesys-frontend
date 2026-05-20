import React, { ReactNode } from "react";
import styled from "styled-components";
import Button, { ButtonThemes } from "../../../components/Button/Button";
import IconButton, { IconButtonThemes } from "../../../components/Button/IconButton";

interface Props {
  screens: {
    id: number;
    icon: ReactNode;
  }[];
  activeScreen: number;
  handleActiveScreen: (id: number) => void;
}

const ActionsHeading = ({ screens, activeScreen, handleActiveScreen }: Props) => {
  return (
    <Wrapper>
      <ButtonWrapper>
        <Button buttonTheme={ButtonThemes.Transparent} text="Save as draft" />
        <Button text="Create Video" />
      </ButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
`;

const IconButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 50%;

  button {
    box-shadow: ${({ theme }) => theme.secondaryButtonShadow};
    background: ${({ theme }) => theme.primaryBackground};
    border-radius: 12px;
    max-width: 48px;
    height: 48px;

    svg {
      width: 24px;
      height: 24px;
    }

    &.active {
      opacity: 0.4;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  width: 50%;
  justify-content: flex-end;

  button {
    max-width: 152px;
  }

  button:first-of-type {
    display: flex;
    justify-content: flex-end;
    background: ${({ theme }) => theme.button};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;

    span {
      font-weight: 600;
      font-size: 14px;
      line-height: 24px;
    }
  }
`;

export default ActionsHeading;
