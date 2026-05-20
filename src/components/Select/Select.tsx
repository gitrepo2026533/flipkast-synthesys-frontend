import React, { FC, useState } from "react";
import styled from "styled-components";
import ArrowDown from "../Icons/ArrowDown";
import { LikeIcon } from "../Icons/LikeIcon";

interface ISelectProps {
  optionsList: Record<string, any>;
  defaultValueText: string;
  value: string;
  onChange: (value: any, type: string) => void;
  variant?: "settings" | "popup";
}

const Select: FC<ISelectProps> = ({ optionsList, defaultValueText, onChange, value, variant = "settings" }) => {
  const [openList, setOpenList] = useState<boolean>(false);
  const currentOption = optionsList.data.find(({ value: item }: any) => item === value);

  return (
    <SelectorContainer isListOpen={openList} hasLabel={!!optionsList.label}>
      <SelectorLabel variant={variant}>{optionsList.label}</SelectorLabel>
      <Selector onClick={() => setOpenList(!openList)}>
        <Row>
          {currentOption?.icon && <Icon src={currentOption.icon} />}
          <SelectorDefaultText isValueExist={value !== ""}>
            {currentOption?.label || defaultValueText}
          </SelectorDefaultText>
        </Row>
      </Selector>
      {openList && (
        <SelectorOptionList>
          {optionsList.data.map((option: Record<string, any>) => (
            <SelectorOptionItem
              active={option.value === value}
              onClick={() => {
                onChange(option.value, optionsList.id);
                setOpenList(!openList);
              }}
              key={option.id}
              id={option.value}
            >
              <Row>
                {option?.icon && <Icon src={option.icon} />}
                {option.label}
              </Row>
            </SelectorOptionItem>
          ))}
        </SelectorOptionList>
      )}
      <ArrowDown />
    </SelectorContainer>
  );
};

const SelectorContainer = styled.div<{ isListOpen?: boolean; hasLabel: boolean }>`
  position: relative;
  cursor: pointer;
  svg {
    position: absolute;
    right: 20px;
    top: ${({ hasLabel }) => (hasLabel ? "32px" : "20px")};
    appearance: none;
    pointer-events: none;
  }
  ${({ isListOpen }) =>
    isListOpen &&
    `
    svg {
      transform: rotate(180deg);
    }
  `}
`;

const SelectorOptionList = styled("div")`
  background-color: ${({ theme }: any) => theme.primaryBackground};
  box-shadow: ${({ theme }: any) => theme.inputShadow};
  height: auto;
  max-height: 150px;
  border-radius: 12px;
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
  z-index: 10;
  padding: 5px 12px;

  @media (max-width: 1001px) {
    ::-webkit-scrollbar {
      display: none;
    }
  }

  ::-webkit-scrollbar {
    width: 2px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: ${({ theme }) => theme.activeMenu};
  }

  ::-webkit-scrollbar-track {
    margin: 15px 0;
  }
`;

const SelectorOptionItem = styled.span<{ active?: boolean }>`
  padding: 7px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: ${({ theme }: any) => theme.primaryText};
  cursor: pointer;
  ${({ active, theme }) =>
    active &&
    `
       border: 1px solid ${theme.activeMenu};
       border-radius: 12px;
       color: ${theme.activeMenu};
  `}
`;

const SelectorLabel = styled("label")<{ variant?: "settings" | "popup" }>`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  opacity: 0.6;
  color: ${({ theme }: any) => theme.primaryText};
  display: flex;
  margin-bottom: 4px;

  ${({ variant }) =>
    variant === "popup" &&
    `
      font-weight: 500;
      opacity: 1;
  `}
`;

const SelectorDefaultText = styled.p<{ isValueExist?: boolean }>`
  opacity: 0.6;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }: any) => theme.primaryText};

  ${({ isValueExist }) =>
    isValueExist &&
    `
      opacity: 1;
  `}
`;

const Selector = styled("div")`
  background-color: ${({ theme }: any) => theme.primaryBackground};
  box-shadow: ${({ theme }: any) => theme.inputShadow};
  border-radius: 60px;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
  height: 48px;
  border: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  display: flex;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  column-gap: 8px;
  align-items: center;
`;

const Icon = styled.img`
  height: 12px;
`;

export default Select;
