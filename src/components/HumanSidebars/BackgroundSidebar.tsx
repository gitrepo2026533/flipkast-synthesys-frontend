import React, { useState } from "react";
import styled from "styled-components";
import { BackgroundProps } from "../../mocks/humans";
import Button, { ButtonThemes } from "../Button/Button";
import { CropIcon, EditIcon, TrimIcon } from "../Icons/Icons";
import Switch from "../Switch/Switch";

interface Props {
  data: any;
  active: BackgroundProps;
  onClick?: (event: MouseEvent) => void;
  handleBackgroundChange: (src: string) => void;
  hideEdit?: boolean;
}

const ACCEPTED_IMG_FORMATS = "image/png, image/jpg";
const ACCEPTED_VIDEO_FORMATS = "video/mp4, video/avi";

const BackgroundSidebar = ({ data, active, onClick, handleBackgroundChange, hideEdit }: Props) => {
  const [modeSelection, setModeSelection] = useState(false);

  const handleEditMode = () => setModeSelection(true);
  const handleViewMode = () => setModeSelection(false);

  const element = data.find(({ type }: any) => type === active);

  return (
    <Wrapper upload={element.type === BackgroundProps.UPLOAD}>
      {element.type !== BackgroundProps.UPLOAD ? (
        !modeSelection ? (
          <>
            <ViewContent>
              <SidebarContent element={element} handleBackgroundChange={handleBackgroundChange} />
            </ViewContent>
            {!hideEdit && (
              <ActionWrapper modeSelection={modeSelection}>
                <Button icon={<EditIcon />} text="Edit" onClick={handleEditMode} />
              </ActionWrapper>
            )}
          </>
        ) : (
          <>
            <EditContent>{SidebarEditContent({ element })}</EditContent>
            <ActionWrapper modeSelection={modeSelection}>
              <Button buttonTheme={ButtonThemes.Secondary} text="Back" onClick={handleViewMode} />
            </ActionWrapper>
          </>
        )
      ) : (
        <>
          <input
            type="file"
            id="settingsImage"
            name="settingsImage"
            accept={ACCEPTED_IMG_FORMATS}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                handleBackgroundChange(url);
              }
            }}
          />
          <span>Upload background image from your device</span>
        </>
      )}
    </Wrapper>
  );
};

const SidebarContent = ({ element, handleBackgroundChange }: any) => {
  switch (element.type) {
    case BackgroundProps.IMAGE:
      return element.data.map(({ id, image }: any, index: number) => (
        <React.Fragment key={id}>
          {index === 0 && (
            <div className="upload">
              <input
                type="file"
                id="settingsImage"
                name="settingsImage"
                accept={ACCEPTED_IMG_FORMATS}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    handleBackgroundChange(url);
                  }
                }}
              />
              <span>+</span>
            </div>
          )}

          <img onClick={() => handleBackgroundChange(image)} src={image} alt="" />
        </React.Fragment>
      ));
    case BackgroundProps.VIDEO:
      return element.data.map(({ id, video }: any, index: number) => (
        <React.Fragment key={id}>
          {index === 0 && (
            <div className="upload">
              <input
                type="file"
                id="settingsBG"
                name="settingsBG"
                accept={ACCEPTED_VIDEO_FORMATS}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    handleBackgroundChange(url);
                  }
                }}
              />
              <span>+</span>
            </div>
          )}
          <img key={id} src={video} alt="" />
        </React.Fragment>
      ));
    default:
      break;
  }
};

const SidebarEditContent = ({ element }: any) => {
  switch (element.type) {
    case BackgroundProps.IMAGE:
      return (
        <div>
          <ButtonWrapper>
            <Button
              buttonTheme={ButtonThemes.Outline}
              text="Crop"
              icon={<CropIcon />}
              onClick={() => console.log("crop")}
            />
          </ButtonWrapper>
        </div>
      );
    case BackgroundProps.VIDEO:
      return (
        <>
          <div>
            <ButtonWrapper>
              <Button
                buttonTheme={ButtonThemes.Outline}
                text="Trim"
                icon={<TrimIcon />}
                onClick={() => console.log("trim")}
              />
            </ButtonWrapper>
          </div>
          <div>
            <ToolWrapper>
              <span>Loop</span>
              <Switch />
            </ToolWrapper>
          </div>
        </>
      );
    default:
      break;
  }
};

const Wrapper = styled.div<{ upload?: boolean }>`
  border: 1px solid ${({ theme }) => theme.activeMenu};
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  padding: 9px;
  border-radius: 20px;
  position: relative;
  min-height: 150px;
  overflow: hidden auto;
  width: 272px;
  margin-top: 12px;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;

  .upload {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed ${({ theme }) => theme.activeMenu};
    width: 120px;
    max-height: 80px;
    border-radius: 12px;
    cursor: pointer;
    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      max-width: 120px;
    }
    span {
      font-family: "Montserrat", sans-serif;
      font-weight: 600;
      font-size: 45px;
      line-height: 24px;
      text-align: center;
      background: ${({ theme }) => theme.button};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  }

  ${({ upload, theme }) =>
    upload &&
    `
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed ${theme.activeMenu};
      margin-top: 12px;

      input {
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      span {
        font-family: "Montserrat", sans-serif;
        font-weight: 600;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        background: ${theme.button};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }
    `}

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
  column-gap: 8px;
  margin-bottom: 24px;

  img {
    width: 120px;
    max-height: 80px;
    border-radius: 12px;
  }
`;

const EditContent = styled.div`
  display: flex;
  flex-direction: column;

  & > div:first-of-type {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    margin-bottom: 16px;
  }

  & > div:last-of-type {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
`;

const ToolWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > span {
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: ${({ theme }) => theme.primaryText};
  }

  & > button {
    width: auto;
    display: flex;
    flex-direction: row-reverse;
    gap: 8px;

    & > span {
      font-family: "Montserrat", sans-serif;
      font-weight: 600;
      line-height: 24px;
      background: ${({ theme }) => theme.button};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
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

const ButtonWrapper = styled.div`
  width: 50%;

  button {
    height: 44px;
    gap: 8px;

    span {
      font-size: 14px;
      background: ${({ theme }) => theme.button};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  }
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

export default BackgroundSidebar;
