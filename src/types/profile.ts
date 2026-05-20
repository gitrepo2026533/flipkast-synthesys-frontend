export interface User {
  userId: number;
  name: string;
  email: string;
  password?: any;
  status: number;
  roleId: number;
  role?: any;
  insertDateTime: Date;
  updateDateTime: Date;
  profilePic: string;
  country?: any;
  language?: any;
  timePreference?: any;
  contactNo?: any;
  receiveUpdates?: any;
  aiVoicesAllowed: number;
  aiVoicesUsed: number;
  hasUnlimited?: boolean;
  voiceCloneAllowed?: number;
  voiceCloneUsed?: number;
  apiKey?: string;
  isAPIKey: boolean;
}

export enum ProfileModules {
  "myProfile" = "myProfile",
  "changePassword" = "changePassword",
  "checkCloneVoice" = "checkCloneVoice",
  "generateApiKey" = "generateApiKey",
}
