"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { authServices, restaurantServices } from "@/services";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { translations } from "@/constants/language/translation";
import { setUserId, login } from "@/redux/authState/authSlice";
import { AllRestaurantResponse, AuthResponse } from "@/services/apiResponse";
import {
  setAllRestaurants,
  setSelectedRestaurant,
} from "@/redux/restaurantState/restaurantSlice";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
type Props = {
  language: string;
};
const LoginForm = ({ language }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  // click register
  const handleChangeRegister = () => {
    router.push("/register");
  };
  interface LoginValues {
    username: string;
    password: string;
  }
  const initialValues: LoginValues = { username: "", password: "" };

  // validate login input
  const validateSchema = Yup.object().shape({
    username: Yup.string()
      .required(
        language === "en"
          ? translations.en.required_username
          : translations.vi.required_username
      )
      .test("is-valid", (value) => {
        // check email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // check phone number
        const phoneRegex = /^[0-9]{10}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      }),
    password: Yup.string().required(
      language === "en"
        ? translations.en.required_password
        : translations.vi.required_password
    ),
  });

  // handle submit
  const handleSubmit = async (
    values: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>
  ) => {
    try {
      const response: AuthResponse = await authServices.loginAccount(values);
      console.log("check response", response);
      if (response?.errCode === 0) {
        dispatch(login(response.accessToken));
        dispatch(setUserId(response.userId));

        // get all restaurants of user
        const listRestaurant: AllRestaurantResponse =
          await restaurantServices.getAllRestaurants(response.userId);
        if (listRestaurant.success === true) {
          dispatch(setAllRestaurants(listRestaurant.data));
        }
        // identify the biggest restaurant id
        if (listRestaurant.data.length > 0) {
          const maxRestaurant = listRestaurant.data.reduce((prev, current) =>
            current.id > prev.id ? current : prev
          );
          dispatch(setSelectedRestaurant(maxRestaurant.id));
        }
        router.push("/dashboard");
        toast.success(
          language === "en"
            ? translations.en.login_success
            : translations.vi.login_success
        );
      } else {
        toast.error(
          language === "en"
            ? translations.en.login_error
            : translations.vi.login_error
        );
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.login_error
          : translations.vi.login_error
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
      {/* title */}
      <div className="h-8 w-full flex items-center justify-center">
        <span className="text-2xl font-bold text-[#121212] uppercase">
          {language === "en"
            ? translations.en.login_title
            : translations.vi.login_title}
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
            <div className="mb-4">
              <label
                className="block text-[#121212] text-base font-semibold mb-2"
                htmlFor="username"
              >
                {language === "en"
                  ? translations.en.username
                  : translations.vi.username}
              </label>
              <Field
                as={TextField}
                className="shadow w-full text-[#3f3f46] flex pl-5"
                id="username"
                name="username"
                type="text"
                placeholder={
                  language === "en"
                    ? translations.en.placeholder_username
                    : translations.vi.placeholder_username
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
                name="username"
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
            <div className="w-full h-10 flex items-start justify-end pr-6">
              <span className="text-base cursor-pointer text-[#3498db] hover:text-[#2980b9]">
                {language === "en"
                  ? translations.en.forgot_password
                  : translations.vi.forgot_password}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="w-40 bg-[#00a8ff] hover:bg-[#0070f4] text-lg text-[#fff] font-bold py-2 px-4 border-[#0070f4] rounded-lg focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={isSubmitting}
              >
                {language === "en"
                  ? translations.en.login
                  : translations.vi.login}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="h-10 w-full flex items-center justify-center gap-2">
        <span className="text-base text-[#121212] ">
          {language === "en"
            ? translations.en.not_have_accout
            : translations.vi.not_have_accout}
        </span>
        <span
          className="text-base font-semibold text-[#0070f4] cursor-pointer"
          onClick={handleChangeRegister}
        >
          {language === "en"
            ? translations.en.register
            : translations.vi.register}
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
