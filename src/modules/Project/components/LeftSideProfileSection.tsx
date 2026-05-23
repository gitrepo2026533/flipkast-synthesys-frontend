import { useState } from "react";
import styled from "styled-components";

const AvatarsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M3 17.5C3 13.91 6.13 11 10 11C13.87 11 17 13.91 17 17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ScriptIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="4" y="2.5" width="12" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 10H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 13H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export type SidebarItemKey = "avatars" | "chat";

interface SidebarItem {
  key: SidebarItemKey;
  label: string;
  icon: React.ReactNode;
}

interface LeftSideProfileSectionProps {
  activeItem?: SidebarItemKey;
  onItemClick?: (key: SidebarItemKey) => void;
}
const SIDEBAR_ITEMS: SidebarItem[] = [
  { key: "avatars", label: "Avatars", icon: <AvatarsIcon /> },
  { key: "chat", label: "Script", icon: <ScriptIcon /> },
];

// ─── Component ────────────────────────────────────────────────────────────────

const LeftSideProfileSection = ({ activeItem: controlledActive, onItemClick }: LeftSideProfileSectionProps) => {
  const [internalActive, setInternalActive] = useState<SidebarItemKey>("chat");

  const activeItem = controlledActive ?? internalActive;

  const handleClick = (key: SidebarItemKey) => {
    setInternalActive(key);
    onItemClick?.(key);
  };

  return (
    <Sidebar>
      {SIDEBAR_ITEMS.map(({ key, label, icon }) => (
        <NavItem
          key={key}
          $active={activeItem === key}
          onClick={() => handleClick(key)}
          aria-label={label}
          aria-current={activeItem === key ? "page" : undefined}
        >
          <IconWrapper $active={activeItem === key}>{icon}</IconWrapper>
          <Label $active={activeItem === key}>{label}</Label>
        </NavItem>
      ))}
    </Sidebar>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const Sidebar = styled.nav`
  width: 70px;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 12px 6px;
  background-color: ${({ theme }) => theme.primaryBackground};
  border-right: 1px solid ${({ theme }) => theme.editorLineBorder};
  box-sizing: border-box;
  flex-shrink: 0;
  min-height: 0;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 100%;
    height: auto;

    flex-direction: row;

    justify-content: space-around;

    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.editorLineBorder};

    overflow-x: auto;
    overflow-y: hidden;
  }
`;

const NavItem = styled.button<{ $active: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 58px;
  padding: 8px 0;
  border-radius: 10px;
  transition: background 0.15s ease, opacity 0.15s ease;
  position: relative;

  background: ${({ $active, theme }) => ($active ? theme.editorDropDownContent : "transparent")};
  box-shadow: ${({ $active, theme }) => ($active ? theme.cardShadow : "none")};

  &:hover {
    background: ${({ theme }) => theme.editorDropDownContent};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const IconWrapper = styled.span<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active, theme }) => ($active ? theme.activeMenu : theme.sidebarIcon)};
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  transition: color 0.15s ease, opacity 0.15s ease;

  ${NavItem}:hover & {
    opacity: 1;
  }
`;

const Label = styled.span<{ $active: boolean }>`
  font-family: "Montserrat", sans-serif;
  font-size: 10px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  line-height: 1;
  color: ${({ $active, theme }) => ($active ? theme.activeMenu : theme.sidebarMenuText)};
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  transition: color 0.15s ease, opacity 0.15s ease;
  text-align: center;
  white-space: nowrap;

  ${NavItem}:hover & {
    opacity: 1;
  }
`;

export default LeftSideProfileSection;
