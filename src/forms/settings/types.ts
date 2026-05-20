export interface SettingsInputValues {
  name: string;
  email: string;
  number: string;
}

export enum SettingsInputFields {
  name = "name",
  email = "email",
  number = "number",
}

export interface ChangePasswordInputValues {
  oldPassword: string;
  newPassword: string;
}

export enum ChangePasswordInputFields {
  oldPassword = "oldPassword",
  newPassword = "newPassword",
}
