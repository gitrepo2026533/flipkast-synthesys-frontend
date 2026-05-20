import { useFormik } from "formik";
import React, { useState } from "react";
import styled from "styled-components";
import Button, { ButtonThemes } from "../Button/Button";
import Divider from "../Divider/Divider";
import Modal from "../Modal/Modal";
import Select from "../Select/Select";
import Switch from "../Switch/Switch";
import Textfield, { TextfieldVariant } from "../Textfield/Textfield";

interface Props {
  open: boolean;
  onClose: () => void;
}

const subtitles = {
  label: "Subtitles",
  id: "subtitles",
  data: [
    {
      id: "1",
      label: "English",
      value: "englishUSA",
      icon: "/images/flag.png",
    },
    {
      id: "2",
      label: "English",
      value: "englishBritan",
      icon: "/images/flag1.png",
    },
    {
      id: "3",
      label: "Spain",
      value: "spain",
      icon: "/images/flag2.png",
    },
  ],
};

const resolution = {
  label: "Resolution",
  id: "resolution",
  data: [
    {
      id: "1",
      label: "1080p (HD)",
      value: "1080",
    },
    {
      id: "2",
      label: "720p",
      value: "720",
    },
    {
      id: "3",
      label: "480p",
      value: "480",
    },
  ],
};

const GenerativeVideoPopup = ({ open, onClose }: Props) => {
  const [titleValue, setTitleValue] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const [selectedValue, setSelectedValue] = useState<Record<string, string>>({
    subtitles: "",
    resolution: "",
  });

  const onChangeSelect = (e: string, type: string) => {
    setSelectedValue({ ...selectedValue, [type]: e });
  };

  return (
    <Modal open={open} onClose={onClose} closeIcon={false}>
      <Wrapper>
        <Title>Generative video</Title>
        <InputWrapper>
          <Textfield
            placeholder="Untitled"
            label="Title"
            value={titleValue}
            onChange={handleTitleChange}
            variant={TextfieldVariant.noneAdornment}
          />
        </InputWrapper>
        <SubtitlesWrapper>
          <Select
            value={selectedValue.subtitles}
            onChange={onChangeSelect}
            optionsList={subtitles}
            defaultValueText="Choose subtitles language"
            variant="popup"
          />
          <Row>
            <FormInputLabel>On</FormInputLabel>
            <Switch />
          </Row>
        </SubtitlesWrapper>
        <Select
          value={selectedValue.resolution}
          onChange={onChangeSelect}
          optionsList={resolution}
          defaultValueText="Choose resolution"
          variant="popup"
        />
        <Divider />
        <SummaryTitle>Summary</SummaryTitle>
        <SummaryWrapper>
          <Row>
            <SummaryLabel>Generation time</SummaryLabel>
            <SummaryValue>~ 6 min</SummaryValue>
          </Row>
          <Row>
            <SummaryLabel>Video size</SummaryLabel>
            <SummaryValue>~ 30 mb</SummaryValue>
          </Row>
        </SummaryWrapper>
        <Actions>
          <Button text="Cancel" onClick={onClose} buttonTheme={ButtonThemes.Outline} />
          <Button text="Download" type="submit" />
        </Actions>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  min-width: 343px;

  @media (max-width: 430px) {
    min-width: 0;
    width: 280px;
  }
`;

const Title = styled.p`
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  color: #191b1f;
  margin-bottom: 8px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

const FormInputLabel = styled("label")`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #191b1f;
`;

const FormInputs = styled("input")`
  box-shadow: ${({ theme }: any) => theme.inputShadow};
  border-radius: 60px;
  background-color: ${({ theme }: any) => theme.primaryBackground};
  width: 100%;
  height: 48px;
  padding-left: 44px;
  padding-right: 44px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  background-repeat: no-repeat;
  background-position: center left 15px;
  min-width: 320px;
  color: ${({ theme }: any) => theme.primaryText};

  &::placeholder {
    color: ${({ theme }: any) => theme.primaryText};
    opacity: 0.6;
  }
`;

const SubtitlesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SummaryTitle = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  color: #191b1f;
  margin-bottom: 4px;
`;

const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;

const SummaryLabel = styled.p`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #191b1f;
  opacity: 0.6;
`;

const SummaryValue = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #191b1f;
`;

const Actions = styled.div`
  display: flex;
  column-gap: 24px;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
`;

export default GenerativeVideoPopup;
