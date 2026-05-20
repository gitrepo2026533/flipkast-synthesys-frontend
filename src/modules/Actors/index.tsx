import {
  convertFromRaw,
  convertToRaw,
  DraftInlineStyleType,
  EditorState,
  RawDraftInlineStyleRange,
  SelectionState,
} from "draft-js";
import * as Sentry from "@sentry/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ActorsSidebar from "../../components/ActorsSidebar/ActorsSidebar";
import Autosave from "../../components/Autosave/Autosave";
import Button, { ButtonThemes } from "../../components/Button/Button";
import IconButton from "../../components/Button/IconButton";
import CircularProgress from "../../components/Icons/CircularProgress";
import { ArrowRight, SearchFilterIcon, SearchIcon } from "../../components/Icons/Icons";
import Player from "../../components/Player/Player";
import ProfileActorSidebar from "../../components/ProfileActorSidebar/ProfileActorSidebar";
import TextBlock from "../../components/TextBlock/TextBlock";
import Textfield from "../../components/Textfield/Textfield";
import withPrivateRoute from "../../hocs/withPrivateRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
import { checkIfZoneCached, checkIfZoneMatchNoAuthor, getAllZones, getAudioList } from "../../lib/editorUtils";
import { dataToState } from "../../lib/projectUtils";
import { setInlineStyle } from "../../lib/setInlineStyle";
import { sidebarBoxes } from "../../mocks/sidebarBoxes";
import { clearActors, clearVoice, generateVoiceServer, getActorsServer } from "../../redux/actions/actorActions";
import { Popups, updatePopup } from "../../redux/actions/popupsActions";
import {
  clearCurrentProject,
  createProjectServer,
  getProjectListServer,
  getProjectServer,
  ProjectType,
  updateProjectLoading,
  updateProjectServer,
} from "../../redux/actions/projectAction";
import { getActorsList, getActorsListLoading } from "../../redux/reducers/actorReducer";
import {
  getAutoSaveLoading,
  getProject,
  getProjectAudio,
  getProjectList,
  getProjectListLoading,
} from "../../redux/reducers/projectReducer";
import { Paragraphs, Project, ProjectModules, Zone } from "../../types/project";
import { styleGenerator } from "../../components/Editor/Editor";
import { getFullImageUrl } from "../../lib/getFullImageUrl";
import { getEstimatedPopupIsOpen } from "../../redux/reducers/popupsReducer";
import EstimatedPopup from "../../components/Popups/EstimatedPopup";
import Tooltip from "../../components/Tooltip/Tooltip";
import { IActor } from "../../types/actor";
import ChatTrigger from "../Chat/components/ChatTrigger";
import ChatPopup from "../Chat/components/ChatPopup";
import { generateEditorStyle } from "../../lib/generateEditorStyle";
import { getMyProfileServer } from "../../redux/actions/profileActions";
import { getCheckCloneVoiceLoading } from "../../redux/reducers/profileReducer";
import { toast } from "react-toastify";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { SentryErrors } from "../../lib/sentry";

export interface GenerateAudioParams {
  onSuccess?: () => void;
  withSelectedZone?: boolean;
  startZone?: number;
}

const initialParagraphsData = [
  {
    actorId: 1,
    actor: {
      actorId: 1,
      actorTypeId: 1,
      flagPath: "",
      isBookmarked: false,
      language: "en-US",
      name: "Sonia",
      photo: "",
      audioSampleLink: "",
      brief: "",
      categoryType: "",
      content: "",
      mood: "",
      region: "",
      voiceAge: "",
      voiceName: "",
    },
    order: 1,
    data: [
      {
        text: "",
        features: [
          {
            key: "",
            value: "",
          },
        ],
      },
    ],
  },
];

const ActorsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [route, setRoute] = useState<string>("");
  const [isRouteHydrated, setIsRouteHydrated] = useState(false);
  const [isProjectHydrated, setIsProjectHydrated] = useState(false);

  const dispatch = useDispatch();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  const [paragraphs, setParagraphs] = useState<Paragraphs[]>(initialParagraphsData);
  const [paragraphActive, setParagraphActive] = useState<number>();
  const [editorContent, setEditorContent] = useState([EditorState.moveFocusToEnd(EditorState.createEmpty())]);
  const [lastSel, setLastSel] = useState(SelectionState.createEmpty(""));
  const [styleMap, setStyledMap] = useState<any>({
    pause: {
      backgroundColor: "#e859ff",
      borderRadius: "20px",
      width: "20px",
      color: "#fff",
      userModify: "read-only",
      padding: "2px 5px",
      fontSize: "11px",
      position: "relative",
      top: "-2px",
    },
    isActive_active: {
      borderRadius: "5px",
      border: "1px solid #009AF7",
    },
    isLoading_loading: {
      backgroundImage: "url('/images/editor/loading.gif')",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "40px",
      backgroundSize: "23px 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
    isGenerated_generated: {
      borderRadius: "5px",
      border: "1px dashed #009AF7",
    },
  });
  const [selectedActorsList, setSelectedActorsList] = useState([]);

  const [featureActive, setFeatureActive] = useState<number>();

  const isProjectRestored = useRef(false);

  const actorsList = useSelector(getActorsList);
  const isLoading = useSelector(getActorsListLoading);
  const estimatedPopupIsOpen = useSelector(getEstimatedPopupIsOpen);

  const projectList = useSelector(getProjectList);
  const projectListLoading = useSelector(getProjectListLoading);

  const project = useSelector(getProject);
  // const projectLoading = useSelector(getProjectLoading);
  const autoSaveLoading = useSelector(getAutoSaveLoading);

  const { cachedZonesAudio, loadingZonesAudio } = useSelector(getProjectAudio);

  const audioList = getAudioList(getAllZones(paragraphs), cachedZonesAudio);

  const actorId = paragraphs?.find((paragraph) => paragraph.order === paragraphActive)?.actorId;
  const actor = actorsList?.find((actor) => actor.actorId === actorId);
  const paragraphActor = paragraphs[(paragraphActive as number) - 1]?.actor;
  const paragraphActorsList = paragraphs[(paragraphActive as number) - 1]?.actorsList;

  const autosaveData: Project = {
    projectId: project?.projectId,
    projectTypeId: ProjectType.TTI,
    title: project?.title || `Project ${projectList?.length + 1}`,
    paragraphs,
  };

  const editorObj = editorContent.find((editor: any, index: number) => index + 1 === paragraphActive);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  const handlePlayAudioButtonClick = (startZone?: number) => {
    generateAudio({
      startZone,
      withSelectedZone: true,
    });
  };

  const getSelectedZone = () => {
    if (paragraphs.length === 0) {
      Sentry.captureException(new Error(SentryErrors.PROJECT_WITH_EMPTY_PARAGRAPHS.title), {
        tags: SentryErrors.PROJECT_WITH_EMPTY_PARAGRAPHS.tags,
        extra: {
          details: {
            projectId: project?.projectId,
          },
        },
      });
      toast.error(SentryErrors.PROJECT_WITH_EMPTY_PARAGRAPHS.toast);
      navigate("/");
      return;
    }

    const activeKey = lastSel.getAnchorKey();

    if (paragraphActive && activeKey) {
      const state = editorContent[paragraphActive - 1];
      let content = convertToRaw(state?.getCurrentContent());

      const index = content.blocks.findIndex((block) => block.key === activeKey) / 2;
      return paragraphs[paragraphActive - 1].data[index];
    }
  };

  const selectedZone = getSelectedZone();

  const generateAllAudios = ({ onSuccess, withSelectedZone = true }: GenerateAudioParams) => {
    // here we need to pick zones starting from 'selected paragraph'
    const paragraphsModified = removeEmptyParagrahs(removeEmptyZones(paragraphs));
    let allZones = getAllZones(paragraphsModified);
    if (selectedZone && withSelectedZone) {
      const currentZoneIndex = allZones.findIndex((zone) => checkIfZoneMatchNoAuthor(zone, selectedZone));
      allZones = allZones.slice(currentZoneIndex);
    }
    const nonCachedZones: Zone[] = [];
    // const nonCachedZones = allZones.filter((zone) => !checkIfZoneCached(zone, cachedZonesAudio));
    allZones.forEach((zone, index) => {
      if (!checkIfZoneCached(zone, cachedZonesAudio)) {
        nonCachedZones.push(zone);
      }
    });
    if (nonCachedZones.length > 0) {
      dispatch(generateVoiceServer({ data: nonCachedZones }));
    } else {
      onSuccess?.();
    }
  };

  const generateAudio = ({ onSuccess, withSelectedZone = true, startZone }: GenerateAudioParams) => {
    // const paragraphsModified = removeEmptyParagrahs(removeEmptyZones(JSON.parse(JSON.stringify(paragraphs))));
    const allZones = getAllZones(paragraphs);
    const currentZone = startZone || startZone === 0 ? allZones[startZone] : selectedZone;

    if (currentZone) {
      const currentZoneIndex = allZones.findIndex((zone) => checkIfZoneMatchNoAuthor(zone, currentZone));
      const finalCurrentZone = allZones[currentZoneIndex];
      const isZoneCached = checkIfZoneCached(finalCurrentZone, cachedZonesAudio);
      if (!isZoneCached) {
        dispatch(generateVoiceServer({ data: [finalCurrentZone] }));
      } else {
        onSuccess?.();
      }
    }
  };

  const handleRightSidebarOpen = () => {
    setRightSidebarOpen(!rightSidebarOpen);
  };

  useEffect(() => {
    setRoute(searchParams.get("projectId") || "");
    setIsRouteHydrated(true);
  }, [searchParams]);

  useEffect(() => {
    dispatch(clearActors());
    dispatch(clearVoice());
    dispatch(
      getActorsServer({
        keyword: search,
        pageNumber: 1,
        categoryType: [],
        voiceAge: [],
        isFeMale: null,
        mood: [],
        content: [],
        region: [],
        language: [],
        country: [],
        popular: true,
      }),
    );
    dispatch(getProjectListServer({ keyword: "" }));
  }, [search]);

  useEffect(() => {
    dispatch(clearCurrentProject());

    if (route) {
      dispatch(updateProjectLoading({ module: ProjectModules.projectList, isLoading: true }));
      dispatch(getProjectServer(parseInt(route)));
    }
  }, [route]);

  useEffect(() => {
    setParagraphActive(1);
  }, [project]);

  useEffect(() => {
    if (isRouteHydrated && !isProjectRestored.current && project && route) {
      const newEditorContent = project?.paragraphs?.map((paragraph) => dataToState(paragraph.data));
      if (newEditorContent.length) {
        let firstEditor = newEditorContent[0];
        firstEditor = EditorState.moveFocusToEnd(firstEditor);
        newEditorContent[0] = EditorState.forceSelection(
          EditorState.createWithContent(
            convertFromRaw(
              setInlineStyle(convertToRaw(firstEditor.getCurrentContent()), firstEditor.getSelection().getAnchorKey(), {
                isActive: "active",
              }),
            ),
          ),
          firstEditor.getSelection(),
        );
        setLastSel(firstEditor.getSelection());
      }

      setEditorContent(newEditorContent);
      setParagraphs(
        project?.paragraphs.map((paragraph, index) => {
          paragraph.order = index + 1;
          return paragraph;
        }),
      );

      isProjectRestored.current = true;
      setIsProjectHydrated(true);
    }
  }, [project, route, isRouteHydrated]);

  useEffect(() => {
    if (isRouteHydrated && !isProjectRestored.current && !project && !route && actorsList && actorsList.length) {
      setParagraphs(
        paragraphs.map((paragraph) => {
          if (paragraph.order === 1) {
            const newActor = actorsList?.[0];
            return { ...paragraph, actor: newActor, actorsList: [newActor], actorId: newActor?.actorId };
          } else {
            return paragraph;
          }
        }),
      );
      setIsProjectHydrated(true);
      isProjectRestored.current = true;
    }
  }, [project, route, actorsList, isRouteHydrated]);

  const calcParagraphsLength = (paragraphs: Paragraphs[]): number[] =>
    paragraphs.map((paragraph) => paragraph.data.reduce((acc, data) => (acc += data.text.length), 0));

  useEffect(() => {
    if (project?.projectId && !route) {
      // navigate(`/actors?projectId=${project?.projectId}`);
    }
  }, [project?.projectId, route]);

  useEffect(() => {
    for (let i = 0; i < editorContent.length; i++) {
      const content = convertToRaw(editorContent[i].getCurrentContent());
      content.blocks.forEach((block) => {
        const element = document.querySelector(`span[data-offset-key="${block.key}-0-0"]`) as HTMLElement;
        let paddings: number[] = [];
        let bgSizes: string[] = [];

        const url = block.inlineStyleRanges
          .reduce((acc: any, elem: any) => {
            if (styleMap[elem.style] && styleMap[elem.style]?.backgroundImage) {
              const img = new Image();
              img.src = styleMap[elem.style].backgroundImage.split("'")[1];
              img.width *= 28 / img.height;

              acc.push(styleMap[elem.style].backgroundImage);
              paddings.push(parseInt(styleMap[elem.style].paddingRight.replace("px", "")));
              bgSizes.push(styleMap[elem.style].backgroundSize);
            }

            return acc;
          }, [])
          .join(",");

        if (element && paddings.length) {
          block.inlineStyleRanges.forEach((inline) => {
            if (styleMap[inline.style]) {
              Object.entries(styleMap[inline.style]).forEach(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                (style) => (element.style[style[0]] = style[1]),
              );
            }
          });
          element.style.backgroundImage = url;
          element.style.paddingRight = `${paddings.reduce((acc, pd) => (acc += pd), 0)}px`;
          element.style.backgroundPosition = paddings
            .map((pd, index, inital) => `calc(100% - ${sum(inital.slice(0, index))}px) 2px`, 0)
            .join(",");
          element.style.backgroundSize = bgSizes.join(",");
        }
      });
    }
  }, [editorContent]);

  useEffect(() => {
    if (window.innerWidth <= 1000) setRightSidebarOpen(false);
    else setRightSidebarOpen(true);
  }, []);

  const handleOpenPopup = () => {
    dispatch(
      updatePopup({
        popup: Popups.characterPopup,
        status: true,
        prefilled: {
          actors: actorsList,
          active: actorId,
          paragraphs,
          currentParagraphActor: actor || paragraphActor,
          currentParagraphActorsList: paragraphActorsList || [],
          setActorActive,
        },
      }),
    );
  };

  // this will change actve actor immediatelye
  const handleActorSidebarClick = (actor: IActor) => {
    setParagraphs(
      paragraphs?.map((paragraph) => {
        const isActorExist = paragraph?.actorsList?.find((item) => item.actorId === actor.actorId);

        if (paragraph.order === paragraphActive) {
          const newActorsList = isActorExist ? paragraph?.actorsList : [actor, ...(paragraph?.actorsList || [])];
          return {
            ...paragraph,
            actorId: actor.actorId,
            actor,
            actorsList: newActorsList,
          };
        } else {
          const newActorsList = isActorExist ? paragraph?.actorsList : [...(paragraph?.actorsList || []), actor];

          return {
            ...paragraph,
            actorsList: newActorsList,
          };
        }
      }),
    );
  };

  // this will add actor to array
  const setActorActive = (actors: IActor[]) => {
    const selectedActor = actors?.[0];
    setParagraphs(
      paragraphs?.map((paragraph) => {
        if (paragraph.order === paragraphActive) {
          return {
            ...paragraph,
            actorId: selectedActor.actorId,
            actor: selectedActor,
            actorsList: actors,
          };
        } else {
          // we need to make sure that actors[0].id === selectedActor.actorId;
          // in this else it will definitely != so we need to parse it.
          const mutatedActors = [...actors];
          let newMutatedActors = [...mutatedActors];
          let savedItem = null;

          const indexOfSelectedActor = mutatedActors.findIndex((item) => {
            return item.actorId === paragraph.actorId;
          });

          if (indexOfSelectedActor > -1) {
            savedItem = mutatedActors[indexOfSelectedActor];
            mutatedActors.splice(indexOfSelectedActor, 1);
          }

          if (savedItem) {
            newMutatedActors = [savedItem, ...mutatedActors];
          }
          return {
            ...paragraph,
            actorsList: newMutatedActors,
          };
        }
      }),
    );
  };

  const handleParagraphActive = (id: number) => {
    setParagraphActive(id);
  };

  const handleEditorContent = (index?: number) => (newEditorContent: any) => {
    setEditorContent(
      editorContent.map((content: any, order: number) => (order === index ? newEditorContent : content)),
    );
  };

  const createProject = () =>
    handleProjectCreate({
      projectTypeId: ProjectType.TTI,
      title: `Project ${projectList?.length + 1}`,
      paragraphs,
    });

  const updateProject = () =>
    handleProjectUpdate({
      projectId: project?.projectId,
      projectTypeId: ProjectType.TTI,
      title: project?.title || "",
      paragraphs,
    });

  const removeEmptyParagrahs = (paragraphs: Paragraphs[]) => {
    const newParagraphs = paragraphs.filter((paragraph) => paragraph.data.some((data) => data.text.length));

    if (!newParagraphs.length) return paragraphs.slice(0, 1);

    return newParagraphs;
  };

  const removeEmptyZones = (paragraphst: Paragraphs[]) => {
    paragraphst.forEach((paragraph) => (paragraph.data = paragraph.data.filter((data) => data.text !== "")));

    return paragraphst;
  };

  const handleProjectCreate = (newData: Project) => {
    newData.paragraphs = removeEmptyZones(JSON.parse(JSON.stringify(newData.paragraphs)));
    newData.paragraphs = removeEmptyParagrahs(newData.paragraphs);
    if (newData.paragraphs.length === 0) {
      alert("Warning! Autosave disabled, please refresh the page and contact support with code 1007");
      return;
    }
    dispatch(createProjectServer(newData));
  };

  const handleProjectUpdate = (newData: Project) => {
    newData.paragraphs = removeEmptyZones(JSON.parse(JSON.stringify(newData.paragraphs)));
    newData.paragraphs = removeEmptyParagrahs(newData.paragraphs);
    if (newData.paragraphs.length === 0) {
      // alert("Warning! Autosave disabled, please refresh the page and contact support with code 1007");
      return;
    }
    if (newData.paragraphs[0].data.length === 0) {
      // toast.error("Autosave dsiabled, please contact support with code 1008 if you can't save the project");
      return;
    }
    dispatch(
      updateProjectServer(
        newData.projectTypeId,
        newData.projectId,
        newData.title,
        newData.paragraphs,
        "projectSavingEvent",
      ),
    );
  };

  const sum = (input: number[]) => {
    if (toString.call(input) !== "[object Array]") return false;

    let total = 0;
    for (let i = 0; i < input.length; i++) {
      if (isNaN(input[i])) {
        continue;
      }
      total += Number(input[i]);
    }
    return total;
  };

  const handleCloseEstimatedPopup = () => {
    dispatch(updatePopup({ popup: Popups.estimatedPopup, status: false }));
  };

  useEffect(() => {
    let generatedStyledMap = {};

    const styles = sidebarBoxes.reduce((acc, box, index) => {
      box.values.forEach((value) => {
        acc[`${box.title}_${value.text}`] = generateEditorStyle(value.text, box.background);
      });

      return acc;
    }, {} as any);

    generatedStyledMap = {
      ...styleMap,
      ...styles,
    };

    setStyledMap(generatedStyledMap);
  }, []);

  const setZonesStatus = (state: EditorState, order: number) => {
    // return state;
    let content = convertToRaw(state.getCurrentContent());
    const allZones = getAllZones([paragraphs[order]]);
    content.blocks = content.blocks.map((block, blockIndex) => {
      if (blockIndex % 2 === 1) return block;

      let zone = allZones[blockIndex / 2];
      let statusStyles: RawDraftInlineStyleRange | null = null;

      if (zone) {
        zone.features = zone.features.filter((feature) => feature.key !== "isLoading");
        block.inlineStyleRanges = block.inlineStyleRanges.filter(
          (inline) => inline.style !== ("isLoading_loading" as DraftInlineStyleType),
        );
      }
      if (zone && checkIfZoneCached(zone, loadingZonesAudio))
        statusStyles = { offset: 0, length: block.text.length, style: "isLoading_loading" as DraftInlineStyleType };

      if (zone && checkIfZoneCached(zone, cachedZonesAudio)) {
        statusStyles = { offset: 0, length: block.text.length, style: "isGenerated_generated" as DraftInlineStyleType };
      }
      if (statusStyles) block.inlineStyleRanges.push(statusStyles);

      return block;
    });

    const newState = EditorState.forceSelection(
      EditorState.createWithContent(convertFromRaw(content)),
      state.getSelection(),
    );

    return newState;
  };

  useEffect(() => {
    setEditorContent((prev) => prev.map((state, index) => setZonesStatus(state, index)));
  }, [cachedZonesAudio, loadingZonesAudio]);

  return (
    <>
      <Wrapper active={rightSidebarOpen}>
        <PageWrapper active={rightSidebarOpen}>
          <DashboardLayout
            navActions={
              <DesktopOnly>
                <Link to="/" style={{ marginRight: "30px", marginTop: "10px" }}>
                  <Button
                    buttonTheme={ButtonThemes.Secondary}
                    icon={<img src="/images/arrow-left.svg" />}
                    style={{
                      position: "relative",
                      zIndex: "100",
                    }}
                    text="Back"
                  />
                </Link>
                <SearchBox>
                  <Textfield
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search voice actors"
                    startAdornment={<SearchIcon />}
                    endAdornment={<SearchFilterIcon />}
                    endAdornmentClick={handleOpenPopup}
                  />
                  <DesktopOnly>
                    <Button
                      text={autoSaveLoading ? "Saving..." : "Save project"}
                      onClick={project?.projectId ? updateProject : createProject}
                    />
                  </DesktopOnly>
                </SearchBox>
              </DesktopOnly>
            }
          >
            <Content>
              <MobileOnly>
                <MobileRow>
                  <Button
                    buttonTheme={ButtonThemes.Secondary}
                    icon={<img src="/images/arrow-left.svg" />}
                    text="Back"
                    style={{
                      position: "relative",
                      zIndex: "100",
                    }}
                  />
                </MobileRow>
              </MobileOnly>
              <ActorsSidebar
                actors={actorsList}
                paragraphs={paragraphs}
                active={actorId}
                currentParagraphActor={actor || paragraphActor}
                currentParagraphActorsList={paragraphActorsList || []}
                onClick={handleActorSidebarClick}
                setActorActive={setActorActive}
                isLoading={isLoading}
              />
              <Right>
                <ActionsWrapper>
                  <MobileOnly>
                    <SearchBox>
                      <Textfield
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search voice actors"
                        startAdornment={<SearchIcon />}
                        endAdornment={<SearchFilterIcon />}
                        endAdornmentClick={handleOpenPopup}
                      />
                      <DesktopOnly>
                        <Button
                          text={autoSaveLoading ? "Saving..." : "Save project"}
                          onClick={project?.projectId ? updateProject : createProject}
                        />
                      </DesktopOnly>
                    </SearchBox>
                  </MobileOnly>
                </ActionsWrapper>
                <TitleWrapper>
                  {isLoading ? (
                    <CircularProgress color="#009af7" />
                  ) : (
                    <>
                      <span>{actor?.name || paragraphActor?.name}</span>
                      <Flag>
                        <img
                          src={
                            actor?.flagPath || paragraphActor?.flagPath
                              ? getFullImageUrl(actor?.flagPath || paragraphActor?.flagPath)
                              : "/images/flag.png"
                          }
                          alt=""
                        />
                        {(actor?.languageName || paragraphActor?.languageName) && (
                          <Tooltip text={actor?.languageName || paragraphActor?.languageName} />
                        )}
                      </Flag>
                    </>
                  )}
                </TitleWrapper>
                <TextBlock
                  projectId={project?.projectId}
                  route={route}
                  actors={actorsList}
                  paragraphs={paragraphs}
                  setParagraphs={setParagraphs}
                  actorActive={actorId}
                  setActorActive={setActorActive}
                  paragraphActive={paragraphActive}
                  setParagraphActive={handleParagraphActive}
                  isLoading={projectListLoading || (!route && isLoading)}
                  editorContent={editorContent}
                  setEditorContent={setEditorContent}
                  setFeatureActive={setFeatureActive}
                  lastSel={lastSel}
                  setLastSel={setLastSel}
                  forceSel={rightSidebarOpen}
                  calcParagraphsLength={calcParagraphsLength(paragraphs)}
                  styleMap={styleMap}
                />
                <Player
                  selectedZone={selectedZone}
                  audioList={audioList}
                  loadingZonesAudio={loadingZonesAudio}
                  paragraphs={paragraphs}
                  generateAudio={handlePlayAudioButtonClick}
                  generateZoneByIndex={(index: number) => handlePlayAudioButtonClick(index)}
                />
                <MobileOnly>
                  <Button text="Save project" onClick={project?.projectId ? updateProject : createProject} />
                </MobileOnly>
              </Right>
            </Content>
          </DashboardLayout>
          <DesktopOnly>
            <IconButtonWrapper active={rightSidebarOpen}>
              <IconButton
                icon={<ArrowRight />}
                onClick={paragraphActive && selectedZone ? handleRightSidebarOpen : undefined}
              />
            </IconButtonWrapper>
          </DesktopOnly>
        </PageWrapper>
        <ProfileActorSidebar
          featureActive={featureActive}
          editorContent={editorObj}
          setEditorContent={handleEditorContent(((paragraphActive as number) || 1) - 1)}
          active={rightSidebarOpen}
          actor={actor}
          sidebarBoxes={sidebarBoxes}
          paragraphActive={paragraphActive}
          paragraphs={paragraphs}
          setParagraphs={setParagraphs}
          lastSel={lastSel}
          paragraphActor={paragraphActor}
          selectedZone={selectedZone}
        />
        <MobileOnly>
          <IconButtonWrapper active={rightSidebarOpen}>
            <IconButton icon={<ArrowRight />} onClick={handleRightSidebarOpen} />
          </IconButtonWrapper>
        </MobileOnly>
        <Autosave
          isProjectHydrated={isProjectHydrated}
          data={autosaveData}
          onProjectCreate={handleProjectCreate}
          onProjectUpdate={handleProjectUpdate}
        />
      </Wrapper>
      {estimatedPopupIsOpen && (
        <EstimatedPopup
          paragraphs={paragraphs}
          cachedZonesAudio={cachedZonesAudio}
          open={estimatedPopupIsOpen}
          onClose={handleCloseEstimatedPopup}
          generateAudio={generateAllAudios}
        />
      )}
      <ChatTrigger />
      <ChatPopup />
    </>
  );
};

const Wrapper = styled("div")<{ active: boolean }>`
  background-color: ${({ theme }) => theme.secondaryBackground};
  width: 100%;
  height: 100vh;
  padding: 24px;
  display: flex;
  position: relative;
  overflow: hidden;

  ${({ active }) =>
    active &&
    `
      gap: 8px;      
  `};

  @media (max-width: 1001px) {
    padding: 0;
    align-items: initial;
    justify-content: initial;

    ${({ active }) =>
      active &&
      `
      gap: 0;      
  `}
  }
`;

const PageWrapper = styled("div")<{ active: boolean }>`
  background-color: ${({ theme }) => theme.primaryBackground};
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 32px;
  position: relative;

  @media (max-width: 1001px) {
    border-radius: 0;
    visibility: visible;

    ${({ active }) =>
      active &&
      `
      width: 0%;
      min-width: 0%;
      height: 0;
      visibility: hidden;
      overflow: hidden auto;
      opacity: 1;
      transition: 0.2s;      
  `}
  }
`;

const Content = styled("div")`
  display: flex;
  gap: 28px;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1001px) {
    flex-direction: column;
    gap: 0;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 1251px) {
    flex-direction: column;
    align-items: initial;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  input {
    width: 320px;
  }

  button {
    width: 152px;
  }

  @media (max-width: 1251px) {
    flex-direction: column;
    align-items: initial;

    input,
    button {
      width: 100%;
    }

    input {
      order: 1;
    }

    button {
      order: 3;
    }
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 12px;
  margin-bottom: 16px;

  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    letter-spacing: -1px;
    color: ${({ theme }) => theme.primaryText};
  }

  img {
    width: 30px;
  }

  @media (max-width: 1001px) {
    margin-top: 32px;
  }
`;

const Flag = styled.div`
  position: relative;
  min-width: 90px;
  max-width: 250px;
  width: 100%;

  :hover > div {
    opacity: 1;
    visibility: visible;
  }
`;

const IconButtonWrapper = styled.div<{ active?: boolean }>`
  position: absolute;
  top: calc(50% - 18px);
  right: -16px;
  transform: rotate(-180deg);
  transition: 0.2s;
  width: 48px;

  & > button {
    box-shadow: none;
  }

  ${({ active }) =>
    active &&
    `
    transform: rotate(0);
    right: -36px;  
  `}

  @media (max-width: 1001px) {
    right: 0;

    & > button {
      width: 40px;
      height: 40px;
      border: 2px solid ${({ theme }) => theme.primaryBackground};
      border-radius: 0 12px 12px 0;
    }

    ${({ active }) =>
      active &&
      `
      right: auto;
      left: 0;  
  `}
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 1001px) {
    display: flex;
  }
`;

const DesktopOnly = styled.div`
  display: flex;

  @media (max-width: 1001px) {
    display: none;
  }
`;

const ButtonWrapper = styled.div`
  margin-right: 10px;

  button {
    width: 152px;
  }

  @media (max-width: 1251px) {
    margin-left: auto;

    button {
      width: 152px;
    }
  }
`;

const MobileRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export default withPrivateRoute(ActorsPage);
