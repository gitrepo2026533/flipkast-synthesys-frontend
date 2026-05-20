import { Ref, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Popups, updatePopup } from "../../redux/actions/popupsActions";
import useAudioPlayer from "../../hooks/useAudioPlayer";
import { formatNumberToDuration } from "../../lib/formatDuration";
import { Paragraphs, Zone } from "../../types/project";
import CircularProgress from "../Icons/CircularProgress";
import IconButton, { IconButtonThemes } from "../Button/IconButton";
import { DownloadIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, RewindIcon } from "../Icons/Icons";
import { checkIfZoneCached, checkIfZoneMatchNoAuthor, checkIfZonesMatch, getAllZones } from "../../lib/editorUtils";
import { toast } from "react-toastify";
import Tooltip from "../Tooltip/Tooltip";

interface Props {
  audioList: Array<string | undefined>;
  paragraphs: Paragraphs[];
  selectedZone?: Zone;
  loadingZonesAudio: Zone[];
  generateAudio: () => void;
  generateZoneByIndex: (zoneIndex: number) => void;
}

const Player = ({
  paragraphs,
  selectedZone,
  audioList,
  loadingZonesAudio,
  generateAudio,
  generateZoneByIndex,
}: Props) => {
  const index = useRef(-1);
  const loadingZonesAudioRef = useRef<any>([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [memoizedAudioList, setMemoizedAudioList] = useState<(string | undefined)[]>([]);
  const [memoizedSelectedZone, setMemoizedSelectedZone] = useState<Zone | null>(null);

  useEffect(() => {
    loadingZonesAudioRef.current = loadingZonesAudio;
  }, [loadingZonesAudio]);

  const allZones = getAllZones(paragraphs);

  const audioLoading = allZones[index.current] && checkIfZoneCached(allZones[index.current], loadingZonesAudio);

  useEffect(() => {
    if (!selectedZone) return;
    if (!memoizedSelectedZone) {
      setMemoizedSelectedZone(selectedZone);
      return;
    }
    if (!checkIfZonesMatch(memoizedSelectedZone, selectedZone)) {
      setMemoizedSelectedZone(selectedZone);
      return;
    }
  }, [selectedZone]);

  useEffect(() => {
    const amountOfUnmatches = audioList.filter((el, index) => {
      return el !== memoizedAudioList[index];
    });

    const isPerfetchMatch = audioList.length === memoizedAudioList.length && amountOfUnmatches.length === 0;
    if (isPerfetchMatch) return;
    setMemoizedAudioList(audioList);
  }, [audioList]);

  const {
    audioPlayer,
    currentTime,
    duration,
    seekValue,
    playing,
    onPlaying,
    isFetching,
    setPlaying,
    startFetchingLoader,
    handleProgressBarChange,
    onLoadStart,
    onLoadedMetadata,
  } = useAudioPlayer();

  useEffect(() => {
    if (playing || isButtonClicked) {
      setIsButtonClicked(false);
      setPlaying(false);
    }
  }, [memoizedSelectedZone]);

  const dispatch = useDispatch();

  const handleOpenPopup = () => {
    dispatch(
      updatePopup({
        popup: Popups.estimatedPopup,
        status: true,
      }),
    );
  };

  const play = () => {
    if (!selectedZone) return;
    const allZones = getAllZones(paragraphs);
    const currentZoneIndex = allZones.findIndex((zone) => checkIfZoneMatchNoAuthor(zone, selectedZone));

    generateNextBunchOfZones(currentZoneIndex);
  };

  const pause = () => {
    setPlaying(false);
  };

  const handlePlayClick = () => {
    if (!playing) {
      let finalIndex = index.current;
      let allZones = getAllZones(paragraphs);
      if (selectedZone) {
        const currentZoneIndex = allZones.findIndex((zone) => checkIfZoneMatchNoAuthor(zone, selectedZone));
        finalIndex = currentZoneIndex;
      }
      index.current = finalIndex;
      play();
      setIsButtonClicked(true);
    } else {
      pause();
      setIsButtonClicked(false);
      audioPlayer?.current?.removeEventListener("ended", handleEnd);
    }
  };

  const isEmptyZone = (zone: Zone) => !zone?.text;

  function handleEnd() {
    const isLastAudio = index.current === memoizedAudioList.length - 1;
    let allZones = getAllZones(paragraphs);
    if (isLastAudio) {
      setIsButtonClicked(false);
      setPlaying(false);
    } else {
      let next = index.current + 1;
      while (isEmptyZone(allZones[next])) {
        if (next === memoizedAudioList.length - 1) {
          setIsButtonClicked(false);
          setPlaying(false);
          return;
        }
        next++;
      }
      const nextValidAudio = memoizedAudioList[next];
      if (nextValidAudio) {
        audioPlayer.current.src = nextValidAudio;
        index.current = next;
        setPlaying(true);
        audioPlayer.current.play();
        generateNextBunchOfZones(next);
      } else {
        setPlaying(false);
        generateNextBunchOfZones(next);

        // here we need to generate next 5 zones
        index.current = next;
      }
    }
  }

  const amount = 3;

  const generateNextBunchOfZones = (startIndex: number) => {
    let allZones = getAllZones(paragraphs);

    // 1. check if such zones exist next === memoizedAudioList.length - 1
    // 2. check if such zones are not loading (will be done inside of the generateZoneByIndex fn)
    // 3. check if such zones are not empty
    let current = startIndex;
    let endIndex = startIndex + amount;
    while (current !== endIndex) {
      const currentZone = allZones[current];
      const zoneExists = !!currentZone;
      const zoneIsEmpty = isEmptyZone(currentZone);
      const zoneIsLoading = !!checkIfZoneCached(currentZone, loadingZonesAudioRef.current);
      if (!zoneExists) {
        // quit
        current = endIndex;
      } else if (zoneIsEmpty) {
        // zone is empty -> move to next zone
        endIndex++;
        current++;
      } else if (zoneIsLoading) {
        // zone is already loading - let's just not touch it
        current++;
      } else {
        generateZoneByIndex(current);
        current++;
      }
    }
  };

  const handleResetClick = () => {
    setPlaying(false);
    audioPlayer?.current?.removeEventListener("ended", handleEnd);
  };

  const handleBackClick = () => {
    const finalIndex = index.current - 1;

    if (finalIndex < 0) {
      return;
    }

    setPlaying(false);

    const isAudioReady =
      memoizedAudioList.slice(finalIndex).filter((audio) => !audio).length === 0 && memoizedAudioList.length > 0;

    if (memoizedAudioList && isAudioReady) {
      setPlaying(true);
      index.current = finalIndex;

      if (!audioPlayer.current.src) {
        audioPlayer.current.src = memoizedAudioList[finalIndex];
      }
      if (audioPlayer.current.src !== memoizedAudioList[finalIndex]) {
        audioPlayer.current.src = memoizedAudioList[finalIndex];
        audioPlayer.current.play();
      }
    } else {
      toast.error("Please, generate zone before playing it");
    }
  };

  const handleForwardClick = () => {
    const finalIndex = index.current + 1;

    if (finalIndex >= memoizedAudioList.length) {
      return;
    }

    setPlaying(false);

    const isAudioReady =
      memoizedAudioList.slice(finalIndex).filter((audio) => !audio).length === 0 && memoizedAudioList.length > 0;

    if (memoizedAudioList && isAudioReady) {
      setPlaying(true);
      index.current = finalIndex;

      if (!audioPlayer.current.src) {
        audioPlayer.current.src = memoizedAudioList[finalIndex];
      }
      if (audioPlayer.current.src !== memoizedAudioList[finalIndex]) {
        audioPlayer.current.src = memoizedAudioList[finalIndex];
        audioPlayer.current.play();
      }
    } else {
      toast.error("Please, generate zone before playing it");
    }
  };

  // this use effect should be called only once -> once button is clicked
  useEffect(() => {
    if (!isButtonClicked) return;
    const finalIndex = index.current;

    const isAudioReady =
      memoizedAudioList.slice(finalIndex, finalIndex + 1).filter((audio) => !audio).length === 0 &&
      memoizedAudioList.length > 0;

    if (memoizedAudioList && isAudioReady) {
      setPlaying(true);

      if (!audioPlayer.current.src) audioPlayer.current.src = memoizedAudioList[finalIndex];
      if (audioPlayer.current.src !== memoizedAudioList[finalIndex])
        audioPlayer.current.src = memoizedAudioList[finalIndex];
      audioPlayer.current.play();

      audioPlayer.current.addEventListener("ended", handleEnd);
    }

    return () => audioPlayer?.current?.removeEventListener("ended", handleEnd);
  }, [memoizedAudioList, isButtonClicked]);

  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.addEventListener("error", handleError);
    }

    return () => audioPlayer?.current?.removeEventListener("error", handleError);
  }, [audioPlayer.current]);

  const handleError = () => {
    setPlaying(false);
    setIsButtonClicked(false);
    toast.error("Failed to play audio, please try to select the zone with your cursor and generate one more time:");
  };

  return (
    <Wrapper>
      <audio ref={audioPlayer} onTimeUpdate={onPlaying} onLoadedMetadata={onLoadedMetadata} onLoadStart={onLoadStart} />
      <ManageButton>
        {/* <IconButton iconButtonTheme={IconButtonThemes.Transparent} icon={<RewindIcon />} onClick={handleResetClick} /> */}
        <IconButton iconButtonTheme={IconButtonThemes.Transparent} icon={<PrevIcon />} onClick={handleBackClick} />
        <PlayButton>
          <IconButton
            className={!playing ? "rounded" : undefined}
            iconButtonTheme={IconButtonThemes.Rounded}
            icon={
              isFetching || audioLoading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CircularProgress color="#F0F0F3" />
                </div>
              ) : !playing || currentTime === duration ? (
                <PlayIcon />
              ) : (
                <PauseIcon />
              )
            }
            onClick={handlePlayClick}
          />
          <Tooltip
            text={isFetching || audioLoading ? "Loading" : !playing || currentTime === duration ? "Play" : "Pause"}
          />
        </PlayButton>
        <IconButton iconButtonTheme={IconButtonThemes.Transparent} icon={<NextIcon />} onClick={handleForwardClick} />
      </ManageButton>
      <ProgressWrapper>
        <ProgressBar>
          <ProgressBarLine
            type="range"
            min="0"
            max="100"
            step="1"
            value={seekValue || 0}
            width={seekValue || 0}
            onChange={handleProgressBarChange}
          />
        </ProgressBar>
        <ProgressCount>
          {formatNumberToDuration(currentTime)} <span> / {formatNumberToDuration(duration)}</span>
        </ProgressCount>
      </ProgressWrapper>
      <WatermarkTrack>
        <IconButton iconButtonTheme={IconButtonThemes.Rounded} icon={<DownloadIcon />} onClick={handleOpenPopup} />
        <Tooltip text="Download" />
      </WatermarkTrack>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 24px;
  width: 100%;
  display: flex;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 16px;
  padding: 12px;
  align-items: center;

  @media (max-width: 1251px) {
    margin: 24px 0;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;

const ManageButton = styled.div`
  display: flex !important;
  align-items: center;
  width: 120px;
  order: 1;

  .rounded {
    svg {
      transform: translateX(1px);
    }
  }

  @media (max-width: 1251px) {
    order: 2;
    width: auto;
  }
`;

const PlayButton = styled.div`
  position: relative;
  width: 100%;
  max-width: 36px;

  :hover > div {
    top: -50px;
    opacity: 1;
    visibility: visible;
  }
`;

const ProgressWrapper = styled.div`
  width: calc(100% - 180px);
  display: flex;
  align-items: center;
  order: 2;

  @media (max-width: 1251px) {
    order: 1;
    width: 100%;
    margin-bottom: 12px;
  }
`;

const ProgressBar = styled.div`
  height: 12px;
  width: calc(100% - 100px);
  position: relative;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.inputShadow};
  border-radius: 60px;
  display: flex;
  align-items: center;
  margin-left: 6px;
  padding-left: 2px;
  padding-right: 2px;
`;

const ProgressBarLine = styled.input<{ width: number }>`
  background: ${({ theme, width }) => `linear-gradient(to right, ${theme.activeMenu} ${width}%, transparent 0)`};
  box-shadow: ${({ theme }) => theme.iconButtonShadow};
  border-radius: 52px;
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 0px;
    height: 0px;
    cursor: pointer;
  }
`;

const ProgressCount = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.primaryText};
  display: flex;
  margin-left: 8px;

  span {
    color: ${({ theme }) => theme.primaryText}66;
    display: flex;
    margin-left: 5px;
  }
`;

const WatermarkTrack = styled.div`
  display: flex;
  position: relative;
  order: 3;
  margin-left: 15px;
  max-width: 36px;
  width: 100%;

  :hover > div {
    top: -50px;
    right: 0;
    opacity: 1;
    visibility: visible;
  }

  @media (max-width: 1251px) {
    order: 3;
    margin: 0;
    max-width: 36px;
    width: 100%;
  }
`;

export default Player;
