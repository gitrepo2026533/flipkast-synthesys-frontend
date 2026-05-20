export const optionList = {
  label: "Download range",
  id: "downloadRange",
  data: [
    {
      id: "default",
      value: "default",
      label: "All sentences",
    },
    {
      id: "1",
      value: "1",
      label: "1",
    },
    {
      id: "2",
      value: "2",
      label: "2",
    },
    {
      id: "3",
      value: "3",
      label: "3",
    },
    {
      id: "4",
      value: "4",
      label: "4",
    },
  ],
};

export const fileType = [
  { id: 1, title: "mp3" },
  { id: 2, title: "wav" },
];

export const audioQuality = [
  { id: 1, title: "low" },
  { id: 2, title: "normal" },
  { id: 3, title: "high" },
];

export enum Integrations {
  integrated,
  bySentence,
}

export const fileIntegrations = [
  { id: Integrations.integrated, title: "Integrated" },
  { id: Integrations.bySentence, title: "By sentence" },
];
