import { CSSProperties } from "react";
import { Position, ResizableDelta } from "react-rnd";

export interface ResizeDragObj {
  id: number;
  position: Position;
  size: ResizableDelta;
}

export enum ShapeTypes {
  circle = "circle",
  rectangle = "rectangle",
  triangle = "triangle",
  polygon = "polygon",
  star = "star",
  square = "square",
  heart = "heart",
  arrow = "arrow",
}

export interface Shape extends ResizeDragObj {
  shape: ShapeTypes;
  background: string;
}

export enum TextTypes {
  title = "title",
  subtitle = "subtitle",
  bodyText = "bodyText",
}

export type TextAlign = "left" | "center" | "right";

export interface Text extends ResizeDragObj {
  text: string;
  style: CSSProperties;
}

export interface Avatar extends ResizeDragObj {
  src: string;
}

export enum BackgroundColor {
  green = "green",
  red = "red",
  yellow = "yellow",
  blue = "blue",
  black = "black",
  pink = "pink",
  orange = "orange",
  brown = "brown",
  azure = "azure",
  cyan = "cyan",
  khaki = "khaki",
  navy = "navy",
}

export interface SceneObject {
  type: ObjectTypes;
  object: Shape | Text | Avatar;
}

export interface Scene {
  id: number;
  activeObjectId: number;
  editableTextId: number;
  background: string | BackgroundColor;
  objects: SceneObject[];
}

export enum ObjectTypes {
  texts = "texts",
  shapes = "shapes",
  avatars = "avatars",
}
