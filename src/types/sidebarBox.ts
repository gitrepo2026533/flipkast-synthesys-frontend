export interface SidebarBox {
  step: number;
  id?: string | number;
  title: string;
  background: string;
  values: {
    id?: number | string;
    text: string;
    label?: string;
  }[];
  defaultValue: string;
  modificator?: string;
  defaultTitle: string;
  actorTypeId?: ActorTypeId;
}

export enum ActorTypeId {
  ONE = 1,
  TWO = 2,
}
