import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "../../components/FormInput/FormikField";
import CircularProgress from "../../components/Icons/CircularProgress";
import AuthLayout from "../../layouts/AuthLayout";
import { getTokenUser, signUpServer } from "../../redux/actions/authActions";
import { getIsSignUpLoading, getIsTokenUserLoading, getUser } from "../../redux/reducers/authReducer";
import { FORM_TEXT } from "../../constants/Form";
import { pages } from "../../lib/routeUtils";
import { SignUpFormValues } from "../../forms/auth/signUp/types";
import { getSignUpFields, initialValuesSignUp } from "../../forms/auth/signUp/form";
import { signUpSchema } from "../../forms/auth/signUp/validation";

const SignUp = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [route, setRoute] = useState<string>("");

  const user = useSelector(getUser);
  const isLoading = useSelector(getIsSignUpLoading);
  const getTokenUserLoading = useSelector(getIsTokenUserLoading);

  const [showPassword, setShowPassword] = useState<Record<string, any>>({
    password: false,
    confirmPassword: false,
  });
  const [checkBox, setCheckBox] = useState<boolean>(false);

  const onSubmit = (values: SignUpFormValues) => {
    if (!checkBox) {
      toast.error("You have not accepted the privacy policy");
      return;
    }
    if (!(values.confirmPassword === values.password)) {
      toast.error("Passwords are not identical");
      return;
    }
    dispatch(signUpServer({ name: values.name, email: values.email, password: values.password, token: route }));
  };

  const handleShowPassword = (value: boolean, type: string) => {
    setShowPassword({ ...showPassword, [type]: value });
  };

  useEffect(() => {
    setRoute(searchParams.get("token") || "");
  }, [searchParams]);

  useEffect(() => {
    if (route) {
      dispatch(getTokenUser(route));
    }
  }, [route]);

  useEffect(() => {
    if (user?.name) setValues({ name: user.name, email: user.email, password: "", confirmPassword: "" });
  }, [user]);

  const {
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setValues,
    handleSubmit: handleFormikSubmit,
  } = useFormik({
    initialValues: initialValuesSignUp,
    validationSchema: signUpSchema,
    onSubmit,
  });

  return (
    <AuthLayout>
      <FormContent>
        <Wrapper>
          <FormTitle>{FORM_TEXT.register.title}</FormTitle>
          <FormDescription>Enjoy our multi-format service</FormDescription>
          <FormMain onSubmit={handleFormikSubmit}>
            {getTokenUserLoading ? (
              <CircularProgressWrapper>
                <CircularProgress color="#009af7" />
              </CircularProgressWrapper>
            ) : (
              getSignUpFields.map((field) => (
                <FormikField
                  key={field.id}
                  handleBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                  field={field}
                  values={values}
                  handleChange={handleChange}
                  isVisible={showPassword[field.name]}
                  setIsVisible={handleShowPassword}
                  disabled={field.disabled}
                />
              ))
            )}
            <FormCheckBoxWrapper style={{ display: "flex", alignItems: "center" }}>
              <input type="checkbox" checked={checkBox} onChange={() => setCheckBox(!checkBox)} />I agree to the{" "}
              <div>
                &nbsp;<a href="">Terms</a> and <a href=""> Privacy Policy</a>
              </div>
            </FormCheckBoxWrapper>
            <FormSubmitButton type="submit">
              {isLoading ? <CircularProgress /> : FORM_TEXT.register.submitButton}{" "}
            </FormSubmitButton>
            <FormLastSection>
              <FormLastQuestion>{FORM_TEXT.register.question}</FormLastQuestion>
              <Link to={pages.signIn()}>{FORM_TEXT.register.anotherPage}</Link>
            </FormLastSection>
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

  & > div {
    margin-bottom: 14px;
  }

  & > div:last-of-type {
    margin-bottom: 0;
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

const FormCheckBoxWrapper = styled("label")`
  display: block;
  position: relative;
  padding-right: 30px;
  cursor: pointer;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }: any) => theme.primaryText};
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  a {
    color: ${({ theme }: any) => theme.primaryText};
    text-decoration: underline;
  }

  input {
    margin-right: 7px;
  }
  input[type="checkbox"] {
    background-color: transparent;
  }

  @media (min-width: 320px) and (max-width: 750px) {
    font-size: 12px;
  }
  @media (min-width: 751px) and (max-width: 1150px) {
    font-size: 10px;
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
  margin-top: 24px;
  text-align: center;
  opacity: 0.6;
`;

const FormSocialIconsList = styled("ul")`
  margin-top: 16px;
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
  margin-top: 32px;
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

const CircularProgressWrapper = styled("div")`
  min-height: 292px;
  max-height: 292px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default SignUp;
