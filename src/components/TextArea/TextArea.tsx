import React from "react";
import styled from "styled-components";

interface Props {
  value?: string;
  name?: string;
  id?: string;
  rows?: number;
  minLength?: number;
  placeholder: string;
  onChange?: (e: any) => void;
}

const TextArea = ({ value, name, id, rows, minLength, placeholder, onChange }: Props) => {
  return (
    <Wrapper
      value={value}
      name={name}
      id={id}
      rows={rows}
      minLength={minLength}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

const Wrapper = styled.textarea`
  border-radius: none;
  border: none;
  padding: 0;
  background-color: transparent;
  margin-top: 8px;
  color: ${({ theme }) => theme.primaryText};
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 28px;
  width: 100%;

  ::placeholder {
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 28px;
    color: ${({ theme }) => theme.primaryText}66;
  }
`;

export default TextArea;
