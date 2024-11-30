"use client";
import { updateModal } from "@/constants/customUI/box_modal";
import { translations } from "@/constants/language/translation";
import { Box, Modal, TextField } from "@mui/material";
import { Asterisk, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { formatCurrency, generateId } from "@/utils/utils";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CircularProgress from "@mui/material/CircularProgress";
import { CreateShiftFundResponse } from "@/services/apiResponse";
import { shiftFundServices } from "@/services";
import { useAppDispatch } from "@/redux/store";
import {
  fetchShiftFundById,
  setOpenShiftFund,
} from "@/redux/shift_fund/shift_fundSlice";
type Props = {
  language: string;
  accessToken: string;
  owner_id: number;
  restaurant_id: number;
  isOpen: boolean;
  handleClose: () => void;
};

const OpenShiftFundModal = ({
  language,
  owner_id,
  restaurant_id,
  accessToken,
  isOpen,
  handleClose,
}: Props) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [shiftFundCode, setShiftFundCode] = useState<string>("");

  // generate shift fund id
  useEffect(() => {
    if (isOpen) {
      const code = generateId("CA");
      setShiftFundCode(code);
    }
  }, [isOpen]);
  const validateData = Yup.object().shape({
    id: Yup.string().required("required"),
    shift_date: Yup.string().required(
      language === "en"
        ? translations.en.required_shift_date
        : translations.vi.required_shift_date
    ),
    open_time: Yup.string().required(
      language === "en"
        ? translations.en.required_open_time
        : translations.vi.required_open_time
    ),
    open_cash: Yup.string().required(
      language === "en"
        ? translations.en.required_open_cash
        : translations.vi.required_open_cash
    ),
  });

  const initialValues = {
    id: shiftFundCode,
    shift_date: dayjs().format("DD-MM-YYYY"),
    open_time: dayjs().format("HH:mm"),
    open_cash: "",
    notes: "",
    owner_id: owner_id,
    restaurant_id: restaurant_id,
  };

  // handleSubmit
  const handleSubmit = async (
    values: any,
    { resetForm }: FormikHelpers<typeof values>
  ) => {
    setLoading(true);
    try {
      const response: CreateShiftFundResponse =
        await shiftFundServices.createOpenShiftFund(values, accessToken);
      if (response.success) {
        toast.success(
          language === "en"
            ? translations.en.success_add_open_shift_fund
            : translations.vi.success_add_open_shift_fund
        );
        dispatch(setOpenShiftFund());
        dispatch(
          fetchShiftFundById({
            id: shiftFundCode,
            owner_id,
            restaurant_id,
            accessToken,
          })
        );
        handleClose();
        resetForm();
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_add_open_shift_fund
          : translations.vi.error_add_open_shift_fund
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen}>
      <Box sx={updateModal}>
        {/* Header */}
        <div className="h-10 w-full flex px-3 items-center justify-between">
          <span className="text-lg font-semibold text-[#121212]">
            {language === "en"
              ? translations.en.open_shift_fund
              : translations.vi.open_shift_fund}
          </span>
          <X
            size={22}
            className="bg-[#ef4444] hover:bg-[#dc2626] cursor-pointer text-[#f3f4f6]"
            onClick={handleClose}
          />
        </div>
        {/* explain */}
        <div className="h-16 w-full flex gap-1 items-start border-b-[1px] border-[#bdc3c7]">
          <Asterisk className="w-4 h-4 text-[#121212]" />
          <span className="flex-1 text-[13px] italic text-[#121212]">
            {language === "en"
              ? translations.en.explain_shift_fund
              : translations.vi.explain_shift_fund}
          </span>
        </div>

        {/* content */}
        <Formik
          initialValues={initialValues}
          validationSchema={validateData}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="w-full mt-2 gap-5 h-auto">
              {/* shift fund id */}
              <div className="flex items-center justify-start h-12 mb-3 pl-8">
                <span className="text-[#121212] font-semibold text-base pb-2 w-[30%]">
                  {language === "en"
                    ? translations.en.open_shift_fund_id_title
                    : translations.vi.open_shift_fund_id_title}
                </span>
                <Field
                  as={TextField}
                  variant="standard"
                  value={values.id}
                  size="small"
                  disabled
                />
              </div>
              {/* date and time */}
              <div className="flex  items-center justify-center h-20 mb-3 gap-5">
                <div className="h-full w-[50%] flex flex-col gap-3">
                  <span className="text-[#121212] font-semibold text-base pl-8">
                    {language === "en"
                      ? translations.en.open_date_title
                      : translations.vi.open_date_title}
                  </span>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label={language === "en" ? "Date" : "Chọn ngày"}
                      value={
                        values.shift_date
                          ? dayjs(values.shift_date, "DD-MM-YYYY")
                          : null
                      }
                      onChange={(newValue) => {
                        if (newValue) {
                          setFieldValue(
                            "shift_date",
                            newValue.format("DD-MM-YYYY")
                          );
                        }
                      }}
                      slotProps={{
                        textField: {
                          sx: {
                            "& .MuiInputBase-root": {
                              height: "36px",
                            },
                            "& .MuiInputBase-input": {
                              padding: "4px 4px",
                            },
                            width: "70%",
                            marginLeft: "40px",
                          },
                          variant: "outlined",
                          size: "small",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div className="h-full w-[50%] flex flex-col gap-3">
                  <span className="text-[#121212] font-semibold text-base pl-8">
                    {language === "en"
                      ? translations.en.open_time_title
                      : translations.vi.open_time_title}
                  </span>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label={language === "en" ? "Time" : "Chọn giờ"}
                      value={
                        values.open_time
                          ? dayjs(values.open_time, "HH:mm")
                          : null
                      }
                      onChange={(newValue) => {
                        if (newValue) {
                          setFieldValue("open_time", newValue.format("HH:mm"));
                        }
                      }}
                      ampm={false}
                      slotProps={{
                        textField: {
                          sx: {
                            "& .MuiInputBase-root": {
                              height: "36px",
                            },
                            "& .MuiInputBase-input": {
                              padding: "4px 4px",
                            },
                            width: "70%",
                            marginLeft: "36px",
                          },
                          variant: "outlined",
                          size: "small",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              {/* open cash */}
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-start h-12 pl-8">
                  <span className="text-[#121212] font-semibold text-base pb-2 w-[30%]">
                    {language === "en"
                      ? translations.en.open_cash_title
                      : translations.vi.open_cash_title}
                  </span>
                  <Field
                    as={TextField}
                    variant="standard"
                    size="small"
                    id="open_cash"
                    name="open_cash"
                    value={formatCurrency(values.open_cash, language)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const rawValue = e.target.value;
                      const numericValue = rawValue.replace(/[,\.]/g, "");
                      setFieldValue("open_cash", numericValue);
                    }}
                  />
                  {language === "en" ? (
                    <span className="text-[#121212]">$</span>
                  ) : (
                    <span className="text-[#121212]">đ</span>
                  )}
                </div>
                {errors.open_cash && touched.open_cash && (
                  <ErrorMessage
                    name="open_cash"
                    component="div"
                    className="text-[#e74c3c] text-sm mb-2 ml-44"
                  />
                )}
              </div>
              {/* notes */}
              <div className="flex items-center justify-start h-12 mb-3 pl-8">
                <span className="text-[#121212] text-base font-semibold pt-2 w-[30%] ">
                  {language === "en"
                    ? translations.en.shift_fund_notes
                    : translations.vi.shift_fund_notes}
                </span>

                <Field
                  as={TextField}
                  className="text-[#4b5563]"
                  id="notes"
                  name="notes"
                  type="text"
                  placeholder={
                    language === "en"
                      ? translations.en.shift_fund_notes_placeholder
                      : translations.vi.shift_fund_notes_placeholder
                  }
                  size="small"
                  variant="standard"
                />
              </div>

              {/* Footer */}
              <div className="w-full h-12 flex items-center justify-end gap-8 pr-10 pt-3">
                <button
                  className="w-28 h-10 bg-[#3b82f6] border rounded-md flex items-center justify-center gap-2 hover:bg-[#0891b2]"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress
                      size={18}
                      sx={{
                        color: "#f3f4f6",
                      }}
                    />
                  ) : (
                    ""
                  )}
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

export default OpenShiftFundModal;
