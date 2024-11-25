// package import
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Box, Modal, TextField } from "@mui/material";
import { X } from "lucide-react";
import { toast } from "react-toastify";
// file import
import { updateModal } from "@/constants/customUI/box_modal";
import { translations } from "@/constants/language/translation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setAllRestaurants,
  setSelectedRestaurant,
} from "@/redux/restaurantState/restaurantSlice";
import { restaurantServices } from "@/services";
import { CreateRestaurantResponse } from "@/services/apiResponse";
import { restaurantDataType } from "@/services/restaurant/restaurantServices";

type Props = {
  language: string;
  isOpen: boolean;
  handleClose: () => void;
};

const CreateRestaurant = ({ language, isOpen, handleClose }: Props) => {
  const dispatch = useAppDispatch();
  const ownerId = useAppSelector((state) => state.auth.userId);
  const accessToken = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  // validate data
  const validateData = Yup.object().shape({
    name: Yup.string().required(
      language === "en"
        ? translations.en.require_name_value
        : translations.vi.require_name_value
    ),
    address: Yup.string().required(
      language === "en"
        ? translations.en.require_address_value
        : translations.vi.require_address_value
    ),
    phone_number: Yup.string().required(
      language === "en"
        ? translations.en.require_phone_value
        : translations.vi.require_phone_value
    ),
  });

  // initial values
  const initialValues: restaurantDataType = {
    name: "",
    address: "",
    phone_number: "",
    owner_id: ownerId || 0,
  };

  // handle submit
  const handleSubmit = async (
    values: restaurantDataType,
    { setSubmitting, resetForm }: FormikHelpers<restaurantDataType>
  ) => {
    setLoading(true);
    try {
      const response: CreateRestaurantResponse =
        await restaurantServices.createNewRestaurant(values, accessToken);
      if (response.success === true) {
        toast.success(
          language === "en"
            ? translations.en.success_add_new_restaurant
            : translations.vi.success_add_new_restaurant
        );
        dispatch(setAllRestaurants([response.data]));
        dispatch(setSelectedRestaurant(response.data.id));
        resetForm();
        handleClose();
      } else {
        toast.error(
          language === "en"
            ? translations.en.error_add_new_restaurant
            : translations.vi.error_add_new_restaurant
        );
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_add_new_restaurant
          : translations.vi.error_add_new_restaurant
      );
      resetForm();
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={updateModal}>
        {/* Header */}
        <div className="h-10 w-full border-b-[1px] border-gray-400 flex px-3 items-center justify-between">
          <span className="text-lg font-semibold text-slate-950">
            {language === "en"
              ? translations.en.create_restaurant_label
              : translations.vi.create_restaurant_label}
          </span>
          <X
            size={22}
            className="bg-red-500 hover:bg-red-600 cursor-pointer text-gray-100"
            onClick={handleClose}
          />
        </div>

        {/* Contents */}
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validateData}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ errors, touched }) => (
            <Form className="w-full mt-5 gap-5 h-auto ">
              <div className="mb-5 flex flex-col w-full items-center justify-center h-12">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-slate-700 text-base font-bold">
                      {language === "en"
                        ? translations.en.restaurant_name
                        : translations.vi.restaurant_name}
                    </span>
                  </div>
                  <Field
                    as={TextField}
                    className=" h-12 w-[65%]  py-2 px-3 text-gray-700 "
                    id="name"
                    name="name"
                    type="text"
                    label={
                      language === "en"
                        ? translations.en.restaurant_name
                        : translations.vi.restaurant_name
                    }
                    placeholder={
                      language === "en"
                        ? translations.en.restaurant_name_placeholder
                        : translations.vi.restaurant_name_placeholder
                    }
                    size="small"
                    variant="standard"
                  />
                </div>
                {errors.name && touched.name && (
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>

              <div className="mb-5 flex flex-col w-full items-center justify-center h-12">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-slate-700 text-base font-bold">
                      {language === "en"
                        ? translations.en.restaurant_address
                        : translations.vi.restaurant_address}
                    </span>
                  </div>
                  <Field
                    as={TextField}
                    className=" h-12 w-[65%]  py-2 px-3 text-gray-700 "
                    id="address"
                    name="address"
                    type="text"
                    label={
                      language === "en"
                        ? translations.en.restaurant_address
                        : translations.vi.restaurant_address
                    }
                    placeholder={
                      language === "en"
                        ? translations.en.restaurant_address_placeholder
                        : translations.vi.restaurant_address_placeholder
                    }
                    size="small"
                    variant="standard"
                  />
                </div>
                {errors.address && touched.address && (
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 text-sm pl-5 mb-2"
                  />
                )}
              </div>

              <div className="mb-5 flex flex-col w-full items-center justify-center h-12">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-slate-700 text-base font-bold">
                      {language === "en"
                        ? translations.en.restaurant_phone
                        : translations.vi.restaurant_phone}
                    </span>
                  </div>
                  <Field
                    as={TextField}
                    className=" h-10 w-[65%]  py-2 px-3 text-gray-700 "
                    id="phone_number"
                    name="phone_number"
                    type="text"
                    label={
                      language === "en"
                        ? translations.en.restaurant_phone
                        : translations.vi.restaurant_phone
                    }
                    placeholder={
                      language === "en"
                        ? translations.en.restaurant_phone_placeholder
                        : translations.vi.restaurant_phone_placeholder
                    }
                    size="small"
                    variant="standard"
                  />
                </div>
                {errors.phone_number && touched.phone_number && (
                  <ErrorMessage
                    name="phone_number"
                    component="div"
                    className="text-red-500 text-sm pl-14 pt-3"
                  />
                )}
              </div>
              {/* Footer */}
              <div className="w-full h-12 flex items-center justify-end gap-8 pr-10 pt-3">
                <button
                  className="w-28 h-10 bg-blue-500 border rounded-md hover:bg-blue-600"
                  type="submit"
                >
                  <span className="text-base font-bold text-gray-100">
                    {language === "en"
                      ? translations.en.save_update
                      : translations.vi.save_update}
                  </span>
                </button>
                <button
                  className="w-28 h-10 bg-red-500 border rounded-md hover:bg-red-600"
                  onClick={handleClose}
                >
                  <span className="text-base font-bold text-gray-100">
                    {language === "en"
                      ? translations.en.cancel_update
                      : translations.vi.cancel_update}
                  </span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default CreateRestaurant;
