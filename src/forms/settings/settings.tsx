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
} as SettingsInputValues;

export const getSettingsFields = [
  {
    type: "text",
    id: SettingsInputFields.name,
    name: SettingsInputFields.name,
    caption: "User name",
    label: "User name",
    placeholder: "Enter your name",
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
