import { ResetPasswordFields, ResetPasswordFormValues } from "./types";

export const initialValuesResetPassword = {
  [ResetPasswordFields.password]: "",
  [ResetPasswordFields.confirmPassword]: "",
} as ResetPasswordFormValues;

export const getResetPasswordFields = [
  {
    type: "password",
    id: ResetPasswordFields.password,
    name: ResetPasswordFields.password,
    caption: "Password",
    placeholder: "Enter your new password",
  },
  {
    type: "password",
    id: ResetPasswordFields.confirmPassword,
    name: ResetPasswordFields.confirmPassword,
    caption: "Confirm your password",
    placeholder: "Confirm your password",
  },
];
