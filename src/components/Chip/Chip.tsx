import styled from "styled-components";
import IconButton, { IconButtonThemes } from "../Button/IconButton";
import { ModalCloseIcon } from "../Icons/Icons";

interface Props {
  title: string;
  onClose?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onRemove?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Chip = ({ title, onClose, onRemove }: Props) => (
  <Wrapper onClick={onRemove}>
    <span>{title}</span>
    <IconButton icon={<ModalCloseIcon />} iconButtonTheme={IconButtonThemes.Transparent} onClick={onClose} />
  </Wrapper>
);

const Wrapper = styled.div`
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.buttonShadow};
  border: 1px solid ${({ theme }) => theme.activeMenu};
  border-radius: 60px;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  max-height: 32px;

  span {
    font-family: "Montserrat", sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.primaryText};
  }

  button {
    width: 16px;
    height: 16px;
  }

  svg {
    path {
      fill: ${({ theme }) => theme.activeMenu};
    }
  }

  @media (max-height: 720px) {
    padding: 6px;

    span {
      font-size: 10px;
      line-height: 14px;
    }

    button {
      width: 14px;
      height: 14px;
    }
  }
`;

export default Chip;
