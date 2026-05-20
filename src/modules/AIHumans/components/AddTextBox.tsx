import React from "react";
import styled from "styled-components";
import IconButton, { IconButtonThemes } from "../../../components/Button/IconButton";
import { PlusIcon } from "../../../components/Icons/PlusIcon";

const AddTextBox = () => {
  return (
    <Wrapper>
      <Content>
        <TextActionWrapper variant="title">
          <span>Add title</span>
          <IconButton iconButtonTheme={IconButtonThemes.Rounded} icon={<PlusIcon />} />
        </TextActionWrapper>
        <TextActionWrapper variant="subtitle">
          <span>Add subtitle</span>
          <IconButton iconButtonTheme={IconButtonThemes.Rounded} icon={<PlusIcon />} />
        </TextActionWrapper>
        <TextActionWrapper variant="body text">
          <span>Add body text</span>
          <IconButton iconButtonTheme={IconButtonThemes.Rounded} icon={<PlusIcon />} />
        </TextActionWrapper>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.activeMenu};
  padding: 16px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TextActionWrapper = styled.div<{ variant?: "title" | "subtitle" | "body text" }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    background: ${({ theme }) => theme.button};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }

  button {
    width: 20px;
    height: 20px;

    svg {
      width: 7px;
      height: 7px;
    }
  }

  ${({ variant }) =>
    variant === "subtitle" &&
    `
      span {
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
      }
    `};

  ${({ variant }) =>
    variant === "body text" &&
    `
      span {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
      }
    `};
`;

export default AddTextBox;
