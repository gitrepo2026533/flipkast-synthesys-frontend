/* eslint-disable prettier/prettier */
import styled from "styled-components";
import Modal from "../Modal/Modal";
import { IHuman } from "../../types/human";

interface AvatarSelectorModalProps {
  open: boolean;
  onClose: () => void;
  avatarData: any[] | undefined;
  selectedAvatarId: number | undefined;
  onSelect: (avatar: IHuman) => void;
}

const AvatarSelectorModal = ({
  open,
  onClose,
  avatarData,
  selectedAvatarId,
  onSelect,
}: AvatarSelectorModalProps) => {
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Select Avatar" maxWidth={400}>
      <AvatarGrid>
        {avatarData?.map((avatar: any) => (
          <AvatarImage
            key={avatar.id}
            src={avatar.image}
            alt={`Avatar ${avatar.id}`}
            $selected={selectedAvatarId === avatar.id}
            onClick={() => {
              onSelect({
                id: avatar.id,
                name: `Avatar ${avatar.id}`,
                imageSrc: avatar.image,
                flagSrc: "",
              });
            }}
          />
        ))}
      </AvatarGrid>
    </Modal>
  );
};

const AvatarGrid = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
  justify-content: center;
`;

const AvatarImage = styled.img<{ $selected: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  cursor: pointer;
  border: 2px solid
    ${({ $selected, theme }) => ($selected ? theme.activeMenu || "#009af7" : "transparent")};
  object-fit: cover;
  transition: border-color 0.15s ease, transform 0.15s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export default AvatarSelectorModal;
