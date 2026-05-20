import { useEffect, useState } from "react";
import { Scene } from "../types/scene";
import { useDebounce } from "./useDebounce";

export interface History {
  scenes: Scene[];
  activeSceneId?: number;
}

interface Props extends History {
  setActiveSceneId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const useVideoSceneHistory = ({ scenes, activeSceneId, setActiveSceneId }: Props) => {
  const [history, setHistory] = useState<History[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [currentScenes, setCurrentScenes] = useState<Scene[] | null>(null);

  const debouncedScenes = useDebounce({ value: scenes, delay: 200 });

  const addToHistory = (scenes: Scene[], activeSceneId: number) => {
    setHistory((history) => [...(history.length < 51 ? history : history.slice(1)), { scenes, activeSceneId }]);
  };

  const removeHistoryFromNow = () => {
    const index = currentHistoryIndex;
    setHistory((history) => history.slice(0, index + 1));
    setCurrentHistoryIndex(-1);
    setCurrentScenes(null);
  };

  const handleBackInHistory = () => {
    if (currentHistoryIndex === 0) return;
    setCurrentHistoryIndex((index) => (index > 0 ? index - 1 : history.length - 2));
  };

  const handleForwardInHistory = () => {
    if (currentHistoryIndex > history.length - 2 || currentHistoryIndex === -1) return;
    setCurrentHistoryIndex((index) => index + 1);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const isCtrlZ = (event.ctrlKey || event.metaKey) && event.code === "KeyZ" && !event.shiftKey;
    const isCtrlShiftZ = (event.ctrlKey || event.metaKey) && event.code === "KeyZ" && event.shiftKey;

    if (isCtrlZ) handleBackInHistory();
    else if (isCtrlShiftZ) handleForwardInHistory();
  };

  useEffect(() => {
    if (scenes.find((scene) => scene.id === activeSceneId)?.editableTextId) return;
    addEventListener("keydown", handleKeyDown);

    return () => removeEventListener("keydown", handleKeyDown);
  }, [history, currentHistoryIndex, scenes]);

  useEffect(() => {
    if (!activeSceneId) return;
    addToHistory(debouncedScenes, activeSceneId);
  }, [debouncedScenes]);

  useEffect(() => {
    if (currentHistoryIndex >= 0) {
      setCurrentScenes(history[currentHistoryIndex].scenes);
      setActiveSceneId(history[currentHistoryIndex].activeSceneId);
    }
  }, [currentHistoryIndex]);

  useEffect(() => {
    if (currentHistoryIndex >= 0 && currentScenes) {
      removeHistoryFromNow();
    }
  }, [scenes]);

  return { currentScenes };
};
