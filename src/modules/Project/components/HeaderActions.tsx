import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button, { ButtonThemes } from "../../../components/Button/Button";
import { CheckIcon } from "../../../components/Icons/CheckIcon";
import { EditIcon } from "../../../components/Icons/EditIcon";
import { PlayIcon } from "../../../components/Icons/PlayIcon";
import { SaveIcon } from "../../../components/Icons/SaveIcon";
import PopupModel from "../../../components/PopupModel/PopupModel";
import Textfield, { TextfieldVariant } from "../../../components/Textfield/Textfield";
import ThemeSwitcher from "../../../components/ThemeSwitcher/ThemeSwitcher";
import CircularProgress from "../../../components/Icons/CircularProgress";
import {
  getPreviewProjectServer,
  getProjectSlideServer,
  mergeVideosProjectServer,
  ProjectType,
  updateVideoProjectServer,
} from "../../../redux/actions/projectAction";
import { getProject } from "../../../redux/reducers/projectReducer";
import VideoModal from "./VideoModal";

const processStatus: Record<number, string> = {
  1: "pending",
  2: "inprogress",
  3: "completed",
};

const HeaderActions = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projectData = useSelector(getProject);
  const dispatch = useDispatch();
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviewPopup, setShowPreviewPopup] = useState(false);
  const isAvatarProject = projectData?.projectTypeId === ProjectType.AVT;
  const navigate = useNavigate();

  const handleTitleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(projectData?.title || "");
  };

  const handleSaveTitle = () => {
    if (!editValue || !editValue.trim()) return;
    dispatch(
      updateVideoProjectServer({
        projectId: Number(projectData?.projectId),
        title: editValue,
        slides: [
          {
            slideId: Number(projectData?.slides?.[0]?.slideId),
            order: 1,
            slideBackgroundColor: "",
            projectParagraphs: [],
            audioPath: projectData?.slides?.[0]?.audioPath,
          },
        ],
        status: projectData?.status ? Number(projectData?.status) : 1,
      }),
    );
    setIsEditing(false);
  };

  const onPreview = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onGenerate = async () => {
    setIsGenerating(true);
    try {
      const response: any = await dispatch(getPreviewProjectServer(Number(projectData?.projectId)));
      const previewDataResponse = response?.payload?.data;

      if (previewDataResponse?.succeeded === true) {
        dispatch(mergeVideosProjectServer(Number(projectData?.projectId)));
        setTimeout(() => {
          dispatch(getProjectSlideServer(Number(projectData?.projectId), Number(projectData?.slides?.[0]?.slideId)));
          setIsGenerating(false);
        }, 1500);
      } else {
        setShowPreviewPopup(true);
        setIsGenerating(false);
      }
    } catch (error) {
      setShowPreviewPopup(true);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    setCurrentStatus(processStatus[Number(projectData?.status)]);
  }, [projectData]);

  return (
    <>
      <Bar>
        {/* LEFT — empty spacer to balance the grid */}
        <LeftSection />

        {/* CENTER — title + back button, truly centered */}
        <CenterSection>
          {isEditing ? (
            <TitleFieldWrapper>
              <Textfield
                name="title"
                autoFocus
                value={editValue}
                placeholder="Enter project name"
                variant={TextfieldVariant.project}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                onBlur={() => {
                  setIsEditing(false);
                }}
                endAdornment={
                  <SaveAdornmentButton
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSaveTitle();
                    }}
                    aria-label="Save title"
                    title="Save (Enter)"
                    type="button"
                  >
                    <SaveIcon />
                  </SaveAdornmentButton>
                }
              />
            </TitleFieldWrapper>
          ) : (
            <TitleGroup onDoubleClick={handleTitleDoubleClick}>
              <TitleText>{editValue ? editValue : projectData?.title}</TitleText>
              <EditButton
                onClick={() => {
                  setIsEditing(true);
                  setEditValue(projectData?.title || "");
                }}
                aria-label="Edit title"
              >
                <EditIcon />
              </EditButton>
            </TitleGroup>
          )}

          <Button
            buttonTheme={ButtonThemes.Secondary}
            icon={<img src="/images/arrow-left.svg" />}
            style={{ position: "relative", zIndex: "100" }}
            text="Back"
            onClick={() => (isAvatarProject ? navigate("/ai-avatar") : navigate("/ai-video"))}
          />
        </CenterSection>

        {/* RIGHT — status + action buttons */}
        <RightSection>
          <StatusBadge status={currentStatus}>{currentStatus}</StatusBadge>

          <Button
            text="Preview"
            icon={<PlayIcon />}
            onClick={onPreview}
            disabled={currentStatus === "pending" || currentStatus === "inprogress" || projectData?.output === null}
            buttonTheme={ButtonThemes.Primary}
            style={{
              height: "40px",
              padding: "0 14px",
              gap: "6px",
              fontSize: "12px",
              fontWeight: "500",
              borderRadius: "8px",
              width: "auto",
              minWidth: "90px",
            }}
          />

          <Button
            text={isGenerating ? <CircularProgress color="#fff" /> : "Generate"}
            icon={!isGenerating && <CheckIcon />}
            onClick={onGenerate}
            disabled={isGenerating || Number(projectData?.status) === 2 || Number(projectData?.status) === 3}
            buttonTheme={ButtonThemes.Outline}
            style={{
              height: "40px",
              padding: "0 14px",
              gap: "6px",
              fontSize: "12px",
              fontWeight: "500",
              borderRadius: "8px",
              width: "auto",
              minWidth: "100px",
            }}
          />

          <ThemeSwitcher />
        </RightSection>

        <PopupModel
          open={showPreviewPopup}
          title="Cannot Generate Video"
          description="All slides are currently inactive or video is not locked. Please activate at least one slide and lock a video before generating the video."
          confirmText={"Ok"}
          cancelText="Cancel"
          onClose={() => setShowPreviewPopup(false)}
          onConfirm={() => setShowPreviewPopup(false)}
        />
      </Bar>

      <VideoModal isOpen={isModalOpen} onClose={closeModal} videoPath={projectData?.output || ""} />
    </>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────

const Bar = styled.header`
  width: 100%;
  height: 55px;
  min-height: 0;
  /* 3-column grid: left spacer | center | right actions */
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.primaryBackground};
  padding: 0 12px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.chatTextfieldBorder};

  @media (max-width: 768px) {
    height: auto;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    padding-bottom: 8px;
  }
`;

/* Invisible spacer — mirrors RightSection's width so CenterSection stays truly centered */
const LeftSection = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 8px 0;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
    padding: 8px 0;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const TitleText = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryText};
  letter-spacing: 0.1px;
  user-select: none;
`;

const EditButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.5;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
`;

const TitleFieldWrapper = styled.div`
  display: flex;
  align-items: center;

  input {
    padding: 6px 36px 6px 12px !important;
    width: 220px !important;
    min-width: 180px;
    height: 36px !important;
    max-height: unset !important;
    border-radius: 12px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    line-height: normal !important;
    box-shadow: ${({ theme }) => theme.inputShadow} !important;
    background-color: ${({ theme }) => theme.primaryBackground} !important;
    color: ${({ theme }) => theme.primaryText} !important;
    border: 1px solid ${({ theme }) => theme.chatTextfieldBorder} !important;
    outline: none !important;
    box-sizing: border-box !important;

    &::placeholder {
      font-weight: 400 !important;
      font-size: 12px !important;
      opacity: 0.4;
    }
  }

  & > div {
    position: relative;
    display: flex;
    align-items: center;
  }

  & > div > div:last-child {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    pointer-events: all;
  }
`;

const SaveAdornmentButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.activeMenu};
  opacity: 0.7;
  transition: opacity 0.15s ease, transform 0.1s ease;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    opacity: 1;
    transform: scale(1.15);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const StatusBadge = styled.div<{ status?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  border-radius: 999px;
  font-family: "Montserrat", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
  white-space: nowrap;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  text-transform: capitalize;

  background: ${({ status }) => {
    switch (status) {
      case "pending":
        return "rgba(255, 159, 10, 0.12)";
      case "inprogress":
        return "rgba(0, 122, 255, 0.12)";
      case "completed":
        return "rgba(52, 199, 89, 0.12)";
      default:
        return "rgba(140,140,140,0.12)";
    }
  }};

  color: ${({ status }) => {
    switch (status) {
      case "pending":
        return "#FF9F0A";
      case "inprogress":
        return "#007AFF";
      case "completed":
        return "#34C759";
      default:
        return "#999999";
    }
  }};

  border-color: ${({ status }) => {
    switch (status) {
      case "pending":
        return "rgba(255, 159, 10, 0.25)";
      case "inprogress":
        return "rgba(0, 122, 255, 0.25)";
      case "completed":
        return "rgba(52, 199, 89, 0.25)";
      default:
        return "rgba(140,140,140,0.2)";
    }
  }};
`;

export default HeaderActions;
