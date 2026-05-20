import React, { useState } from "react";
import styled from "styled-components";

interface Props {
  title: string;
  values: {
    id: number | string;
    title: string;
  }[];
}

const ProgressBar = ({ title, values }: Props) => {
  const [value, setValue] = useState(10);

  const handleChange = (e: any) => setValue(e.target.value);

  return (
    <Wrapper>
      <span>{title}</span>
      <div>
        <ProgressBarLineWrapper>
          <ProgressBarLine
            value={value}
            type="range"
            min="0"
            max="100"
            step="10"
            width={value}
            onChange={handleChange}
          />
        </ProgressBarLineWrapper>
        <RangeWrapper>
          {values.map((value) => (
            <span key={value.id}>{value.title}</span>
          ))}
        </RangeWrapper>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;

  & > span:first-of-type {
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 12px;
    line-height: 24px;
    color: ${({ theme }) => theme.primaryText};
    width: 39px;
    flex-shrink: 0;
  }

  & > div {
    position: relative;
    width: 100%;
    display: flex;
  }
`;

const ProgressBarLineWrapper = styled.div`
  height: 4px;
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.inputShadow};
  border-radius: 60px;
  display: flex;
  align-items: center;
`;

const ProgressBarLine = styled.input<{ width: number }>`
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.inputShadow};
  border-radius: 80px;
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;

  ::-webkit-slider-runnable-track {
    background: ${({ theme, width }) => `linear-gradient(to right, ${theme.activeMenu} ${width}%, transparent 0)`};
    height: 4px;
  }

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: ${({ theme }) => theme.white};
    width: 4px;
    height: 4px;
    padding: 2px;
    margin-top: -2px;
    border: 2px solid ${({ theme }) => theme.activeMenu};
    border-radius: 52px;
    cursor: pointer;
  }
`;

const RangeWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.primaryText};
    opacity: 0.4;
  }
`;

export default ProgressBar;
