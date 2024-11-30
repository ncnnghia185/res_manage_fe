"use client";
import React, { useState } from "react";
import { Button } from "@mui/material";
import { RiRefund2Line } from "react-icons/ri";
import dynamic from "next/dynamic";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// files import
import BaseLayout from "@/app/(components)/BaseLayout";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { translations } from "@/constants/language/translation";
import OpenShiftFundModal from "./components/OpenShiftFundModal";
import CloseShiftFundModal from "./components/CloseShiftFundModal";
import { dataBarChart } from "@/mook/mookData";
import { TrendingDown, TrendingUp } from "lucide-react";
import { FaTurnUp, FaTurnDown } from "react-icons/fa6";

const Dashboard = () => {
  const language = useAppSelector((state) => state.global.language);
  const owner_id = useAppSelector((state) => state.auth.userId);
  const accessToken = useAppSelector((state) => state.auth.user);
  const restaurant_id = useAppSelector(
    (state) => state.restaurant.selected_restaurant.id
  );
  const isOpenShiftFund = useAppSelector(
    (state) => state.shift_fund.isOpenShiftFund
  );
  // state
  const [openShiftFundModal, setOpenShiftFundModal] = useState<boolean>(false);
  const [endShiftFundModal, setEndShiftFundModal] = useState<boolean>(false);
  // handle open shift fund modal
  const handleOpenShiftFundModal = () => {
    setOpenShiftFundModal(true);
  };
  // handle close shift fund modal
  const handleCloseShiftFundModal = () => {
    setOpenShiftFundModal(false);
  };

  // end shift fund modal
  const handleOpenEndShiftFundModal = () => {
    setEndShiftFundModal(true);
  };
  // handle close end shift fund modal
  const handleCloseEndShiftFundModal = () => {
    setEndShiftFundModal(false);
  };
  return (
    <BaseLayout>
      <div className="h-[90%] w-full  ml-3 md:ml-0 flex flex-col md:flex md:flex-row ">
        {/* small screen */}
        <div className="w-full md:w-[70%] h-full flex flex-col overflow-y-auto custom-scroll-bar">
          {/* today */}
          <div className="h-[30%] min-h-[30%] w-full flex flex-col gap-2">
            {/* result */}
            <div className="w-full h-[30%] flex items-center justify-between px-6 ">
              <div className="h-full w-[50%] flex items-center justify-start">
                <span className="text-xl font-semibold text-slate-900">
                  {language === "en"
                    ? translations.en.today_sales_result
                    : translations.vi.today_sales_result}
                </span>
              </div>
              <div className="h-full w-[50%] flex items-center justify-center md:justify-end md:pr-6">
                {isOpenShiftFund ? (
                  <Button
                    variant="outlined"
                    endIcon={<RiRefund2Line className="text-slate-900" />}
                    sx={{
                      borderColor: "#7f8c8d",
                      height: "30px",
                      ":hover": {
                        backgroundColor: "#bdc3c7",
                      },
                    }}
                    onClick={handleOpenEndShiftFundModal}
                  >
                    <span className="text-slate-900">
                      {language === "en"
                        ? translations.en.close_shift_fund
                        : translations.vi.close_shift_fund}
                    </span>
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    endIcon={<RiRefund2Line className="text-slate-900" />}
                    sx={{
                      borderColor: "#7f8c8d",
                      height: "30px",
                      ":hover": {
                        backgroundColor: "#bdc3c7",
                      },
                    }}
                    onClick={handleOpenShiftFundModal}
                  >
                    <span className="text-slate-900">
                      {language === "en"
                        ? translations.en.open_shift_fund
                        : translations.vi.open_shift_fund}
                    </span>
                  </Button>
                )}
              </div>
            </div>

            {/* overview */}
            <div className="w-full h-[70%] flex flex-col md:gap-2">
              <div className="w-full h-[50%] flex items-center justify-center gap-3">
                <div className="w-[45%] h-[80%] md:h-full flex border-1 border-[#ecf0f1] rounded-md shadow-md shadow-[#bdc3c7] bg-slate-50 pr-2">
                  <div className="h-full w-[80%] flex flex-col items-center justify-center">
                    <span className="text-base font-semibold text-slate-900">
                      Doanh thu : 5.000.000 đ
                    </span>
                    <span className="text-xs italic text-slate-900">
                      Tăng 10% so với hôm qua
                    </span>
                  </div>
                  <div className="h-full w-[20%] flex items-center justify-center gap-1">
                    <TrendingUp className="w-6 h-6" color="#2980b9" />
                    <span className="text-base font-bold text-blue-500">
                      10%
                    </span>
                  </div>
                </div>
                <div className="w-[45%] h-[80%] md:h-full flex border-1 border-[#ecf0f1] rounded-md shadow-md shadow-[#bdc3c7] bg-slate-50 pr-2">
                  <div className="h-full w-[80%] flex flex-col items-center justify-center">
                    <span className="text-base font-semibold text-slate-900">
                      Chi tiêu : 500.000 đ
                    </span>
                    <span className="text-xs italic text-slate-900">
                      Giảm 30% so với hôm qua
                    </span>
                  </div>
                  <div className="h-full w-[20%] flex items-center justify-center gap-1">
                    <TrendingDown className="w-6 h-6" color="#e67e22" />
                    <span className="text-base font-bold text-orange-500">
                      30%
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-[50%] flex items-center justify-center gap-3">
                <div className="w-[45%] h-[80%] md:h-full flex border-1 border-[#ecf0f1] rounded-md shadow-md shadow-[#bdc3c7] bg-slate-50 pr-2">
                  <div className="h-full w-[80%] flex flex-col items-center justify-center">
                    <span className="text-base font-semibold text-slate-900">
                      Đơn đặt bàn : 20 đơn
                    </span>
                    <span className="text-xs italic text-slate-900">
                      Tăng 19% so với hôm qua
                    </span>
                  </div>
                  <div className="h-full w-[20%] flex items-center justify-center gap-1">
                    <FaTurnUp className="w-4 h-4" color="#27ae60" />
                    <span className="text-base font-bold text-green-500">
                      19%
                    </span>
                  </div>
                </div>
                <div className="w-[45%] h-[80%] md:h-full flex border-1 border-[#ecf0f1] rounded-md shadow-md shadow-[#bdc3c7] bg-slate-50 pr-2">
                  <div className="h-full w-[80%] flex flex-col items-center justify-center">
                    <span className="text-base font-semibold text-slate-900">
                      Lượng khách hàng : 200 người
                    </span>
                    <span className="text-xs italic text-slate-900">
                      Giảm 1% so với hôm qua
                    </span>
                  </div>
                  <div className="h-full w-[20%] flex items-center justify-center gap-1">
                    <FaTurnDown className="w-4 h-4" color="#c0392b" />
                    <span className="text-base font-bold text-red-500">1%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* chart */}
          <div className="min-h-[70%] md:min-h-[72%] w-full flex flex-col pt-6">
            <div className="w-full h-[8%] flex items-center justify-start pl-6 mb-3">
              <span className="text-xl font-semibold text-slate-900">
                {language === "en"
                  ? translations.en.over_view_title
                  : translations.vi.over_view_title}
              </span>
            </div>
            <div className="w-full flex flex-col gap-2 items-center">
              <ResponsiveContainer width="90%" height={450}>
                <BarChart data={dataBarChart}>
                  <Legend />
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="uv" fill="#82ca9d" barSize={38} />
                </BarChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="90%" height={450}>
                <BarChart data={dataBarChart}>
                  <Legend />
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="uv" fill="#82ca9d" barSize={38} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* large screen */}
        <div className="hidden md:flex flex-col h-[95%] w-[30%] mr-2 overflow-y-auto scroll-container gap-2 border-[1px] rounded-md border-[#bdc3c7] px-3 py-2 mt-3">
          <div className="w-full h-[6%] flex border-b-[1px] border-[#7f8c8d] rounded-lg shadow-sm items-center">
            <span className="text-lg font-semibold text-slate-900 pl-5">
              {language === "en"
                ? translations.en.new_information
                : translations.vi.new_information}
            </span>
          </div>
          <div className="w-full h-[94%] flex flex-col"></div>
        </div>

        {/* shift fund modal */}
        <OpenShiftFundModal
          language={language}
          owner_id={owner_id}
          restaurant_id={restaurant_id}
          accessToken={accessToken}
          isOpen={openShiftFundModal}
          handleClose={handleCloseShiftFundModal}
        />

        {/* Close shift fund modal */}
        <CloseShiftFundModal
          isOpen={endShiftFundModal}
          handleClose={handleCloseEndShiftFundModal}
          language={language}
          owner_id={owner_id}
          restaurant_id={restaurant_id}
          accessToken={accessToken}
        />
      </div>
    </BaseLayout>
  );
};

export default Dashboard;
