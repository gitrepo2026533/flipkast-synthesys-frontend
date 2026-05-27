/* eslint-disable prettier/prettier */
import { useRef } from "react";
import styled from "styled-components";

interface ProjectCardProps {
  title: string;
  description?: string;
  image?: string;
  preViewVideo?: string;
  onClick?: () => void;
}

const VideoProjectCard = ({
  title,
  preViewVideo,
  image,
  onClick,
}: ProjectCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = async () => {
    if (preViewVideo && videoRef.current) {
      try {
        await videoRef.current.play();
      } catch (error) {
        console.log("Video autoplay failed", error);
      }
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <CardWrapper
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardImageWrapper>
        {/* Default Image */}
        {image && (
          <CardImage
            src={image}
            alt={title}
            hasVideo={!!preViewVideo}
          />
        )}

        {/* Preview Video */}
        {preViewVideo && preViewVideo !== null && (
          <PreviewVideo
            ref={videoRef}
            src={`http://192.168.1.80:7132/${preViewVideo}`}
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}

        <Overlay />
      </CardImageWrapper>

      <CardContent>
        <CardTitle>{title}</CardTitle>
      </CardContent>
    </CardWrapper>
  );
};

export default VideoProjectCard;

const CardWrapper = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.22s ease;

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 210px;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #111;

  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);

  @media (max-width: 768px) {
    height: 190px;
  }
`;

const CardImage = styled.img<{ hasVideo: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;

  transition:
    transform 0.5s ease,
    opacity 0.3s ease;

  ${CardWrapper}:hover & {
    transform: scale(1.05);
    opacity: ${({ hasVideo }) => (hasVideo ? 0 : 1)};
  }
`;

const PreviewVideo = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  opacity: 0;
  transition:
    opacity 0.35s ease,
    transform 0.5s ease;

  ${CardWrapper}:hover & {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.45),
    rgba(0, 0, 0, 0.05)
  );
  pointer-events: none;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 2px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-family: "Montserrat", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.primaryText};
  letter-spacing: -0.4px;
`;
