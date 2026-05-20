export const modules = {
  AIVoices: "AI Voices",
  AIHumans: "AI Humans",
};

export const section = {
  voiceGeneration: "Voice Generation",
  voiceDownload: "Voice Download",
  zippingVoice: "Zipping Voice",
  gettingActors: "Getting Actors",
  savingProject: "Saving Project",
};

// interface ISentryError {
//   [item: string]: {
//     title: string;
//     toast: string;
//     code: number;
//     tags: {
//       module: string;
//       section: string;
//       code: number;
//     };
//   };
// }

export const SentryErrors = {
  SERVER_ERROR_WHILE_GENERATING_VOICE: {
    title: "Server Error While Generating Voice - 1002",
    toast: "Error while generating your voice. Please contact support with code 1002",
    code: 1002,
    tags: {
      module: modules.AIVoices,
      section: section.voiceGeneration,
      code: 1002,
    },
  },
  SERVER_ERROR_WHILE_DOWNLOADING_VOICE: {
    title: "Server Error While Downloading Voice - 1003",
    toast: "Error while downloading your voice. Please contact support with code 1003",
    code: 1003,
    tags: {
      module: modules.AIVoices,
      section: section.voiceDownload,
      code: 1003,
    },
  },
  SERVER_ERROR_WHILE_ZIPPING_VOICE: {
    title: "Server Error While Zipping Voice - 1004",
    toast: "Error while zipping your voice. Please contact support with code 1004",
    code: 1004,
    tags: {
      module: modules.AIVoices,
      section: section.zippingVoice,
      code: 1004,
    },
  },
  SERVER_ERROR_WHILE_GETTING_ACTORS: {
    title: "Server Error While Getting Actors - 1101",
    toast: "Error while getting actors. Please contact support with code 1101",
    code: 1101,
    tags: {
      module: modules.AIVoices,
      section: section.gettingActors,
      code: 1101,
    },
  },
  SERVER_ERROR_WHILE_SAVING_PROJECT: {
    title: "Server Error While Updating/Creating Project - 1102",
    code: 1102,
    tags: {
      module: modules.AIVoices,
      section: section.savingProject,
      code: 1102,
    },
  },
  PROJECT_WITH_EMPTY_PARAGRAPHS: {
    title: "Project with empty paragraphs - 1103",
    toast: "There was an issue while saving/getting your project, please contact support with code 1103",
    code: 1103,
    tags: {
      module: modules.AIVoices,
      code: 1103,
    },
  },
  PAGE_CRASH: {
    title: "Page Crash - 9999",
    code: 9999,
    tags: {
      code: 9999,
    },
  },
};
