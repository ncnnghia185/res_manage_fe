"use client";
import React, { useState } from "react";
import { Avatar, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  ChartColumn,
  CircleDollarSign,
  MousePointerClick,
  PhoneCall,
  ShoppingBasket,
  SquareMenu,
  UserRoundPlus,
  Table,
  HandPlatter,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { translations } from "@/constants/language/translation";
import { setLanguage } from "@/redux/globalState/globalSlice";

type Props = {};

const HomePage = (props: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.global.language);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeNavItem, setActiveNavItem] = useState<string>("");
  const handleBackToHome = () => {
    router.push("/home");
  };
  const handleLoginClick = () => {
    router.push("/login");
  };
  const handleRegisterClick = () => {
    router.push("/register");
  };
  const handleClickChangePath = (path: string) => {
    router.push(path);
    setActiveNavItem(path);
  };
  const handleClickPolicy = () => {
    router.push("/policy");
  };
  const handleChangeLanguage = (event: any) => {
    const newLanguage = language === "en" ? "vi" : "en";
    dispatch(setLanguage(newLanguage));
  };
  const handleUserMenuClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-5 gap-3 bg-[#fff]">
      {/* Header */}
      <div
        className="w-[90%] h-20 flex items-center justify-center gap-6 md:justify-between bg-[#f0f9ff] border-b border-[#bdc3c7] px-3 sticky top-0 z-50"
        style={{ boxShadow: "0 6px 6px -1px rgba(0, 0, 0, 0.1)" }}
      >
        {/* Logo*/}
        <div
          className="w-[15%] md:w-[20%] lg:w-[25%] h-full flex items-center justify-center md:justify-center pl-3 gap-3 cursor-pointer"
          onClick={handleBackToHome}
        >
          <Avatar src="./logo.svg" alt="HomeLogo" />
          <span className="hidden md:hidden lg:block text-xl font-bold text-[#121212] uppercase">
            {language === "en"
              ? translations.en.manage
              : translations.vi.manage}
          </span>
        </div>
        {/* navbar */}
        <div className="w-[65%] md:w-[55%] h-full flex items-center justify-center gap-5 md:gap-8 pl-3">
          <span
            className={`flex-1 cursor-pointer text-[#121212] text-center text-base md:text-lg font-bold ${
              activeNavItem === "/how-to-use" ? "underline" : ""
            } hover:text-[#3498db]`}
            onClick={() => handleClickChangePath("/how-to-use")}
          >
            {language === "en"
              ? translations.en.how_it_work
              : translations.vi.how_it_work}
          </span>
          <span
            className={`flex-1 cursor-pointer text-[#121212] text-center text-base md:text-lg font-bold ${
              activeNavItem === "/about" ? "underline" : ""
            } hover:text-[#3498db]`}
            onClick={() => handleClickChangePath("/about")}
          >
            {language === "en"
              ? translations.en.about_us
              : translations.vi.about_us}
          </span>
          <span
            className={`flex-1 cursor-pointer text-[#121212] text-center text-base md:text-lg font-bold ${
              activeNavItem === "/policy" ? "underline" : ""
            } hover:text-[#3498db]`}
            onClick={() => handleClickChangePath("/policy")}
          >
            {language === "en"
              ? translations.en.policy
              : translations.vi.policy}
          </span>
        </div>
        {/* auth */}
        <div className="w-[15%] md:w-[25%] lg:w-[30%] h-full flex items-center justify-start md:justify-center">
          <div className=" w-full flex items-center justify-center gap-2 md:gap-6">
            <button
              className="hidden xl:flex items-center justify-center h-10 w-28 bg-[#f1f7fc] border border-[#0070f4] rounded-lg hover:bg-[#bfdbfe]"
              onClick={handleLoginClick}
            >
              <span className="text-base text-[#0673f4] font-bold">
                {language === "en"
                  ? translations.en.login
                  : translations.vi.login}
              </span>
            </button>
            <button
              className="hidden xl:flex items-center justify-center h-10 w-28 bg-[#005ac3] border border-[] rounded-lg hover:bg-[#0070f4]"
              onClick={handleRegisterClick}
            >
              <span className="text-base text-[#f9fafb] font-bold">
                {language === "en"
                  ? translations.en.register
                  : translations.vi.register}
              </span>
            </button>

            <IconButton
              sx={{
                display: { xl: "none", lg: "none", xs: "flex" },
              }}
              onClick={handleUserMenuClick}
              size="medium"
            >
              <UserRoundPlus />
            </IconButton>

            {/* Menu dropdown cho người dùng */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={handleLoginClick}
                sx={{
                  ":hover": {
                    backgroundColor: "#bfdbfe",
                  },
                }}
              >
                <span className="text-base text-[#0673f4] font-bold">
                  {language === "en"
                    ? translations.en.login
                    : translations.vi.login}
                </span>
              </MenuItem>
              <MenuItem
                onClick={handleRegisterClick}
                sx={{
                  ":hover": {
                    backgroundColor: "#bfdbfe",
                  },
                }}
              >
                <span className="text-base text-[#121212] font-bold">
                  {language === "en"
                    ? translations.en.register
                    : translations.vi.register}
                </span>
              </MenuItem>
            </Menu>
            <Tooltip
              title={
                language === "en"
                  ? translations.en.change_language
                  : translations.vi.change_language
              }
            >
              <button
                className="h-9 w-9  border rounded-full overflow-hidden border-[#bdc3c7]"
                onClick={handleChangeLanguage}
              >
                {language === "en" ? (
                  <img
                    src="/en.svg"
                    alt="English"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <img
                    src="/vi.svg"
                    alt="Vietnamese"
                    className="h-full w-full object-cover rounded-full"
                  />
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-[90%] h-auto flex flex-col gap-2">
        {/* Introduction */}
        <div className="w-full h-[90%] flex flex-col md:flex md:flex-row lg:flex lg:flex-row pt-5 bg-[#e9f4f5] gap-2 md:gap-5">
          <div className="w-full md:w-[40%] h-[30%] md:h-full flex flex-col justify-center md:justify-start">
            <div className="h-[30%] md:h-24 pl-5 flex items-end">
              <span className="text-2xl font-semibold text-[#121212]">
                {language === "en"
                  ? translations.en.software
                  : translations.vi.software}
              </span>
            </div>
            <div className="h-[40%] md:h-24 pl-16 flex flex-col items-start pt-2">
              <span className="text-2xl font-bold text-[#121212] uppercase pl-5">
                {language === "en"
                  ? translations.en.manage
                  : translations.vi.manage}
              </span>
              <span className="text-base font-semibold text-[#121212]">
                {language === "en"
                  ? translations.en.manage_sub_title
                  : translations.vi.manage_sub_title}
              </span>
            </div>
            <div className="h-[30%] md:h-24 pl-5 flex items-center md:items-start justify-center gap-5">
              <button
                className="flex items-center justify-center h-10 w-36 bg-[#0070f4] border border-[#95a5a6] rounded-lg hover:bg-[#005ac3] gap-2"
                onClick={() => handleClickChangePath("/how-to-use")}
              >
                <span className="text-base text-[#f9fafb] font-bold">
                  {language === "en"
                    ? translations.en.how_it_work
                    : translations.vi.how_it_work}
                </span>
                <MousePointerClick size={19} color="#f9fafb" />
              </button>
              <button
                className="flex items-center justify-center h-10 w-36 bg-[#cce2fd] borde rounded-lg"
                onClick={() => handleClickChangePath("/about")}
              >
                <span className="text-base text-[#075fc5] font-bold ">
                  {language === "en"
                    ? translations.en.about_us
                    : translations.vi.about_us}
                </span>
              </button>
            </div>
            <div className="hidden md:flex md:flex-col justify-center gap-2 h-24 pl-8">
              <span className="font-semibold text-lg flex gap-2 items-center text-[#121212]">
                <PhoneCall size={20} color="#007bff" />
                {language === "en"
                  ? translations.en.hotline
                  : translations.vi.hotline}
                0913392518
              </span>
              <span className="font-semibold text-lg text-[#121212]">
                {language === "en"
                  ? translations.en.open_day
                  : translations.vi.open_day}
              </span>
            </div>
          </div>
          <div className="w-full md:w-[60%] h-[70%] md:h-full relative flex justify-center">
            <img
              src="/bgi.png"
              alt="backgroud image"
              className="h-full w-[80%]"
            />
            <div className="absolute w-56 h-14 bg-[#ecf0f1] top-6 left-8 md:top-24 border border-[#bdc3c7] rounded-2xl flex items-center justify-center gap-3">
              <ChartColumn size={20} color="#007bff" />
              <span className="text-lg font-semibold text-[#121212]">
                {language === "en"
                  ? translations.en.revenue_statistics
                  : translations.vi.revenue_statistics}
              </span>
            </div>
            <div className=" absolute w-56 h-14 bg-[#ecf0f1] top-64 left-20 md:top-96 md:left-32 border border-[#bdc3c7] rounded-2xl flex items-center justify-center gap-3">
              <ShoppingBasket size={20} color="#007bff" />
              <span className="text-lg font-semibold text-[#121212]">
                {language === "en"
                  ? translations.en.sales_management
                  : translations.vi.sales_management}
              </span>
            </div>
            <div className="absolute w-56 h-14 bg-[#ecf0f1] top-24 right-6 md:top-44 md:right-16 border border-[#bdc3c7] rounded-2xl flex items-center justify-center gap-3">
              <CircleDollarSign size={20} color="#007bff" />
              <span className="text-lg font-semibold text-[#121212]">
                {language === "en"
                  ? translations.en.expense_management
                  : translations.vi.expense_management}
              </span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="w-full flex flex-col gap-2">
          <div className="w-full h-30 pt-6 flex flex-col items-center">
            <span className="text-[#002249] text-2xl md:text-3xl font-bold">
              {language === "en"
                ? translations.en.features
                : translations.vi.features}
            </span>
            <span className="text-xl md:text-2xl font-semibold text-[#121212]">
              {language === "en"
                ? translations.en.features_title
                : translations.vi.features_title}
            </span>
          </div>
          <div className="w-full h-80 flex items-start md:gap-3">
            <div className="hidden md:flex w-[30%] h-full items-center justify-center">
              <img src="./preview.png" alt="" className="h-[90%] w-[90%]" />
            </div>
            <div className="h-full w-full md:w-[60%] grid grid-cols-2 gap-4 md:gap-12 p-4 mt-2">
              <div className="grid grid-rows-4 gap-2">
                {/* item 1 */}
                <div className="h-14 flex items-center justify-center gap-2">
                  <div className="h-12 w-12 border border-[#7f8c8d] rounded-full flex items-center justify-center">
                    <ChartColumn color="#0070f4" />
                  </div>
                  <div className="h-full flex-1 flex flex-col">
                    <span className="text-base text-[002249] font-bold">
                      {language === "en"
                        ? translations.en.statistic_manage
                        : translations.vi.statistic_manage}
                    </span>
                    <span className="text-base text-[#121212] font-medium">
                      {language === "en"
                        ? translations.en.statistic_manage_content
                        : translations.vi.statistic_manage_content}
                    </span>
                  </div>
                </div>
                {/* item 2 */}
                <div className="h-14 flex items-center justify-center gap-2">
                  <div className="h-12 w-12 border border-[#7f8c8d] rounded-full flex items-center justify-center">
                    <SquareMenu color="#0070f4" />
                  </div>
                  <div className="h-full flex-1 flex flex-col">
                    <span className="text-base text-[002249] font-bold">
                      {language === "en"
                        ? translations.en.menu_category_manage
                        : translations.vi.menu_category_manage}
                    </span>
                    <span className="text-base text-[#121212] font-medium">
                      {language === "en"
                        ? translations.en.menu_category_manage_content
                        : translations.vi.menu_category_manage_content}
                    </span>
                  </div>
                </div>
                {/* item 3 */}
                <div className="bg-white h-14 flex items-center justify-center gap-2">
                  <div className="h-12 w-12 border border-[#7f8c8d] rounded-full flex items-center justify-center">
                    <Table color="#0070f4" />
                  </div>
                  <div className="h-full flex-1 flex flex-col">
                    <span className="text-base text-[002249] font-bold">
                      {language === "en"
                        ? translations.en.table_location_manage
                        : translations.vi.table_location_manage}
                    </span>
                    <span className="text-base text-[#121212] font-medium">
                      {language === "en"
                        ? translations.en.table_location_manage_content
                        : translations.vi.table_location_manage_content}
                    </span>
                  </div>
                </div>
                {/* item 4 */}
                <div className="bg-white h-14 flex items-center justify-center gap-2">
                  <div className="h-12 w-12 border border-[#7f8c8d] rounded-full flex items-center justify-center">
                    <HandPlatter color="#0070f4" />
                  </div>
                  <div className="h-full flex-1 flex flex-col">
                    <span className="text-base text-[002249] font-bold">
                      {language === "en"
                        ? translations.en.order_feature_manage
                        : translations.vi.order_feature_manage}
                    </span>
                    <span className="text-base text-[#121212] font-medium">
                      {language === "en"
                        ? translations.en.order_feature_manage_content
                        : translations.vi.order_feature_manage_content}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-rows-4 gap-2">
                {/* item 5 */}
                <div className="bg-white h-14 flex items-center justify-center gap-2">
                  <div className="h-12 w-12 border border-[#7f8c8d] rounded-full flex items-center justify-center">
                    <ShoppingCart color="#0070f4" />
                  </div>
                  <div className="h-full flex-1 flex flex-col">
                    <span className="text-base text-[002249] font-bold">
                      {language === "en"
                        ? translations.en.expenses_feature_manage
                        : translations.vi.expenses_feature_manage}
                    </span>
                    <span className="text-base text-[#121212] font-medium">
                      {language === "en"
                        ? translations.en.expenses_feature_manage_content
                        : translations.vi.expenses_feature_manage_content}
                    </span>
                  </div>
                </div>
                {/* item 6 */}
                <div className="bg-white h-14 flex items-center justify-center gap-2">
                  <div className="h-12 w-12 border border-[#7f8c8d] rounded-full flex items-center justify-center">
                    <UsersRound color="#0070f4" />
                  </div>
                  <div className="h-full flex-1 flex flex-col">
                    <span className="text-base text-[002249] font-bold">
                      {language === "en"
                        ? translations.en.staff_feature_manage
                        : translations.vi.staff_feature_manage}
                    </span>
                    <span className="text-base text-[#121212] font-medium">
                      {language === "en"
                        ? translations.en.staff_feature_manage_content
                        : translations.vi.staff_feature_manage_content}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-[90%] h-12 bg-[#e2f2f3] flex items-center justify-center border-t-2 border-[#bdc3c7]">
        <span className="text-base font-semibold text-[#121212]">
          &copy; Copyright by NCNTOOF - 2024
        </span>
      </div>
    </div>
  );
};

export default HomePage;
