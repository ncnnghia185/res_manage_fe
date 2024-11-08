import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { setIsSidebarCollapsed } from "@/redux/globalState/globalSlice";
import {
  ChevronsLeft,
  ChevronsRight,
  CircleDollarSign,
  Clipboard,
  Layout,
  SlidersHorizontal,
  TableCellsSplit,
  Tally2,
  User,
} from "lucide-react";
import Image from "next/image";
import { translations } from "@/constants/language/translation";
import { SidebarLink } from "./sidebarLink";

const Sidebar = () => {
  const dispatch = useAppDispatch();

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const language = useAppSelector((state) => state.global.language);

  // state
  const [isHovered, setIsHovered] = useState(false);

  // handle toggle sidebar
  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  // handle hover event
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  return (
    <div
      className={`
         w-full h-full bg-gray-100 relative flex-col gap-2 hidden md:flex `}
    >
      {/* logo */}
      <div className="h-[10%] flex items-center justify-center w-full gap-3 border-b-2 z-40 shadow-sm">
        <Image src={"./logo.svg"} alt="logo" width={30} height={30} />
        <span
          className={`${
            isSidebarCollapsed ? "hidden" : ""
          } font-bold text-slate-700 text-lg uppercase`}
        >
          {language === "en" ? translations.en.manage : translations.vi.manage}
        </span>
      </div>

      {/* Sidebar link */}
      <div className="h-[80%] w-full flex flex-col items-start justify-start gap-2">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label={
            language === "en"
              ? translations.en.dashboard
              : translations.vi.dashboard
          }
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/menu"
          icon={Clipboard}
          label={
            language === "en" ? translations.en.menu : translations.vi.menu
          }
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/table"
          icon={TableCellsSplit}
          label={
            language === "en" ? translations.en.table : translations.vi.table
          }
          isCollapsed={isSidebarCollapsed}
        />

        <SidebarLink
          href="/users"
          icon={User}
          label="Users"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/expenses"
          icon={CircleDollarSign}
          label="Expenses"
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      <div className="h-[10%] flex items-center justify-center w-full gap-2">
        &copy;
        <span className="text-sm font-bold text-slate-800">NCN-TOOF</span>
      </div>

      {/* Icon */}
      <div
        className="cursor-pointer h-9 w-6 absolute top-1/2 -right-3"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={toggleSidebar}
      >
        {isSidebarCollapsed ? (
          <ChevronsRight
            className="absolute top-1/2 -right-1  transform -translate-y-1/2 transition-all duration-200 text-slate-800"
            size={28}
          />
        ) : isHovered ? (
          <ChevronsLeft
            className="absolute top-1/2 right-0.5 transform -translate-y-1/2 transition-all duration-200 text-slate-800"
            size={28}
          />
        ) : (
          <Tally2
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 transition-all duration-200 text-slate-800"
            size={28}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
