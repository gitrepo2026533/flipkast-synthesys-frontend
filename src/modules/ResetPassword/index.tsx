import React from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { resetPasswordSchema } from "../../forms/auth/resetPassword/validation";
import { getResetPasswordFields, initialValuesResetPassword } from "../../forms/auth/resetPassword/form";
import { ResetPasswordFormValues } from "../../forms/auth/resetPassword/types";

import AuthLayout from "../../layouts/AuthLayout";

import FormikField from "../../components/FormInput/FormikField";
import CircularProgress from "../../components/Icons/CircularProgress";

import { resetPasswordServer } from "../../redux/actions/authActions";
import { getIsResetPasswordLoading } from "../../redux/reducers/authReducer";

const ResetPassword = () => {
  const isLoading = useSelector(getIsResetPasswordLoading);

  const dispatch = useDispatch();

  const location = useLocation();

  const onSubmit = (values: ResetPasswordFormValues) => {
    const token = new URLSearchParams(location.search).get("token");
    if (!token) return;
    dispatch(resetPasswordServer({ token, password: values.password }));
  };

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit: handleFormikSubmit,
  } = useFormik({
    initialValues: initialValuesResetPassword,
    validationSchema: resetPasswordSchema,
    onSubmit,
  });

  return (
    <AuthLayout>
      <FormContent>
        <FormTitle>Reset Password</FormTitle>
        <FormMain onSubmit={handleFormikSubmit}>
          {getResetPasswordFields.map((field) => (
            <FormikField
              handleBlur={handleBlur}
              key={field.id}
              errors={errors}
              touched={touched}
              field={field}
              handleChange={handleChange}
              values={values}
            />
          ))}
          <FormSubmitButton type="submit">{isLoading ? <CircularProgress /> : "Submit"}</FormSubmitButton>
        </FormMain>
      </FormContent>
    </AuthLayout>
  );
};

const FormContent = styled("div")`
  padding-right: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 1150px) {
    padding-right: 0;
  }
  @media (max-height: 750px) {
    justify-content: center;
  }
`;

const FormTitle = styled("h1")`
  font-weight: 500;
  font-size: 52px;
  line-height: 60px;
  color: ${({ theme }: any) => theme.primaryText};
  text-align: left;
  max-width: 320px;

  @media (max-width: 1150px) {
    font-size: 32px;
    line-height: 38px;
    max-width: 160px;
  }

  @media (max-width: 750px) {
    max-width: max-content;
  }

  @media (max-height: 750px) {
    font-size: 32px;
  }
`;

const FormMain = styled("form")`
  margin-top: 40px;
  width: 100%;
  min-width: 320px;
  max-width: 320px;

  @media (min-width: 280px) and (max-width: 375px) {
    min-width: 300px;
    max-width: 300px;
    margin-top: 20px;
    input {
      min-width: auto;
    }
  }

  @media (min-width: 751px) and (max-width: 1150px) {
    min-width: 260px;
    max-width: 260px;
    margin-top: 20px;
    input {
      min-width: auto;
      font-size: 13px;
    }
  }
  @media (max-height: 750px) {
    margin-top: 25px;
  }
`;

const FormSubmitButton = styled("button")`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #fff;
  width: 100%;
  height: 60px;
  margin-top: 32px;
  border: none;
  background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
  border-radius: 12px;
  @media (min-width: 320px) and (max-width: 750px) {
    height: 45px;
    font-size: 14px;
    margin-top: 25px;
  }
  @media (min-width: 751px) and (max-width: 1150px) {
    margin-top: 20px;
    height: 45px;
    font-size: 14px;
  }
  @media (max-height: 750px) {
    margin-top: 23px;
    height: 45px;
  }
`;

export default ResetPassword;
function useQuery() {
  throw new Error("Function not implemented.");
}
