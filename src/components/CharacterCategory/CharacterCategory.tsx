import { useState } from "react";
import styled from "styled-components";
import Checkbox from "../Checkbox/Checkbox";
import ArrowDown from "../Icons/ArrowDown";

interface Props {
  category: {
    id: string;
    type: "categoryType" | "voiceAge" | "isFeMale" | "mood" | "content" | "region" | "language" | "country" | string;
    title: string;
    data: {
      id: string;
      label: string;
    }[];
  };
  filters: any;
  updateFilters: (updatedFilters: any) => void;
}

const CharacterCategory = ({ category, filters, updateFilters }: Props) => {
  const [openList, setOpenList] = useState<boolean>(false);
  const handleClick = () => setOpenList(!openList);

  const handleCheckboxToggle = (
    e: any,
    key: "categoryType" | "voiceAge" | "isFeMale" | "mood" | "content" | "region" | "language" | "country" | string,
    value: any,
  ) => {
    let newValue: any = [];

    if (e.target.checked) {
      if (key === "isFeMale") {
        newValue = {
          [key]: [value],
        };
      } else {
        newValue = {
          [key]: [...filters[key], value],
        };
      }
    } else {
      newValue = {
        [key]: filters[key].filter((item: any) => item !== value) || [],
      };
    }

    updateFilters({ ...filters, ...newValue });
  };

  return (
    <Wrapper>
      <Heading isListOpen={openList} onClick={handleClick}>
        <span>{category.title}</span>
        <ArrowDown />
      </Heading>
      {openList && (
        <Content>
          {category.data.map((d) => (
            <Checkbox
              key={d.id}
              label={d.label}
              checked={filters[category.type].some((chip: any) => chip === d.label)}
              name={d.label}
              onChange={(e: any) => handleCheckboxToggle(e, category.type, d.label)}
            />
          ))}
        </Content>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 12px;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  cursor: pointer;
`;

const Heading = styled.div<{ isListOpen?: boolean }>`
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-anchor: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out, border-radius 0.15s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: ${({ theme }) => theme.primaryText};
  }

  ${({ isListOpen }) =>
    isListOpen &&
    `
    svg {
      transform: rotate(180deg);
    }
  `};

  @media (max-height: 720px) {
    padding: 12px 20px;

    span {
      font-size: 12px;
      line-height: 18px;
    }
  }
`;

const Content = styled.div`
  padding: 1rem 1.25rem;

  @media (max-height: 720px) {
    padding: 12px 20px;
  }
`;

export default CharacterCategory;
