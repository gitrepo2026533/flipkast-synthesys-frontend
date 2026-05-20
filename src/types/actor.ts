export interface IActor {
  actorId: number;
  actorTypeId?: number;
  userId?: number;
  flagPath?: string;
  name: string;
  photo: string;
  styles?: string;
  isNew?: boolean;
  voiceType?: string;
  categoryType?: string;
  voiceName?: string;
  brief?: string;
  language?: string;
  languageName?: string;
  isFeMale?: boolean;
  audioSampleLink?: string;
  status?: number;
  insertDateTime?: Date;
  isBookmarked?: boolean;
}

export interface IActorsList {
  pageNumber: number;
  pageSize: number;
  firstPage: string;
  lastPage: string;
  totalPages: number;
  totalRecords: number;
  nextPage?: any;
  previousPage?: any;
  data: IActor[];
}

export enum ActorModules {
  "actorList" = "actorList",
  "downloadAudio" = "downloadAudio",
}
