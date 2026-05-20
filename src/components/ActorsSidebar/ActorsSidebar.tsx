import { useDispatch } from "react-redux";
import styled from "styled-components";

import ActorCard from "../ActorCard/ActorCard";
import CircularProgress from "../Icons/CircularProgress";
import { Popups, updatePopup } from "../../redux/actions/popupsActions";
import { IActor } from "../../types/actor";
import { Paragraphs } from "../../types/project";

interface Props {
  actors: IActor[];
  paragraphs: Paragraphs[];
  active?: number;
  onClick?: (actor: any) => void;
  setActorActive?: (actor: any) => void;
  currentParagraphActor?: IActor;
  currentParagraphActorsList: IActor[];
  isLoading: boolean;
}

const ActorsSidebar = ({
  actors,
  paragraphs,
  active,
  currentParagraphActor,
  currentParagraphActorsList,
  setActorActive,
  onClick,
  isLoading,
}: Props) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(
      updatePopup({
        popup: Popups.characterPopup,
        status: true,
        prefilled: {
          actors,
          paragraphs,
          active,
          setActorActive,
          currentParagraphActor,
          currentParagraphActorsList,
        },
      }),
    );
  };

  return (
    <Wrapper>
      <Content>
        <Title>Actors</Title>
        <ActorsWrapper>
          <ActorCardWrapper>
            {isLoading ? (
              <CircularProgress color="#009af7" />
            ) : (
              actors &&
              actors?.map((actor) => (
                <ActorCard
                  key={actor?.actorId}
                  actor={actor}
                  active={actor?.actorId === active}
                  onClick={onClick ? () => onClick(actor) : undefined}
                />
              ))
            )}
          </ActorCardWrapper>
          <ShowAll isLoading={isLoading} onClick={handleClick}>
            Show all
          </ShowAll>
        </ActorsWrapper>
        <MobileOnly>
          <ShowAll isLoading={isLoading} onClick={handleClick}>
            Show all
          </ShowAll>
        </MobileOnly>
      </Content>
    </Wrapper>
  );
};

const Content = styled("div")`
  position: fixed;
  top: 45px;
  left: 64px;
  max-height: 85vh;
  /* overflow: hidden; */
  width: 280px;
  display: flex;
  flex-direction: column;

  @media (max-width: 1251px) {
    left: 40px;
  }

  @media (max-width: 1001px) {
    position: static;
    width: 100%;
    display: block;
  }
`;

const Wrapper = styled("div")`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;

  @media (max-width: 1001px) {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-between;
  }
`;

const Title = styled.div`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 40px;
  line-height: 52px;
  letter-spacing: -3px;
  color: ${({ theme }) => theme.primaryText};
  order: 1;
  margin-bottom: 16px;

  @media (max-width: 1001px) {
    font-size: 32px;
    line-height: 40px;
    margin-bottom: 12px;
    width: 50%;
  }
`;

const ActorsWrapper = styled.div`
  background-color: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 16px;
  position: relative;
  order: 2;

  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 1001px) {
    border-radius: 0;
    background-color: transparent;
    box-shadow: none;
    overflow: hidden;
    order: 3;
    min-width: 100px;
  }
`;

const ActorCardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  gap: 8px;
  overflow: hidden;
  position: relative;

  flex: 1;
  align-content: flex-start;

  ::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /* box-shadow: ${({ theme }) => theme.cardShadow}; */
    z-index: 6;
    pointer-events: none;
  }

  ::after {
    content: "";
    position: absolute;
    bottom: 0px;
    left: 16px;
    width: 248px;
    background: ${({ theme }) => theme.sidebarShow};
    height: 156px;
    z-index: 5;
    pointer-events: none;
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

  @media (max-width: 1001px) {
    flex-wrap: nowrap;
    min-height: 68px;
    max-height: 68px;
    padding: 0;
    min-width: 100px;
    width: 100%;
    overflow: auto;

    ::-webkit-scrollbar {
      display: none;
    }

    ::after {
      display: none;
    }

    ::before {
      display: none;
    }
  }
`;

const ShowAll = styled.span<{ isLoading: boolean }>`
  display: flex;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.41px;
  background: ${({ theme }) => theme.button};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  cursor: pointer;

  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 6;

  ${({ isLoading }) =>
    isLoading &&
    `
    display: none;
  `}

  @media (max-width: 1001px) {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 1001px) {
    display: flex;
    order: 2;
    width: 50%;

    & > span {
      display: flex;
      position: initial;
      justify-content: flex-end;
    }
  }
`;

export default ActorsSidebar;
