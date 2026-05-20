import React from "react";
import styled from "styled-components";

interface Props {
  value?: string;
  type?: string;
  name?: string;
  checked?: boolean;
  label: string;
  className?: string;
  onChange: (e: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
}

const Checkbox = ({
  value = "yes",
  type = "checkbox",
  name,
  checked,
  label,
  className = "checkbox",
  onChange,
  onFocus,
  onBlur,
}: Props) => (
  <Wrapped>
    <input
      value={value}
      type={type}
      name={name}
      className={className}
      id="checkbox-id"
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      checked={checked}
    />
    <span />
    <p>{label}</p>
  </Wrapped>
);

const Wrapped = styled.label`
  display: block;
  position: relative;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.primaryText};
  padding-left: 35px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 12px;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 16px;
    background: #f0f0f3;
    box-shadow: inset 5px 5px 4px rgb(174 174 192 / 20%), inset -5px -5px 4px rgb(255 255 255 / 30%);
    border-radius: 4px;
    border: 1px solid #f0f0f3;
  }

  p {
    word-break: break-word;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.primaryText}99;
  }

  input:checked ~ p {
    color: ${({ theme }) => theme.primaryText};
  }

  input:checked ~ span {
    background: ${({ theme }) => theme.button};
  }

  span:after {
    content: "";
    position: absolute;
    display: none;
  }

  input:checked ~ span:after {
    display: block;
  }

  span:after {
    left: 5px;
    top: 1px;
    width: 4px;
    height: 9px;
    border: solid ${({ theme }) => theme.white};
    border-width: 0 1px 1px 0;
    transform: rotate(45deg);
  }
`;

export default Checkbox;
