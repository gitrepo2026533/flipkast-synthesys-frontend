import React from "react";
import styled from "styled-components";

import {
  ObjectTypes,
  SceneObject as SceneObjectType,
  Text,
  TextAlign,
  Avatar as AvatarType,
  ShapeTypes,
  Shape,
} from "../../../types/scene";

import { Arrow, Circle, Heart, Polygon, Rectangle, Square, Star, Triangle } from "../../../components/Shapes";

interface Props {
  object: SceneObjectType;
  activeObjectId: number;
  editableTextId: number;
  handleChangeActiveObject: (id: number) => void;
  handleInputChange: (value: string, id: number) => void;
  setEditableTextId: (id: number) => void;
}

const SceneObject = ({
  object: { object: obj, type },
  activeObjectId,
  editableTextId,
  handleChangeActiveObject,
  handleInputChange,
  setEditableTextId,
}: Props) => {
  const handlChangeActive = (event: React.MouseEvent<HTMLElement>, id: number) => {
    event.stopPropagation();
    handleChangeActiveObject(id);
  };

  const shouldBlur = (e: KeyboardEvent) => {
    if (e.code !== "Escape") return;
    (e.target as HTMLElement).blur();
  };

  const getObject = (type: ObjectTypes) => {
    switch (type) {
      case ObjectTypes.texts: {
        return activeObjectId !== obj.id ? (
          <TextObject
            onClick={(event) => handlChangeActive(event, obj.id)}
            className="text-object"
            align={(obj as Text).style.textAlign as TextAlign}
            style={(obj as Text).style}
          >
            {(obj as Text).text}
          </TextObject>
        ) : (
          <TextObjectArea
            onMouseUp={() => setEditableTextId(obj.id)}
            onKeyDown={shouldBlur as any}
            disabled={activeObjectId !== obj.id}
            isEditable={editableTextId === obj.id}
            value={(obj as Text).text}
            style={(obj as Text).style}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(event.target.value, obj.id)}
          />
        );
      }
      case ObjectTypes.avatars: {
        return <Avatar src={(obj as AvatarType).src} />;
      }
      case ObjectTypes.shapes: {
        return shapesComponents((obj as Shape).background)[(obj as Shape).shape];
      }
    }
  };

  return getObject(type);
};

const shapesComponents = (background: string) => ({
  [ShapeTypes.circle]: <Circle background={background} />,
  [ShapeTypes.rectangle]: <Rectangle background={background} />,
  [ShapeTypes.triangle]: <Triangle background={background} />,
  [ShapeTypes.polygon]: <Polygon background={background} />,
  [ShapeTypes.star]: <Star background={background} />,
  [ShapeTypes.square]: <Square background={background} />,
  [ShapeTypes.heart]: <Heart background={background} />,
  [ShapeTypes.arrow]: <Arrow background={background} />,
});

const TextObjectArea = styled.textarea<{ disabled?: boolean; isEditable: boolean }>`
  max-height: 100%;
  max-width: 100%;
  background: transparent;
  border: none;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: ${({ isEditable }) => (isEditable ? "text" : "move")};
`;

const TextObject = styled.pre<{ align?: TextAlign }>`
  display: inline-block;
  font-family: monospace;
  position: absolute;
  ${({ align }) => getTextAlign[align || "left"]}
  max-width: 100%;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
`;

const getTextAlign = {
  left: `left: 0;`,
  right: `right: 0;`,
  center: `left: 50%; transform: translateX(-50%);`,
};

const Avatar = styled.div<{ src: string }>`
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

export default SceneObject;
