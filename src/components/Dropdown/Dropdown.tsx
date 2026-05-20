import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Popups, updatePopup } from "../../redux/actions/popupsActions";
import { IActor } from "../../types/actor";
import { Paragraphs } from "../../types/project";
import Button, { ButtonThemes } from "../Button/Button";
import IconButton, { IconButtonThemes } from "../Button/IconButton";
import { DropdownDelete, DropdownIcon, PlusIcon } from "../Icons/Icons";

interface Props {
  paragraphs: Paragraphs[];
  photo?: string;
  currentParagraphActor?: IActor;
  currentParagraphActorsList?: IActor[];
  name?: string;
  actors?: IActor[];
  active?: number;
  setActorActive?: any;
  deleteDisplay?: boolean;
  onDelete: (e: any) => void;
}

const Dropdown = ({
  photo,
  paragraphs,
  currentParagraphActor,
  currentParagraphActorsList,
  name,
  actors,
  active,
  setActorActive,
  deleteDisplay,
  onDelete,
}: Props) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleDropdownToogle = () => setOpen(!open);
  const handleDropdownClose = () => setOpen(false);

  const handleClick = () => {
    dispatch(
      updatePopup({
        popup: Popups.characterPopup,
        status: true,
        prefilled: {
          actors,
          active,
          paragraphs,
          currentParagraphActor,
          currentParagraphActorsList,
          setActorActive,
        },
      }),
    );
    handleDropdownClose();
  };

  const handleDelete = (e: any) => {
    onDelete(e);
    handleDropdownClose();
  };

  const handleClickActorDropItem = (actor: IActor) => {
    const newSelectedActor = actor;
    const newActors = currentParagraphActorsList?.filter((currActor) => currActor.actorId !== actor.actorId) || [];
    setActorActive([newSelectedActor, ...newActors]);
  };

  return (
    <>
      <Wrapper>
        <Toogle onClick={handleDropdownToogle}>
          <img src={photo} alt="" />
          <span>{name}</span>
          <IconButton
            iconButtonTheme={IconButtonThemes.Transparent}
            icon={
              !open ? (
                <DropdownIcon />
              ) : (
                <Rotate>
                  <DropdownIcon />
                </Rotate>
              )
            }
          />
        </Toogle>
        {open && (
          <Menu>
            {currentParagraphActorsList?.slice(1, currentParagraphActorsList?.length)?.map((actor) => (
              <ActorDropItem key={actor.name + "drop-list"} onClick={() => handleClickActorDropItem(actor)}>
                <img src={actor.photo} />
                {actor.name}
              </ActorDropItem>
            ))}
            <MenuAction>
              <Button
                buttonTheme={ButtonThemes.Secondary}
                icon={
                  <PlusIconWrapper>
                    <PlusIcon />
                  </PlusIconWrapper>
                }
                text="Add actor"
                onClick={handleClick}
              />
              {deleteDisplay && (
                <Actions>
                  {/* <IconButton iconButtonTheme={IconButtonThemes.Transparent} icon={<DropdownSettings />} /> */}
                  <IconButton
                    iconButtonTheme={IconButtonThemes.Transparent}
                    icon={<DropdownDelete />}
                    onClick={handleDelete}
                  />
                </Actions>
              )}
            </MenuAction>
          </Menu>
        )}
      </Wrapper>
      {open && <Darkener onClick={handleDropdownClose} />}
    </>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  vertical-align: middle;
`;

const Toogle = styled.button`
  background-color: transparent;
  border-radius: 0;
  position: relative;
  border: none;
  padding: 0;
  padding-right: 25px;
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 4px;
  }

  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: ${({ theme }) => theme.primaryText};
    opacity: 0.6;
  }
`;

const Menu = styled.ul`
  position: absolute;
  z-index: 1000;
  width: 200px;

  min-width: 10rem;
  margin: 0;
  inset: 0px auto auto 0px;
  transform: translate(0px, 34px);

  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.activeMenu};
  padding: 12px;
  top: 8px !important;
`;

const MenuAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
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
`;

const Rotate = styled.div`
  transform: rotate(-180deg);
`;

const Darkener = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9;
`;

const ActorDropItem = styled.div`
  display: flex;
  column-gap: 12px;
  align-items: center;
  color: ${({ theme }) => theme.primaryText};
  margin-bottom: 7px;
  cursor: pointer;
  font-size: 14px;

  img {
    width: 32px;
    border-radius: 50%;
  }
`;

export default Dropdown;
