import { useState } from "react";
import styled from "styled-components";
import { ChatIcon } from "../../../components/Icons/ChatIcon";
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
const SIDEBAR_ITEMS: SidebarItem[] = [{ key: "chat", label: "chat", icon: <ChatIcon /> }];

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

// Style

const Sidebar = styled.nav`
  width: 70px;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 12px 6px;
  background-color: ${({ theme }) => theme.primaryBackground};
  border-right: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
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
    border-bottom: 1px solid ${({ theme }) => theme.chatTextfieldBorder};

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

  background: ${({ $active, theme }) => theme.editorDropDownContent};
  box-shadow: ${({ $active, theme }) => theme.cardShadow};

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
