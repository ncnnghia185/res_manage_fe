"use client";
import { updateModal } from "@/constants/customUI/box_modal";
import { translations } from "@/constants/language/translation";
import { useAppDispatch } from "@/redux/store";
import { generateId } from "@/utils/utils";
import { Box, Modal, TextField, MenuItem } from "@mui/material";
import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { toast } from "react-toastify";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { CreateNewStaffResponse } from "@/services/apiResponse";
import { staffInfoServices } from "@/services";
import { fetchAllStaffs } from "@/redux/staffState/staffSlice";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  owner_id: number;
  restaurant_id: number;
  language: string;
  accessToken: string;
};

const CreateNewStaffModal = ({
  isOpen,
  handleClose,
  owner_id,
  restaurant_id,
  language,
  accessToken,
}: Props) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [staffId, setStaffId] = useState<string>("");
  // generate staff id
  useEffect(() => {
    if (isOpen) {
      const code = generateId("MNV");
      setStaffId(code);
    }
  }, [isOpen]);
  //   genders
  const genders = [
    {
      id: 1,
      value: "male",
      label: language === "en" ? "Male" : "Nam",
    },
    {
      id: 2,
      value: "female",
      label: language === "en" ? "Female" : "Nữ",
    },
    {
      id: 3,
      value: "orther",
      label: language === "en" ? "Orther" : "Khác",
    },
  ];

  //   types
  const types = [
    {
      id: 1,
      value: "official",
      label: language === "en" ? "Official employee" : "Nhân viên chính thức",
    },
    {
      id: 2,
      value: "probationary",
      label: language === "en" ? "Probationary employee" : "Nhân viên thử việc",
    },
    {
      id: 3,
      value: "parttime",
      label: language === "en" ? "Parttime employee" : "Nhân viên thời vụ",
    },
  ];
  // validate data
  const validateData = Yup.object().shape({
    fullname: Yup.string().required(
      language === "en"
        ? translations.en.required_staff_fullname
        : translations.vi.required_staff_fullname
    ),
    gender: Yup.string().required(
      language === "en"
        ? translations.en.required_staff_gender
        : translations.vi.required_staff_gender
    ),
    date_of_birth: Yup.string().required(
      language === "en"
        ? translations.en.required_staff_date_of_birth
        : translations.vi.required_staff_date_of_birth
    ),
    phone_number: Yup.string().required(
      language === "en"
        ? translations.en.required_staff_phone_number
        : translations.vi.required_staff_phone_number
    ),
    address: Yup.string().required(
      language === "en"
        ? translations.en.required_staff_address
        : translations.vi.required_staff_address
    ),
    identification_card: Yup.string().required(
      language === "en"
        ? translations.en.required_staff_identification_card
        : translations.vi.required_staff_identification_card
    ),
    hire_date: Yup.string().required(
      language === "en"
        ? translations.en.required_staff_hire_date
        : translations.vi.required_staff_hire_date
    ),
    net_salary: Yup.string().required(
      language === "en"
        ? translations.en.required_staff_net_salary
        : translations.vi.required_staff_net_salary
    ),
    staff_type: Yup.string().required(
      language === "en"
        ? translations.en.required_staff_staff_type
        : translations.vi.required_staff_staff_type
    ),
    position: Yup.string().required(
      language === "en"
        ? translations.en.required_staff_position
        : translations.vi.required_staff_position
    ),
  });
  // initial value
  const initialValues = {
    id: staffId,
    fullname: "",
    gender: "",
    date_of_birth: "",
    phone_number: "",
    address: "",
    identification_card: "",
    hire_date: "",
    net_salary: "",
    staff_type: "",
    position: "",
    owner_id: owner_id,
    restaurant_id: restaurant_id,
  };
  //   handle submit
  const handleSubmit = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    setLoading(true);
    try {
      const response: CreateNewStaffResponse =
        await staffInfoServices.createNewStaffInfo(values, accessToken);
      if (response.success === true) {
        toast.success(
          language === "en"
            ? translations.en.success_add_new_staff
            : translations.vi.success_add_new_staff
        );
      }
      resetForm();
      dispatch(fetchAllStaffs({ owner_id, restaurant_id, accessToken }));
      handleClose();
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_add_new_staff
          : translations.vi.error_add_new_staff
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal open={isOpen}>
      <Box sx={updateModal}>
        {/* Header */}
        <div className="h-10 w-full border-b-[1px] border-[#bdc3c7] flex px-3 items-center justify-between">
          <span className="text-lg font-semibold text-[#121212]">
            {language === "en"
              ? translations.en.create_staff_label
              : translations.vi.create_staff_label}
          </span>
          <X
            size={22}
            className="bg-[#ef4444] hover:bg-[#dc2626] cursor-pointer text-[#f3f4f6]"
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
            <Form className="w-full mt-2 gap-5 h-auto ">
              {/* staff id */}
              <div className="mb-3 flex  w-full items-center justify-center h-10">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-[#121212] text-base font-bold">
                      {language === "en"
                        ? translations.en.staff_id
                        : translations.vi.staff_id}
                    </span>
                  </div>
                  <Field
                    as={TextField}
                    className=" h-12 w-[65%]  py-2 px-3 text-[#4b5563]"
                    id="id"
                    name="id"
                    type="text"
                    label={
                      language === "en"
                        ? translations.en.staff_id
                        : translations.vi.staff_id
                    }
                    size="small"
                    variant="standard"
                    disabled
                  />
                </div>
              </div>
              {/* staff name */}
              <div className="mb-3 flex flex-col w-full items-center justify-center h-10">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-[#121212] text-base font-bold">
                      {language === "en"
                        ? translations.en.staff_fullname
                        : translations.vi.staff_fullname}
                    </span>
                  </div>
                  <Field
                    as={TextField}
                    className=" h-12 w-[65%]  py-2 px-3 text-[#4b5563]"
                    id="fullname"
                    name="fullname"
                    type="text"
                    label={
                      language === "en"
                        ? translations.en.staff_fullname
                        : translations.vi.staff_fullname
                    }
                    placeholder={
                      language === "en"
                        ? translations.en.staff_fullname_placeholder
                        : translations.vi.staff_fullname_placeholder
                    }
                    size="small"
                    variant="standard"
                  />
                </div>
                {errors.fullname && touched.fullname && (
                  <ErrorMessage
                    name="fullname"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>

              {/* staff gender */}
              <div className="mb-4 flex flex-col w-full items-center justify-center h-10">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-[#121212] text-base font-bold">
                      {language === "en"
                        ? translations.en.staff_gender
                        : translations.vi.staff_gender}
                    </span>
                  </div>
                  <div className="h-8 w-[65%] flex items-center justify-start ">
                    <Select
                      id="gender"
                      name="gender"
                      value={values.gender}
                      label={
                        language === "en"
                          ? translations.en.staff_gender
                          : translations.vi.staff_gender
                      }
                      variant="standard"
                      onChange={(e: SelectChangeEvent) =>
                        setFieldValue("gender", e.target.value)
                      }
                      sx={{
                        height: "32px",
                        width: "180px",
                      }}
                    >
                      {genders.map((gender) => (
                        <MenuItem key={gender.id} value={gender.value}>
                          {gender.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
                {errors.gender && touched.gender && (
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>

              {/* staff date of birth */}
              <div className="mb-1 flex flex-col w-full items-center justify-center h-10">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-[#121212] text-base font-bold">
                      {language === "en"
                        ? translations.en.staff_date_of_birth
                        : translations.vi.staff_date_of_birth}
                    </span>
                  </div>
                  <div className="h-8 w-[65%] flex items-center justify-start">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={
                          values.date_of_birth
                            ? dayjs(values.date_of_birth, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => {
                          const formattedDate = date
                            ? dayjs(date).format("DD-MM-YYYY")
                            : "";
                          setFieldValue("date_of_birth", formattedDate);
                        }}
                        slotProps={{
                          textField: {
                            variant: "standard",
                            sx: {
                              height: "32px",
                              width: "180px",
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                {errors.date_of_birth && touched.date_of_birth && (
                  <ErrorMessage
                    name="date_of_birth"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>

              {/* staff phone number */}
              <div className="mb-3 flex flex-col w-full items-center justify-center h-10">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-[#121212] text-base font-bold">
                      {language === "en"
                        ? translations.en.staff_phone_number
                        : translations.vi.staff_phone_number}
                    </span>
                  </div>
                  <Field
                    as={TextField}
                    className=" h-12 w-[65%]  py-2 px-3 text-[#4b5563]"
                    id="phone_number"
                    name="phone_number"
                    type="text"
                    label={
                      language === "en"
                        ? translations.en.staff_phone_number
                        : translations.vi.staff_phone_number
                    }
                    placeholder={
                      language === "en"
                        ? translations.en.staff_phone_number_placeholder
                        : translations.vi.staff_phone_number_placeholder
                    }
                    size="small"
                    variant="standard"
                  />
                </div>
                {errors.phone_number && touched.phone_number && (
                  <ErrorMessage
                    name="phone_number"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>

              {/* staff address */}
              <div className="mb-3 flex flex-col w-full items-center justify-center h-10">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-[#121212] text-base font-bold">
                      {language === "en"
                        ? translations.en.staff_address
                        : translations.vi.staff_address}
                    </span>
                  </div>
                  <Field
                    as={TextField}
                    className=" h-12 w-[65%]  py-2 px-3 text-[#4b5563]"
                    id="address"
                    name="address"
                    type="text"
                    label={
                      language === "en"
                        ? translations.en.staff_address
                        : translations.vi.staff_address
                    }
                    placeholder={
                      language === "en"
                        ? translations.en.staff_address_placeholder
                        : translations.vi.staff_address_placeholder
                    }
                    size="small"
                    variant="standard"
                  />
                </div>
                {errors.address && touched.address && (
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>

              {/* staff identification_card */}
              <div className="mb-4 flex flex-col w-full items-center justify-center h-10">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-[#121212] text-base font-bold">
                      {language === "en"
                        ? translations.en.staff_identification_card
                        : translations.vi.staff_identification_card}
                    </span>
                  </div>
                  <Field
                    as={TextField}
                    className=" h-12 w-[65%]  py-2 px-3 text-[#4b5563]"
                    id="identification_card"
                    name="identification_card"
                    type="text"
                    label={
                      language === "en"
                        ? translations.en.staff_identification_card
                        : translations.vi.staff_identification_card
                    }
                    placeholder={
                      language === "en"
                        ? translations.en.staff_identification_card_placeholder
                        : translations.vi.staff_identification_card_placeholder
                    }
                    size="small"
                    variant="standard"
                  />
                </div>
                {errors.identification_card && touched.identification_card && (
                  <ErrorMessage
                    name="identification_card"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>

              {/* staff hire date */}
              <div className="mb-1 flex flex-col w-full items-center justify-center h-10">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-[#121212] text-base font-bold">
                      {language === "en"
                        ? translations.en.staff_hire_date
                        : translations.vi.staff_hire_date}
                    </span>
                  </div>
                  <div className="h-8 w-[65%] flex items-center justify-start">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={
                          values.hire_date
                            ? dayjs(values.hire_date, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => {
                          const formattedDate = date
                            ? dayjs(date).format("DD-MM-YYYY")
                            : "";
                          setFieldValue("hire_date", formattedDate);
                        }}
                        slotProps={{
                          textField: {
                            variant: "standard",
                            sx: {
                              height: "32px",
                              width: "180px",
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                {errors.hire_date && touched.hire_date && (
                  <ErrorMessage
                    name="hire_date"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>

              {/* staff net salary */}
              <div className="mb-4 flex flex-col w-full items-center justify-center h-10">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-[#121212] text-base font-bold">
                      {language === "en"
                        ? translations.en.staff_net_salary
                        : translations.vi.staff_net_salary}
                    </span>
                  </div>
                  <Field
                    as={TextField}
                    className=" h-12 w-[65%]  py-2 px-3 text-[#4b5563]"
                    id="net_salary"
                    name="net_salary"
                    type="text"
                    label={
                      language === "en"
                        ? translations.en.staff_net_salary
                        : translations.vi.staff_net_salary
                    }
                    placeholder={
                      language === "en"
                        ? translations.en.staff_net_salary_placeholder
                        : translations.vi.staff_net_salary_placeholder
                    }
                    size="small"
                    variant="standard"
                  />
                </div>
                {errors.net_salary && touched.net_salary && (
                  <ErrorMessage
                    name="net_salary"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>

              {/* staftype */}
              <div className="mb-3 flex flex-col w-full items-center justify-center h-10">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-[#121212] text-base font-bold">
                      {language === "en"
                        ? translations.en.staff_type
                        : translations.vi.staff_type}
                    </span>
                  </div>
                  <div className="h-8 w-[65%] flex items-center justify-start ">
                    <Select
                      id="staff_type"
                      name="staff_type"
                      value={values.staff_type}
                      label={
                        language === "en"
                          ? translations.en.staff_type
                          : translations.vi.staff_type
                      }
                      variant="standard"
                      onChange={(e: SelectChangeEvent) =>
                        setFieldValue("staff_type", e.target.value)
                      }
                      sx={{
                        height: "32px",
                        width: "180px",
                      }}
                    >
                      {types.map((type) => (
                        <MenuItem key={type.id} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
                {errors.staff_type && touched.staff_type && (
                  <ErrorMessage
                    name="staff_type"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>

              {/* staff position */}
              <div className="mb-3 flex flex-col w-full items-center justify-center h-10">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-[#121212] text-base font-bold">
                      {language === "en"
                        ? translations.en.staff_position
                        : translations.vi.staff_position}
                    </span>
                  </div>
                  <Field
                    as={TextField}
                    className=" h-12 w-[65%]  py-2 px-3 text-[#4b5563]"
                    id="position"
                    name="position"
                    type="text"
                    label={
                      language === "en"
                        ? translations.en.staff_position
                        : translations.vi.staff_position
                    }
                    placeholder={
                      language === "en"
                        ? translations.en.staff_position_placeholder
                        : translations.vi.staff_position_placeholder
                    }
                    size="small"
                    variant="standard"
                  />
                </div>
                {errors.position && touched.position && (
                  <ErrorMessage
                    name="position"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>
              {/* Footer */}
              <div className="w-full h-12 flex items-center justify-end gap-8 pr-10 pt-3">
                <button
                  className="w-28 h-10 bg-[#3b82f6] border rounded-md hover:bg-[#0891b2]"
                  type="submit"
                >
                  <span className="text-base font-bold text-[#f3f4f6]">
                    {language === "en"
                      ? translations.en.save_update
                      : translations.vi.save_update}
                  </span>
                </button>
                <button
                  className="w-28 h-10 bg-[#ef4444] border rounded-md hover:bg-[#dc2626]"
                  onClick={handleClose}
                >
                  <span className="text-base font-bold text-[#f3f4f6]">
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

export default CreateNewStaffModal;
