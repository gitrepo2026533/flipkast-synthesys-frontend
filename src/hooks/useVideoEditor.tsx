import { useEffect, useState } from "react";
import { Position, ResizableDelta } from "react-rnd";
import { Scene as SceneType, TextTypes, TextAlign, ShapeTypes, ObjectTypes, Text, SceneObject } from "../types/scene";
import { useVideoSceneHistory } from "./useVideoSceneHistory";

const DEFAULT_OBJECT_POSITION = { x: 10, y: 10 };

const DEFAULT_TEXT_SIZE = { width: 160, height: 40 };
const DEFAULT_AVATAR_SIZE = { width: 100, height: 100 };
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

  const addScene = () => {
    const rand = Math.random();
    const newScene = {
      id: rand,
      background: "/images/mock1.png",
      activeObjectId: 0,
      editableTextId: 0,
      objects: [],
    };
    setScenes((scenes) => [...scenes, newScene]);
    setActiveSceneId(rand);
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

  const handleAddAvatar = (src: string) => {
    if (!currentScene) return;
    const rand = Math.random();
    const newAvatar = {
      type: ObjectTypes.avatars,
      object: {
        id: rand,
        position: DEFAULT_OBJECT_POSITION,
        size: DEFAULT_AVATAR_SIZE,
        src,
      },
    };
    const newObjects = [...currentScene.objects, newAvatar];
    updateScene({ ...currentScene, objects: newObjects, activeObjectId: rand });
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

  const updateSize = (size: ResizableDelta, id: number, objType: ObjectTypes) => {
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
    scenes: currentScenes || scenes,
    currentScene,
    activeSceneId,
  };
};
