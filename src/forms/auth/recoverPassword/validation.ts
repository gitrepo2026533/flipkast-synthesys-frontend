import * as Yup from "yup";
import { RecoverPasswordFields } from "./types";

export const recoverPasswordSchema = Yup.object().shape({
  [RecoverPasswordFields.email]: Yup.string().email("Email is incorrect").required("Please, enter your email"),
});
