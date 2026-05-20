import { Account } from "../../../components/Icons/Accont";
import { EmailBlue } from "../../../components/Icons/Email";
import { LockBlue } from "../../../components/Icons/Lock";
import { SignUpFields, SignUpFormValues } from "./types";

export const initialValuesSignUp = {
  [SignUpFields.name]: "",
  [SignUpFields.email]: "",
  [SignUpFields.password]: "",
  [SignUpFields.confirmPassword]: "",
} as SignUpFormValues;

export const getSignUpFields = [
  {
    type: "text",
    id: SignUpFields.name,
    name: SignUpFields.name,
    caption: "Name",
    placeholder: "Enter your name",
    icon: <Account />,
  },
  {
    type: "email",
    id: SignUpFields.email,
    name: SignUpFields.email,
    caption: "Email",
    placeholder: "Enter your email",
    icon: <EmailBlue />,
    disabled: true,
  },
  {
    type: "password",
    id: SignUpFields.password,
    name: SignUpFields.password,
    caption: "Password",
    placeholder: "Enter your password",
    icon: <LockBlue />,
  },
  {
    type: "password",
    id: SignUpFields.confirmPassword,
    name: SignUpFields.confirmPassword,
    caption: "Confirm password",
    placeholder: "Confirm the password",
    icon: <LockBlue />,
  },
];
