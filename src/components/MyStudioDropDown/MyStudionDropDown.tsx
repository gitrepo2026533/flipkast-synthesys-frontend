import React, { FC, useState } from "react";
import styled from "styled-components";
import ArrowDown from "../Icons/ArrowDown";

interface IMyStudioDropDownProps {
  dropDownList: Record<string, any>[];
  defaultValueText: string;
  value: string;
  onChange: (value: any) => void;
}

const MyStudioDropDown: FC<IMyStudioDropDownProps> = ({ dropDownList, defaultValueText, onChange, value }) => {
  const [openList, setOpenList] = useState<boolean>(false);
  return (
    <DropDownContainer onClick={() => setOpenList(!openList)}>
      <DropDownSelectedValue>{value || defaultValueText}</DropDownSelectedValue>
      {openList && (
        <DropDownListItems>
          {dropDownList.map((item) => (
            <DropDownItem active={item.label === value} key={item.id} onClick={() => onChange(item.label)}>
              {item.label}
            </DropDownItem>
          ))}
        </DropDownListItems>
      )}
      <ArrowDown />
    </DropDownContainer>
  );
};

const DropDownContainer = styled("div")`
  position: relative;
  display: flex;
  cursor: pointer;
`;

const DropDownSelectedValue = styled("p")`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }: any) => theme.primaryText};
  margin-right: 8px;
`;
const DropDownListItems = styled("div")`
  right: 0;
  background: ${({ theme }: any) => theme.primaryBackground};
  box-shadow: ${({ theme }: any) => theme.cardShadow};
  border-radius: 12px;
  border: 1px solid #009af7;
  padding: 12px;
  position: absolute;
  top: 30px;
  width: 180px;
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

const DropDownItem = styled.span<{ active?: boolean }>`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }: any) => theme.primaryText};
  margin-bottom: 12px;
  transition: 200ms ease-in-out;
  &:hover {
    color: ${({ theme }: any) => theme.activeMenu};
    opacity: 0.6;
  }
  &:last-child {
    margin-bottom: 0;
  }
  ${({ active, theme }) =>
    active &&
    `
       color: ${theme.activeMenu};
  `}
`;

export default MyStudioDropDown;
