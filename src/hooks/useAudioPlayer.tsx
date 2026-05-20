import { useRef, useState, useEffect } from "react";

const useAudioPlayer = () => {
  const audioPlayer: any = useRef();

  const [playing, setPlaying] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekValue, setSeekValue] = useState(0);

  const startFetchingLoader = () => {
    setIsFetching(true);
  };

  const onLoadedMetadata = () => {
    setIsFetching(false);
    if (audioPlayer.current) setDuration(audioPlayer?.current?.duration);
  };

  const onLoadStart = () => {
    if (playing) {
      setIsFetching(true);
    }
  };

  const onPlaying = () => {
    setCurrentTime(audioPlayer?.current?.currentTime);
    setSeekValue((audioPlayer.current.currentTime / audioPlayer.current.duration) * 100);
  };

  useEffect(() => {
    if (playing) {
      audioPlayer?.current?.play();
    } else {
      setIsFetching(false);
      audioPlayer?.current?.pause();
    }
  }, [playing]);

  const toggleAudioPlay = () => {
    setPlaying(!playing);
  };

  const handleProgressBarChange = (e: any) => {
    const seekto = audioPlayer.current.duration * (+e.target.value / 100);
    audioPlayer.current.currentTime = seekto;
    setSeekValue(e.target.value);
  };

  return {
    audioPlayer,
    currentTime,
    duration,
    isFetching,
    seekValue,
    playing,
    onPlaying,
    toggleAudioPlay,
    handleProgressBarChange,
    setPlaying,
    startFetchingLoader,
    onLoadStart,
    onLoadedMetadata,
  };
};

export default useAudioPlayer;
