import React, { ReactNode } from "react";
import styled from "styled-components";

export enum ButtonThemes {
  Primary = "primary",
  Secondary = "secondary",
  Transparent = "transparent",
  Outline = "Outline",
}

interface Props {
  id?: string;
  text?: string | ReactNode;
  hoverMessage?: string;
  image?: string;
  buttonTheme?: ButtonThemes;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: (e: any) => void;
  width?: string;
  icon?: ReactNode;
  style?: Record<string, string>;
}

const Button = ({
  id,
  text,
  hoverMessage,
  image,
  disabled,
  className,
  buttonTheme = ButtonThemes.Primary,
  type = "button",
  onClick,
  icon,
  style,
}: Props) => (
  <Wrapper
    id={id}
    buttonTheme={buttonTheme}
    title={hoverMessage}
    disabled={disabled}
    onClick={onClick}
    className={className}
    type={type}
    style={style}
  >
    {icon && icon}
    <span>{text ? text : <img src={image} />}</span>
  </Wrapper>
);

const Wrapper = styled.button<{ buttonTheme?: string }>`
  height: 48px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.buttonShadow};
  background: transparent;
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.41px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  width: 100%;
  cursor: pointer;

  span {
    color: ${({ theme }) => theme.white};
    text-decoration: none;
  }
  ${({ buttonTheme, theme }) =>
    buttonTheme === ButtonThemes.Primary &&
    `
        background: ${theme.button};
  `}
  ${({ buttonTheme, theme }) =>
    buttonTheme === ButtonThemes.Secondary &&
    `
    height: 24px;
    border-radius: 0;
    box-shadow: none;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0;
    outline: none;
    border: none;
    width: auto;
    gap: 11px;

    span {
      background: ${theme.button};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  `}

${({ buttonTheme, theme }) =>
    buttonTheme === ButtonThemes.Transparent &&
    `
    box-shadow: none;
    align-items: center;
    justify-content: start;
    border-radius: 0;
    height: 20px;
    gap: 12px;

    span {
      color: ${theme.primaryText};
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
    }

    svg > path {
      fill: ${theme.icon};
    }
  `}
  ${({ buttonTheme, theme }) =>
    buttonTheme === ButtonThemes.Outline &&
    `
    position: relative;
    border-radius: 16px;
    height: 52px;
    background: ${theme.primaryBackground};
    background-clip: padding-box;
    border: solid 1px ${theme.activeMenu};

    span {
      color: ${theme.primaryText};
    }

    &:hover {
      border: solid 1px ${theme.activeMenu};
    }

    &:focus {
      border: solid 1px ${theme.activeMenu};
    }
  `}
`;

export default Button;
