import React, { useState } from "react";
import styled from "styled-components";
import { useDarkMode } from "../../hooks/useDarkMode";
import { ThemeTypes } from "../../types/theme";
import { DarkThemeIcon, LightThemeIcon } from "../Icons/Icons";

interface DarkModeTypes {
  theme: ThemeTypes;
  toggleTheme: () => void;
}

const ThemeSwitcher = () => {
  const { theme, toggleTheme }: DarkModeTypes = useDarkMode();

  const handleThemeToggle = () => toggleTheme();

  return (
    <Wrapper onClick={handleThemeToggle}>
      <ThemesContainer currentTheme={theme}>
        <LightThemeIcon />
      </ThemesContainer>
      <ThemesContainer currentTheme={theme}>
        <DarkThemeIcon />
      </ThemesContainer>
      <InnerWrapper currentTheme={theme} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.themeSwitcherShadow};
  border-radius: 60px;
  width: 70px;
  min-width: 70px;
  height: 36px;
  margin: 0 24px;
  cursor: pointer;

  @media (max-width: 1001px) {
    margin-right: 4px;
  }
`;

const ThemesContainer = styled.div<{ currentTheme: ThemeTypes }>`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;

  :first-child {
    margin-left: 8px;
  }

  :nth-child(2) {
    margin-right: 8px;
  }

  svg > path,
  svg > g > path {
    fill: ${({ theme }) => theme.disableIcon};
  }

  svg > g {
    opacity: 1;
  }

  ${({ currentTheme, theme }) =>
    currentTheme === ThemeTypes.light &&
    `
        :first-child {
          svg > path, svg > g > path {
            fill: ${theme.enableIcon};
          }

          svg > g {
            opacity: 1;
          } 
        }   
    `}

  ${({ currentTheme, theme }) =>
    currentTheme === ThemeTypes.dark &&
    `
        :nth-child(2) {
          svg > path, svg > g > path {
            fill: ${theme.enableIcon};
          }

          svg > g {
            opacity: 1;
          } 
        }  
    `}
`;

const InnerWrapper = styled.div<{ currentTheme: ThemeTypes }>`
  position: absolute;
  display: flex;
  top: 4px;
  align-items: center;
  transition: 0.5s;
  background: ${({ theme }) => theme.button};
  box-shadow: ${({ theme }) => theme.buttonShadow};
  border-radius: 80px;
  width: 28px;
  height: 28px;
  z-index: 1;

  ${({ currentTheme }) =>
    currentTheme === ThemeTypes.light &&
    `
      left: 4px;  
      transform: translateX(0);
  `}
  ${({ currentTheme }) =>
    currentTheme === ThemeTypes.dark &&
    `
      left: calc(100% - 4px);
      transform: translateX(-100%);
`}
`;

export default ThemeSwitcher;
