import React from "react";
import styled from "styled-components";

const Switch = () => {
  return (
    <Wrapper>
      <input type="checkbox" />
      <span className="slider-range"></span>
    </Wrapper>
  );
};

const Wrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 28px;
  min-width: 44px;

  input {
    display: none;
    width: 100%;
    height: 5px;
    border-radius: 5px;
    outline: none;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
  }

  input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 23px;
    height: 24px;
    border: 0;
    border-radius: 50%;
    background-image: url("../media/images/thumbnail.svg");
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    cursor: pointer;
  }

  input::-moz-range-thumb {
    width: 23px;
    height: 24px;
    border: 0;
    border-radius: 50%;
    background-image: url("https://img.icons8.com/material-outlined/344/average-2.png");
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    cursor: pointer;
  }

  input:checked + span {
    background: ${({ theme }) => theme.button};
  }

  input:checked + span:before {
    -webkit-transform: translateX(14px);
    -moz-transform: translateX(14px);
    transform: translateX(14px);
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.switcher};
    border-radius: 40px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    box-shadow: ${({ theme }) => theme.themeSwitcherShadow};
  }

  span:before {
    position: absolute;
    content: "";
    height: 24px;
    width: 24px;
    background: ${({ theme }) => theme.white};
    border-radius: 50%;
    left: 2px;
    bottom: 2px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
`;

export default Switch;
