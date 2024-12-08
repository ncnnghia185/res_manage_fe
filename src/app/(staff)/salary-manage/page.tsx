"use client";
import BaseLayout from "@/app/(components)/BaseLayout";
import IconBreadcrumbs from "@/app/(components)/Breadcrumb";
import { translations } from "@/constants/language/translation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Layout, SlidersHorizontal } from "lucide-react";
import React, { useMemo } from "react";

const SalaryManagePage = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.global.language);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const accessToken = useAppSelector((state) => state.auth.user);
  const owner_id = useAppSelector((state) => state.auth.userId);
  const restaurant_id = useAppSelector(
    (state) => state.restaurant.selected_restaurant.id
  );
  const all_staffs = useAppSelector((state) => state.staffInfo.all_staffs);
  const breadcrumbItems = useMemo(
    () => [
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
            ? translations.en.staff_sub_side_link2
            : translations.vi.staff_sub_side_link2,
        href: "/add-order",
        icon: SlidersHorizontal,
      },
    ],
    [language]
  );
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
              ? translations.en.staff_sub_side_link2
              : translations.vi.staff_sub_side_link2}
          </span>
        </div>

        <div className="h-[94%] w-full flex flex-col gap-2 sm:justify-center ">
          <div className="w-full h-[10%]  flex items-center bg-blue-500">
            <span className="hidden md:flex text-lg font-bold uppercase text-slate-700 ">
              {language === "en"
                ? translations.en.staff_sub_side_link2
                : translations.vi.staff_sub_side_link2}
            </span>
            <span className="flex md:hidden text-lg font-semibold text-slate-900 uppercase text-start w-[50%]">
              {language === "en"
                ? translations.en.total_staff
                : translations.vi.total_staff}{" "}
              {all_staffs.length}
            </span>
          </div>
          <div className="w-full h-[90%] flex items-center bg-blue-500"></div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default SalaryManagePage;
