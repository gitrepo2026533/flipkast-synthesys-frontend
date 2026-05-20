import React, { FC } from "react";
import { Visible } from "../Icons/Visible";
import { Invisible } from "../Icons/Invisible";
import styled from "styled-components";

interface IFormInputProps {
  data: Record<string, any>;
}

const FormInput: FC<IFormInputProps> = ({ data }) => {
  const { inputData, onChangeData, onShowPassword } = data;
  return inputData.map((item: any) => (
    <FormInputWrapper key={item.id}>
      <FormInputs
        type={
          item.type === "password" ? (item.showPassword || item.showConfirmPassword ? "text" : "password") : item.type
        }
        value={item.value}
        onChange={(e) => onChangeData(e.target.value, item.id)}
        placeholder={item.placeholder}
      />
      <FormInputIcons>{item.icon}</FormInputIcons>
      {item.id === "password" && (
        <FormInputPasswordIcons onClick={() => onShowPassword(!item.showPassword, item.id)}>
          {item.showPassword ? <Visible /> : <Invisible />}
        </FormInputPasswordIcons>
      )}
      {item.id === "confirmPassword" && (
        <FormInputPasswordIcons onClick={() => onShowPassword(!item.showConfirmPassword, item.id)}>
          {item.showConfirmPassword ? <Visible /> : <Invisible />}
        </FormInputPasswordIcons>
      )}
    </FormInputWrapper>
  ));
};

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

const FormInputWrapper = styled("div")`
  margin-bottom: 25px;
  position: relative;
`;

const FormInputIcons = styled("span")`
  position: absolute;
  left: 15px;
  top: 13px;
  cursor: pointer;
  svg {
    path {
      fill: ${({ theme }: any) => theme.icon};
    }
  }
`;

const FormInputs = styled("input")`
  box-shadow: ${({ theme }: any) => theme.inputShadow};
  border-radius: 60px;
  background-color: ${({ theme }: any) => theme.primaryBackground};
  width: 100%;
  height: 48px;
  padding-left: 44px;
  padding-right: 44px;
  font-size: 14px;
  line-height: 24px;
  background-repeat: no-repeat;
  background-position: center left 15px;
  min-width: 320px;

  &::placeholder {
    color: ${({ theme }: any) => theme.primaryText};
    opacity: 0.6;
  }
`;

export default FormInput;
