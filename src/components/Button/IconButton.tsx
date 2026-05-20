import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export enum IconButtonThemes {
  Primary = "primary",
  Secondary = "secondary",
  Transparent = "transparent",
  Rounded = "rounded",
}

interface Props {
  id?: string;
  icon: ReactNode;
  iconButtonTheme?: IconButtonThemes;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: (e: any) => void;
}

const IconButton = ({
  id,
  icon,
  disabled,
  className,
  iconButtonTheme = IconButtonThemes.Primary,
  type = "button",
  onClick,
}: Props) => (
  <Wrapper
    id={id}
    iconButtonTheme={iconButtonTheme}
    disabled={disabled}
    onClick={onClick}
    className={className}
    type={type}
  >
    {icon}
  </Wrapper>
);

const Wrapper = styled.button<{ iconButtonTheme?: string }>`
  height: 32px;
  max-width: 32px;
  width: 100%;
  border-radius: 12px;
  box-shadow: ${({ theme }: any) => theme.secondaryButtonShadow};
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  flex-shrink: 0;
  cursor: pointer;

  ${({ iconButtonTheme, theme }) =>
    iconButtonTheme === IconButtonThemes.Primary &&
    `
      background: ${theme.button};
      border: 2px solid ${theme.white};

      &:focus {
        border: 2px solid ${theme.white};
      }
        
  `}
  ${({ iconButtonTheme, theme }) =>
    iconButtonTheme === IconButtonThemes.Secondary &&
    `
    background: ${theme.primaryBackground};
    box-shadow: ${theme.iconButtonShadow};
    border-radius: 60px;
    max-width: 40px;
    height: 40px;

    svg {
      flex-shrink: 0;

      & > rect {
        fill: ${theme.primaryBackground}
      }

      & > path {
        fill: ${theme.icon};
      }
    }
  `}

  ${({ iconButtonTheme }) =>
    iconButtonTheme === IconButtonThemes.Transparent &&
    `
    width: 24px;
    height: 24px;
    background: transparent;
    box-shadow: none;
  `}

${({ iconButtonTheme, theme }) =>
    iconButtonTheme === IconButtonThemes.Rounded &&
    `
    max-width: 36px;
    height: 36px;
    background: ${theme.button};
    box-shadow: ${theme.iconButtonShadow};
    border-radius: 52px;

    svg {
      width: 20px;
      height: 20px;
    }
  `}
`;

export default IconButton;
