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
  UsersRound,
  ConciergeBell,
  Logs,
  Banknote,
  DollarSign,
  AlignVerticalSpaceAround,
  ShoppingCart,
  BaggageClaim,
  ContactRound,
  ChartColumnIncreasing,
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
      <div className="h-[80%] overflow-y-auto w-full flex flex-col items-start justify-start gap-2 scroll-container ">
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
          icon={ConciergeBell}
          label={
            language === "en"
              ? translations.en.order_parent_label
              : translations.vi.order_parent_label
          }
          isCollapsed={isSidebarCollapsed}
          subMenu={[
            {
              href: "/add-order",
              label:
                language === "en"
                  ? translations.en.add_order_label
                  : translations.vi.add_order_label,
              icon: ConciergeBell,
            },
            {
              href: "/manage-order",
              label:
                language === "en"
                  ? translations.en.orders_manage
                  : translations.vi.orders_manage,
              icon: Logs,
            },
          ]}
        />
        <SidebarLink
          href="/payment"
          icon={Banknote}
          label={
            language === "en"
              ? translations.en.payment
              : translations.vi.payment
          }
          isCollapsed={isSidebarCollapsed}
        />

        <SidebarLink
          icon={AlignVerticalSpaceAround}
          label={
            language === "en"
              ? translations.en.ingredient
              : translations.vi.ingredient
          }
          isCollapsed={isSidebarCollapsed}
          subMenu={[
            {
              href: "/buy-ingredients",
              label:
                language === "en"
                  ? translations.en.ingredient_sub_side_link1
                  : translations.vi.ingredient_sub_side_link1,
              icon: ShoppingCart,
            },
            {
              href: "/inventory-ingredients",
              label:
                language === "en"
                  ? translations.en.ingredient_sub_side_link2
                  : translations.vi.ingredient_sub_side_link2,
              icon: BaggageClaim,
            },
          ]}
        />
        <SidebarLink
          icon={CircleDollarSign}
          label={
            language === "en"
              ? translations.en.expenses
              : translations.vi.expenses
          }
          isCollapsed={isSidebarCollapsed}
          subMenu={[
            {
              href: "/fixed-expenses",
              label:
                language === "en"
                  ? translations.en.expenses_sub_side_link1
                  : translations.vi.expenses_sub_side_link1,
              icon: DollarSign,
            },
            {
              href: "/incurred-expenses",
              label:
                language === "en"
                  ? translations.en.expenses_sub_side_link2
                  : translations.vi.expenses_sub_side_link2,
              icon: DollarSign,
            },
          ]}
        />
        <SidebarLink
          icon={UsersRound}
          label={
            language === "en" ? translations.en.staff : translations.vi.staff
          }
          isCollapsed={isSidebarCollapsed}
          subMenu={[
            {
              href: "/staff-manage",
              label:
                language === "en"
                  ? translations.en.staff_sub_side_link1
                  : translations.vi.staff_sub_side_link1,
              icon: ContactRound,
            },
            {
              href: "/salary-manage",
              label:
                language === "en"
                  ? translations.en.staff_sub_side_link2
                  : translations.vi.staff_sub_side_link2,
              icon: SlidersHorizontal,
            },
          ]}
        />
        <SidebarLink
          icon={ChartColumnIncreasing}
          label={
            language === "en"
              ? translations.en.statistic
              : translations.vi.statistic
          }
          isCollapsed={isSidebarCollapsed}
          subMenu={[
            {
              href: "/staff-manage",
              label:
                language === "en"
                  ? translations.en.staff_sub_side_link1
                  : translations.vi.staff_sub_side_link1,
              icon: ContactRound,
            },
            {
              href: "/salary-manage",
              label:
                language === "en"
                  ? translations.en.staff_sub_side_link2
                  : translations.vi.staff_sub_side_link2,
              icon: SlidersHorizontal,
            },
          ]}
        />
      </div>

      <div className="h-[10%] flex items-center justify-center w-full gap-2">
        <span className="text-sm font-bold text-slate-800 select-none">
          &copy;
        </span>

        <span className="text-sm font-bold text-slate-800 select-none">
          NCN-TOOF
        </span>
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
