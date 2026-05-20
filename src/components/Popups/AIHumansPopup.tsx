import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { categories, chips } from "../../mocks/character";

import { getPrefilled } from "../../redux/reducers/popupsReducer";

import { IHuman } from "../../types/human";

import Button, { ButtonThemes } from "../Button/Button";
import CharacterCategory from "../CharacterCategory/CharacterCategory";
import CharacterSidebar from "../CharacterSidebar/CharacterSidebar";
import Chip from "../Chip/Chip";
import HumanCard from "../HumanCard/HumanCard";
import Modal from "../Modal/Modal";
import Textfield from "../Textfield/Textfield";
import CloseIconV2 from "../Icons/CloseIconV2";
import { ClockIcon, DownloadIcon, LikeIcon, SearchFilterIcon, SearchIcon, StarIcon } from "../Icons/Icons";

interface Props {
  open: boolean;
  onClose: () => void;
}

const AIHumansPopup = ({ open, onClose }: Props) => {
  const [humans, setHumans] = useState<IHuman[]>([]);
  const [active, setActive] = useState<number>();
  const [openMobileSelectList, setOpenMobileSelectList] = useState<boolean>(false);
  const cardsWrapperRef = useRef(null);

  const prefilled = useSelector(getPrefilled);

  useEffect(() => {
    const humans = prefilled?.humans;

    setHumans(humans);
    setActive(humans[0].id);
  }, [prefilled]);

  const handleActiveChange = (index: number) => {
    setActive(index);
  };

  const [filters, setFilters] = useState<any>({
    chipList: [],
  });

  const handleFilterDelete = (id: string) => {
    const newFilters = filters.chipList.filter((chip: any) => chip.id !== id);
    setFilters({ chipList: newFilters });
  };

  return (
    <Modal className="human" open={open} onClose={onClose} closeIcon={false} maxWidth={1276} maxHeight={704}>
      <Content>
        <MobileOnlyTitleWrapper>
          <Title>AI humans</Title>
        </MobileOnlyTitleWrapper>
        <CharacterSidebar categories={categories} filters={filters} setFilters={setFilters} title="AI humans" />
        <Right>
          <Heading>
            <ButtonWrapper>
              <Button buttonTheme={ButtonThemes.Transparent} text="Popular" icon={<StarIcon />} />
              <Button buttonTheme={ButtonThemes.Transparent} text="History" icon={<ClockIcon />} />
              <Button buttonTheme={ButtonThemes.Transparent} text="Bookmark" icon={<LikeIcon />} />
            </ButtonWrapper>
            <TextfieldWrapper>
              <Actions>
                <Textfield placeholder="Search actors" startAdornment={<SearchIcon />} />
              </Actions>
              <MobileOnlyFilterButton onClick={() => setOpenMobileSelectList(!openMobileSelectList)}>
                {openMobileSelectList ? <CloseIconV2 /> : <SearchFilterIcon />}
              </MobileOnlyFilterButton>
              <ImportMobileWrapper>
                <Import>
                  <DownloadIcon />
                </Import>
              </ImportMobileWrapper>
              {openMobileSelectList && (
                <CharactersWrapper>
                  <CharacterCategoryWrapper>
                    {categories.map((category) => (
                      <CharacterCategory
                        key={category.id}
                        category={category}
                        filters={filters}
                        updateFilters={setFilters}
                      />
                    ))}
                  </CharacterCategoryWrapper>
                </CharactersWrapper>
              )}
            </TextfieldWrapper>
          </Heading>
          <ChipWrapper>
            {filters.chipList.map((chip: any) => (
              <Chip key={chip.id} title={chip.name} onRemove={() => handleFilterDelete(chip.id)} />
            ))}
          </ChipWrapper>
          <HumansCardsWrapper ref={cardsWrapperRef}>
            {humans.map((human) => (
              <HumanCard
                parent={cardsWrapperRef}
                {...human}
                key={human.id}
                active={active === human.id}
                handleActiveChange={handleActiveChange}
              />
            ))}
          </HumansCardsWrapper>
          <ActionsWrapper>
            <Button text="Cancel" buttonTheme={ButtonThemes.Outline} onClick={onClose} />
            <Button text="Add" />
          </ActionsWrapper>
        </Right>
      </Content>
    </Modal>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  flex: 1;
  gap: 28px;
  @media (max-width: 735px) {
    gap: 15px;
    flex-direction: column;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden auto;
`;

const MobileOnlyFilterButton = styled.div`
  margin-left: 17px;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
  }

  @media (min-width: 736px) {
    display: none;
  }
`;
const MobileOnlyTitleWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  p {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    background: ${({ theme }) => theme.button};
  }
  @media (min-width: 736px) {
    display: none;
  }
`;

const Title = styled.h2`
  font-family: "Montserrat", sans-serif;
  color: ${({ theme }) => theme.primaryText};
  letter-spacing: -1px;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;

  @media (max-width: 600px) and (max-height: 400px) {
    font-size: 18px;
    line-height: 22px;
  }
`;

const Heading = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 18px;

  button > span {
    font-size: 12px;
    line-height: 16px;

    @media (max-width: 600px) and (max-height: 400px) {
      font-size: 10px;
      line-height: 14px;
    }
  }

  @media (max-height: 720px) {
    margin-bottom: 14px;

    button > span {
      font-size: 10px;
      line-height: 14px;
    }
  }

  @media (max-width: 735px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  @media (min-width: 736px) and (max-width: 949px) {
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 735px) and (max-height: 660px) {
    margin-bottom: 10px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 17px;
  @media (max-width: 949px), (max-height: 800px) {
    margin-bottom: 5px;
  }
`;

const TextfieldWrapper = styled.div`
  width: 320px;

  @media (max-width: 735px) {
    display: flex;
    align-items: center;
    width: 100%;
  }
`;

const Actions = styled.div`
  display: flex;
  column-gap: 24px;
  align-items: center;
`;

const ImportDesktopWrapper = styled.div`
  @media (max-width: 735px) {
    display: none;
  }
`;

const ImportMobileWrapper = styled.div`
  margin-left: 16px;
  margin-bottom: 5px;

  @media (min-width: 736px) {
    display: none;
  }
`;

const Import = styled.div`
  background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  display: flex;
  column-gap: 4px;
  align-items: center;

  & path {
    fill: #0063b4;
  }
`;

const ImportText = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
`;

const ChipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: flex-start;
  gap: 12px;
  width: 100%;
  height: 32px;
  overflow: scroll;
  flex-flow: column wrap;
  flex-shrink: 0;

  ::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 735px) {
    display: none;
  }
`;

const HumansCardsWrapper = styled.div`
  position: relative;
  overflow: hidden auto;
  height: 100%;
  max-height: 100%;
  margin-top: 18px;
  display: grid;

  .infinite-scroll-component__outerdiv {
    display: contents;
  }

  @media (min-width: 1310px) {
    grid-template-columns: repeat(4, 216px);
  }

  @media (min-width: 950px) and (max-width: 1309px) {
    grid-template-columns: repeat(3, 216px);
  }
  @media (min-width: 950px) and (max-width: 1309px) and (max-height: 860px), (max-height: 800px) {
    max-height: 58vh;
  }

  @media (max-height: 800px) {
    max-height: 58vh;
  }

  @media (max-height: 660px) {
    grid-template-columns: repeat(3, 216px);
  }

  @media (max-width: 949px) {
    grid-template-columns: repeat(2, 216px);
  }

  @media (max-width: 949px) and (max-height: 860px) {
    max-height: 58vh;
  }
  @media (max-width: 735px) {
    max-height: 65vh;
    margin-top: 0;
  }

  @media (max-width: 735px) and (max-height: 660px) {
    max-height: 58vh;
    margin-top: 0;
  }

  @media (max-width: 515px) {
    position: inherit;
    max-height: 71vh;
    margin-top: 0;
  }
  @media (max-width: 515px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 515px) and (max-height: 760px) {
    max-height: 62vh;
  }

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

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.characterActionsBackground};
  height: 100px;
  bottom: 0;
  position: absolute;
  width: 100%;
  z-index: 3;

  button {
    width: 161.5px;
  }

  @media (max-width: 515px) and (max-height: 760px) {
    height: 80px;
    width: 99%;
  }

  @media (min-width: 950px) and (max-height: 720px) {
    height: auto;

    button {
      width: 100px;
      max-height: 48px;

      & > span {
        font-size: 14px;
        line-height: 18px;
      }
    }
  }
`;

const CharactersWrapper = styled.div`
  background-color: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 16px;
  position: absolute;
  width: 100%;
  z-index: 10;
  top: 80px;
  border: solid 1px ${({ theme }) => theme.activeMenu};

  svg {
    path {
      fill: ${({ theme }) => theme.activeMenu};
    }
  }
`;

const CharacterCategoryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 16px 12px 16px 12px;
  border-radius: 16px;
  gap: 8px;
  max-height: 53vh;
  overflow-y: auto;

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

export default AIHumansPopup;
