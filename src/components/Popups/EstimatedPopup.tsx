import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import { audioQuality, fileIntegrations, fileType, Integrations } from "../../mocks/estimatedPopup";
import { GenerateAudioParams } from "../../modules/Actors";
import { downloadVoiceServer, resetDownloadLink, zipVoiceServer } from "../../redux/actions/actorActions";
import { getDownloadData } from "../../redux/reducers/actorReducer";
import { getProject } from "../../redux/reducers/projectReducer";

import Button, { ButtonThemes } from "../Button/Button";
import CheckMarksWithLabel from "../CheckMarksWithLabel/CheckMarksWithLabel";
import Modal from "../Modal/Modal";
import Textfield, { TextfieldVariant } from "../Textfield/Textfield";
import { Paragraphs, Zone } from "../../types/project";
import { getAllZones, getAudioList } from "../../lib/editorUtils";

interface Props {
  open: boolean;
  cachedZonesAudio: Zone[];
  paragraphs: Paragraphs[];
  time?: string;
  generateAudio: (params: GenerateAudioParams) => void;
  onClose: () => void;
}

function downloadFile(filePath: string, fileName: string) {
  const link = document.createElement("a");
  link.href = filePath;
  link.download = fileName;
  link.click();
}

const defaultFileName = "Untitled";

const EstimatedPopup = ({ paragraphs, cachedZonesAudio, open, generateAudio, onClose }: Props) => {
  const dispatch = useDispatch();
  const project = useSelector(getProject);
  const [filename, setFilename] = useState(defaultFileName);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkMarksActive, setCheckMarksActive] = useState({
    type: fileType[0].id,
    quality: audioQuality[0].id,
    integration: fileIntegrations[0].id,
  });

  const audioList = getAudioList(
    getAllZones(paragraphs).filter((zone) => zone.text !== ""),
    cachedZonesAudio,
  );

  const handleIntegrationActive = (id: number) => {
    setCheckMarksActive({ ...checkMarksActive, integration: id });
  };

  const handleQualityActive = (id: number) => {
    setCheckMarksActive({ ...checkMarksActive, quality: id });
  };

  const { isError, isLoading: isLoadingDownload, data: finalAudioFileLink, extension } = useSelector(getDownloadData);

  const isAudioReady = audioList.filter((audio) => !audio).length === 0 && audioList.length > 0;

  const handleDownloadVoiceClick = () => {
    setIsButtonClicked(true);
    setIsLoading(true);
    if (!isAudioReady) {
      generateAudio({ withSelectedZone: false });
    }
    // else -> useEffect will be called
  };

  const downloadVoice = () => {
    if (isAudioReady) {
      if (!project?.projectId) {
        toast.error(
          "Save project before downloading voice, please. If you think this is mistake contact support with code 1005",
        );
        setIsLoading(false);
        setIsButtonClicked(false);
        return;
      }
      dispatch(
        downloadVoiceServer({ voices: audioList as string[], projectId: project.projectId, fileName: filename }),
      );
    }
  };

  const zipVoces = () => {
    if (isAudioReady) {
      if (!project?.projectId) {
        toast.error(
          "Save project before downloading voice, please. If you think this is mistake contact support with code 1006",
        );
        setIsLoading(false);
        setIsButtonClicked(false);
        return;
      }
      dispatch(zipVoiceServer({ voices: audioList as string[], projectId: project.projectId, fileName: filename }));
    }
  };

  const handleClose = () => {
    setIsLoading(false);
    setIsButtonClicked(false);
    onClose();
  };

  useEffect(() => {
    if (isAudioReady && isButtonClicked) {
      setIsLoading(true);
      if (checkMarksActive.integration === Integrations.integrated) {
        downloadVoice();
      } else {
        zipVoces();
      }
    }
  }, [isAudioReady, isButtonClicked]);

  useEffect(() => {
    if (isButtonClicked && finalAudioFileLink && !isLoadingDownload) {
      const name = `${filename}.${extension}`;
      downloadFile(finalAudioFileLink, name);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      // jQuery.ajax({
      //   url: finalAudioFileLink,
      //   cache: false,
      //   xhr: function () {
      //     // Seems like the only way to get access to the xhr object
      //     let xhr = new XMLHttpRequest();
      //     xhr.responseType = "blob";
      //     return xhr;
      //   },
      //   success: function (data: any) {
      //     const url = window.URL || window.webkitURL;
      //     const linkToTrigger = url.createObjectURL(data);

      //     const a = document.createElement("a");
      //     document.body.appendChild(a);
      //     a.href = linkToTrigger;
      //     a.download = name;
      //     a.click();
      //     setTimeout(() => {
      //       window.URL.revokeObjectURL(linkToTrigger);
      //       document.body.removeChild(a);
      //     }, 0);
      //   },
      // });
      dispatch(resetDownloadLink());

      setIsLoading(false);
      setIsButtonClicked(false);
    }
  }, [isButtonClicked, finalAudioFileLink, isLoadingDownload]);

  useEffect(() => {
    if (isError) {
      setIsLoading(false);
      setIsButtonClicked(false);
    }
  }, [isError]);

  const isButtonLoading = isLoading || isLoadingDownload;

  return (
    <Modal
      className="download-popup"
      title={
        <TitleWrapper>
          <>Download Audio</>
          {/* <ClockWrapper>
            <ClockIcon /> <span>{time}</span>
          </ClockWrapper> */}
        </TitleWrapper>
      }
      open={open}
      onClose={handleClose}
      closeIcon={false}
      // description={
      //   <>
      //     The time deducted after download reflects the actual audio time and may{" "}
      //     <span>differ from the estimated time. </span>
      //     Previously downloaded files can be downloaded again from the <span>Download history</span> (paid members only)
      //   </>
      // }
    >
      <Form>
        <Content>
          <Top>
            <Textfield
              value={filename}
              placeholder="Untitled"
              label="File name"
              variant={TextfieldVariant.noneAdornment}
              onChange={(e) => setFilename(e.target.value)}
            />
          </Top>

          <Bottom>
            <CheckMarksWithLabel
              label="File integration"
              checkMarks={fileIntegrations}
              active={checkMarksActive.integration}
              handleActive={(id: number) => handleIntegrationActive(id)}
            />
            {/* <CheckMarksWithLabel
              label="Audio quality (only paid member)"
              checkMarks={audioQuality}
              active={checkMarksActive.quality}
              handleActive={(id: number) => handleQualityActive(id)}
            /> */}
          </Bottom>
        </Content>
        <ButtonWrapper>
          <Button text="Cancel" buttonTheme={ButtonThemes.Outline} onClick={onClose} />
          <Button
            text={isButtonLoading ? "Loading..." : "Download"}
            onClick={isButtonLoading ? () => null : handleDownloadVoiceClick}
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
  flex-direction: column;
  gap: 28px;
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 267px;

  span {
    margin-bottom: 10px;
  }
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

export default EstimatedPopup;
