import { SignInFields, SignInFormValues } from "./types";
import { EmailBlue } from "../../../components/Icons/Email";
import { LockBlue } from "../../../components/Icons/Lock";

export const initialValuesSignIn = {
  [SignInFields.email]: "",
  [SignInFields.password]: "",
} as SignInFormValues;

export const getSignInFields = [
  {
    type: "email",
    id: SignInFields.email,
    name: SignInFields.email,
    caption: "Email",
    placeholder: "Enter your email",
    icon: <EmailBlue />,
  },
  {
    type: "password",
    id: SignInFields.password,
    name: SignInFields.password,
    caption: "Password",
    placeholder: "Enter your password",
    icon: <LockBlue />,
  },
];
