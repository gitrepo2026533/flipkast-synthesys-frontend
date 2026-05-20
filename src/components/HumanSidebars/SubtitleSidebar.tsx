import React, { useState } from "react";
import styled from "styled-components";
import RadioButton from "../RadioButton/RadioButton";

interface Props {
  data: {
    id: number;
    flag?: string;
    country: string;
  }[];
}

const SubtitleSidebar = ({ data }: Props) => {
  const [selectedSubtitle, setSelectedSubtitle] = useState<number>();

  const handleClick = (id: number) => setSelectedSubtitle(id);

  return (
    <Wrapper>
      <Content>
        {data.map(({ id, flag, country }) => (
          <Item key={id} onClick={() => handleClick(id)}>
            <img src={flag} alt={country} />
            <span>{country}</span>
            <RadioButton id={id} label={"hello"} checked={id === selectedSubtitle} />
          </Item>
        ))}
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.activeMenu};
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  padding: 16px;
  border-radius: 20px;
  min-height: 496px;
  max-height: 496px;
  overflow: hidden auto;

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: ${({ theme }) => theme.secondaryBackground}f;
  }

  ::-webkit-scrollbar-track {
    margin: 15px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Item = styled.div`
  padding: 16px;
  background: #f0f0f3;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 16px;
  display: flex;
  align-items: center;
  flex-direction: row;
  cursor: pointer;

  img {
    width: 16px;
    height: 12px;
    border-radius: 2px;
  }

  span {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: ${({ theme }) => theme.primaryText};
    margin-left: 8px;
  }

  div {
    margin-left: auto;
  }
`;

export default SubtitleSidebar;
