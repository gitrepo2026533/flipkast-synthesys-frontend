import { useEffect, useState } from "react";
import { Position, ResizableDelta } from "react-rnd";
import { ObjectTypes, SceneObject, Scene as SceneType, ShapeTypes, TextAlign, TextTypes } from "../types/scene";
import { useVideoSceneHistory } from "./useVideoSceneHistory";
import { sidebar, BackgroundProps } from "../mocks/humans";
import { ProfileHumanSidebarType } from "../types/human";

const DEFAULT_OBJECT_POSITION = { x: 10, y: 10 };

const DEFAULT_TEXT_SIZE = { width: 160, height: 40 };
const DEFAULT_AVATAR_POSITION = { x: 0, y: 0 };
const DEFAULT_AVATAR_SIZE = { width: "100%", height: "100%" };
const DEFAULT_SHAPE_SIZE = { width: 100, height: 100 };

enum ChangeLayer {
  raise = "raise",
  lower = "lower",
}

const initialStyles = {
  [TextTypes.title]: {
    fontWeight: 400,
    fontSize: "24px",
    lineHeight: "1.3",
    textAlign: "left" as TextAlign,
    opacity: 1,
    color: "#000000",
  },
  [TextTypes.subtitle]: {
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "1.5",
    textAlign: "left" as TextAlign,
    opacity: 1,
    color: "#000000",
  },
  [TextTypes.bodyText]: {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "1.43",
    textAlign: "left" as TextAlign,
    opacity: 1,
    color: "#000000",
  },
};

export const useVideoEditor = () => {
  const [scenes, setScenes] = useState<SceneType[]>([]);
  const [activeSceneId, setActiveSceneId] = useState<number>();

  const { currentScenes } = useVideoSceneHistory({ scenes, activeSceneId, setActiveSceneId });

  const currentScene: SceneType | undefined = (currentScenes || scenes).find(({ id }) => id === activeSceneId);

  const updateScene = (scene: SceneType) => {
    setScenes((scenes) => scenes.map((sceneItem) => (sceneItem.id === currentScene?.id ? scene : sceneItem)));
  };

  const dublicateScene = (id: number) => {
    const current = scenes.find(({ id: sceneId }) => sceneId === id);
    if (!current) return;
    const prevScene = { ...current };
    prevScene.objects = prevScene.objects.map((obj) => {
      const rand = Math.random();
      return { ...obj, object: { ...obj.object, id: rand } };
    });
    setScenes((scenes) => [...scenes, { ...prevScene, id: Math.random() }]);
  };

  const addScene = (initialBackground?: string) => {
    const rand = Math.random();

    let bgImage = initialBackground;
    if (!bgImage) {
      // Extract first background image from mock data
      const bgCategory = sidebar.find((s) => s.type === ProfileHumanSidebarType.Background);
      const imageCategory = (bgCategory?.data as any[])?.find((c: any) => c.type === BackgroundProps.IMAGE);
      bgImage = imageCategory?.data?.[0]?.image || "/images/mock1.png";
    }

    const newScene = {
      id: rand,
      background: bgImage || "/images/mock1.png",
      activeObjectId: 0,
      editableTextId: 0,
      objects: [],
      script: "",
    };
    setScenes((scenes) => [...scenes, newScene]);
    setActiveSceneId(rand);
  };

  const setScenesExternal = (newScenes: SceneType[] | ((prev: SceneType[]) => SceneType[])) => {
    setScenes((prevScenes) => {
      const resolvedScenes = typeof newScenes === "function" ? newScenes(prevScenes) : newScenes;
      setActiveSceneId((prevId) => {
        if (resolvedScenes.some((scene) => scene.id === prevId)) {
          return prevId;
        }
        return resolvedScenes.length > 0 ? resolvedScenes[0].id : NaN;
      });
      return resolvedScenes;
    });
  };

  const handleDeleteScene = (id: number) => {
    setScenes((scenes) => scenes.filter(({ id: sceneId }) => sceneId !== id));
  };

  const handleTextObjectChange = (key: string, value: any, id: number) => {
    if (!currentScene) return;
    const newObjects = [...currentScene.objects];

    newObjects.forEach(({ object: obj }: SceneObject) => {
      if (obj.id === id) obj[key as keyof typeof obj] = value;
    });

    updateScene({ ...currentScene, objects: newObjects });
  };

  const handleAddText = (text: string, type: TextTypes) => {
    if (!currentScene) return;
    const rand = Math.random();
    const newText = {
      type: ObjectTypes.texts,
      object: {
        id: rand,
        text,
        style: initialStyles[type],
        position: DEFAULT_OBJECT_POSITION,
        size: DEFAULT_TEXT_SIZE,
      },
    };
    const newObjects = [...currentScene.objects, newText];
    updateScene({ ...currentScene, objects: newObjects, activeObjectId: rand });
  };

  const handleAddShape = (type: ShapeTypes) => {
    if (!currentScene) return;
    const rand = Math.random();
    const newShape = {
      type: ObjectTypes.shapes,
      object: {
        id: rand,
        position: DEFAULT_OBJECT_POSITION,
        size: DEFAULT_SHAPE_SIZE,
        shape: type,
        background: "linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%)",
      },
    };
    const newObjects = [...currentScene.objects, newShape];
    updateScene({ ...currentScene, objects: newObjects, activeObjectId: rand });
  };

  const handleAddAvatar = (src: string, id?: number) => {
    if (!currentScene) return;
    const existingAvatarIndex = currentScene.objects.findIndex((obj) => obj.type === ObjectTypes.avatars);

    if (existingAvatarIndex !== -1) {
      const newObjects = [...currentScene.objects];
      const existingId = newObjects[existingAvatarIndex].object.id;
      newObjects[existingAvatarIndex] = {
        ...newObjects[existingAvatarIndex],
        object: {
          ...newObjects[existingAvatarIndex].object,
          src,
          id: id || existingId,
        },
      };
      updateScene({ ...currentScene, objects: newObjects, activeObjectId: id || existingId });
    } else {
      const rand = Math.random();
      const newAvatar = {
        type: ObjectTypes.avatars,
        object: {
          id: id || rand,
          position: DEFAULT_AVATAR_POSITION,
          size: DEFAULT_AVATAR_SIZE,
          src,
        },
      };
      const newObjects = [...currentScene.objects, newAvatar];
      updateScene({ ...currentScene, objects: newObjects, activeObjectId: id || rand });
    }
  };

  const handleChangeActiveObject = (id: number) => {
    if (!currentScene) return;
    if (currentScene.editableTextId) {
      return updateScene({ ...currentScene, editableTextId: NaN });
    }
    updateScene({ ...currentScene, activeObjectId: id });
  };

  const handleChangeActiveScene = (id: number) => {
    setActiveSceneId(id);
  };

  const handleRemoveTextChip = (id: number) => {
    if (!currentScene) return;
    const current = currentScene.objects.find((obj) => obj.object.id === id);
    const newObjects = currentScene.objects.filter((obj) => obj.object.id !== id);
    if (current?.object.id === currentScene.activeObjectId && newObjects.length) {
      handleChangeActiveObject(newObjects[0].object.id);
    }
    updateScene({ ...currentScene, objects: newObjects });
  };

  const handleInputChange = (value: string, id: number) => {
    handleTextObjectChange("text", value, id);
  };

  const updatePosition = (position: Position, id: number, objType: ObjectTypes) => {
    if (!currentScene) return;
    updateScene({
      ...currentScene,
      objects: currentScene.objects.map((obj) =>
        obj.object.id === id && obj.type === objType ? { ...obj, object: { ...obj.object, position } } : obj,
      ),
      activeObjectId: id,
    });
  };

  const updateSize = (size: { width: string | number; height: string | number }, id: number, objType: ObjectTypes) => {
    if (!currentScene) return;
    updateScene({
      ...currentScene,
      objects: currentScene.objects.map((obj) =>
        obj.object.id === id && obj.type === objType ? { ...obj, object: { ...obj.object, size } } : obj,
      ),
    });
  };

  const handleBackgroundChange = (src: string) => {
    if (!currentScene) return;
    updateScene({ ...currentScene, background: src });
  };

  const deleteAllText = () => {
    if (!currentScene) return;
    updateScene({ ...currentScene, objects: currentScene.objects.filter((obj) => obj.type !== ObjectTypes.texts) });
  };

  const handleDisactivateObjects = () => {
    if (!currentScene) return;
    if (currentScene.editableTextId) {
      return updateScene({ ...currentScene, editableTextId: NaN });
    }
    updateScene({ ...currentScene, activeObjectId: NaN, editableTextId: NaN });
  };

  const handleDeleteCurrentObject = () => {
    if (!currentScene) return;
    const id = currentScene.activeObjectId;
    const activeObject = currentScene.objects.find((obj) => obj.object.id === id);
    if (!activeObject || (activeObject.type === ObjectTypes.texts && currentScene.editableTextId === id)) return;

    const newObjects = currentScene.objects.filter((obj) => obj.object.id !== id);

    updateScene({ ...currentScene, objects: newObjects });
  };

  const setEditableTextId = (id: number) => {
    if (!currentScene) return;
    updateScene({ ...currentScene, editableTextId: id });
  };

  const changeObjectLayer = (direction: ChangeLayer) => {
    if (!currentScene) return;
    const objects = [...currentScene.objects];
    const index = objects.findIndex((item) => item.object.id === currentScene.activeObjectId);
    if (index === -1) return;
    const removed = objects.splice(index, 1)[0];
    if (direction === ChangeLayer.lower) {
      objects.unshift(removed);
    } else {
      objects.push(removed);
    }
    updateScene({ ...currentScene, objects });
  };

  const handleKeyboardPress = (event: KeyboardEvent) => {
    switch (event.code) {
      case "Escape": {
        return handleDisactivateObjects();
      }
      case "Delete": {
        return handleDeleteCurrentObject();
      }
      case "Backspace": {
        return handleDeleteCurrentObject();
      }
      case "BracketLeft": {
        return changeObjectLayer(ChangeLayer.lower);
      }
      case "BracketRight": {
        return changeObjectLayer(ChangeLayer.raise);
      }
      default: {
        return;
      }
    }
  };

  const handleScriptChange = (script: string) => {
    if (!currentScene) return;
    updateScene({ ...currentScene, script: script });
  };

  useEffect(() => {
    addEventListener("keydown", handleKeyboardPress);

    return () => removeEventListener("keydown", handleKeyboardPress);
  }, [scenes, activeSceneId, currentScenes]);

  return {
    dublicateScene,
    addScene,
    handleDeleteScene,
    handleAddText,
    handleAddShape,
    handleAddAvatar,
    handleRemoveTextChip,
    handleTextObjectChange,
    handleInputChange,
    updatePosition,
    updateSize,
    handleChangeActiveObject,
    handleChangeActiveScene,
    handleBackgroundChange,
    deleteAllText,
    setEditableTextId,
    handleScriptChange,
    scenes: currentScenes || scenes,
    currentScene,
    activeSceneId,
    setScenesExternal,
  };
};
