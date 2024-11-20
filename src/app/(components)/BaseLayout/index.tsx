"use client";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import SidebarSmall from "../Sidebar/SidebarSmall";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const sidebarSmallCollapsed = useAppSelector(
    (state) => state.global.sidebarSmallCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const language = useAppSelector((state) => state.global.language);
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("light");
    }
  });

  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex h-full w-full bg-gray-100 md:px-4 gap-3 relative md:relative:hidden
      `}
    >
      <div
        className={`${
          sidebarSmallCollapsed ? "hidden" : "flex "
        } w-[40%] h-full z-40 md:hidden absolute top-0 left-0 border-r-2 rounded-md shadow-md`}
      >
        <SidebarSmall
          sidebarSmallCollapse={sidebarSmallCollapsed}
          language={language}
        />
      </div>
      <div
        className={`${
          isSidebarCollapsed ? "w-[6%] " : "w-[18%]"
        } h-full duration-[70] ease-in-out border-r-2 rounded-md shadow-md z-40 hidden md:flex`}
      >
        <Sidebar />
      </div>

      <div
        className={`w-full md:${
          isSidebarCollapsed ? "w-[94%]" : "w-[82%]"
        } h-full bg-gray-200 flex flex-col gap-2`}
      >
        <div className="h-[10%] w-full border-b-2 border-slate-300 bg-gray-300 shadow-md shadow-gray-200">
          <Navbar />
        </div>
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;
