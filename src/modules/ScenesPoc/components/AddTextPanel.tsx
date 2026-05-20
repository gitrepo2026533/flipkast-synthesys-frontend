import React from "react";
import styled from "styled-components";

import IconButton, { IconButtonThemes } from "../../../components/Button/IconButton";
import { PlusIcon } from "../../../components/Icons/Icons";
import { TextTypes } from "../../../types/scene";

interface Props {
  handleAddText: (text: string, type: TextTypes) => void;
}

const AddTextPanel = ({ handleAddText }: Props) => (
  <Wrapper>
    <AddTextsWrapper>
      <Row onClick={() => handleAddText("Title", TextTypes.title)}>
        <AddTitle>Add title</AddTitle>
        <PlusButtonWrapper>
          <IconButton icon={<PlusIcon />} iconButtonTheme={IconButtonThemes.Rounded} />
        </PlusButtonWrapper>
      </Row>
      <Row onClick={() => handleAddText("Subtitle", TextTypes.subtitle)}>
        <AddSubtitle>Add subtitle</AddSubtitle>
        <PlusButtonWrapper>
          <IconButton icon={<PlusIcon />} iconButtonTheme={IconButtonThemes.Rounded} />
        </PlusButtonWrapper>
      </Row>
      <Row onClick={() => handleAddText("Body", TextTypes.bodyText)}>
        <AddBodyText>Add body text</AddBodyText>
        <PlusButtonWrapper>
          <IconButton icon={<PlusIcon />} iconButtonTheme={IconButtonThemes.Rounded} />
        </PlusButtonWrapper>
      </Row>
    </AddTextsWrapper>
  </Wrapper>
);

const Wrapper = styled.div`
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 20px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.activeMenu};
`;

const AddTextsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

const PlusButtonWrapper = styled.div`
  & button {
    width: 20px;
    height: 20px;
  }

  & svg {
    width: 7px;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddTitle = styled.p`
  cursor: pointer;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  background: ${({ theme }) => theme.button};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const AddSubtitle = styled.p`
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  background: ${({ theme }) => theme.button};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const AddBodyText = styled.p`
  cursor: pointer;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  background: ${({ theme }) => theme.button};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

export default AddTextPanel;
