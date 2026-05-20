import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Popups, updatePopup } from "../../redux/actions/popupsActions";
import { deleteProjectserver } from "../../redux/actions/projectAction";
import { getConfirmationPopupIsOpen, getPrefilled } from "../../redux/reducers/popupsReducer";
import { getIsDeleteLoading } from "../../redux/reducers/projectReducer";

import Button, { ButtonThemes } from "../Button/Button";
import Modal from "../Modal/Modal";

const ConfirmationPopup = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(getConfirmationPopupIsOpen);
  const isDeleteLoading = useSelector(getIsDeleteLoading);
  const {
    title,
    description,
    project: { projectId },
  } = useSelector(getPrefilled);

  const handleClose = () => {
    dispatch(updatePopup({ popup: Popups.confirmationPopup, status: false }));
  };

  const handleDelete = () => {
    dispatch(deleteProjectserver({ projectId: projectId.toString() }));
  };

  return (
    <Modal
      className="download-popup"
      title={<TitleWrapper>{title}</TitleWrapper>}
      open={isOpen}
      onClose={handleClose}
      closeIcon={false}
      description={<>{description}</>}
    >
      <Form>
        <Content>
          {/* <Right>
            <Textfield placeholder="Untitled" label="File name" variant={TextfieldVariant.noneAdornment} />
            <Select
              optionsList={optionList}
              defaultValueText="All sentences"
              value={selectedValue}
              onChange={(value: string) => onChangeSelect(value)}
              variant="popup"
            />
          </Right> */}
          <Left>
            {/* <CheckMarksWithLabel
              label="File type"
              checkMarks={fileType}
              active={checkMarksActive.type}
              handleActive={(id: number) => handleTypeActive(id)}
            />
            <CheckMarksWithLabel
              label="Audio quality (only paid member)"
              checkMarks={audioQuality}
              active={checkMarksActive.quality}
              handleActive={(id: number) => handleQualityActive(id)}
            /> */}
          </Left>
        </Content>
        <ButtonWrapper>
          <Button text="Cancel" buttonTheme={ButtonThemes.Outline} onClick={handleClose} />
          <Button
            text={isDeleteLoading ? "Loading..." : "Delete"}
            onClick={isDeleteLoading ? () => null : handleDelete}
          />
        </ButtonWrapper>
      </Form>
    </Modal>
  );
};

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Form = styled.form`
  margin-top: 32px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  gap: 28px;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 50%;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 50%;
`;

const ButtonWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > button {
    width: 25%;
  }
`;

const ClockWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 17px;
    height: 17px;

    path {
      fill: ${({ theme }) => theme.activeMenu};
    }
  }

  span {
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    background: ${({ theme }) => theme.button};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

export default ConfirmationPopup;
