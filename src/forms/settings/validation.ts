import * as Yup from "yup";
import { ChangePasswordInputFields, SettingsInputFields } from "./types";

const phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export const settingsSchema = Yup.object().shape({
  [SettingsInputFields.name]: Yup.string().required("Please, enter your name"),
  [SettingsInputFields.email]: Yup.string().email("Email is incorrect").required("Please, enter your email"),
  [SettingsInputFields.number]: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .min(12, "Phone number should be more 12+ digits")
    .required("Please, enter your phone number"),
});

export const changePasswordSchema = Yup.object().shape({
  [ChangePasswordInputFields.oldPassword]: Yup.string()
    .min(4, "The password must be 4+ digits long")
    .required("Please, enter your password"),
  [ChangePasswordInputFields.newPassword]: Yup.string()
    .min(4, "The password must be 4+ digits long")
    .required("Please, enter your new password"),
});
