"use client";
import BaseLayout from "@/app/(components)/BaseLayout";
import IconBreadcrumbs from "@/app/(components)/Breadcrumb";
import { translations } from "@/constants/language/translation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import React from "react";
import { Layout, ConciergeBell, Logs } from "lucide-react";
import { Select } from "@mui/material";
type Props = {};

const ManageOrderPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.global.language);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const breadcrumbItems = [
    {
      label:
        language === "en"
          ? translations.en.dashboard
          : translations.vi.dashboard,
      href: "/dashboard",
      icon: Layout,
    },
    {
      label:
        language === "en"
          ? translations.en.orders_manage
          : translations.vi.orders_manage,
      href: "/manage-order",
      icon: Logs,
    },
  ];
  return (
    <BaseLayout>
      <div className="h-[88%] w-full px-3 md:px-5 py-2 gap-2 flex flex-col">
        {/* Breadcrumb */}
        <div className="h-[3%] md:h-[6%] w-full flex items-center px-3 z-10">
          <IconBreadcrumbs items={breadcrumbItems} darkTheme={isDarkMode} />
        </div>

        <div className="flex md:hidden w-full h-[3%] items-center justify-start px-3">
          <span className="text-lg font-bold uppercase text-slate-700">
            {language === "en"
              ? translations.en.orders_manage
              : translations.vi.orders_manage}
          </span>
        </div>

        {/* main content */}
        <div className="h-[94%] w-full flex flex-col md:flex-row bg-blue-200">
          <div className="h-[10%] w-full flex md:hidden bg-blue-600">
            <Select></Select>
          </div>
          <div className="hidden md:flex h-full w-[20%] bg-blue-600"></div>
          <div className="h-[90%] md:h-full w-full md:w-[80%] flex bg-blue-900"></div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ManageOrderPage;
