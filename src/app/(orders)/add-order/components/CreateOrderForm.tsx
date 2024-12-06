"use client";
import { generateId } from "@/utils/utils";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import moment from "moment-timezone";
import { translations } from "@/constants/language/translation";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Edit2, MoveRight } from "lucide-react";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { orderDataType } from "@/services/order/orderServices";
import { toast } from "react-toastify";
import { CreateOrderResponse } from "@/services/apiResponse";
import { orderServices } from "@/services";
import { useAppDispatch } from "@/redux/store";
import { setCreatedOrder } from "@/redux/orderState/orderSlice";
type Props = {
  isVisible: boolean;
  table_id: number;
  table_name: string;
  owner_id: number;
  restaurant_id: number;
  accessToken: string;
  language: string;
  handleChangActiveDiv: (index: number) => void;
};

const CreateOrderForm = ({
  isVisible,
  table_id,
  table_name,
  owner_id,
  restaurant_id,
  accessToken,
  language,
  handleChangActiveDiv,
}: Props) => {
  const dispatch = useAppDispatch();
  const [orderCode, setOrderCode] = useState<string>("");
  const [orderDateTime, setOrderDateTime] = useState<string>(
    moment().format("DD-MM-YYYY HH:mm")
  );
  const [customerName, setCustomerName] = useState<string>("");
  const [numberCustomers, setNumberCustomers] = useState<string>("");
  const [orderNotes, setOrderNotes] = useState<string>("");
  const [openNotesModal, setOpenNotesModal] = useState<boolean>(false);
  const [timeError, setTimeError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [customerError, setCustomerError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const createInfo = () => {
      const code = generateId("MDH");
      setOrderCode(code);
    };
    if (isVisible) {
      createInfo();
    }
  }, [isVisible, table_id]);

  const handleChangeTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setOrderDateTime(value);
    const inputTime = moment.tz(value, "DD-MM-YYYY HH:mm", "Asia/Ho_Chi_Minh");
    const now = moment.tz(new Date(), "Asia/Ho_Chi_Minh");
    if (inputTime.isBefore(now)) {
      setTimeError(
        language === "en"
          ? "The time cannot be in the past."
          : "Thời gian không thể là quá khứ."
      );
    } else {
      setTimeError("");
    }
  };
  // handle open notes modal
  const handleOpenNotesModal = () => setOpenNotesModal(true);
  // handle close notes modal
  const handleCloseNotesModal = () => setOpenNotesModal(false);
  const handleValidation = (): boolean => {
    let valid = true;

    // Kiểm tra thời gian
    if (!orderDateTime) {
      setTimeError(
        language === "en"
          ? "Order time cannot be empty."
          : "Thời gian không được để trống."
      );
      valid = false;
    }

    // Kiểm tra tên khách hàng
    if (!customerName.trim()) {
      setNameError(
        language === "en"
          ? "Customer name cannot be empty."
          : "Tên khách hàng không được để trống."
      );
      valid = false;
    } else {
      setNameError("");
    }

    // Kiểm tra số lượng khách
    if (!numberCustomers.trim() || isNaN(Number(numberCustomers))) {
      setCustomerError(
        language === "en"
          ? "Number of customers must be a valid number."
          : "Số lượng khách phải là một số hợp lệ."
      );
      valid = false;
    } else {
      setCustomerError("");
    }

    return valid;
  };

  // handle create
  const handleSubmit = async () => {
    const isValid = handleValidation();
    if (!isValid) {
      return;
    }
    const orderData: orderDataType = {
      id: orderCode,
      table_id: table_id,
      order_time: orderDateTime,
      customer_name: customerName,
      number_of_customer: Number(numberCustomers),
      order_status: "pending",
      notes: orderNotes,
      owner_id: owner_id,
      restaurant_id: restaurant_id,
    };
    try {
      setLoading(true);
      const response: CreateOrderResponse = await orderServices.createNewOrder(
        orderData,
        accessToken
      );
      if (response.success === true) {
        handleChangActiveDiv(2);
        dispatch(setCreatedOrder(response.data));
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_add_new_order
          : translations.vi.error_add_new_order
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={`${
        isVisible ? "flex" : "hidden"
      } h-full w-full flex-col px-2 md:px-4 py-2 gap-2`}
    >
      <div className="w-full h-[15%] md:h-[10%] flex flex-col md:flex-row md:gap-5">
        <div className="w-full h-[50%] md:h-full md:w-[35%] flex items-center">
          <span className="text-slate-900 font-semibold text-base">
            {language === "en"
              ? translations.en.order_code
              : translations.vi.order_code}
          </span>
        </div>
        <div className="w-full h-[50%] md:h-full md:w-[65%] flex items-center">
          <TextField
            value={orderCode}
            variant="standard"
            disabled
            sx={{ width: "100%" }}
          />
        </div>
      </div>
      <div className="w-full h-[15%] md:h-[10%] flex flex-col md:flex-row md:gap-5">
        <div className="w-full h-[50%] md:h-full md:w-[35%] flex items-center">
          <span className="text-slate-900 font-semibold text-base">
            {language === "en"
              ? translations.en.order_time
              : translations.vi.order_time}
          </span>
        </div>
        <div className="w-full h-[50%] md:h-full md:w-[65%] flex items-center">
          <TextField
            value={orderDateTime}
            onChange={handleChangeTime}
            variant="standard"
            error={!!timeError}
            helperText={timeError}
            sx={{ width: "100%" }}
          />
        </div>
      </div>
      <div className="w-full h-[15%] md:h-[10%] flex flex-col md:flex-row md:gap-5">
        <div className="w-full h-[50%] md:h-full md:w-[35%] flex items-center">
          <span className="text-slate-900 font-semibold text-base">
            {language === "en"
              ? translations.en.customer_name
              : translations.vi.customer_name}
          </span>
        </div>
        <div className="w-full h-[50%] md:h-full md:w-[65%] flex items-center">
          <TextField
            value={customerName}
            variant="standard"
            sx={{ width: "100%" }}
            onChange={(e) => setCustomerName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
          />
        </div>
      </div>
      <div className="w-full h-[15%] md:h-[10%] flex flex-col md:flex-row md:gap-5">
        <div className="w-full h-[50%] md:h-full md:w-[35%] flex items-center">
          <span className="text-slate-900 font-semibold text-base">
            {language === "en"
              ? translations.en.number_customers
              : translations.vi.number_customers}
          </span>
        </div>
        <div className="w-full h-[50%] md:h-full md:w-[65%] flex items-center">
          <TextField
            value={numberCustomers}
            variant="standard"
            sx={{ width: "100%" }}
            onChange={(e) => setNumberCustomers(e.target.value)}
            error={!!customerError}
            helperText={customerError}
          />
        </div>
      </div>
      <div className="w-full h-[15%] md:h-[10%] flex flex-col md:flex-row md:gap-5">
        <div className="w-full h-[50%] md:h-full md:w-[35%] flex items-center">
          <span className="text-slate-900 font-semibold text-base">
            {language === "en"
              ? translations.en.order_table
              : translations.vi.order_table}
          </span>
        </div>
        <div className="w-full h-[50%] md:h-full md:w-[65%] flex items-center">
          <TextField
            value={table_name}
            variant="standard"
            sx={{ width: "100%" }}
            disabled
          />
        </div>
      </div>
      <div className="w-full h-[5%] flex items-center justify-end mt-2">
        <Tooltip
          title={
            language === "en"
              ? translations.en.order_notes
              : translations.vi.order_notes
          }
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
        >
          <IconButton onClick={handleOpenNotesModal}>
            <Edit2
              className="text-slate-900 cursor-pointer hover:text-blue-600"
              size={18}
            />
          </IconButton>
        </Tooltip>
      </div>
      <div className="w-full h-[10%] mt-2 flex items-center justify-end ">
        <Button
          variant="outlined"
          endIcon={<MoveRight size={20} />}
          sx={{
            height: "32px",
          }}
          onClick={handleSubmit}
        >
          <span>
            {language === "en"
              ? translations.en.order_food
              : translations.vi.order_food}
          </span>
        </Button>
      </div>

      {/* Modal for Notes */}
      <Modal open={openNotesModal} onClose={handleCloseNotesModal}>
        <Box sx={{ padding: 4, backgroundColor: "white", borderRadius: 2 }}>
          <Typography variant="h6">
            {language === "en" ? "Add Notes" : "Thêm ghi chú"}
          </Typography>
          <TextField
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{ mt: 2 }}
          />
          <Button onClick={handleCloseNotesModal} sx={{ mt: 2 }}>
            {language === "en" ? "Close" : "Đóng"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateOrderForm;
