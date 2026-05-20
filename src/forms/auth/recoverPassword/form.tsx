import { RecoverPasswordFields, RecoverPasswordFormValues } from "./types";
import { EmailBlue } from "../../../components/Icons/Email";

export const initialValuesRecoverPassword = {
  [RecoverPasswordFields.email]: "",
} as RecoverPasswordFormValues;

export const getRecoverPasswordFields = [
  {
    type: "email",
    id: RecoverPasswordFields.email,
    name: RecoverPasswordFields.email,
    caption: "Email",
    placeholder: "Enter your email",
    icon: <EmailBlue />,
  },
];
