import React, { useState } from "react";
import { ResizableDelta } from "react-rnd";
import styled from "styled-components";
import { ObjectTypes } from "../../types/scene";
import Button, { ButtonThemes } from "../Button/Button";
import IconButton, { IconButtonThemes } from "../Button/IconButton";
import { DropdownIcon, EditIcon, ProfileIcon, VoiceIcon } from "../Icons/Icons";
import { Lock } from "../Icons/Lock";

interface Props {
  data: {
    id: number;
    image: string;
  }[];
  handleAddAvatar: (src: string) => void;
  updateSize: (size: ResizableDelta, id: number, objType: ObjectTypes) => void;
}

const HumatarSidebar = ({ data, handleAddAvatar, updateSize }: Props) => {
  const [modeSelection, setModeSelection] = useState(false);

  const handleEditMode = () => setModeSelection(true);
  const handleViewMode = () => setModeSelection(false);

  return (
    <Wrapper>
      {!modeSelection ? (
        <ViewContent>
          {data.map(({ id, image }) => (
            <img key={id} src={image} onClick={() => handleAddAvatar(image)} />
          ))}
        </ViewContent>
      ) : (
        <EditContent>
          <EditActionWrapper>
            <span>Avatar style</span>
            <div>
              <Button buttonTheme={ButtonThemes.Outline} text="Full body" icon={<ProfileIcon />} />
              <Button
                buttonTheme={ButtonThemes.Outline}
                text="Circle"
                icon={
                  <div>
                    <ProfileIcon />
                  </div>
                }
              />
              <Button className="voice" buttonTheme={ButtonThemes.Outline} text="Voice Only" icon={<VoiceIcon />} />
            </div>
          </EditActionWrapper>
        </EditContent>
      )}
      <ActionWrapper modeSelection={modeSelection}>
        {!modeSelection ? (
          <Button icon={<EditIcon />} text="Edit" onClick={handleEditMode} />
        ) : (
          <Button buttonTheme={ButtonThemes.Secondary} text="Back" onClick={handleViewMode} />
        )}
      </ActionWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.activeMenu};
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  padding: 9px;
  border-radius: 20px;
  position: relative;
  min-height: 150px;
  overflow: hidden auto;
  width: 272px;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;

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

const ViewContent = styled.div`
  display: flex;
  flex-flow: row wrap;
  row-gap: 8px;
  column-gap: 4px;
  margin-bottom: 24px;

  img {
    width: 80px;
    height: 80px;
    border-radius: 16px;
  }
`;

const EditContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EditActionWrapper = styled.div<{ variant?: string }>`
  display: flex;
  flex-flow: column wrap;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.darkText}33;

  ${({ variant }) =>
    variant === "row" &&
    `
        flex-flow: row nowrap;
        align-items: center;
        gap: 0;

        button:first-of-type {
            margin-left: 11px;
            max-width: 16px;
            height: 16px;

            svg > g {
                opacity: 1;
            }
        }

        button:last-of-type {
            margin-left: auto;
        }
    `}

  & > span {
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: ${({ theme }) => theme.primaryText};
  }

  & > div {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    gap: 4px;

    button {
      width: calc(50% - 2px);
      height: 44px;
      gap: 8px;

      span {
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
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    button:first-of-type > svg > path {
      fill: ${({ theme }) => theme.activeMenu};
    }

    button:nth-child(2) > div {
      width: 20px;
      height: 20px;
      background: ${({ theme }) => theme.button};
      border-radius: 50%;
    }

    .voice {
      width: 100%;
    }
  }
`;

const ActionWrapper = styled.div<{ modeSelection?: boolean }>`
  position: absolute;
  bottom: 12px;
  left: 12px;

  button {
    min-width: 244px;
    max-width: 244px;
    gap: 8px;

    svg {
      width: 20px;
      height: 20px;
      path {
        fill: ${({ theme }) => theme.white};
      }
    }
  }

  ${({ modeSelection }) =>
    modeSelection &&
    `
      position: absolute;
      bottom: 20px;
      left: 0;
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    `}
`;

export default HumatarSidebar;
