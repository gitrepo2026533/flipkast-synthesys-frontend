import React, { useRef, useState } from "react";
import styled from "styled-components";

import Modal from "../Modal/Modal";
import Soundtrack from "../Sountrack/Soundtrack";
import Button, { ButtonThemes } from "../Button/Button";
import Textfield, { TextfieldVariant } from "../Textfield/Textfield";
import { InfoIcon, MicrophoneIcon } from "../Icons/Icons";
import { Voice } from "../../types/voice";
import { useDispatch } from "react-redux";
import { cloneVoiceServer } from "../../redux/actions/profileActions";

const SAMPLES_LENGTH = 15;
const ACCEPTED_FORMATS = "audio/wav";
const MAX_SAMPLE_SIZE = 157286400;

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddVoiceAudioPopup = ({ open, onClose }: Props) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [voices, setVoices] = useState<Voice[]>([]);
  const [activeSoundtrack, setActiveSoundtrack] = useState<number>(0);
  const [errorSizeSample, setErrorSizeSample] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const sampleUpload = ({ target }: any) => {
    const uploadedFiles = target.files;
    let sizeError = false;

    for (let i = 0; i < uploadedFiles.length; i++) {
      if (uploadedFiles[i].size > MAX_SAMPLE_SIZE) {
        sizeError = true;
      }
    }

    if (sizeError) {
      setErrorSizeSample(true);
      return;
    } else {
      const files = Array.from(uploadedFiles).map((uploadedFile: any) => ({
        id: Math.random(),
        name: uploadedFile.name,
        voice: URL.createObjectURL(uploadedFile),
        file: uploadedFile,
      }));

      setErrorSizeSample(false);
      setVoices([...voices, ...files]);
    }
  };

  const handlePlayingSoundtrack = (id: number) => {
    setActiveSoundtrack(id - 1);
  };

  const deleteVoice = (id: number) => {
    const newVoices = voices.filter(({ id: voiceId }: Voice) => voiceId !== id);

    setVoices(newVoices);
  };

  const addVoices = () => {
    if (!voices) return;

    const formData = new FormData();

    [].forEach.call(voices, function (file: Voice) {
      formData.append("File", file.file);
    });

    formData.append("name", title);

    dispatch(cloneVoiceServer(formData));
  };

  return (
    <Modal
      title="Add voice audio"
      className="addVoiceAudio"
      open={open}
      onClose={onClose}
      maxWidth={660}
      maxHeight={1069}
    >
      <Content>
        <Textfield
          label="Title"
          variant={TextfieldVariant.noneAdornment}
          value={title}
          placeholder="Untitled"
          onChange={handleTitleChange}
        />
        <MainContent>
          <SoundtrackHeader length={voices.length}>
            <span>Samples</span>
            <span>
              {voices.length}/{SAMPLES_LENGTH}
            </span>
          </SoundtrackHeader>
          {voices.length > 0 && (
            <SoundtrackWrapper>
              {voices.map(({ name, voice, id }: Voice) => (
                <Soundtrack
                  key={id}
                  active={id === activeSoundtrack + 1}
                  title={name}
                  soundtrack={voice}
                  variant="addVoiceAudioPopup"
                  actionClick={() => deleteVoice(id)}
                  onClick={() => handlePlayingSoundtrack(id)}
                />
              ))}
            </SoundtrackWrapper>
          )}
          {voices.length < SAMPLES_LENGTH && (
            <DragAndDropWrapper>
              <input type="file" ref={inputRef} multiple accept={ACCEPTED_FORMATS} onChange={sampleUpload} />
              <MicrophoneIcon />
              <h3>
                Drag and drop your audio, or browse <span>audio</span>
              </h3>
              <SampleFormat>File Supported: WAV. </SampleFormat>
              <SampleFormat sizeError={errorSizeSample}>Maximum size: 150 MB</SampleFormat>
            </DragAndDropWrapper>
          )}
        </MainContent>
        <InformationWrapper>
          <InfoIcon />
          <span>
            Sample quality is more important that quantity. Noisy samples may give bad results. Providing more than 5
            minutes of audio in total brings little improvement
          </span>
        </InformationWrapper>
        <ActionsWrapper>
          <Button text="Cancel" onClick={onClose} buttonTheme={ButtonThemes.Outline} />
          <Button text="Add" onClick={addVoices} />
        </ActionsWrapper>
      </Content>
    </Modal>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 16px;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SoundtrackHeader = styled.div<{ length: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 32px;
    color: ${({ theme }) => theme.primaryText};
    opacity: 0.4;
  }

  ${({ length }) =>
    length > 0 &&
    `
      span:last-of-type {
        opacity: 1;
      }
  `}
`;

const DragAndDropWrapper = styled.div`
  position: relative;
  background: ${({ theme }) => theme.primaryBackground};
  border: 1px dashed #c2c2c2;
  box-shadow: ${({ theme }) => theme.inputShadow};
  border-radius: 20px;
  height: 187px;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;

  & > h3 {
    font-family: "Montserrat";
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: ${({ theme }) => theme.primaryText};
    margin-top: 4px;
    text-align: center;

    & > span {
      background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  }

  & > input {
    width: 100%;
    height: 100%;
    opacity: 0;
    top: 0;
    left: 0;
    position: absolute;
  }

  @media (max-height: 775px) {
    height: 100px;
    gap: 4px;

    & > svg {
      width: 24px;
      height: 24px;
    }

    & > h3 {
      font-size: 14px;
      margin-top: 0;
    }
  }

  @media (max-width: 500px) {
    height: 130px;
    gap: 4px;

    & > svg {
      width: 24px;
      height: 24px;
    }

    & > h3 {
      font-size: 12px;
      margin-top: 0;
    }
  }
`;

const SampleFormat = styled.p<{ sizeError?: boolean }>`
  font-family: "Montserrat";
  font-weight: 400;
  font-size: 12px;
  line-height: 155%;
  color: ${({ theme }) => theme.primaryText};
  opacity: 0.4;
  text-align: center;

  ${({ sizeError }) =>
    sizeError &&
    `
       color: red;
  `}

  @media (max-width: 500px) {
    font-size: 10px;
  }
`;

const InformationWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;

  svg {
    flex-shrink: 0;
  }

  span {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 155%;
    color: ${({ theme }) => theme.primaryText};
    opacity: 0.6;
  }

  @media (max-width: 520px) and (max-height: 775px) {
    span {
      font-size: 8px;
    }
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 18px;
  gap: 24px;

  button {
    width: 100%;
    height: 52px;
  }

  @media (min-width: 950px) and (max-height: 720px) {
    height: auto;
    margin-top: 0;

    button {
      max-height: 48px;

      & > span {
        font-size: 14px;
        line-height: 18px;
      }
    }
  }
`;

const SoundtrackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 4px 0;
  overflow: hidden auto;
  max-height: 200px;

  ::-webkit-scrollbar {
    display: none;
  }

  @media (max-height: 650px) {
    max-height: 120px;
  }

  @media (max-width: 520px) and (max-height: 775px) {
    max-height: 120px;
  }
`;

export default AddVoiceAudioPopup;
