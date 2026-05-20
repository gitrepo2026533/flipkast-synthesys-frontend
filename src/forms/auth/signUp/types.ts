export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export enum SignUpFields {
  name = "name",
  email = "email",
  password = "password",
  confirmPassword = "confirmPassword",
}
