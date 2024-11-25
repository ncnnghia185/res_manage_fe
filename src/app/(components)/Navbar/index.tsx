"use client";
// package import
import React, { useState } from "react";
import {
  Bell,
  LogOut,
  Moon,
  Settings,
  User2,
  Sun,
  Calendar,
  Search,
  MenuIcon,
  Home,
  MoveLeft,
} from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  ListItemIcon,
  MenuItem,
  Menu,
  Select,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

// file import
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setIsDarkMode,
  setIsSidebarSmallCollapsed,
  setLanguage,
} from "@/redux/globalState/globalSlice";
import { slotProps, menuSlotProps } from "@/constants/customUI/slotProps";
import { translations } from "@/constants/language/translation";

import CreateRestaurant from "@/app/restaurant/component/CreateRestaurant";
import { logout } from "@/redux/authState/authSlice";
const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // global state
  const sidebarSmallCollapsed = useAppSelector(
    (state) => state.global.sidebarSmallCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const language = useAppSelector((state) => state.global.language);
  const selected_restaurant = useAppSelector(
    (state) => state.restaurant.selected_restaurant
  );
  const toggleSidebarSmall = () => {
    dispatch(setIsSidebarSmallCollapsed(!sidebarSmallCollapsed));
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement | SVGSVGElement>(
    null
  );
  const [openModalCreateRestaurant, setOpenModalCreateRestaurant] =
    useState(false);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickSmallScreen = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // toggle sidebar
  const toggleSidebarCollapse = () => {
    dispatch(setIsSidebarSmallCollapsed(!sidebarSmallCollapsed));
  };
  // toggle dark mode
  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };
  // change language
  const handleChangeLanguage = (event: SelectChangeEvent) => {
    dispatch(setLanguage(event.target.value));
  };
  // change language in small screen
  const handleSmallScreenLanguageToggle = (language: string) => {
    dispatch(setLanguage(language));
  };
  // handle show search in small screen
  const handleSearchInSmallScreen = () => {
    setShowSearchBar(!showSearchBar);
  };
  // handle open create restaurant modal
  const handleOpenCreateRestaurantModal = () => {
    setOpenModalCreateRestaurant(true);
  };
  // handle close create restaurant modal
  const handleCloseCreateRestaurantModal = () => {
    setOpenModalCreateRestaurant(false);
  };
  // handle logout user
  const handleLogout = () => {
    dispatch(logout());
    router.push("/home");
  };
  // dark/light tooltip title
  const tooltipDarkModeTitle: string = isDarkMode
    ? translations[language as "en" | "vi"].light
    : translations[language as "vi" | "en"].dark;

  const today = dayjs();
  return (
    <div className="h-full w-full flex items-center justify-between gap-1 md:gap-2 px-2">
      {/* Infor */}
      <div className="w-1/2 md:w-[30%] h-full flex items-center justify-between md:justify-center gap-4 md:gap-2 px-2 md:px-4">
        <Tooltip
          title={
            language === "en"
              ? translations.en.show_small_sidebar
              : translations.vi.show_small_sidebar
          }
        >
          <MenuIcon
            className="block md:hidden cursor-pointer text-slate-900"
            size={24}
            onClick={toggleSidebarCollapse}
          />
        </Tooltip>

        <Image
          src="/logo.svg"
          alt="logo-small-screen"
          width={34}
          height={34}
          className="flex md:hidden"
          style={{
            paddingLeft: "5px",
          }}
        />
        {/* Restaurant name */}
        <div className="w-[90%] h-full flex items-center justify-start md:justify-center">
          <span className="text-xl md:text-xl font-bold text-slate-700">
            {selected_restaurant !== null ? selected_restaurant.name : ""}
          </span>
        </div>
      </div>
      {/* SMALL SCREEN */}
      <div className="flex md:hidden w-1/2 h-full items-center justify-between px-8">
        {/* Search icon */}
        <Tooltip
          title={
            language === "en"
              ? translations.en.search_icon
              : translations.vi.search_icon
          }
        >
          <Search
            className="text-slate-900 cursor-pointer"
            onClick={handleSearchInSmallScreen}
          />
        </Tooltip>

        {/* Dark/Light Mode */}
        {isDarkMode === true ? (
          <Tooltip
            title={
              language === "en" ? translations.en.light : translations.vi.light
            }
          >
            <Sun
              className="text-slate-900 cursor-pointer"
              onClick={toggleDarkMode}
            />
          </Tooltip>
        ) : (
          <Tooltip
            title={
              language === "en" ? translations.en.dark : translations.vi.dark
            }
          >
            <Moon
              className="text-slate-900 cursor-pointer"
              onClick={toggleDarkMode}
            />
          </Tooltip>
        )}
        {/* Notification */}
        <Tooltip
          title={
            language === "en"
              ? translations.en.notification_icon
              : translations.vi.notification_icon
          }
        >
          <Bell className="text-slate-900 cursor-pointer" />
        </Tooltip>

        {/* User info */}
        <React.Fragment>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Tooltip
              title={
                language === "en"
                  ? translations.en.profile
                  : translations.vi.profile
              }
            >
              <User2
                className="text-slate-900 cursor-pointer"
                onClick={handleClickSmallScreen}
              />
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={menuSlotProps}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleOpenCreateRestaurantModal}>
              <ListItemIcon>
                <Home className="h-6 w-6" />
              </ListItemIcon>
              {language === "en"
                ? translations.en.add_new_restaurant
                : translations.vi.add_new_restaurant}
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <User2 className="h-6 w-6" />
              </ListItemIcon>
              {language === "en"
                ? translations.en.profile
                : translations.vi.profile}
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings className="h-6 w-6" />
              </ListItemIcon>
              {language === "en"
                ? translations.en.setting
                : translations.vi.setting}
            </MenuItem>

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogOut className="h-6 w-6" />
              </ListItemIcon>
              {language === "en"
                ? translations.en.logout
                : translations.vi.logout}
            </MenuItem>
          </Menu>
        </React.Fragment>

        {/* Change Language */}
        {language === "en" ? (
          <Tooltip
            title={
              language === "en"
                ? translations.en.en_icon
                : translations.vi.en_icon
            }
          >
            <Image
              src="/enrouded.svg"
              alt="vietnam flag"
              width={24}
              height={24}
              onClick={() => handleSmallScreenLanguageToggle("vi")}
              style={{
                cursor: "pointer",
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip
            title={
              language === "en"
                ? translations.en.vi_icon
                : translations.vi.vi_icon
            }
          >
            <Image
              src="/vnrouded.svg"
              alt="vietnam flag"
              width={24}
              height={24}
              onClick={() => handleSmallScreenLanguageToggle("en")}
              style={{
                cursor: "pointer",
              }}
            />
          </Tooltip>
        )}
      </div>
      {/* Search in small screen */}
      <div
        className={`${
          showSearchBar ? "flex" : "hidden"
        } md:hidden fixed top-0 left-0 w-full h-[10%] items-center pl-10 bg-gray-300 gap-10 z-50 transition-all duration-300`}
      >
        <Tooltip
          title={
            language === "en"
              ? translations.en.back_search_icon
              : translations.vi.back_search_icon
          }
        >
          <MoveLeft
            onClick={handleSearchInSmallScreen}
            className="text-slate-900 cursor-pointer"
          />
        </Tooltip>
        <div className="flex md:hidden relative items-center justify-center w-[70%] h-full">
          <input
            type="text"
            className="h-[50%] w-[90%] bg-slate-200 px-4 text-base border border-slate-500 focus:outline-none focus:border-slate-600 rounded-lg text-slate-800"
            placeholder={
              language === "en"
                ? translations.en.search
                : translations.vi.search
            }
          />
          <Search className="absolute top-7 right-9 cursor-pointer text-slate-800" />
        </div>
      </div>
      {/* Search */}
      <div className="hidden md:flex w-[35%] h-full relative items-center justify-center">
        <input
          type="text"
          className="h-[50%] w-[90%] bg-slate-200 px-4 text-base border border-slate-500 focus:outline-none focus:border-slate-600 rounded-lg text-slate-800"
          placeholder={
            language === "en" ? translations.en.search : translations.vi.search
          }
        />
        <Search className="absolute top-6 right-9 cursor-pointer text-slate-800" />
      </div>

      {/* Options */}
      <div className=" hidden md:flex w-[35%] h-full items-center justify-between gap-2">
        <div className="h-full w-[35%] flex gap-2 items-center justify-center">
          <Calendar size={20} className="text-gray-800" />
          <span className="text-base font-semibold text-gray-800">
            {today.format("DD/MM/YYYY")}
          </span>
        </div>
        <div className="h-full w-[40%] flex items-center gap-5 justify-center">
          {/* Dark/Light mode */}
          <Tooltip title={tooltipDarkModeTitle} slotProps={slotProps}>
            {isDarkMode ? (
              <Sun
                size={22}
                onClick={toggleDarkMode}
                className="cursor-pointer text-gray-900"
              />
            ) : (
              <Moon
                size={22}
                onClick={toggleDarkMode}
                className="cursor-pointer text-gray-900"
              />
            )}
          </Tooltip>

          {/* Notification */}
          <Badge
            badgeContent={<span className="text-red-500 text-base">9</span>}
          >
            <Bell size={22} className="text-slate-800" />
          </Badge>
          {/* User option */}

          <React.Fragment>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar className="w-5 h-5">M</Avatar>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={menuSlotProps}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleOpenCreateRestaurantModal}>
                <ListItemIcon>
                  <Home className="h-6 w-6" />
                </ListItemIcon>
                {language === "en"
                  ? translations.en.add_new_restaurant
                  : translations.vi.add_new_restaurant}
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <User2 className="h-6 w-6" />
                </ListItemIcon>
                {language === "en"
                  ? translations.en.profile
                  : translations.vi.profile}
              </MenuItem>

              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings className="h-6 w-6" />
                </ListItemIcon>
                {language === "en"
                  ? translations.en.setting
                  : translations.vi.setting}
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogOut className="h-6 w-6" />
                </ListItemIcon>
                {language === "en"
                  ? translations.en.logout
                  : translations.vi.logout}
              </MenuItem>
            </Menu>
          </React.Fragment>
        </div>

        <div className="h-full w-[25%] flex items-center">
          {/* Language */}
          <Select
            value={language}
            onChange={handleChangeLanguage}
            className="h-9 w-[80%]"
          >
            <MenuItem value="vi" className="flex">
              <div className="h-full w-full flex gap-2 items-center">
                <Image src={"./vi.svg"} alt="vi" width={15} height={15} />
                <span className="text-base font-semibold">vi</span>
              </div>
            </MenuItem>
            <MenuItem value="en">
              <div className="h-full w-full flex gap-2 items-center">
                <Image src={"./en.svg"} alt="vi" width={15} height={15} />
                <span className="text-base font-semibold">en</span>
              </div>
            </MenuItem>
          </Select>
        </div>
      </div>
      <CreateRestaurant
        language={language}
        isOpen={openModalCreateRestaurant}
        handleClose={handleCloseCreateRestaurantModal}
      />
    </div>
  );
};

export default Navbar;
