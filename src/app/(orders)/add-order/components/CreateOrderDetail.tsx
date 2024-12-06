import React, { useEffect, useRef, useState } from "react";
import { selectedItemType } from "../page";
import { useAppSelector } from "@/redux/store";
import { translations } from "@/constants/language/translation";
import {
  CircleDollarSign,
  CircleMinus,
  CirclePlus,
  ConciergeBell,
  Printer,
  Trash2Icon,
} from "lucide-react";
import { formatCurrency } from "@/utils/utils";
import { OrderDetailData } from "@/services/order/orderDetailServices";
import { toast } from "react-toastify";
import { CreateOrderDetailResponse } from "@/services/apiResponse";
import { orderDetailServices } from "@/services";

type Props = {
  language: string;
  owner_id: number;
  restaurant_id: number;
  accessToken: string;
  items: selectedItemType[];
  handleRemoveItems: (itemId: string) => void;
  handleActiveDiv: (index: number) => void;
  order_table_id: number;
  order_table_name: string;
};

const CreateOrderDetail = ({
  language,
  owner_id,
  restaurant_id,
  accessToken,
  items,
  handleRemoveItems,
  order_table_id,
  order_table_name,
  handleActiveDiv,
}: Props) => {
  const currentOrderId = useAppSelector(
    (state) => state.order.created_order.orderId
  );
  const currentOrderTable = useAppSelector(
    (state) => state.order.created_order.tableId
  );
  const [orderedItems, setOrderedItems] = useState<selectedItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (currentOrderId) {
      setOrderedItems(items);
    } else {
      setOrderedItems([]);
    }
  }, [order_table_id, currentOrderId]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống cuối khi danh sách items thay đổi
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [orderedItems]);

  // handle increase quantity of item
  const handleIncreaseQuantity = (itemId: string) => {
    setOrderedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  // handle decrease quantity of item
  const handleDecreaseQuantity = (itemId: string) => {
    setOrderedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // handle calculate total price of item
  const calculateTotalItemPrice = (quantity: number, price: string) => {
    const priceItem = parseFloat(price);
    return quantity * priceItem;
  };

  // calculate total amout of order
  const calculateTotalAmount = () => {
    return orderedItems.reduce((total, item) => {
      const itemTotal = parseFloat(item.price) * item.quantity;
      return total + itemTotal;
    }, 0);
  };

  const formetOrderDetailItem = orderedItems.map((item) => ({
    item_id: item.id,
    item_name: item.name,
    item_quantity: item.quantity,
    item_price: parseInt(item.price),
    total_item_price: calculateTotalItemPrice(item.quantity, item.price),
  }));
  // handle submit create order details
  const handleCreateOrderDetails = async () => {
    const orderDetailData: OrderDetailData = {
      owner_id: owner_id,
      restaurant_id: restaurant_id,
      data: formetOrderDetailItem,
    };

    try {
      const response: CreateOrderDetailResponse =
        await orderDetailServices.createNewOrderDetail(
          currentOrderId,
          order_table_id,
          orderDetailData,
          accessToken
        );
      if (response.success === true) {
        toast.success(
          language === "en"
            ? translations.en.success_create_order_items
            : translations.vi.success_create_order_items
        );
        handleActiveDiv(1);
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_create_order_items
          : translations.vi.error_create_order_items
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-full max-h-full w-full flex flex-col">
      {/* Header */}
      <div className="w-full h-[15%] flex flex-col items-center justify-between px-4">
        <div className="h-[50%] w-full flex items-center">
          {" "}
          <span className="text-base font-semibold text-slate-900 w-[50%]">
            {language === "en" ? "Order ID : " : "Mã đơn hàng : "}
          </span>
          <span className="text-base text-slate-900 w-[50%] pointer-events-none select-none">
            {currentOrderId}
          </span>
        </div>

        <div className="h-[50%] w-full flex items-center">
          {" "}
          <span className="text-base font-semibold text-slate-900 w-[50%]">
            {language === "en" ? "Table : " : "Bàn ăn : "}
          </span>
          <span className="text-base text-slate-900 w-[50%] pointer-events-none select-none">
            {order_table_name}
          </span>
        </div>
      </div>

      {/* Danh sách các món */}
      <div
        ref={scrollContainerRef}
        className="w-full flex-1 overflow-y-auto scroll-container border-[1px] border-[#bdc3c7] "
      >
        <div className="flex flex-col gap-2 px-2 py-1 md:py-2">
          {orderedItems.map((item, index) => {
            const totalPriceOfItem = calculateTotalItemPrice(
              item.quantity,
              item.price
            );
            return (
              <div
                key={item.id}
                className="w-full h-24 rounded-md flex flex-col items-center justify-between bg-gray-300 px-1 md:px-2 relative hover:bg-blue-300"
              >
                <div className="w-full h-[50%] flex items-center border-b-[1px] border-[#95a5a6]">
                  <div className="h-full w-[70%] flex items-center justify-start">
                    <span className="text-sm md:text-base font-semibold text-slate-900">
                      {item.name}
                    </span>
                  </div>
                  <div className="h-full w-[30%] flex items-center justify-center">
                    <span className="text-sm md:text-base font-semibold text-slate-900">
                      {formatCurrency(item.price, language)}{" "}
                      {language === "en" ? "$" : "đ"}
                    </span>
                  </div>
                </div>
                <div className="w-full h-[50%] flex items-center">
                  <div className="h-full w-[50%] flex items-center justify-center ">
                    <span className="hidden md:flex md:text-base font-semibold text-slate-900 w-[40%]">
                      {language === "en" ? "Quantity" : "Số lượng"}
                    </span>
                    <div className="h-full w-[60%] flex items-center justify-center">
                      <CircleMinus
                        className="w-5 h-5 cursor-pointer text-slate-700"
                        onClick={() => handleDecreaseQuantity(item.id)}
                      />
                      <span className="text-sm md:text-base font-semibold text-slate-900 w-[40%] text-center">
                        {item.quantity}
                      </span>
                      <CirclePlus
                        className="w-5 h-5 cursor-pointer text-slate-700"
                        onClick={() => handleIncreaseQuantity(item.id)}
                      />
                    </div>
                  </div>
                  <div className="h-full w-[50%] flex items-center justify-center">
                    <span className="hidden md:flex md:text-base font-semibold text-slate-900 w-[55%]">
                      Thành tiền
                    </span>
                    <span className="text-sm md:text-base font-semibold text-slate-900 w-[80%] md:w-[45%]">
                      {formatCurrency(totalPriceOfItem.toString(), language)}{" "}
                      {language === "en" ? "$" : "đ"}
                    </span>
                  </div>
                </div>

                <Trash2Icon
                  className="absolute h-5 w-5 bottom-1 right-1 text-red-500 cursor-pointer"
                  onClick={() => handleRemoveItems(item.id)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Tổng cộng */}
      <div className="w-full h-[10%] flex items-center justify-end gap-2 border-t border-slate-300 px-4">
        <span className="text-base font-semibold text-slate-900">
          {language === "en" ? "Total : " : "Tổng cộng : "}
        </span>
        <span className="text-base font-semibold text-slate-900">
          {formatCurrency(calculateTotalAmount().toString(), language)}
          {language === "en" ? "$" : "đ"}
        </span>
      </div>

      {/* Nút thao tác */}
      <div className="w-full h-[10%] flex items-center justify-between gap-2 px-4">
        <button className="w-[50%] h-10 border-[1px] rounded-md bg-blue-500 hover:bg-blue-600 cursor-pointer border-blue-600 flex items-center justify-center gap-1 md:gap-2">
          <Printer size={18} color="#ecf0f1" />
          <span className="text-sm md:text-base font-semibold text-slate-100">
            {language === "en"
              ? translations.en.provisional_print
              : translations.vi.provisional_print}
          </span>
        </button>
        <button
          className="w-[50%] h-10 border-[1px] rounded-md bg-green-500 hover:bg-green-600 cursor-pointer border-green-600 flex items-center justify-center gap-1 md:gap-2"
          onClick={handleCreateOrderDetails}
        >
          <ConciergeBell size={18} color="#ecf0f1" />
          <span className="text-sm md:text-base font-semibold text-slate-100">
            {language === "en"
              ? translations.en.add_order_label
              : translations.vi.add_order_label}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CreateOrderDetail;
