import { IActor } from "./actor";

export interface Feature {
  key: string;
  value: string;
}

export interface Zone {
  text: string;
  features: Feature[];
  actorId?: number;
  isLoading?: boolean;
  outputUrl?: string;
}

export interface Paragraphs {
  actorId: number;
  order: number;
  data: Zone[];
  insertDateTime?: string;
  jsonText?: string | null;
  outputAudio?: string;
  projectId?: number;
  projectParagraphId?: number;
  updateDateTime?: string;
  userId?: number;
  actor?: IActor;
  actorsList?: IActor[];
}

export interface Slide {
  slideId: number;
  projectId: number;
  order: number;
  projectParagraphs?: Paragraphs[];
  audioPath?: string;
  backGroundColor?: string;
}

export interface Project {
  projectId?: number;
  projectTypeId: number;
  useId?: number;
  title: string;
  output?: string;
  coverImage?: string;
  insertDateTime?: string;
  updateDateTime?: string;
  subTitle?: string;
  paragraphs: Paragraphs[];
  slides?: Slide[];
  status?: string;
}

export interface ProjectList {
  pageNumber: number;
  pageSize: number;
  firstPage: string;
  lastPage: string;
  totalPages: number;
  totalRecords: number;
  nextPage?: any;
  previousPage?: any;
  data: Project[];
}

export enum ProjectModules {
  "projectList" = "projectList",
  "project" = "project",
  "autoSave" = "autoSave",
}

export enum LoadingStyles {
  "loading" = "isLoading_loading",
  "generated" = "isGenerated_generated",
}
