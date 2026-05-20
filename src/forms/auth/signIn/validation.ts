import * as Yup from "yup";
import { SignInFields } from "./types";

export const signInSchema = Yup.object().shape({
  [SignInFields.email]: Yup.string().email("Email is incorrect").required("Please, enter your email"),
  [SignInFields.password]: Yup.string()
    .min(4, "The password must be 4+ digits long")
    .required("Please, enter your password"),
});
