import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import FormikField from "../../components/FormInput/FormikField";
import CircularProgress from "../../components/Icons/CircularProgress";
import { getRecoverPasswordFields, initialValuesRecoverPassword } from "../../forms/auth/recoverPassword/form";
import { RecoverPasswordFormValues } from "../../forms/auth/recoverPassword/types";
import { recoverPasswordSchema } from "../../forms/auth/recoverPassword/validation";
import AuthLayout from "../../layouts/AuthLayout";
import { pages } from "../../lib/routeUtils";
import { recoverPasswordServer, updateAuthLoading } from "../../redux/actions/authActions";
import { getIsCheckMailLoading, getIsRecoverPasswordLoading } from "../../redux/reducers/authReducer";
import { AuthModules } from "../../types/auth";

const RecoverPassword = () => {
  const [email, setEmail] = useState<string>("");
  const isLoading = useSelector(getIsRecoverPasswordLoading);
  const isCheckMailLoading = useSelector(getIsCheckMailLoading);

  const dispatch = useDispatch();

  const onSubmit = (values: RecoverPasswordFormValues) => {
    dispatch(recoverPasswordServer(values));
    setEmail(values.email);
  };

  const handleClick = () => dispatch(updateAuthLoading({ module: AuthModules.checkMail, isLoading: false }));

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit: handleFormikSubmit,
  } = useFormik({
    initialValues: initialValuesRecoverPassword,
    validationSchema: recoverPasswordSchema,
    onSubmit,
  });

  return (
    <AuthLayout variant="without-images">
      <FormContent>
        <Wrapper>
          {!isCheckMailLoading ? (
            <>
              <FormTitle>Forget your password?</FormTitle>
              <FormDescription>Enter your email and we will send you one-time link to reset password</FormDescription>
              <FormMain onSubmit={handleFormikSubmit}>
                {getRecoverPasswordFields.map((field) => (
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
                <FormSubmitButton type="submit">
                  {isLoading ? <CircularProgress /> : "Restore password"}
                </FormSubmitButton>
              </FormMain>
              <FormLastSection>
                <Link to={pages.signIn()}>Cancel</Link>
              </FormLastSection>
            </>
          ) : (
            <>
              <FormTitle>Please check your mail</FormTitle>
              <FormDescription>We have sent you one-time link to reset password to your email {email}</FormDescription>
              <FormSubmitButton onClick={handleClick} style={{ marginTop: "24px" }}>
                Try log in again
              </FormSubmitButton>
              <FormLastSection>
                <FormLastQuestion>Didn’t receive the email? Check your spam filter or</FormLastQuestion>
                <Link to="#">Try another email address</Link>
              </FormLastSection>
            </>
          )}
        </Wrapper>
      </FormContent>
    </AuthLayout>
  );
};

const FormContent = styled("div")`
  display: flex;
  flex-direction: column;
  margin: auto 0;
  justify-content: center;

  @media (max-width: 1150px) {
    padding-right: 0;
  }
  @media (max-height: 750px) {
    justify-content: center;
  }
`;

const Wrapper = styled("div")`
  padding: 56px 72px;
  background: ${({ theme }) => theme.primaryBackground};
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: 24px;

  @media (max-width: 601px) {
    padding: 0;
    background: transparent;
    box-shadow: none;
    border-radius: 0;
  }
`;

const FormTitle = styled("h1")`
  font-weight: 500;
  font-size: 32px;
  line-height: 42px;
  letter-spacing: -3px;
  color: ${({ theme }: any) => theme.primaryText};
  text-align: left;
  max-width: 353px;

  @media (max-width: 750px) {
    max-width: max-content;
  }

  @media (max-height: 750px) {
    font-size: 32px;
  }

  @media (max-width: 350px) {
    max-width: 200px;
  }
`;

const FormDescription = styled("p")`
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }: any) => theme.primaryText};
  opacity: 0.6;
  font-weight: 400;
  text-align: left;
  margin-top: 12px;
  max-width: 353px;
  @media (min-width: 280px) and (max-width: 375px) {
    font-size: 12px;
    max-width: 300px;
  }
`;

const FormMain = styled("form")`
  margin-top: 32px;
  width: 100%;
  min-width: 353px;
  max-width: 353px;

  @media (min-width: 280px) and (max-width: 375px) {
    min-width: 300px;
    max-width: 300px;
    margin-top: 20px;
    input {
      min-width: auto;
    }
  }

  @media (min-width: 751px) and (max-width: 1150px) {
    min-width: 353px;
    max-width: 353px;
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
  border: none;
  background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
  border-radius: 12px;
  margin-bottom: 24px;
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

const FormLastSection = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;

  a {
    background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 12px;
  }

  @media (max-height: 750px) {
    margin-top: 8%;
  }
`;

const FormLastQuestion = styled("p")`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }: any) => theme.primaryText};
  text-align: center;
  opacity: 0.6;
`;

export default RecoverPassword;
