import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/store";
import { toast } from "react-toastify";
import { translations } from "@/constants/language/translation";
import {
  fetchShiftFundById,
  setCloseShiftFund,
} from "@/redux/shift_fund/shift_fundSlice";

import { formatCurrency } from "@/utils/utils";
import { updateModal } from "@/constants/customUI/box_modal";
import {
  Box,
  CircularProgress,
  Modal,
  TextField,
  Tooltip,
} from "@mui/material";
import { X } from "lucide-react";
import { Field, Form, Formik } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { CiEdit } from "react-icons/ci";
type Props = {
  isOpen: boolean;
  handleClose: () => void;
  language: string;
  owner_id: number;
  restaurant_id: number;
  accessToken: string;
};

const CloseShiftFundModal = ({
  isOpen,
  handleClose,
  language,
  owner_id,
  restaurant_id,
  accessToken,
}: Props) => {
  const dispatch = useAppDispatch();

  const currentShiftFundDetail = useAppSelector(
    (state) => state.shift_fund.detailShiftFund
  );

  const [loading, setLoading] = useState<boolean>(false);
  const initialEndShiftFundValues = {
    end_time: "",
    close_cash: "",
    total_revenue: "",
    expenses: "",
  };

  // useEffect(() => {
  //   const getCurrentShiftFund = async () => {
  //     try {
  //       dispatch(
  //         fetchShiftFundById({
  //           id: shiftId,
  //           owner_id,
  //           restaurant_id,
  //           accessToken,
  //         })
  //       );
  //     } catch (error) {
  //       toast.error(
  //         language === "en"
  //           ? translations.en.error_fetch_current_shift_fund
  //           : translations.vi.error_fetch_current_shift_fund
  //       );
  //     }
  //   };
  //   if (isOpen) {
  //   }
  // }, [isOpen]);

  const handleSubmit = () => {};
  return (
    <Modal open={isOpen}>
      <Box sx={updateModal}>
        <div className="h-10 w-full flex px-3 items-center justify-between border-b-[1px] border-[#bdc3c7]">
          <div className="h-full flex">
            <span className="text-lg font-semibold text-[#121212]">
              {language === "en"
                ? translations.en.close_shift_fund
                : translations.vi.close_shift_fund}{" "}
            </span>
            <span className="text-lg font-bold text-[#121212]">
              {currentShiftFundDetail.id}
            </span>
          </div>

          <X
            size={22}
            className="bg-[#ef4444] hover:bg-[#dc2626] cursor-pointer text-[#f3f4f6]"
            onClick={handleClose}
          />
        </div>

        <div className="w-full h-auto flex flex-col gap-1 mb-2">
          <div className="w-full flex h-5 gap-3 mb-2">
            <span className="text-[#121212] text-base">
              {language === "en"
                ? translations.en.time_open_shift_fund
                : translations.vi.time_open_shift_fund}
            </span>
            <span className="text-[#121212] text-base">
              {currentShiftFundDetail.shift_date}{" "}
              {currentShiftFundDetail.open_time}
            </span>
          </div>
          <div className="w-full h-12 flex flex-col items-center border-[1px] border-[#bdc3c7] rounded-md px-2 py-1 pl-3">
            <div className="w-full h-full flex justify-between">
              <span className="text-[#121212] font-semibold text-base w-[30%] mt-1">
                {language === "en"
                  ? translations.en.open_cash_title
                  : translations.vi.open_cash_title}
              </span>
              <div className="w-[70%] flex items-center justify-end pr-5">
                <span className="text-[#121212] font-semibold text-base">
                  {formatCurrency(currentShiftFundDetail.open_cash, language)}
                </span>
                <span className="text-[#121212] font-semibold text-base ">
                  {language === "en" ? <span>$</span> : <span>đ</span>}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Formik
          initialValues={initialEndShiftFundValues}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="w-full gap-5 h-auto ">
              <div className="w-full flex flex-col border-[1px] border-[#bdc3c7] rounded-md py-2">
                {/* end time */}
                <div className="flex items-center justify-start h-12 mb-1 pl-3">
                  <span className="text-[#121212] font-semibold text-base w-[30%]">
                    {language === "en"
                      ? translations.en.time_close_shift_fund
                      : translations.vi.time_close_shift_fund}
                  </span>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label={language === "en" ? "Time" : "Chọn giờ"}
                      value={
                        values.end_time ? dayjs(values.end_time, "HH:mm") : null
                      }
                      onChange={(newValue) => {
                        if (newValue) {
                          setFieldValue("end_time", newValue.format("HH:mm"));
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
                            width: "150px",
                          },
                          variant: "outlined",
                          size: "small",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
                {/* close cash */}
                <div className="flex items-center justify-start h-12 mb-1 pl-3">
                  <span className="text-[#121212] font-semibold text-base w-[30%]">
                    {language === "en"
                      ? translations.en.close_cash_title
                      : translations.vi.close_cash_title}
                  </span>
                  <Field
                    as={TextField}
                    variant="standard"
                    size="small"
                    id="close_cash"
                    name="close_cash"
                    value={formatCurrency(values.close_cash, language)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const rawValue = e.target.value;
                      const numericValue = rawValue.replace(/[,\.]/g, "");
                      setFieldValue("close_cash", numericValue);
                    }}
                  />
                  {language === "en" ? <span>$</span> : <span>đ</span>}
                </div>

                {/* money arises */}
                <div className="flex items-center justify-start h-12 mb-3 pl-3 gap-2">
                  <div className="h-full w-[80%] flex items-center">
                    <span className="text-[#121212] font-semibold text-base w-[30%]">
                      {language === "en"
                        ? translations.en.money_arises
                        : translations.vi.money_arises}
                    </span>
                    <Field
                      as={TextField}
                      variant="standard"
                      size="small"
                      id="expenses"
                      name="expenses"
                      value={formatCurrency(values.expenses, language)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const rawValue = e.target.value;
                        const numericValue = rawValue.replace(/[,\.]/g, "");
                        setFieldValue("expenses", numericValue);
                      }}
                      sx={{
                        marginLeft: "25px",
                      }}
                    />
                    {language === "en" ? <span>$</span> : <span>đ</span>}
                  </div>
                  <div className="h-full w-[20%] flex items-center justify-start">
                    <Tooltip
                      title={
                        language === "en"
                          ? translations.en.shift_fund_notes
                          : translations.vi.shift_fund_notes
                      }
                    >
                      <CiEdit className="w-7 h-7 text-[#3498db] hover:text-[#2980b9] mt-3 cursor-pointer" />
                    </Tooltip>
                  </div>
                </div>

                {/* actual cash */}
                <div className="flex items-center justify-start h-[70px] mb-1 pl-3 gap-2">
                  <div className="h-full w-[50%] flex flex-col">
                    <span className="text-[#121212] text-base font-semibold">
                      {language === "en"
                        ? translations.en.actual_cash
                        : translations.vi.actual_cash}
                    </span>
                    <div className="w-full flex">
                      <Field
                        as={TextField}
                        variant="standard"
                        size="small"
                        id="expenses"
                        name="expenses"
                        value={formatCurrency(values.expenses, language)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const rawValue = e.target.value;
                          const numericValue = rawValue.replace(/[,\.]/g, "");
                          setFieldValue("expenses", numericValue);
                        }}
                      />
                      {language === "en" ? <span>$</span> : <span>đ</span>}
                    </div>
                  </div>

                  <div className="h-full w-[50%] flex flex-col">
                    <span className="text-[#121212] text-base font-semibold">
                      {language === "en"
                        ? translations.en.difference_amout
                        : translations.vi.difference_amout}
                    </span>
                    <div className="w-full flex">
                      <Field
                        as={TextField}
                        variant="standard"
                        size="small"
                        id="expenses"
                        name="expenses"
                        value={formatCurrency(values.expenses, language)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const rawValue = e.target.value;
                          const numericValue = rawValue.replace(/[,\.]/g, "");
                          setFieldValue("expenses", numericValue);
                        }}
                      />
                      {language === "en" ? <span>$</span> : <span>đ</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="w-full h-12 flex items-center justify-end gap-8 pr-10 pt-3">
                <button
                  className="w-32 h-10 bg-[#3b82f6] border rounded-md flex items-center justify-center gap-2 hover:bg-[#0891b2]"
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
                      ? translations.en.close_shift
                      : translations.vi.close_shift}
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

export default CloseShiftFundModal;
