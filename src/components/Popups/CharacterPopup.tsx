import styled from "styled-components";
import { categories } from "../../mocks/character";
import Button, { ButtonThemes } from "../Button/Button";
import CharacterCard from "../CharacterCard/CharacterCard";
import CharacterSidebar from "../CharacterSidebar/CharacterSidebar";
import Chip from "../Chip/Chip";
import { ClockIcon } from "../Icons/ClockIcon";
import { LikeActiveIcon, LikeIcon, SearchFilterIcon, SearchIcon, StarIcon } from "../Icons/Icons";
import Modal from "../Modal/Modal";
import Textfield from "../Textfield/Textfield";
import { useEffect, useRef, useState } from "react";
import CharacterCategory from "../CharacterCategory/CharacterCategory";
import CloseIconV2 from "../Icons/CloseIconV2";
import { getPrefilled } from "../../redux/reducers/popupsReducer";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  getHasMoreActors,
  getCurrentPageActors,
  getActorsList,
  searchResultLoading,
  filterResultLoading,
} from "../../redux/reducers/actorReducer";
import { useDispatch } from "react-redux";
import {
  bookmarkActorServer,
  clearActors,
  clearSearch,
  filterActorLoading,
  getActorsServer,
  searchActorResultLoading,
} from "../../redux/actions/actorActions";
import CardsLoader from "../CardsLoader/CardsLoader";
import { IActor } from "../../types/actor";
import debounce from "lodash.debounce";
import { getFullImageUrl } from "../../lib/getFullImageUrl";
import { Paragraphs } from "../../types/project";

interface Props {
  open: boolean;
  onClose: () => void;
}

function getWindowDimensions() {
  const { innerWidth: width } = window;
  return {
    width,
  };
}

const searchTimeoutDelay = 500;

const CharacterPopup = ({ open, onClose }: Props) => {
  const dispatch = useDispatch();
  const isFirstRender = useRef(true);
  const [screen, setScreen] = useState({
    popular: false,
    history: false,
    bookmark: false,
  });
  const [openMobileSelectList, setOpenMobileSelectList] = useState<boolean>(false);
  const [windowDimensions, setWindowDimensions] = useState<Record<string, number>>(getWindowDimensions());
  const [active, setActive] = useState<IActor[]>([]);
  const [activePlaying, setActivePlaying] = useState<number>();
  const [search, setSearch] = useState("");
  const prefilled = useSelector(getPrefilled);
  const actors = useSelector(getActorsList);
  const hasMore = useSelector(getHasMoreActors);
  const currentPage = useSelector(getCurrentPageActors);
  const searchLoading = useSelector(searchResultLoading);
  const filterLoading = useSelector(filterResultLoading);

  const [filters, setFilters] = useState<any>({
    categoryType: [],
    voiceAge: [],
    isFeMale: [],
    mood: [],
    content: [],
    region: [],
    country: [],
    language: [],
  });

  const handleScreenChange = (e: any, key: "popular" | "history" | "bookmark", value: any) => {
    e.preventDefault();

    const newValue = {
      [key]: !value,
    };

    setScreen({ popular: false, history: false, bookmark: false, ...newValue });
  };

  const allFilters = filters.categoryType
    .concat(
      filters.voiceAge,
      filters.isFeMale,
      filters.mood,
      filters.content,
      filters.region,
      filters.country,
      filters.language,
    )
    .map((item: any) => {
      const filterObjArray = Object.entries(filters).map(([key, value]) => {
        return {
          key,
          value,
        };
      });

      const newKey = filterObjArray?.find(({ value }: any) => value.includes(item))?.key;

      return {
        key: newKey,
        item,
      };
    });

  const debounceHandleGetActors = useRef(
    debounce(async (search?: string, filters?: any) => {
      dispatch(
        getActorsServer({
          keyword: search,
          pageNumber: 1,
          ...filters,
          isFeMale: filters.isFeMale.length ? (filters.isFeMale[0] === "Male" ? false : true) : null,
        }),
      );
    }, searchTimeoutDelay),
  ).current;

  useEffect(() => {
    if (!prefilled.currentParagraphActorsList && !prefilled.currentParagraphActor) {
      alert("Hey please contact support in case you see this error, code: 1000");
      throw new Error("Hey please contact support in case you see this error, code: 1000");
    }

    const activeActors = prefilled.currentParagraphActorsList
      ? prefilled.currentParagraphActorsList
      : [prefilled.currentParagraphActor];
    setActive(activeActors);
  }, [prefilled]);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowDimensions.width > 735) {
      setOpenMobileSelectList(false);
    }
  }, [windowDimensions]);

  useEffect(() => {
    dispatch(searchActorResultLoading(true));
    dispatch(clearActors());
    debounceHandleGetActors(search, filters);
  }, [search]);

  useEffect(() => {
    if (!isFirstRender.current) {
      dispatch(clearActors());
      dispatch(filterActorLoading(true));
      dispatch(
        getActorsServer({
          keyword: search,
          pageNumber: 1,
          ...filters,
          isFeMale: filters.isFeMale.length ? (filters.isFeMale[0] === "Male" ? false : true) : null,
          bookmarked: screen.bookmark,
          popular: screen.popular,
          history: screen.history,
        }),
      );
    }
    isFirstRender.current = false;
  }, [screen]);

  useEffect(() => {
    dispatch(filterActorLoading(true));
    dispatch(clearActors());
    debounceHandleGetActors(search, filters);
  }, [filters]);

  const handleActive = (actor: IActor) => {
    const isCurrentActorActive = active.find((activeActor) => activeActor.actorId === actor.actorId);
    const isAuthorSelectedForAnyParagraph = prefilled.paragraphs
      .map((paragraph: Paragraphs) => paragraph.actorId)
      .includes(actor.actorId);

    if (isCurrentActorActive) {
      if (active.length === 1) return;
      if (isAuthorSelectedForAnyParagraph) {
        toast.error(
          "You can't remove this character, because it is selected in a different paragraph. If you think it is a mistake, contact support with code: 1001",
        );
        return;
      }
      setActive(active.filter((activeActor) => activeActor.actorId !== actor.actorId));
    } else {
      setActive([...active, actor]);
    }
  };

  const handleActivePlaying = (id: number) => {
    setActivePlaying(id);
  };

  const onSave = () => {
    const newActors = active;
    prefilled?.setActorActive([...newActors]);
    handleClose();
  };

  const handleClose = () => {
    dispatch(clearSearch());
    setSearch("");
    onClose();
  };

  const handleFilterDelete = (
    key: "categoryType" | "voiceAge" | "isFeMale" | "mood" | "content" | "region" | "language" | "country" | string,
    item: string,
  ) => {
    const newValue = {
      [key]: filters[key].filter((filter: any) => filter !== item) || [],
    };

    setFilters({ ...filters, ...newValue });
  };

  const fetchMore = (search: string) => {
    dispatch(
      getActorsServer({
        keyword: search,
        pageNumber: currentPage + 1,
        ...filters,
        isFeMale: filters.isFeMale.length ? (filters.isFeMale[0] === "Male" ? false : true) : null,
      }),
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  const handleBookmarked = (e: any, id: number) => {
    e.stopPropagation();

    const isBookmarked = actors?.find((actor) => actor.actorId === id)?.isBookmarked;

    if (isBookmarked) dispatch(bookmarkActorServer(id, false, screen.bookmark));
    else dispatch(bookmarkActorServer(id, true));
  };

  return (
    <Modal className="character" open={open} onClose={handleClose} closeIcon={false} maxWidth={1248} maxHeight={778}>
      <Content>
        <MobileOnlyTitleWrapper>
          <Title>Actors</Title>
          <ClockWrapper>
            <ClockIcon /> <span>6 sec</span>
          </ClockWrapper>
        </MobileOnlyTitleWrapper>
        <CharacterSidebar categories={categories} filters={filters} setFilters={setFilters} title="Actors" />
        <Right>
          <Heading>
            <ButtonWrapper>
              <Button
                buttonTheme={ButtonThemes.Transparent}
                text="Popular"
                icon={<StarIcon />}
                onClick={(e) => handleScreenChange(e, "popular", screen.popular)}
              />
              <Button
                buttonTheme={ButtonThemes.Transparent}
                text="History"
                icon={<ClockIcon />}
                onClick={(e) => handleScreenChange(e, "history", screen.history)}
              />
              <Button
                buttonTheme={ButtonThemes.Transparent}
                text="Bookmark"
                icon={!screen.bookmark ? <LikeIcon /> : <LikeActiveIcon />}
                onClick={(e) => handleScreenChange(e, "bookmark", screen.bookmark)}
              />
            </ButtonWrapper>
            <TextfieldWrapper>
              <Textfield
                value={search}
                placeholder="Search for voice actors, languages etc."
                startAdornment={<SearchIcon />}
                onChange={handleSearchChange}
              />
              <MobileOnlyFilterButton onClick={() => setOpenMobileSelectList(!openMobileSelectList)}>
                {openMobileSelectList ? <CloseIconV2 /> : <SearchFilterIcon />}
              </MobileOnlyFilterButton>
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
            {allFilters.map(({ key, item }: any, index: number) => (
              <Chip key={index} title={item} onRemove={() => handleFilterDelete(key, item)} />
            ))}
          </ChipWrapper>
          <CharacterCardsWrapper id="scrollableDiv">
            <InfiniteScroll
              next={() => !searchLoading && !filterLoading && fetchMore(search)}
              hasMore={hasMore}
              loader={!screen.bookmark || !screen.history || !screen.popular ? <CardsLoader /> : null}
              dataLength={actors?.length}
              style={{ display: "contents" }}
              scrollableTarget="scrollableDiv"
            >
              {actors &&
                actors?.map((actor) => {
                  const isCurrentActorActive = !!active.find((activeActor) => activeActor.actorId === actor.actorId);
                  return (
                    <CharacterCard
                      actor={actor}
                      key={actor.actorId}
                      flag={actor.flagPath ? getFullImageUrl(actor.flagPath) : "/images/flag.png"}
                      languageName={actor.languageName?.split(" ")[0]}
                      photo={actor.photo}
                      name={actor.name}
                      isBookmarked={actor.isBookmarked}
                      audioSampleLink={actor.audioSampleLink}
                      active={isCurrentActorActive}
                      activePlaying={actor.actorId === activePlaying}
                      handleActive={() => handleActive(actor)}
                      handleActivePlaying={() => handleActivePlaying(actor.actorId)}
                      handleBookmarked={(e: any) => handleBookmarked(e, actor.actorId)}
                    />
                  );
                })}
            </InfiniteScroll>
          </CharacterCardsWrapper>
          <ActionsWrapper>
            <Button text="Cancel" onClick={handleClose} buttonTheme={ButtonThemes.Outline} />
            <Button text="Add" onClick={onSave} />
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
  /* gap: 28px; */
  @media (max-width: 735px) {
    gap: 15px;
    flex-direction: column;
  }

  @media (max-height: 400px) {
    gap: 5px;
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
const ClockWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 17px;
    height: 17px;

    path {
      fill: ${({ theme }) => theme.activeMenu};
    }
  }

  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    background: ${({ theme }) => theme.button};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;

    @media (max-width: 600px) and (max-height: 400px), (max-height: 720px) {
      font-size: 12px;
      line-height: 16px;
    }
  }
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

const CharacterCardsWrapper = styled.div`
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

  @media (max-height: 660px) {
    grid-template-columns: repeat(3, 216px);
  }

  @media (max-width: 949px) {
    grid-template-columns: repeat(2, 216px);
  }

  @media (max-width: 735px) {
    margin-top: 0;
  }

  @media (max-width: 735px) and (max-height: 660px) {
    margin-top: 0;
  }

  @media (max-width: 515px) {
    position: inherit;
    margin-top: 0;
  }

  @media (max-width: 515px) {
    grid-template-columns: repeat(2, 1fr);
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
  z-index: 700;

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
  z-index: 15;
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

export default CharacterPopup;
