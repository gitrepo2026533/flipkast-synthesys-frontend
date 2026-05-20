import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import styled from "styled-components";
import Download from "../../components/Icons/Download";
import Select from "../../components/Select/Select";
import { settingOptionsList } from "../../mocks/settingOptionsList";
import FormikField from "../../components/FormInput/FormikField";
import { useFormik } from "formik";
import { getChangePasswordFields, getSettingsFields, initialValuesSettings } from "../../forms/settings/settings";
import { settingsSchema } from "../../forms/settings/validation";
import Button from "../../components/Button/Button";
import CloseIcon from "../../components/Icons/CloseIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProfilePicServer,
  getMyProfileServer,
  updateProfileServer,
  uploadProfilePicServer,
} from "../../redux/actions/profileActions";
import { getProfile } from "../../redux/reducers/profileReducer";
import { SettingsInputValues } from "../../forms/settings/types";
import ChangePasswordForm from "../../components/ChangePasswordForm/ChangePasswordForm";
import Sidebar from "../../components/Sidebar/Sidebar";

const ACCEPTED_FORMATS = "image/png, image/jpg";
const MAX_IMAGE_SIZE = 5000000;

const Settings = () => {
  const dispatch = useDispatch();

  const profile = useSelector(getProfile);

  const [selectedValue, setSelectedValue] = useState<Record<string, string>>({
    country: "",
    languages: "",
    timeZone: "",
  });
  const [errorSizeImage, setErrorSizeImage] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [checkBox, setCheckBox] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getMyProfileServer());
  }, []);

  useEffect(() => {
    if (!profile.name) return;
    setSelectedValue({ country: profile.country, languages: profile.language, timeZone: profile.timePreference });
    if (!selectedImage) {
      setSelectedImage(profile.profilePic);
    }
    setValues({ name: profile.name, email: profile.email, number: profile.contactNo.replace(/\s/g, "") });
    setCheckBox(profile.receiveUpdates);
  }, [profile]);

  const onSubmit = (values: SettingsInputValues) => {
    dispatch(
      updateProfileServer({
        name: values.name,
        email: values.email,
        contactNo: values.number,
        country: selectedValue.country,
        language: selectedValue.languages,
        timePreference: selectedValue.timeZone,
        receiveUpdates: checkBox,
      }),
    );
  };

  const imageUpload = (file: File) => {
    if (file && file.size > MAX_IMAGE_SIZE) {
      setErrorSizeImage(true);
    } else {
      const formData = new FormData();
      formData.set("File", file);

      setErrorSizeImage(false);
      setSelectedImage(URL.createObjectURL(file));
      dispatch(uploadProfilePicServer(formData));
    }
  };

  const handleLoadingError = () => {
    setSelectedImage("/images/placeholder.png");
  };

  const imageDelete = () => {
    dispatch(deleteProfilePicServer());
  };

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit: handleFormikSubmit,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: initialValuesSettings,
    validationSchema: settingsSchema,
    onSubmit,
  });

  const isAllInputsFilled =
    (values.name &&
      values.email &&
      values.number &&
      selectedValue.country &&
      selectedValue.languages &&
      selectedValue.timeZone &&
      !errors) !== "";

  const onChangeSelect = (e: string, type: string) => {
    setSelectedValue({ ...selectedValue, [type]: e });
  };

  const cancelChanges = () => {
    dispatch(getMyProfileServer());
  };

  return (
    <Wrapper>
      <SidebarLayout>
        <SettingsWrapper>
          <SettingsTitle>Settings</SettingsTitle>
          <MobileOnly>
            <Sidebar mobile />
          </MobileOnly>
          <SettingsForm onSubmit={handleFormikSubmit}>
            <SettingPhotoSection>
              {selectedImage ? (
                <SettingsUploadedImage
                  alt="uploadedSettingsImage"
                  width={"250px"}
                  src={selectedImage}
                  onError={handleLoadingError}
                />
              ) : (
                <SettingsNotUploadedImage>
                  <input
                    onChange={(e) => imageUpload(e?.target?.files?.[0] as File)}
                    type="file"
                    id="settingsImage"
                    name="settingsImage"
                    accept={ACCEPTED_FORMATS}
                  />
                  <img src="/images/upload-photo.png" alt="emptyImage" />
                </SettingsNotUploadedImage>
              )}
              <SettingsUploadingWrapper>
                <SettingsPhotoTitle>Your photo</SettingsPhotoTitle>
                <SettingsPhotoDownload>
                  <input
                    onChange={(e) => imageUpload(e?.target?.files?.[0] as File)}
                    type="file"
                    id="settingsImage"
                    name="settingsImage"
                    accept={ACCEPTED_FORMATS}
                  />
                  <Download />
                  <p>Change</p>
                  {/* {selectedImage && (
                    <SettingsDeleteImage onClick={imageDelete}>
                      <CloseIcon />
                      Delete
                    </SettingsDeleteImage>
                  )} */}
                </SettingsPhotoDownload>
                <SettingsPhotoFormat>Format .png or .jpg </SettingsPhotoFormat>
                <SettingsPhotoFormat sizeError={errorSizeImage}>Maximum size 5Mb</SettingsPhotoFormat>
              </SettingsUploadingWrapper>
            </SettingPhotoSection>
            <SettingsSubTitles>General</SettingsSubTitles>
            <SettingsContentWrapper>
              <SettingContentItem>
                <Select
                  value={selectedValue.country}
                  onChange={(value: string, type: string) => onChangeSelect(value, type)}
                  optionsList={settingOptionsList.countries}
                  defaultValueText="Enter your country"
                />
              </SettingContentItem>
              <SettingContentItem>
                <Select
                  value={selectedValue.languages}
                  onChange={(value: string, type: string) => onChangeSelect(value, type)}
                  optionsList={settingOptionsList.languages}
                  defaultValueText="Enter your language"
                />
              </SettingContentItem>
              <SettingContentItem>
                <Select
                  value={selectedValue.timeZone}
                  onChange={(value: string, type: string) => onChangeSelect(value, type)}
                  optionsList={settingOptionsList.timeZones}
                  defaultValueText="Enter your time-zone"
                />
              </SettingContentItem>
            </SettingsContentWrapper>
            <SettingsSubTitles>Account</SettingsSubTitles>
            <SettingsContentWrapper>
              {getSettingsFields.map((field) => (
                <FormikField
                  flexRow="31"
                  handleBlur={handleBlur}
                  key={field.id}
                  errors={errors}
                  touched={touched}
                  field={field}
                  checkBoxValue={checkBox}
                  handleChangeCheckBox={(value: boolean) => setCheckBox(value)}
                  handleChange={handleChange}
                  values={values}
                />
              ))}
            </SettingsContentWrapper>
            <SettingsButtonsSection>
              <Button text="Cancel" onClick={cancelChanges} />
              <Button text="Save" type="submit" />
            </SettingsButtonsSection>
          </SettingsForm>
          <ChangePasswordForm />
        </SettingsWrapper>
      </SidebarLayout>
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  background-color: ${({ theme }) => theme.primaryBackground};
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
`;

const SettingsWrapper = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden auto;
  flex: 1;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const SettingsTitle = styled("h3")`
  margin-top: 21px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  display: flex;
  align-items: center;
  letter-spacing: -1px;
  color: ${({ theme }: any) => theme.primaryText};

  @media (max-width: 1001px) {
    margin-bottom: 16px;
  }
`;

const SettingsForm = styled("form")`
  margin-top: 25px;

  @media (max-width: 1001px) {
    margin-top: 8px;
  }
`;

const SettingsUploadedImage = styled("img")`
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: ${({ theme }: any) => theme.iconButtonShadow};
`;

const SettingsNotUploadedImage = styled("div")`
  width: 100px;
  height: 100px;

  input {
    position: absolute;
    opacity: 0;
    width: 100px;
    height: 100px;
  }

  img {
    width: 100%;
    height: 100%;
  }
`;

const SettingPhotoSection = styled("div")`
  display: flex;
`;

const SettingsUploadingWrapper = styled("div")`
  margin-left: 20px;
`;

const SettingsPhotoTitle = styled("p")`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }: any) => theme.primaryText};
  margin-bottom: 12px;
`;

const SettingsDeleteImage = styled("button")`
  background-color: transparent;
  color: ${({ theme }: any) => theme.primaryText};
  display: flex;
  align-items: center;
  margin-left: 16px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
`;

const SettingsPhotoDownload = styled("div")`
  margin-bottom: 8px;

  display: flex;
  align-items: center;
  position: relative;
  input {
    opacity: 0;
    position: absolute;
    width: 120px;
  }
  p {
    background: linear-gradient(142.13deg, #0063b4 16.78%, #009af7 85.53%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 6px;
  }
`;

const SettingsPhotoFormat = styled.p<{ sizeError?: boolean }>`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }: any) => theme.primaryText};
  opacity: 0.6;

  ${({ sizeError }) =>
    sizeError &&
    `
       color: red;
  `}
`;

const SettingsSubTitles = styled("h3")`
  margin-top: 32px;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }: any) => theme.primaryText};
`;

const SettingsContentWrapper = styled("div")`
  margin-top: 16px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const SettingContentItem = styled("div")`
  width: 31%;
  position: relative;

  @media (max-width: 800px) {
    width: 100%;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const SettingsButtonsSection = styled("div")`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 30px;
  background: ${({ theme }: any) => theme.primaryBackground};
  z-index: 5;
  button {
    width: 160px;

    &:first-child {
      background: ${({ theme }: any) => theme.primaryBackground};
      border: 1px solid #009af7;
      span {
        color: ${({ theme }: any) => theme.primaryText};
        font-weight: 600;
        font-size: 16px;
        line-height: 20px;
      }
    }
  }
  @media (max-width: 800px) {
    button {
      &:first-child {
        margin-right: 16px;
      }
    }
  }

  @media (max-height: 820px) {
    position: sticky;
    height: 100px;
    bottom: 0;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 1001px) {
    display: flex;

    & > div {
      display: flex;
    }
  }
`;

export default Settings;
