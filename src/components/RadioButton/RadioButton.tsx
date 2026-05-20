import React from "react";
import styled from "styled-components";

interface Props {
  id?: number;
  value?: string;
  type?: string;
  name?: string;
  checked?: boolean;
  label: string;
  className?: string;
  onChange?: (e: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
}

const RadioButton = ({
  id,
  value,
  type = "radio",
  name,
  checked,
  className = "radio",
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
      id={`radio-${id}`}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      checked={checked}
    />
    <label htmlFor={`radio-${id}`}></label>
  </Wrapped>
);

const Wrapped = styled.div`
  font-family: "Open Sans", sans-serif;
  input[type="radio"] {
    display: none;
  }
  label:before {
    content: "";
    display: inline-block;
    text-align: center;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    background: ${({ theme }) => theme.primaryBackground};
    box-shadow: ${({ theme }) => theme.inputShadow};
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50% 50%;
    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
  }
  input:checked + label:before {
    border: 3.5px solid ${({ theme }) => theme.activeMenu};
    background: ${({ theme }) => theme.white};
    width: 9px;
    height: 9px;
    box-shadow: -2px 2px 5px rgba(139, 145, 149, 0.12), 2px -2px 5px rgba(139, 145, 149, 0.12),
      -2px -2px 5px rgba(139, 145, 149, 0.4), 2px 2px 5px rgba(54, 145, 233, 0.4),
      inset 1px 1px 1px rgba(255, 255, 255, 0.2), inset -1px -1px 1px rgba(209, 217, 230, 0.2);
  }
`;

export default RadioButton;
