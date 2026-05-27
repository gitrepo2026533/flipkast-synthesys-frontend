/* eslint-disable prettier/prettier */
import styled from "styled-components";
import Button, { ButtonThemes } from "../Button/Button";

interface CommonModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

const PopupModel = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onClose,
  onConfirm,
  loading = false,
  children,
}: CommonModalProps) => {
  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>

        {description && <Description>{description}</Description>}

        {children}

        {/* <Actions>
          <CancelButton onClick={onClose}>
            {cancelText}
          </CancelButton>

          <ConfirmButton onClick={onConfirm} disabled={loading}>
            {loading ? "Loading..." : confirmText}
          </ConfirmButton>
        </Actions> */}
        <Actions>
          <Button
            text={cancelText}
            buttonTheme={ButtonThemes.Transparent}
            onClick={onClose}
            style={{
              height: "36px",
              width: "auto",
              padding: "0 14px",
            }}
          />

          <Button
            text={loading ? "Loading..." : confirmText}
            buttonTheme={ButtonThemes.Primary}
            onClick={onConfirm}
            disabled={loading}
            style={{
              height: "36px",
              width: "auto",
              padding: "0 14px",
            }}
          />
        </Actions>
      </ModalContainer>
    </Overlay>
  );
};

export default PopupModel;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  width: 340px;
  padding: 22px;
  border-radius: 16px;
  background: ${({ theme }) => theme.editorDropDownContent ?? "#1e1f24"};
  border: 1px solid ${({ theme }) => theme.editorLineBorder};
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
`;

const Title = styled.h3`
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.primaryText};
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.editorFileUpload};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
`;

const CancelButton = styled.button`
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.primaryText};
  transition: 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }
`;

const ConfirmButton = styled.button`
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  background: #ff4d4f;
  color: white;
  transition: 0.2s ease;

  &:hover {
    background: #ff2f32;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;