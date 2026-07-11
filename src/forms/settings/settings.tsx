import {
  ChangePasswordInputFields,
  ChangePasswordInputValues,
  SettingsInputFields,
  SettingsInputValues,
} from "./types";
import { Lock } from "../../components/Icons/Lock";

export const initialValuesSettings = {
  [SettingsInputFields.name]: "",
  [SettingsInputFields.email]: "",
  [SettingsInputFields.number]: "",
  [SettingsInputFields.aiVideoApiKey]: "",
  [SettingsInputFields.aiAvatarApiKey]: "",
} as SettingsInputValues;

export const getSettingsFields = [
  {
    type: "text",
    id: SettingsInputFields.name,
    name: SettingsInputFields.name,
    caption: "User name",
    label: "User name",
    placeholder: "Enter your name",
    autoComplete: "off",
  },
  {
    type: "email",
    id: SettingsInputFields.email,
    name: SettingsInputFields.email,
    caption: "Email",
    label: "Email",
    placeholder: "Enter your email",
    checkbox: true,
    checkBoxText: "Receive updates",
  },
  {
    type: "text",
    id: SettingsInputFields.number,
    name: SettingsInputFields.number,
    caption: "Phone number",
    label: "Contact",
    placeholder: "Enter your phone number",
  },
];

export const getApiKeysFields = [
  {
    type: "password",
    id: SettingsInputFields.aiVideoApiKey,
    name: SettingsInputFields.aiVideoApiKey,
    caption: "AI Video API Key",
    label: "AI Video API Key",
    placeholder: "Enter your AI Video API key",
    autoComplete: "new-password",
  },
  {
    type: "password",
    id: SettingsInputFields.aiAvatarApiKey,
    name: SettingsInputFields.aiAvatarApiKey,
    caption: "AI Avatar API Key",
    label: "AI Avatar API Key",
    placeholder: "Enter your AI Avatar API key",
    autoComplete: "new-password",
  },
];

export const initialValuesChangePassword = {
  [ChangePasswordInputFields.oldPassword]: "",
  [ChangePasswordInputFields.newPassword]: "",
} as ChangePasswordInputValues;

export const getChangePasswordFields = [
  {
    type: "password",
    id: ChangePasswordInputFields.oldPassword,
    name: ChangePasswordInputFields.oldPassword,
    caption: "Old Password",
    label: "Old Password",
    placeholder: "Enter your old password",
    icon: <Lock />,
  },
  {
    type: "password",
    id: ChangePasswordInputFields.newPassword,
    name: ChangePasswordInputFields.newPassword,
    caption: "New Password",
    label: "New Password",
    placeholder: "Enter your new password",
    icon: <Lock />,
  },
];
