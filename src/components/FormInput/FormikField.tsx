import React from "react";
import { FormikProps } from "formik";
import styled, { useTheme } from "styled-components";

import { Visible } from "../Icons/Visible";
import { Invisible } from "../Icons/Invisible";
import { darkTheme } from "../../themes/themes";

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

interface OtherProps {
  field: any;
  isVisible?: boolean;
  flexRow?: any;
  setIsVisible?: (isVisible: boolean, type: string) => void;
  checkBoxValue?: boolean;
  handleChangeCheckBox?: (bool: boolean) => void;
  disabled?: boolean;
}

const FormikField = (
  props: OtherProps &
    OptionalExceptFor<FormikProps<any>, "values" | "errors" | "touched" | "handleChange" | "handleBlur">,
) => {
  const {
    handleChange,
    field,
    values,
    isVisible,
    setIsVisible,
    touched,
    errors,
    handleBlur,
    flexRow,
    checkBoxValue,
    handleChangeCheckBox,
    disabled,
  } = props;

  const theme = useTheme();
  const { name } = field;
  const errorName = (errors[name] && touched[name] ? errors[name] : null) as string;

  return (
    <FormInputWrapper flexRow={flexRow} key={field.id}>
      {field.label && <FormInputLabel htmlFor={field.id}>{field.label}</FormInputLabel>}
      <FormInputs
        type={field.type === "password" ? (isVisible ? "text" : "password") : field.type}
        name={name}
        value={values[name]}
        onChange={handleChange}
        placeholder={field.placeholder}
        onBlur={handleBlur}
        darkTheme={theme === darkTheme}
        disabled={disabled}
      />
      {errorName && <ErrorText>{errorName}</ErrorText>}
      {field.checkbox && (
        <FormCheckBoxWrapper>
          <label>
            <input type="checkbox" checked={checkBoxValue} onChange={() => handleChangeCheckBox?.(!checkBoxValue)} />
            <p>{field.checkBoxText}</p>
          </label>
        </FormCheckBoxWrapper>
      )}
      <FormInputIcons>{field.icon}</FormInputIcons>
      {setIsVisible && field.type === "password" && (
        <FormInputPasswordIcons onClick={() => setIsVisible(!isVisible, field.name)}>
          {isVisible ? <Visible /> : <Invisible />}
        </FormInputPasswordIcons>
      )}
    </FormInputWrapper>
  );
};

const FormInputLabel = styled("label")`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  opacity: 0.6;
  color: ${({ theme }: any) => theme.primaryText};
`;

const FormCheckBoxWrapper = styled("div")`
  margin-top: 4px;
  label {
    display: flex;
  }
  p {
    font-family: "Montserrat", sans-serif;
    margin-left: 8px;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }: any) => theme.primaryText};
    opacity: 0.6;
  }
`;

const ErrorText = styled("div")`
  color: red;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  margin-top: 5px;
`;

const FormInputPasswordIcons = styled("span")`
  position: absolute;
  right: 15px;
  top: 17px;
  cursor: pointer;
  svg {
    path {
      fill: ${({ theme }: any) => theme.icon};
    }
  }
`;

const FormInputWrapper = styled.div<{ flexRow: boolean }>`
  margin-bottom: 25px;
  position: relative;

  ${({ flexRow }) =>
    flexRow &&
    `
      width: ${flexRow}%;
      margin: 0;
      input {
      min-width: auto;
      padding-left: 20px;
     }
     
    @media (max-width: 800px) {
      width: 100%;
      margin-bottom: 16px;
    }    
    `}

  @media (min-width: 320px) and (max-width: 750px) {
    margin-bottom: 15px;
  }

  @media (min-width: 751px) and (max-width: 1150px) {
    margin-bottom: 17px;
  }

  @media (max-height: 750px) {
    margin-bottom: 16px;
  }
`;

const FormInputIcons = styled("span")`
  position: absolute;
  left: 17px;
  top: 16px;
  cursor: pointer;
  display: flex;
  /* svg {
    path {
      fill: ${({ theme }: any) => theme.activeMenu};
    }
  } */
`;

const FormInputs = styled("input")<{ darkTheme?: boolean; disabled?: boolean }>`
  box-shadow: ${({ theme }: any) => theme.inputShadow};
  border-radius: 60px;
  background-color: ${({ theme }: any) => theme.primaryBackground};
  width: 100%;
  height: 48px;
  padding-left: 44px;
  padding-right: 44px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  background-repeat: no-repeat;
  background-position: center left 15px;
  min-width: 320px;
  color: ${({ theme }: any) => theme.primaryText};

  ${({ darkTheme, theme }) =>
    darkTheme &&
    `
      border: 1px solid ${theme.secondaryBackground};
      box-shadow: none;
  
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px ${theme.primaryBackground} inset !important;
        -webkit-text-fill-color: ${theme.primaryText};
        -webkit-border-before-color: ${theme.secondaryBackground};
        -webkit-border-before-style: solid;
        -webkit-border-before-width: 1px;
      }

      &:focus {
        background-color: ${theme.primaryBackground};
        border: 1px solid ${theme.secondaryBackground};
      }
    `}

  &::placeholder {
    color: ${({ theme }: any) => theme.primaryText};
    opacity: 0.6;
  }

  ${({ disabled }) =>
    disabled &&
    `
    cursor: not-allowed;
    opacity: 0.5;

    + span svg {
      opacity: 0.5;
    }
  `}
`;

export default FormikField;
