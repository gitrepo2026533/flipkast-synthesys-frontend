import React, { useState } from "react";
import styled from "styled-components";

import CharacterCategory from "../CharacterCategory/CharacterCategory";

interface Props {
  categories: {
    id: string;
    type: "categoryType" | "voiceAge" | "isFeMale" | "mood" | "content" | "region" | "language" | "country" | string;
    title: string;
    data: {
      id: string;
      label: string;
    }[];
  }[];
  isMobile?: boolean;
  filters?: any;
  setFilters?: any;
  title: string;
}

const CharacterSidebar = ({ categories, isMobile, filters, setFilters, title }: Props) => {
  const updateFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <Wrapper isMobile={isMobile}>
      <Title>{title}</Title>
      <CharactersWrapper>
        <CharacterCategoryWrapper>
          {categories.map((category) => (
            <CharacterCategory key={category.id} category={category} filters={filters} updateFilters={updateFilters} />
          ))}
        </CharacterCategoryWrapper>
      </CharactersWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ isMobile?: boolean }>`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  /* overflow: hidden; */
  margin-right: 25px;
  margin-left: 40px;

  @media (max-width: 735px), (max-height: 800px), (max-width: 949px) and (max-height: 500px) {
    margin-left: 24px;
  }
  @media (max-width: 949px) and (max-height: 860px) {
    margin-left: 24px;
  }
  @media (max-width: 949px) and (max-height: 660px) {
    margin-left: 15px;
  }

  @media (min-width: 735px) and (max-width: 1100px) {
    width: 170px;
  }
  @media (max-width: 735px) {
    display: none;
  }
  ${({ isMobile }) =>
    isMobile &&
    `
      position: absolute;     
  `}
`;

const Title = styled.h2`
  font-family: "Montserrat", sans-serif;
  color: ${({ theme }) => theme.primaryText};
  letter-spacing: -3px;
  font-weight: 400;
  font-size: 40px;
  line-height: 52px;
  margin-bottom: 16px;

  @media (max-width: 735px), (max-height: 720px) {
    margin-bottom: 7px;
    font-size: 35px;
  }
`;

const CharactersWrapper = styled.div`
  background-color: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 16px;

  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 735px), (max-height: 720px) {
    max-width: 425px;
  }
  @media (max-width: 515px) {
    max-width: fit-content;
  }
`;

const CharacterCategoryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 16px 12px 0 12px;
  border-radius: 16px;
  gap: 8px;
  flex: 1;
  align-content: flex-start;
  overflow: hidden auto;

  @media (max-width: 735px) {
    flex-wrap: nowrap;
    padding: 10px 10px 0 10px;
  }

  ::-webkit-scrollbar {
    width: 2px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: ${({ theme }) => theme.activeMenu};
  }

  ::-webkit-scrollbar-track {
    margin: 15px 0;
  }

  @media (max-width: 1001px) {
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

export default CharacterSidebar;
