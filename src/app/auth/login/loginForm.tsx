"use client";
import React from "react";
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
const LoginForm = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  interface LoginValues {
    username: string;
    password: string;
  }
  const initialValues: LoginValues = { username: "", password: "" };

  // validate login input
  const validateSchema = Yup.object().shape({
    username: Yup.string()
      .required("bắt buộc")
      .test(
        "is-valid",

        (value) => {
          // check email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          // check phone number
          const phoneRegex = /^[0-9]{10}$/;
          return emailRegex.test(value) || phoneRegex.test(value);
        }
      ),
    password: Yup.string().required("bắt buộc"),
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
        toast.success("thành công");
      } else {
        toast.error("thất bại");
      }
    } catch (error) {
      toast.error("thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full md:w-[50%] h-[80%] md:h-[50%] flex flex-col gap-2 border rounded-md border-slate-300 items-center">
      {/* title */}
      <div className="h-8 w-full flex items-center justify-center">
        <span className="text-lg font-bold text-gray-300 uppercase">
          đăng nhập
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
                tài khoản
              </label>
              <Field
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                name="username"
                type="text"
                placeholder="Nhập tên đăng nhập"
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
                mật khẩu
              </label>
              <Field
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
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
                đăng nhập
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
