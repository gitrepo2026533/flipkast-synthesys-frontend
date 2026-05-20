import styled from "styled-components";

interface ChipProps {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

const InputChip = ({ title, isActive = false, onClick }: ChipProps) => {
  return (
    <ChipWrapper isActive={isActive} onClick={onClick}>
      <ChipLabel>{title}</ChipLabel>
    </ChipWrapper>
  );
};

const ChipWrapper = styled.div<{ isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  border: 1px solid ${({ theme, isActive }) => (isActive ? theme.activeMenu : theme.editorLineBorder)};
  background: ${({ theme, isActive }) => (isActive ? theme.editorDropDownContent : "transparent")};
  transition: background 0.15s ease, border-color 0.15s ease;
  user-select: none;

  &:hover {
    border-color: ${({ theme }) => theme.activeMenu};
    background: ${({ theme }) => theme.editorDropDownContent};
  }
`;

const ChipLabel = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryText};
  line-height: 1;
`;

export default InputChip;
