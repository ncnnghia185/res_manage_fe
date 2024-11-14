"use client";
// package import
import { Box, MenuItem, Modal, TextField } from "@mui/material";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// file import
import { updateModal } from "@/constants/customUI/box_modal";
import { translations } from "@/constants/language/translation";
import { useAppDispatch } from "@/redux/store";
import { CreateTableResponse, LocationData } from "@/services/apiResponse";
import { tableServices } from "@/services";
import { fetchAllTables } from "@/redux/tableState/tableSlice";
type Props = {
  language: string;
  isOpen: boolean;
  handleClose: () => void;
  accessToken: string;
  owner_id: number;
  restaurant_id: number;
  all_locations: LocationData[];
};

const CreateTable = ({
  language,
  isOpen,
  handleClose,
  accessToken,
  owner_id,
  restaurant_id,
  all_locations,
}: Props) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  // validate data
  const validateData = Yup.object().shape({
    name: Yup.string().required(
      language === "en"
        ? translations.en.required_table_name
        : translations.vi.required_table_name
    ),
    location_id: Yup.number().required(
      language === "en"
        ? translations.en.required_table_location
        : translations.vi.required_table_location
    ),
    capacity: Yup.number().required(
      language === "en"
        ? translations.en.required_table_capacity
        : translations.vi.required_table_capacity
    ),
    type: Yup.string().required(
      language === "en"
        ? translations.en.required_table_type
        : translations.vi.required_table_type
    ),
  });

  // initial value
  const initialValues = {
    name: "",
    location_id: "",
    capacity: "",
    type: "",
    restaurant_id,
    owner_id,
  };

  // handle submit
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response: CreateTableResponse = await tableServices.createNewTable(
        values,
        accessToken
      );
      if (response.success === true) {
        toast.success(
          language === "en"
            ? translations.en.success_add_new_table
            : translations.vi.success_add_new_table
        );
        dispatch(fetchAllTables({ accessToken, owner_id, restaurant_id }));
        handleClose();
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_add_new_table
          : translations.vi.error_add_new_table
      );
    } finally {
      setLoading(false);
    }
  };

  // handle cancel
  const handleCancel = (helpers: FormikHelpers<any>) => {
    handleClose();
    helpers.resetForm();
  };
  return (
    <Modal open={isOpen}>
      <Box sx={updateModal}>
        {/* Header */}
        <div className="h-10 w-full border-b-[1px] border-gray-400 flex px-3 items-center justify-between">
          <span className="text-lg font-semibold text-slate-950">
            {language === "en"
              ? translations.en.create_table_label
              : translations.vi.create_table_label}
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
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="w-full mt-5 gap-5 h-auto ">
              {/* table name */}
              <div className="mb-5 flex flex-col w-full items-center justify-center h-12">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-slate-900 text-base font-bold">
                      {language === "en"
                        ? translations.en.table_name
                        : translations.vi.table_name}
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
                        ? translations.en.table_name
                        : translations.vi.table_name
                    }
                    placeholder={
                      language === "en"
                        ? translations.en.table_name_placeholder
                        : translations.vi.table_name_placeholder
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

              {/* table location */}
              <div className="mb-5 flex flex-col w-full items-center justify-center h-12">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-slate-900 text-base font-bold">
                      {language === "en"
                        ? translations.en.table_location
                        : translations.vi.table_location}
                    </span>
                  </div>
                  <Select
                    className=" h-12 w-[65%] py-2  text-gray-700 "
                    id="location_id"
                    name="location_id"
                    value={values.location_id}
                    label={
                      language === "en"
                        ? translations.en.table_location
                        : translations.vi.table_location
                    }
                    variant="standard"
                    onChange={(e: SelectChangeEvent) =>
                      setFieldValue("location_id", e.target.value)
                    }
                  >
                    {all_locations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                {errors.location_id && touched.location_id && (
                  <ErrorMessage
                    name="location_id"
                    component="div"
                    className="text-red-500 text-sm mb-2 pl-7"
                  />
                )}
              </div>

              {/* table capacity */}
              <div className="mb-5 flex flex-col w-full items-center justify-center h-12">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-slate-900 text-base font-bold">
                      {language === "en"
                        ? translations.en.table_capacity
                        : translations.vi.table_capacity}
                    </span>
                  </div>
                  <Select
                    className=" h-12 w-[65%] py-2 text-gray-700 "
                    id="capacity"
                    name="capacity"
                    value={values.capacity}
                    label={
                      language === "en"
                        ? translations.en.table_capacity
                        : translations.vi.table_capacity
                    }
                    onChange={(e: SelectChangeEvent) => {
                      setFieldValue("capacity", e.target.value);
                    }}
                    size="small"
                    variant="standard"
                  >
                    <MenuItem value="6">
                      {language === "en"
                        ? translations.en.capacity_six
                        : translations.vi.capacity_six}
                    </MenuItem>
                    <MenuItem value="10">
                      {language === "en"
                        ? translations.en.capacity_ten
                        : translations.vi.capacity_ten}
                    </MenuItem>
                  </Select>
                </div>
                {errors.capacity && touched.capacity && (
                  <ErrorMessage
                    name="capacity"
                    component="div"
                    className="text-red-500 text-sm mb-2 pl-5"
                  />
                )}
              </div>

              {/* table type */}
              <div className="mb-5 flex flex-col w-full items-center justify-center h-12">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-slate-900 text-base font-bold">
                      {language === "en"
                        ? translations.en.table_type
                        : translations.vi.table_type}
                    </span>
                  </div>
                  <Select
                    className=" h-12 w-[65%] py-2 text-gray-700 "
                    id="type"
                    name="type"
                    value={values.type}
                    label={
                      language === "en"
                        ? translations.en.table_type
                        : translations.vi.table_type
                    }
                    onChange={(e: SelectChangeEvent) => {
                      setFieldValue("type", e.target.value);
                    }}
                    size="small"
                    variant="standard"
                  >
                    <MenuItem value="vip">VIP (Bàn VIP)</MenuItem>
                    <MenuItem value="regular">Regular (Bàn thường)</MenuItem>
                  </Select>
                </div>
                {errors.type && touched.type && (
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>

              {/* Footer */}
              <div className="w-full h-12 flex items-center justify-end gap-8 pr-10 pt-3">
                <button
                  className="w-28 h-10 bg-green-500 border rounded-md hover:bg-green-600"
                  type="submit"
                >
                  <span className="text-base font-bold text-slate-900">
                    {language === "en"
                      ? translations.en.save_update
                      : translations.vi.save_update}
                  </span>
                </button>
                <button
                  className="w-28 h-10 bg-red-500 border rounded-md hover:bg-red-600"
                  onClick={handleClose}
                >
                  <span className="text-base font-bold text-slate-900">
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

export default CreateTable;
