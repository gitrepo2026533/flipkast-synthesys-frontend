import * as Yup from "yup";
import { ResetPasswordFields } from "./types";

export const resetPasswordSchema = Yup.object().shape({
  [ResetPasswordFields.password]: Yup.string().required("Please, enter your password"),
  [ResetPasswordFields.confirmPassword]: Yup.string()
    .oneOf([Yup.ref(ResetPasswordFields.password), null], "Passwords must match")
    .required("Enter your password one more time"),
});
