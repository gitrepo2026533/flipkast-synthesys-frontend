import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import React, { useState } from "react";
import styled from "styled-components";

import ProfileActorSidebarBox from "./ProfileActorSidebarBox";
import { Block } from "../Editor/Editor";
import { IActor } from "../../types/actor";
import { SidebarBox } from "../../types/sidebarBox";
import { setInlineStyle } from "../../lib/setInlineStyle";
import { DropdownIcon } from "../Icons/Icons";
import IconButton, { IconButtonThemes } from "../Button/IconButton";

interface Props {
  active?: boolean;
  featureActive?: number;
  sidebarBoxes: SidebarBox[];
  actor: IActor | undefined;
  editorContent: any;
  setEditorContent: any;
  paragraphActive: any;
  paragraphs: any;
  setParagraphs: any;
  lastSel: any;
  paragraphActor: IActor | undefined;
  selectedZone: any;
}

const ProfileActorSidebar = ({
  active,
  featureActive,
  actor,
  sidebarBoxes,
  editorContent,
  setEditorContent,
  paragraphActive,
  paragraphs,
  setParagraphs,
  lastSel,
  paragraphActor,
  selectedZone,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = (value: string, values: any) => {
    const newValue = { key: "style", value };
    const newParagraphs = paragraphs.map((paragraph: any) =>
      paragraph.order === paragraphActive
        ? {
            ...paragraph,
            data: paragraph.data.map((data: any, index: number) =>
              index === (featureActive as number) / 2
                ? {
                    ...data,
                    features: data.features.map((features: any) => (features.key === "style" ? newValue : features)),
                  }
                : data,
            ),
          }
        : paragraph,
    );

    setParagraphs(newParagraphs);

    let state = EditorState.forceSelection(editorContent, lastSel);
    const valuesIndex = values.findIndex((val: any) => val.text === value);

    handleChangeStyle({ style: values[valuesIndex].text }, state);
    setSelectedOption(value);
    setIsOpen(false);
  };

  const sidebarBox = sidebarBoxes.filter(
    (box) => box.actorTypeId === (actor?.actorTypeId || paragraphActor?.actorTypeId),
  );

  const stylesValues = actor?.styles?.length
    ? actor?.styles?.split(",").map((style, index: number) => {
        return {
          id: index,
          text: style.charAt(0).toUpperCase() + style.slice(1),
          label: style.charAt(0).toUpperCase() + style.slice(1),
        };
      })
    : "";

  const styles = [
    {
      id: 20,
      title: "style",
      background: "#779930",
      defaultValue: "General",
      values: stylesValues,
      defaultTitle: "style",
    },
  ];

  const stylesSidebar =
    actor?.actorId === 1 && actor?.language?.slice(0, 5) === "en-US"
      ? sidebarBox.filter((box) => box.title === "style")
      : stylesValues.length
      ? styles
      : [];

  const handleChangeStyle = (style: { [s: string]: unknown } | ArrayLike<unknown>, state: any) => {
    let content: any = convertToRaw(state.getCurrentContent());
    const selection = state.getSelection();
    const selectionKey = selection.getAnchorKey();

    if (!Object.entries(style).length) return;

    content = setInlineStyle(content, selectionKey, style);

    setEditorContent(EditorState.forceSelection(EditorState.createWithContent(convertFromRaw(content)), selection));
  };

  const setTimerValue = ({ state, selectionKey, value }: any) => {
    let content = convertToRaw(state.getCurrentContent());
    const selectionIndex = content.blocks.findIndex((block) => block.key === selectionKey);
    const timerIndex = selectionIndex + 1;
    value += "s";

    if (content.blocks[timerIndex]) {
      content.blocks[timerIndex].text = value;
      content.blocks[timerIndex].inlineStyleRanges[0].length = value.length;

      return EditorState.createWithContent(convertFromRaw(content));
    }

    content.blocks.push(
      new Block({
        key: Math.random().toString(16).slice(2).slice(0, 5),
        text: value,
        inlineStyles: [{ offset: 0, length: value.length + 1, style: "pause" }],
      }),
      new Block({
        key: Math.random().toString(16).slice(2).slice(0, 5),
        text: "",
        inlinyStyles: [],
      }),
    );

    return EditorState.createWithContent(convertFromRaw(content));
  };

  const handleChange = (e: any, key: string, step: number, values: any) => {
    const newValue = { key, value: values[Math.round(e.target.value / step)].text };
    const newParagraphs = paragraphs.map((paragraph: any) =>
      paragraph.order === paragraphActive
        ? {
            ...paragraph,
            data: paragraph.data.map((data: any, index: number) =>
              index === (featureActive as number) / 2
                ? {
                    ...data,
                    features: data.features.map((features: any) => (features.key === key ? newValue : features)),
                  }
                : data,
            ),
          }
        : paragraph,
    );

    if (key !== "pause") setParagraphs(newParagraphs);

    const selectionKey = lastSel.getAnchorKey();
    const newContent = EditorState.createWithContent(
      convertFromRaw(
        setInlineStyle(convertToRaw(editorContent.getCurrentContent()), selectionKey, {
          isActive: "active",
        }),
      ),
    );
    let state = EditorState.forceSelection(newContent, lastSel);

    if (key === "pause") {
      const selection = state.getSelection();
      const selectionKey = selection.getAnchorKey();

      state = EditorState.forceSelection(
        setTimerValue({ state: newContent, selectionKey, value: values[Math.round(e.target.value / step)].text }),
        selection,
      );
    }

    handleChangeStyle({ [key]: values[Math.round(e.target.value / step)].text }, state);
  };

  return (
    <Wrapper active={active}>
      <Content>
        <img src={actor?.photo || paragraphActor?.photo} alt="" />
        <Name>{actor?.name || paragraphActor?.name}</Name>
        <BoxWrapper>
          {sidebarBox
            .filter((box) => box.title !== "style")
            .map((box) => {
              const activeData = selectedZone;
              const activeFeatureValue = activeData?.features?.find(
                (features: any) => features.key === box.defaultTitle,
              )?.value;

              const sidebarId = box.values.find((value: any) => value.text === activeFeatureValue)?.id;

              const sidebarDefaultId = box.values.find((value: any) => value.text === box.defaultValue)?.id;
              const sidebarValue = ((sidebarId as number) - 1) * box.step;
              const sidebarDefaultValue = ((sidebarDefaultId as number) - 1) * box.step;

              return (
                <>
                  <ProfileActorSidebarBox
                    key={box.id}
                    {...box}
                    value={!isNaN(sidebarValue) ? sidebarValue : sidebarDefaultValue}
                    handleChange={(e: any) => handleChange(e, box.title, box.step, box.values)}
                  />
                </>
              );
            })}
          {stylesSidebar &&
            stylesSidebar?.map(({ id, title, background, defaultValue, values, defaultTitle }: any) => {
              const activeData = selectedZone;
              const activeFeatureValue = activeData?.features?.find(
                (features: any) => features.key === defaultTitle,
              )?.value;

              return (
                <DropdownWrapper key={id}>
                  <DropdownContent>
                    <DropdownHeading>
                      <span>{title}</span>
                      <div style={{ background }} />
                    </DropdownHeading>
                    <DropdownSelectOption onClick={toggling}>
                      <span>{!activeFeatureValue ? defaultValue : activeFeatureValue}</span>
                      <IconButton
                        iconButtonTheme={IconButtonThemes.Transparent}
                        icon={
                          !isOpen ? (
                            <DropdownIcon />
                          ) : (
                            <Rotate>
                              <DropdownIcon />
                            </Rotate>
                          )
                        }
                      />
                    </DropdownSelectOption>
                    {isOpen && (
                      <div>
                        <DropdownList>
                          {values.map((option: any) => (
                            <ListItem onClick={() => onOptionClicked(option.text, values)} key={option.id}>
                              {option.text}
                            </ListItem>
                          ))}
                        </DropdownList>
                      </div>
                    )}
                  </DropdownContent>
                </DropdownWrapper>
              );
            })}
        </BoxWrapper>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ active?: boolean }>`
  width: 0%;
  min-width: 0%;
  visibility: hidden;
  overflow: hidden auto;
  opacity: 1;
  transition: 0.2s;

  ${({ active }) =>
    active &&
    `
        min-width: 255px;
        width: 255px;
        visibility: visible;      
  `}

  @media (max-width: 1001px) {
    ${({ active }) =>
      active &&
      `
        padding: 40px 52px 32px;
        min-width: 100%;
        width: 100%;   
  `}
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 121px;
    height: 120px;
    border-radius: 16px;
  }
`;

const Name = styled.span`
  margin-top: 12px;
  margin-bottom: 20px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.secondaryText};
`;

const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DropdownWrapper = styled.div`
  background: ${({ theme }) => theme.secondaryBackground};
  box-shadow: ${({ theme }) => theme.secondaryCardShadow};
  border-radius: 12px;
  width: 232px;
`;

const DropdownContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
`;

const DropdownHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    color: ${({ theme }) => theme.secondaryText};
    text-transform: capitalize;
  }
  div {
    width: 24px;
    height: 16px;
    border-radius: 28px;
  }
`;

const DropdownList = styled.ul`
  max-height: 200px;
  overflow: hidden auto;
  padding: 0;
  margin: 0;
  background: ${({ theme }) => theme.secondaryBackground};
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.secondaryText};
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

const DropdownSelectOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    color: ${({ theme }) => theme.secondaryText};
  }
`;

const ListItem = styled.li`
  list-style: none;
  padding-bottom: 4px;
  margin-bottom: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.secondaryText}66;
  :last-of-type {
    border-bottom: none;
  }
`;

const Rotate = styled.div`
  transform: rotate(-180deg);
`;

export default ProfileActorSidebar;
