/* eslint-disable prettier/prettier */
import { useState } from "react";
import styled from "styled-components";
import Modal from "../Modal/Modal";
import BackgroundSidebar from "../HumanSidebars/BackgroundSidebar";
import Button, { ButtonThemes } from "../Button/Button";
import { BackgroundProps } from "../../mocks/humans";

interface BackgroundSelectorModalProps {
  open: boolean;
  onClose: () => void;
  backgroundData: any[] | undefined;
  onSelect: (src: string) => void;
}

const BackgroundSelectorModal = ({
  open,
  onClose,
  backgroundData,
  onSelect,
}: BackgroundSelectorModalProps) => {
  const [activeTab, setActiveTab] = useState<BackgroundProps>(BackgroundProps.IMAGE);

  if (!open) return null;

  const handleBackgroundChange = (src: string) => {
    onSelect(src);
  };

  return (
    <Modal open={open} onClose={onClose} title="Select Background" maxWidth={400}>
      <BgModalContent>
        <BgTabs>
          {backgroundData?.map((bgCat: any) => (
            <BgTab
              key={bgCat.type}
              $active={activeTab === bgCat.type}
              onClick={() => setActiveTab(bgCat.type)}
            >
              {bgCat.type}
            </BgTab>
          ))}
        </BgTabs>
        <BackgroundSidebar
          active={activeTab}
          data={backgroundData}
          handleBackgroundChange={handleBackgroundChange}
          hideEdit={true}
        />
        <ModalActions>
          <Button text="Cancel" buttonTheme={ButtonThemes.Outline} onClick={onClose} />
        </ModalActions>
      </BgModalContent>
    </Modal>
  );
};

const BgModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 16px;
  max-height: 70vh;
`;

const BgTabs = styled.div`
  display: flex;
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.chatTextfieldBorder};
  padding-bottom: 8px;
`;

const BgTab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active, theme }) => ($active ? theme.activeMenu : theme.primaryText)};
  cursor: pointer;
  padding: 4px 8px;
  &:hover {
    color: ${({ theme }) => theme.activeMenu};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

export default BackgroundSelectorModal;
