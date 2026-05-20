import * as Yup from "yup";
import { SignUpFields } from "./types";

export const signUpSchema = Yup.object().shape({
  [SignUpFields.name]: Yup.string().required("Please, enter your name"),
  [SignUpFields.email]: Yup.string().email("Email is incorrect").required("Please, enter your email"),
  [SignUpFields.password]: Yup.string()
    .min(4, "The password must be 4+ digits long")
    .required("Please, enter your password"),
  [SignUpFields.confirmPassword]: Yup.string()
    .min(4, "The password must be 4+ digits long")
    .required("Please, confirm your password"),
});
