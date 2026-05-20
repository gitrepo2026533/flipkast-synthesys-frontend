import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getChangePasswordFields, initialValuesChangePassword } from "../../forms/settings/settings";
import { ChangePasswordInputValues } from "../../forms/settings/types";
import { changePasswordSchema } from "../../forms/settings/validation";
import { changePasswordServer } from "../../redux/actions/profileActions";
import { getChangePasswordLoading } from "../../redux/reducers/profileReducer";
import Button from "../Button/Button";
import FormikField from "../FormInput/FormikField";
import CircularProgress from "../Icons/CircularProgress";

const ChangePasswordForm = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<Record<string, any>>({
    password: false,
  });

  const isLoading = useSelector(getChangePasswordLoading);

  const handleShowPassword = (value: boolean, type: string) => {
    setShowPassword({ ...showPassword, [type]: value });
  };

  const onSubmit = (values: ChangePasswordInputValues) => {
    dispatch(changePasswordServer(values));
    resetForm();
  };

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit: handleFormikSubmit,
    resetForm,
  } = useFormik({
    initialValues: initialValuesChangePassword,
    validationSchema: changePasswordSchema,
    onSubmit,
  });

  const isAllInputsFilled = (values.oldPassword && values.newPassword && !errors) !== "";

  return (
    <Form onSubmit={handleFormikSubmit}>
      <Title>Change password</Title>
      <Content>
        {getChangePasswordFields.map((field) => (
          <FormikField
            flexRow="31"
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
        <ButtonWrapper>
          <Button text={isLoading ? <CircularProgress /> : "Change"} disabled={!isAllInputsFilled} type="submit" />
        </ButtonWrapper>
      </Content>
    </Form>
  );
};

const Form = styled("form")`
  margin-bottom: 100px;
`;

const Title = styled("h3")`
  margin-top: 32px;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }: any) => theme.primaryText};

  @media (max-width: 800px) {
    margin-top: 16px;
  }
`;

const Content = styled("div")`
  margin-top: 16px;
  display: flex;
  justify-content: space-between;

  div > span:first-of-type > svg {
    display: none;
  }

  div > span:last-of-type {
    top: 33px;
  }

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const ButtonWrapper = styled("div")`
  width: 31%;
  position: relative;
  margin-top: 17px;

  @media (max-width: 800px) {
    width: 100%;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export default ChangePasswordForm;
