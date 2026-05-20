import React, { ReactNode } from "react";
import styled from "styled-components";

export enum TextfieldVariant {
  noneAdornment = "noneAdornment",
  startAdornment = "startAdornment",
  endAdornment = "endAdornment",
  startAndEndAdornment = "startAndEndAdornment",
  project = "project",
}

interface Props {
  value?: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  label?: string;
  name?: string;
  subtitle?: string;
  number?: number;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  endAdornmentClick?: () => void;
  variant?: TextfieldVariant;
  autoFocus?: boolean;
  onChange?: (e: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  onKeyPress?: (e: any) => void;
}

const Textfield = ({
  value,
  type = "text",
  required = false,
  name,
  label,
  placeholder = "",
  startAdornment,
  endAdornment,
  endAdornmentClick,
  variant = TextfieldVariant.startAndEndAdornment,
  autoFocus,
  onChange,
  onFocus,
  onBlur,
  onKeyPress,
}: Props) => (
  <Wrapper>
    {label && <Label>{label}</Label>}
    {startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>}
    <Input
      autoFocus={autoFocus}
      value={value}
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyPress={onKeyPress}
      variant={variant}
    />
    {endAdornment && (
      <InputAdornment position="end" onClick={endAdornmentClick}>
        {endAdornment}
      </InputAdornment>
    )}
  </Wrapper>
);

const Wrapper = styled.div`
  /* flex: 1; */
  position: relative;
`;

const Label = styled.span`
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.primaryText};
  margin-bottom: 4px;
  display: flex;
`;

const Input = styled.input<{ variant?: TextfieldVariant }>`
  background-color: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.inputShadow};
  padding: 12px 44px;
  width: 100%;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  font-family: "Montserrat", sans-serif;
  color: ${({ theme }) => theme.primaryText};
  border-radius: 60px;

  ::placeholder {
    color: ${({ theme }) => theme.primaryText};
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    opacity: 0.4;
  }

  @media (max-height: 720px) {
    font-size: 12px;
    line-height: 20px;

    ::placeholder {
      font-size: 12px;
      line-height: 20px;
    }
  }

  ${({ variant }) =>
    variant === TextfieldVariant.startAdornment &&
    `
      padding: 12px 16px 12px 44px;
  `}

  ${({ variant }) =>
    variant === TextfieldVariant.endAdornment &&
    `
      padding: 12px 44px 12px 16px;
  `}

  ${({ variant }) =>
    variant === TextfieldVariant.noneAdornment &&
    `
      padding: 12px 16px;
  `}

  ${({ variant }) =>
    variant === TextfieldVariant.project &&
    `
      padding: 3px 12px;
      max-width: 130px;
      max-height: 24px;
      border-radius: 12px;

      ::placeholder {
        font-weight: 400;
        font-size: 10px;
        line-height: 14px;
        opacity: 0.4;
      }
  `}
`;

const InputAdornment = styled.div<{ position?: "start" | "end" }>`
  position: absolute;
  display: flex;

  ${({ position, theme }) =>
    position === "start" &&
    `
            top: 50%;
            left: 18px;
            transform: translateY(-50%);

            svg > path {
              fill: ${theme.icon};
              opacity: 0.4;
            }
    `}

  ${({ position }) =>
    position === "end" &&
    `
            top: 50%;
            right: 18px;
            transform: translateY(-50%);
    `}
`;

export default Textfield;
