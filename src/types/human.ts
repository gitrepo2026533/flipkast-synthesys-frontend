export interface IHuman {
  id: number;
  imageSrc: string;
  flagSrc: string;
  name: string;
}

export interface FeaturesSettings {
  id?: string | number;
  image: string;
  name: string;
  flag?: string;
  features: {
    id?: number | string;
    title: string;
    values: {
      id: number | string;
      title: string;
    }[];
  }[];
  // actorTypeId?: ActorTypeId;
}

export enum ProfileHumanSidebarType {
  Background = "Background",
  // Templates = "Templates",
  Text = "Text",
  Humatar = "Humatar",
  Soundtrack = "Soundtrack",
  // Subtitle = "Subtitle",
  Transitions = "Transitions",
  Shapes = "Shapes",
}
