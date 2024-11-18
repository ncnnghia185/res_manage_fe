"use client";
import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { v4 as uuidv4 } from "uuid";
import { authServices } from "@/services";
import { useAppDispatch } from "@/redux/store";
import { translations } from "@/constants/language/translation";
import { ResgisterResponse } from "@/services/apiResponse";
import {
  setAllRestaurants,
  setSelectedRestaurant,
} from "@/redux/restaurantState/restaurantSlice";
import { Checkbox, IconButton, InputAdornment, TextField } from "@mui/material";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  RefreshCcw,
  User2,
} from "lucide-react";
type Props = {
  language: string;
};
const RegisterForm = ({ language }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [capcha, setCapcha] = useState(uuidv4().slice(0, 6));
  const [inputUserCapcha, setInputUserCapcha] = useState<string>("");
  const [errorCapcha, setErrorCapcha] = useState<boolean>(false);
  const [checkPolicy, setCheckPolicy] = useState<boolean>(true);
  // show password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  // click register
  const handleChangeLogin = () => {
    router.push("/login");
  };
  interface RegisterValues {
    email: string;
    fullname: string;
    phone: string;
    password: string;
  }
  const initialValues: RegisterValues = {
    email: "",
    fullname: "",
    phone: "",
    password: "",
  };

  // validate login input
  const validateSchema = Yup.object().shape({
    email: Yup.string()
      .required(
        language === "en"
          ? translations.en.required_email
          : translations.vi.required_email
      )
      .test("is-valid", (value) => {
        // check email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // check phone number
        const phoneRegex = /^[0-9]{10}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      }),
    fullname: Yup.string().required(
      language === "en"
        ? translations.en.required_fullname
        : translations.vi.required_fullname
    ),
    phone: Yup.string().required(
      language === "en"
        ? translations.en.required_phone
        : translations.vi.required_phone
    ),
    password: Yup.string().required(
      language === "en"
        ? translations.en.required_password
        : translations.vi.required_password
    ),
  });

  // handle submit
  const handleSubmit = async (
    values: RegisterValues,
    { setSubmitting }: FormikHelpers<RegisterValues>
  ) => {
    if (inputUserCapcha !== capcha) {
      setErrorCapcha(true);
      setSubmitting(false);
      return;
    }
    if (!checkPolicy) {
      toast.error(
        language === "en"
          ? translations.en.must_agree_policy
          : translations.vi.must_agree_policy
      );
      setSubmitting(false);
      return;
    }
    try {
      const response: ResgisterResponse = await authServices.registerAccount(
        values
      );
      console.log("check response", response);
      if (response?.success === true) {
        toast.success(
          language === "en"
            ? translations.en.register_success
            : translations.vi.register_success
        );
        router.push("/login");
      } else {
        toast.error(
          language === "en"
            ? translations.en.register_error
            : translations.vi.register_error
        );
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.register_error
          : translations.vi.register_error
      );
    } finally {
      setSubmitting(false);
    }
  };
  // handle user input capcha
  const handleInputCapcha = (capcha: string) => {
    setInputUserCapcha(capcha);
    setErrorCapcha(false);
  };
  // handle reset capcha
  const handleResetCapcha = () => {
    setCapcha(uuidv4().slice(0, 6));
    setInputUserCapcha("");
    setErrorCapcha(false);
  };
  // handle check policy
  const handleCheckPolicy = () => {
    setCheckPolicy((prev) => !prev);
  };
  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
      {/* title */}
      <div className="h-8 w-full flex items-center justify-center mb-2">
        <span className="text-2xl font-bold text-[#121212] uppercase">
          {language === "en"
            ? translations.en.register_title
            : translations.vi.register_title}
        </span>
      </div>

      {/* form */}
      <Formik
        initialValues={initialValues}
        validationSchema={validateSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="w-full max-w-sm">
            <div className="mb-2">
              <label
                className="block text-[#121212] text-base font-semibold mb-2"
                htmlFor="email"
              >
                {language === "en"
                  ? translations.en.email
                  : translations.vi.email}
              </label>
              <Field
                as={TextField}
                className="shadow w-full text-[#3f3f46] flex pl-5"
                id="email"
                name="email"
                type="text"
                placeholder={
                  language === "en"
                    ? translations.en.placeholder_email
                    : translations.vi.placeholder_email
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} color="#121212" />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="standard"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-[#e74c3c] text-sm italic mt-2"
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-[#121212] text-base font-semibold mb-2"
                htmlFor="fullname"
              >
                {language === "en"
                  ? translations.en.fullname
                  : translations.vi.fullname}
              </label>
              <Field
                as={TextField}
                className="shadow w-full text-[#3f3f46] flex pl-5"
                id="fullname"
                name="fullname"
                type="text"
                placeholder={
                  language === "en"
                    ? translations.en.placeholder_fullname
                    : translations.vi.placeholder_fullname
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <User2 size={20} color="#121212" />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="standard"
              />
              <ErrorMessage
                name="fullname"
                component="div"
                className="text-[#e74c3c] text-sm italic mt-2"
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-[#121212] text-base font-semibold mb-2"
                htmlFor="phone"
              >
                {language === "en"
                  ? translations.en.phone
                  : translations.vi.phone}
              </label>
              <Field
                as={TextField}
                className="shadow w-full text-[#3f3f46] flex pl-5"
                id="phone"
                name="phone"
                type="text"
                placeholder={
                  language === "en"
                    ? translations.en.placeholder_phone
                    : translations.vi.placeholder_phone
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={20} color="#121212" />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="standard"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-[#e74c3c] text-sm italic mt-2"
              />
            </div>
            <div className="mb-3">
              <label
                className="block text-[#121212] text-base font-semibold mb-2"
                htmlFor="password"
              >
                {language === "en"
                  ? translations.en.password
                  : translations.vi.password}
              </label>
              <Field
                as={TextField}
                className="shadow w-full text-[#3f3f46] flex pl-5"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={
                  language === "en"
                    ? translations.en.placeholder_password
                    : translations.vi.placeholder_password
                }
                variant="standard"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockKeyhole size={20} color="#121212" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? (
                            <Eye size={20} />
                          ) : (
                            <EyeOff size={20} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-[#e74c3c] text-sm italic mt-2"
              />
            </div>
            {/* capcha */}
            <div className="w-full h-14 flex items-center justify-between gap-4">
              <div className="h-full w-[35%] flex items-center">
                <div className="h-full w-[85%] flex flex-col gap-1">
                  <span className="text-base text-[#7f8fa6]">
                    {language === "en"
                      ? translations.en.capcha
                      : translations.vi.capcha}
                  </span>
                  <span className="text-base text-[#121212] font-semibold select-none">
                    {capcha}
                  </span>
                </div>
                <RefreshCcw
                  size={22}
                  className="cursor-pointer"
                  onClick={handleResetCapcha}
                />
              </div>
              <div className="h-full w-[62%] flex items-center ">
                <TextField
                  variant="standard"
                  fullWidth
                  size="medium"
                  placeholder={
                    language === "en"
                      ? translations.en.placeholder_capcha
                      : translations.vi.placeholder_capcha
                  }
                  value={inputUserCapcha}
                  onChange={(e) => handleInputCapcha(e.target.value)}
                  error={errorCapcha}
                  helperText={
                    errorCapcha &&
                    (language === "en"
                      ? "Captcha is incorrect.Please try again."
                      : "Mã captcha không đúng.Vui lòng thử lại.")
                  }
                />
              </div>
            </div>
            {/* check policy */}
            <div className="w-full h-10 flex items-center justify-start">
              <Checkbox checked={checkPolicy} onChange={handleCheckPolicy} />
              <span className="text-base text-[#121212] mr-2">
                {language === "en"
                  ? translations.en.agree_with
                  : translations.vi.agree_with}
              </span>
              <span className="text-base cursor-pointer text-[#3498db] hover:text-[#2980b9] font-semibold">
                {language === "en"
                  ? translations.en.agree_policy
                  : translations.vi.agree_policy}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="w-40 bg-[#00a8ff] hover:bg-[#0070f4] text-lg text-[#fff] font-bold py-2 px-4 border-[#0070f4] rounded-lg focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={isSubmitting}
              >
                {language === "en"
                  ? translations.en.register
                  : translations.vi.register}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="h-10 w-full flex items-center justify-center gap-2">
        <span className="text-base text-[#121212] ">
          {language === "en"
            ? translations.en.already_have_account
            : translations.vi.already_have_account}
        </span>
        <span
          className="text-base font-semibold text-[#0070f4] cursor-pointer"
          onClick={handleChangeLogin}
        >
          {language === "en" ? translations.en.login : translations.vi.login}
        </span>
      </div>
    </div>
  );
};

export default RegisterForm;
