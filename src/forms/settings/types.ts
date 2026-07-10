export interface SettingsInputValues {
  name: string;
  email: string;
  number: string;
  aiVideoApiKey: string;
  aiAvatarApiKey: string;
}

export enum SettingsInputFields {
  name = "name",
  email = "email",
  number = "number",
  aiVideoApiKey = "aiVideoApiKey",
  aiAvatarApiKey = "aiAvatarApiKey",
}

export interface ChangePasswordInputValues {
  oldPassword: string;
  newPassword: string;
}

export enum ChangePasswordInputFields {
  oldPassword = "oldPassword",
  newPassword = "newPassword",
}
