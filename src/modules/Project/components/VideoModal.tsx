import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { getProjectPreview } from "../../../redux/reducers/projectReducer";
import { getPreviewProjectServer } from "../../../redux/actions/projectAction";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  projectId: number;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, projectId }) => {
  const dispatch = useDispatch();
  const projectVideos = useSelector(getProjectPreview);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  // fetch project videos when modal opens
  useEffect(() => {
    if (!isOpen) return;
    dispatch(getPreviewProjectServer(projectId));
    setCurrentIndex(0);
  }, [isOpen, projectId, dispatch]);

  // play the current video automatically when index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => console.log("Autoplay failed"));
    }
  }, [currentIndex]);

  console.log("Project videos:", projectVideos);

  if (!isOpen) return null;

  const handleEnded = () => {
    if (currentIndex < projectVideos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>

        {projectVideos.length > 0 ? (
          <Video ref={videoRef} controls autoPlay onEnded={handleEnded}>
            <source src={`http://192.168.1.80:7132${projectVideos[currentIndex]}`} type="video/mp4" />
            Your browser does not support HTML5 video.
          </Video>
        ) : (
          <p>Loading videos...</p>
        )}
      </Content>
    </Overlay>
  );
};

// ─── Styled Components ─────────────────────────────────
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
