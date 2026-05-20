import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useFormik } from "formik";

import AuthLayout from "../../layouts/AuthLayout";
import { FORM_TEXT } from "../../constants/Form";
import { pages } from "../../lib/routeUtils";
import { getSignInFields, initialValuesSignIn } from "../../forms/auth/signIn/form";
import { signInSchema } from "../../forms/auth/signIn/validation";
import { Twitter } from "../../components/Icons/Twitter";
import { Google } from "../../components/Icons/Google";
import { SignInFormValues } from "../../forms/auth/signIn/types";
import FormikField from "../../components/FormInput/FormikField";
import { useDispatch, useSelector } from "react-redux";
import { signInServer } from "../../redux/actions/authActions";
import { getIsSignInLoading } from "../../redux/reducers/authReducer";
import CircularProgress from "../../components/Icons/CircularProgress";

const SignIn = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(getIsSignInLoading);

  const [showPassword, setShowPassword] = useState<Record<string, any>>({
    password: false,
  });

  const onSubmit = (values: SignInFormValues) => {
    dispatch(signInServer(values));
  };

  const handleShowPassword = (value: boolean, type: string) => {
    setShowPassword({ ...showPassword, [type]: value });
  };

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit: handleFormikSubmit,
  } = useFormik({
    initialValues: initialValuesSignIn,
    validationSchema: signInSchema,
    onSubmit,
  });

  return (
    <AuthLayout>
      <FormContent>
        <Wrapper>
          <FormTitle>{FORM_TEXT.login.title}</FormTitle>
          <FormMain onSubmit={handleFormikSubmit}>
            {getSignInFields.map((field) => (
              <FormikField
                handleBlur={handleBlur}
                key={field.id}
                errors={errors}
                touched={touched}
                field={field}
                handleChange={handleChange}
                values={values}
                isVisible={showPassword[field.name]}
                setIsVisible={handleShowPassword}
              />
            ))}
            <FormForgetPasswordWrapper>
              <a href="/recover-password">Forgot password?</a>
            </FormForgetPasswordWrapper>
            <FormSubmitButton type="submit">
              {isLoading ? <CircularProgress /> : FORM_TEXT.login.submitButton}
            </FormSubmitButton>
            {/* <FormSocialText>Or continue with these social profile</FormSocialText>
          <FormSocialIconsList>
            <li>
              <a href="">
                <Twitter />
              </a>
            </li>
            <li>
              <a href="">
                <Google />
              </a>
            </li>
          </FormSocialIconsList>
          <FormLastSection>
            <FormLastQuestion>{FORM_TEXT.login.question}</FormLastQuestion>
            <Link to={pages.signUp()}>{FORM_TEXT.login.anotherPage}</Link>
          </FormLastSection> */}
          </FormMain>
        </Wrapper>
      </FormContent>
    </AuthLayout>
  );
};

const FormContent = styled("div")`
  display: flex;
  flex-direction: column;
  margin: auto 0;
  justify-content: flex-end;

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
  margin-bottom: 16px;
  font-weight: 500;
  font-size: 52px;
  line-height: 60px;
  color: ${({ theme }: any) => theme.primaryText};
  text-align: left;

  @media (min-width: 280px) and (max-width: 375px) {
    font-size: 40px;
    margin-bottom: 10px;
  }
  @media (max-height: 750px) {
    font-size: 42px;
    margin-bottom: 15px;
  }
`;

const FormDescription = styled("p")`
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }: any) => theme.primaryText};
  opacity: 0.6;
  font-weight: 400;
  text-align: left;
  @media (min-width: 280px) and (max-width: 375px) {
    font-size: 12px;
  }
`;

const FormMain = styled("form")`
  margin-top: 24px;
  width: 100%;
  min-width: 353px;
  max-width: 353px;

  & > div:first-of-type {
    margin-bottom: 14px;
  }

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
    margin-top: 14px;
    input {
      min-width: auto;
      font-size: 13px;
    }
  }
  @media (max-height: 750px) {
    margin-top: 24px;
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

const FormSocialText = styled("p")`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }: any) => theme.primaryText};
  margin-top: 32px;
  text-align: center;
  opacity: 0.6;
`;

const FormSocialIconsList = styled("ul")`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  flex-direction: row;

  li {
    margin-left: 10px;
    margin-right: 10px;
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

const FormLastSection = styled("div")`
  display: flex;
  flex-direction: row;
  margin-top: 70px;
  justify-content: center;
  align-items: center;

  a {
    background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 8px;
    font-size: 12px;
  }

  @media (min-width: 320px) and (max-width: 750px) {
    margin-top: 35px;
  }

  @media (min-width: 751px) and (max-width: 1150px) {
    margin-top: 25px;
  }
  @media (max-height: 750px) {
    margin-top: 8%;
  }
`;

const FormForgetPasswordWrapper = styled("div")`
  display: flex;
  justify-content: flex-end;
  margin-top: -12px;
  a {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #0063b4;
    margin-top: 4px;
  }

  @media (max-width: 1150px) {
    margin-top: -12px;
  }
`;

export default SignIn;
