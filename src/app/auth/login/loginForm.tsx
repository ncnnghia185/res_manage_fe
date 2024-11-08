"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { authServices } from "@/services";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { translations } from "@/constants/language/translation";
import { setUserId, login } from "@/redux/authState/authSlice";
const LoginForm = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.global.language);
  const router = useRouter();
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
      .test(
        "is-valid",
        language === "en" ? translations.en : translations.vi,
        (value) => {
          // check email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          // check phone number
          const phoneRegex = /^[0-9]{10}$/;
          return emailRegex.test(value) || phoneRegex.test(value);
        }
      ),
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
      const response = await authServices.loginAccount(values);
      console.log("check response", response);
      if (response?.errCode === 0) {
        dispatch(login(response?.accessToken));
        dispatch(setUserId(response?.userId));
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
    <div className="w-full md:w-[50%] h-[80%] md:h-[50%] flex flex-col gap-2 border rounded-md border-slate-300 items-center">
      {/* title */}
      <div className="h-8 w-full flex items-center justify-center">
        <span className="text-lg font-bold text-gray-300 uppercase">
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
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                {language === "en"
                  ? translations.en.username
                  : translations.vi.username}
              </label>
              <Field
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                name="username"
                type="text"
                placeholder={
                  language === "en"
                    ? translations.en.placeholder_username
                    : translations.vi.placeholder_username
                }
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                {language === "en"
                  ? translations.en.password
                  : translations.vi.password}
              </label>
              <Field
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                type="password"
                placeholder={
                  language === "en"
                    ? translations.en.placeholder_password
                    : translations.vi.placeholder_password
                }
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border rounded focus:outline-none focus:shadow-outline"
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
    </div>
  );
};

export default LoginForm;
