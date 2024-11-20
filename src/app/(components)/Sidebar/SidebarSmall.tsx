import React, { useState } from "react";
import { Clipboard, Layout, TableCellsSplit, Tally2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "@mui/material";

import { setIsSidebarSmallCollapsed } from "@/redux/globalState/globalSlice";
import { useAppDispatch } from "@/redux/store";
import { translations } from "@/constants/language/translation";
type Props = {
  sidebarSmallCollapse: boolean;
  language: string;
};
const SidebarSmall = ({ sidebarSmallCollapse, language }: Props) => {
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const toggleSmallSidebar = () => {
    dispatch(setIsSidebarSmallCollapsed(!sidebarSmallCollapse));
  };
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (pathname === "/dashboard" && href === "/dashboard");
  return (
    <div className="w-full h-full py-5 relative flex flex-col px-3 bg-gray-100 gap-3">
      <div className="w-full h-[8%] flex items-center justify-center gap-3  border-b-[1px] border-gray-400 shadow-sm">
        <Image src="/logo.svg" alt="logo" width={26} height={26} />
        <span className="text-base font-bold text-slate-900 uppercase">
          {language === "en" ? translations.en.manage : translations.vi.manage}
        </span>
      </div>

      <div className="w-full h-[86%] flex flex-col items-center justify-start gap-2">
        <Link
          href="/dashboard"
          className={`w-[80%] h-10 flex items-center justify-center gap-5 border-1 border-blue-300 rounded-md ${
            isActive("/dashboard") ? "bg-blue-300 text-white" : ""
          }`}
        >
          <Layout />
          <span className="text-base font-semibold">
            {language === "en"
              ? translations.en.dashboard
              : translations.vi.dashboard}
          </span>
        </Link>

        {/* menu item */}
        <Link
          href="/menu"
          className={`w-[80%] h-10 flex items-center justify-center gap-5 border-[1px] border-blue-300 rounded-md ${
            isActive("/menu") ? "bg-blue-300 text-white" : ""
          }`}
        >
          <Clipboard />
          <span className="text-base font-semibold">
            {language === "en" ? translations.en.menu : translations.vi.menu}
          </span>
        </Link>

        {/* table */}
        <Link
          href="/table"
          className={`w-[80%] h-10 flex items-center justify-center gap-5 border-[1px] border-blue-300 rounded-md ${
            isActive("/table") ? "bg-blue-300 text-white" : ""
          }`}
        >
          <TableCellsSplit />
          <span className="text-base font-semibold">
            {language === "en" ? translations.en.table : translations.vi.table}
          </span>
        </Link>
      </div>
      <div className="w-full h-[6%] flex items-center justify-center border-t-[1px] border-gray-400">
        <span className="text-sm text-slate-900 font-semibold">
          &copy; Copyright by TOOF
        </span>
      </div>
      {/* icon */}
      <Tooltip
        title={
          language === "en"
            ? translations.en.hide_small_sidebar
            : translations.vi.hide_small_sidebar
        }
      >
        <Tally2
          className="absolute top-1/2 -right-5 transform -translate-y-1/2 transition-all duration-200 text-slate-800 cursor-pointer"
          size={28}
          onClick={toggleSmallSidebar}
        />
      </Tooltip>
    </div>
  );
};

export default SidebarSmall;
