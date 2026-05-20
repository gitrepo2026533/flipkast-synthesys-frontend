import { EditorState } from "draft-js";
import styled from "styled-components";
import { IActor } from "../../types/actor";
import { Paragraphs } from "../../types/project";
import Button, { ButtonThemes } from "../Button/Button";
import Dropdown from "../Dropdown/Dropdown";
import Editor from "../Editor/Editor";
import CircularProgress from "../Icons/CircularProgress";
import { PlusIcon } from "../Icons/PlusIcon";

interface Props {
  projectId?: number;
  route?: string;
  actors: IActor[];
  paragraphs?: Paragraphs[];
  setParagraphs?: any;
  actorActive?: number;
  setActorActive?: any;
  paragraphActive?: number;
  setParagraphActive?: any;
  isLoading: boolean;
  editorContent: any;
  setEditorContent: any;
  setFeatureActive: any;
  lastSel: any;
  setLastSel: any;
  forceSel: any;
  calcParagraphsLength: number[];
  styleMap: any;
}

const TextBlock = ({
  projectId,
  route,
  actors,
  paragraphs,
  setParagraphs,
  actorActive,
  setActorActive,
  paragraphActive,
  setParagraphActive,
  isLoading,
  editorContent,
  setEditorContent,
  setFeatureActive,
  lastSel,
  setLastSel,
  forceSel,
  calcParagraphsLength,
  styleMap,
}: Props) => {
  const textLength = calcParagraphsLength.reduce((start, current) => start + current, 0);

  const addParagraph = (id?: number) => {
    setEditorContent((prev: any) => [...prev, EditorState.moveFocusToEnd(EditorState.createEmpty())]);
    setParagraphActive(Number(paragraphs?.length) + 1);
    if (paragraphs && paragraphActive) {
      const newActor = paragraphs?.[paragraphActive - 1]?.actor;
      const newActorsList = paragraphs?.[paragraphActive - 1]?.actorsList;
      setParagraphs((prev: any) => [
        ...prev,
        {
          actor: newActor,
          actorsList: newActorsList,
          actorId: actorActive,
          order: id,
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
      ]);
    }
  };

  const handleEditorContent = (index: number) => (newEditorContent: any) => {
    setEditorContent(
      editorContent.map((content: any, order: number) => (order === index ? newEditorContent : content)),
    );
  };

  const handleTextParagraph = (order: number) => (payload: any[]) => {
    const newText = paragraphs?.map((paragraph) =>
      paragraph.order === order
        ? {
            ...paragraph,
            data: payload,
          }
        : paragraph,
    );
    setParagraphs(newText);
  };

  const handleDelete = (e: any, id: number) => {
    e.stopPropagation();

    const newParagraphs = paragraphs
      ?.filter((paragraph) => paragraph.order !== id)
      .map((paragraph, index) => ({ ...paragraph, order: index + 1 }));
    const editorIndex = paragraphs?.findIndex((paragraph) => paragraph.order === id);
    const newEditorContent = editorContent.filter((editor: EditorState, index: number) => index !== editorIndex);
    setParagraphs(newParagraphs);
    setEditorContent(newEditorContent);
    setParagraphActive(1);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <CircularProgress color="#009af7" />
      ) : (
        paragraphs &&
        paragraphs?.map((paragraph, order) => {
          const actor = actors?.find((actor) => actor?.actorId === paragraph.actorId);

          return (
            <ParagraphWrapper key={paragraph.order} onClick={() => setParagraphActive(paragraph.order)}>
              <Dropdown
                photo={actor?.photo || paragraph?.actor?.photo}
                name={actor?.name || paragraph?.actor?.name}
                actors={actors}
                currentParagraphActor={actor || paragraph?.actor}
                currentParagraphActorsList={paragraph?.actorsList || []}
                active={actor?.actorId || paragraph?.actor?.actorId}
                setActorActive={setActorActive}
                paragraphs={paragraphs}
                deleteDisplay={paragraphs.length === 1 ? false : true}
                onDelete={(e: any) => handleDelete(e, paragraph.order)}
              />
              <Editor
                index={order}
                projectId={projectId}
                route={route}
                data={paragraph.data}
                editorContent={editorContent[order]}
                setEditorContent={handleEditorContent(order)}
                handleTextParagraph={handleTextParagraph(order + 1)}
                setFeatureActive={setFeatureActive}
                lastSel={lastSel}
                setLastSel={setLastSel}
                forceSel={forceSel}
                addParagraph={addParagraph}
                paragraphs={paragraphs}
                styleMap={styleMap}
              />
            </ParagraphWrapper>
          );
        })
      )}
      <Footer>
        <Button
          buttonTheme={ButtonThemes.Transparent}
          icon={
            <PlusIconWrapper>
              <PlusIcon />
            </PlusIconWrapper>
          }
          text="Add paragraph"
          onClick={() => addParagraph((paragraphs?.length as number) + 1)}
        />
        <TextWrapper>
          <a
            href="https://flipcast.freshdesk.com/support/solutions/articles/13000100260-tips-for-life-like-voices-"
            target="_blank"
            rel="noreferrer"
          >
            <Tips>Tips</Tips>
          </a>
          <Text>{textLength}</Text>
        </TextWrapper>
      </Footer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.inputShadow};
  border-radius: 20px;
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: auto;
  padding: 20px 20px 0px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;

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

const ParagraphWrapper = styled.div``;

const Footer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: auto;
  position: sticky;
  background-color: ${({ theme }) => theme.primaryBackground};
  z-index: 5;
  bottom: -1px;
  padding-bottom: 20px;
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  a {
    display: flex;
  }
`;

const Tips = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-decoration: underline ${({ theme }) => theme.activeMenu};
  background: ${({ theme }) => theme.button};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const Text = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.4;
`;

const PlusIconWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.button};
  box-shadow: ${({ theme }) => theme.buttonShadow};
  border-radius: 50%;

  svg > path {
    fill: ${({ theme }) => theme.white};
  }
`;

export default TextBlock;
