import { useSelector } from "react-redux";
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { getProjectPreview } from "../../../redux/reducers/projectReducer";
interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoPath: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoPath }) => {
  const projectVideos = useSelector(getProjectPreview);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!isOpen) return null;

  if (!videoPath) return null;

  const handleEnded = () => {
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Video ref={videoRef} controls autoPlay onEnded={handleEnded}>
          <source src={`http://192.168.1.80:7132/${videoPath}`} type="video/mp4" />
          Your browser does not support HTML5 video.
        </Video>
      </Content>
    </Overlay>
  );
};

// Style

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Content = styled.div`
  position: relative;
  width: 80%;
  max-width: 800px;
  background: #000;
  padding: 10px;
  border-radius: 8px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 28px;
  color: #fff;
  background: transparent;
  border: none;
  cursor: pointer;
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  border-radius: 6px;
`;
export default VideoModal;
