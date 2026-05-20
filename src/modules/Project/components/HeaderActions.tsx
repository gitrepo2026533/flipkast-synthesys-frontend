import { useState } from "react";
import styled from "styled-components";
import { HomeIcon } from "../../../components/Icons/HomeIcon";
import { useNavigate } from "react-router-dom";
import { ProfileIcon } from "../../../components/Icons/ProfileIcon";

interface TopBarProps {
  title?: string;
  credits?: number;
  onMenuToggle?: () => void;
  onTitleChange?: (title: string) => void;
  onSaveProject?: () => void;
  onPreview?: () => void;
  onGenerate?: () => void;
  projectData: any;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const HamburgerIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
    <rect width="18" height="2" rx="1" fill="currentColor" />
    <rect y="6" width="18" height="2" rx="1" fill="currentColor" />
    <rect y="12" width="18" height="2" rx="1" fill="currentColor" />
  </svg>
);

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M9.5 1.5L12.5 4.5L4.5 12.5H1.5V9.5L9.5 1.5Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M13 14H3C2.45 14 2 13.55 2 13V3C2 2.45 2.45 2 3 2H11L14 5V13C14 13.55 13.55 14 13 14Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M5 2V6H10V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 9H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M4 11.5H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const PlayIcon = () => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
    <path d="M1 1L11 7L1 13V1Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2 7L5.5 10.5L12 3.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeaderActions = ({
  title = "Untitled session",
  credits = 10,
  onMenuToggle,
  onTitleChange,
  onSaveProject,
  onPreview,
  onGenerate,
  projectData,
}: TopBarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const handleTitleDoubleClick = () => setIsEditing(true);

  const handleTitleBlur = () => {
    setIsEditing(false);
    onTitleChange?.(editValue);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setIsEditing(false);
      onTitleChange?.(editValue);
    }
  };

  const navigate = useNavigate();

  return (
    <Bar>
      {/* Left */}
      <LeftSection>
        <MenuButton onClick={() => navigate("/")} aria-label="Toggle menu">
          {/* <HamburgerIcon /> */}
          <HomeIcon />
        </MenuButton>
        <Divider />
      </LeftSection>

      {/* Center */}
      <CenterSection>
        {isEditing ? (
          <TitleInput
            autoFocus
            value={projectData.title}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
          />
        ) : (
          <TitleGroup onDoubleClick={handleTitleDoubleClick}>
            <TitleText>{projectData.title}</TitleText>
            <EditButton onClick={() => setIsEditing(true)} aria-label="Edit title">
              <PencilIcon />
            </EditButton>
          </TitleGroup>
        )}
      </CenterSection>

      {/* Right */}
      <RightSection>
        <SaveButton onClick={onSaveProject} aria-label="Save project">
          <SaveIcon />
          <span>Save Project</span>
        </SaveButton>

        <PreviewButton onClick={onPreview} aria-label="Preview">
          <PlayIcon />
          <span>Preview</span>
        </PreviewButton>

        <GenerateButton onClick={onGenerate} aria-label="Generate">
          <CheckIcon />
          <span>Generate</span>
        </GenerateButton>

        <CreditsText>{credits} credits</CreditsText>
      </RightSection>
    </Bar>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const Bar = styled.header`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.primaryBackground};
  padding: 0 12px 0 0;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.editorLineBorder};

  @media (max-width: 768px) {
    min-height: 48px;
    height: auto;
    flex-wrap: wrap;
    // justify-content: space-between;
    // padding: 0 12px 8px;
    padding-bottom: 8px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const MenuButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.7;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.editorLineBorder};
  flex-shrink: 0;
`;

const CenterSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    order: 3;
    width: 100%;
    justify-content: center;
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

const TitleInput = styled.input`
  background: transparent;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.activeMenu};
  outline: none;
  font-family: "Montserrat", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryText};
  text-align: center;
  padding: 2px 6px;
  min-width: 160px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    order: 2;
    width: 100%;
    justify-content: flex-end;
    padding: 8px 0;
  }
`;

const BaseButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 6px;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  font-weight: 500;
  transition: opacity 0.15s ease, transform 0.1s ease;
  white-space: nowrap;

  &:active {
    transform: scale(0.97);
  }
`;

const SaveButton = styled(BaseButton)`
  background: ${({ theme }) => theme.editorDropDownContent};
  color: ${({ theme }) => theme.primaryText};
  border: 1px solid ${({ theme }) => theme.editorLineBorder};
  opacity: 0.95;

  svg {
    color: ${({ theme }) => theme.primaryText};
  }

  &:hover {
    opacity: 1;
  }
`;

const PreviewButton = styled(BaseButton)`
  background: ${({ theme }) => theme.activeMenu};
  color: #ffffff;
  box-shadow: ${({ theme }) => theme.buttonShadow};

  &:hover {
    opacity: 0.95;
  }
`;

const GenerateButton = styled(BaseButton)`
  background: ${({ theme }) => theme.editorDropDownContent};
  color: ${({ theme }) => theme.primaryText};
  border: 1px solid ${({ theme }) => theme.activeMenu};

  &:hover {
    background: ${({ theme }) => theme.editorDropDownContent};
    opacity: 1;
  }
`;

const CreditsText = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.4;
  padding-left: 4px;
  white-space: nowrap;
`;

export default HeaderActions;
