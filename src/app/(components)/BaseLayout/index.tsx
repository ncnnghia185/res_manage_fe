"use client";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store, useAppSelector } from "@/redux/store";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
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
      } flex h-full w-full bg-gray-100 px-4 gap-3
      `}
    >
      <div
        className={`${
          isSidebarCollapsed ? "w-[6%] " : "w-[15%]"
        } h-full duration-[70] ease-in-out border-r-2 rounded-md shadow-md z-40 hidden md:flex`}
      >
        <Sidebar />
      </div>

      <div
        className={`${
          isSidebarCollapsed ? "w-[94%]" : "w-[85%]"
        } h-full bg-gray-200 flex flex-col gap-2`}
      >
        <div className="h-[10%] w-full border-b-2 border-slate-300">
          <Navbar />
        </div>
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;
