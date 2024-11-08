"use client";
import React, { useState } from "react";
import IconBreadcrumbs from "@/app/(components)/Breadcrumb";
import {
  Layout,
  Clipboard,
  Menu,
  PlusCircleIcon,
  FilterIcon,
  Filter,
  ArrowUp10,
  ArrowDown10,
  ArrowUpAZ,
  ArrowDownZA,
} from "lucide-react";
import BaseLayout from "@/app/(components)/BaseLayout";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { translations } from "@/constants/language/translation";
import CreateCategory from "./category/createCategory";
import {
  Button,
  Pagination,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import ListCategory from "./category/listCategory";
import CardItem from "@/app/(components)/CardItem";

type Props = {};

const MenuPage = (props: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const language = useAppSelector((state) => state.global.language);
  // menu item state
  const [openCreateMenuModal, setOpenCreateMenuModal] = useState(false);
  const [openUpdateMenuModal, setOpenUpdateMenuModal] = useState(false);
  const [openDeleteMenuModal, setOpenDeleteMenuModal] = useState(false);
  const [openDetailMenuDrawer, setOpenDetailMenuDrawer] = useState(false);
  const [sortOption, setSortOption] = useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value);
  };
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
      label: language === "en" ? translations.en.menu : translations.vi.menu,
      href: "/menu",
      icon: Clipboard,
    },
  ];
  return (
    <BaseLayout>
      <div className="h-full w-full px-6 py-2 gap-6 flex flex-col">
        {/* breadcrumb */}
        <div className="h-[6%] w-full flex items-center px-3 z-10">
          <IconBreadcrumbs items={breadcrumbItems} darkTheme={isDarkMode} />
        </div>

        {/* main content */}
        <div className="h-[94%] w-full flex gap-2 sm:justify-center">
          {/* category select */}
          <div className="block md:hidden">
            <Menu size={24} className="text-slate-700 cursor-pointer" />
          </div>

          {/* category manage */}
          <div className="hidden md:flex flex-col h-full w-[18%] gap-2 border-r-[1px] border-slate-300">
            <div className="h-[8%] w-full flex flex-col items-start justify-center pl-4 gap-2">
              <span className="text-lg font-bold uppercase text-slate-700">
                {language === "en"
                  ? translations.en.category_menu
                  : translations.vi.category_menu}
              </span>
              <div className="h-[1px] border-b-2 border-slate-300 w-3/4 shadow-sm" />
            </div>
            {/* list category */}
            <div className="w-full h-auto">
              <ListCategory language={language} />
            </div>
            {/* create category */}
            <div className="h-[8%] w-full flex items-center justify-center">
              <CreateCategory language={language} />
            </div>
          </div>

          {/* menu manage */}
          <div className="w-[100%] h-full md:w-[80%] flex flex-col gap-1">
            <div className="h-[6%] w-full flex pr-6 items-center justify-between pl-3">
              <span className="text-lg font-bold uppercase text-slate-700">
                {language === "en"
                  ? translations.en.menu_manage
                  : translations.vi.menu_manage}
              </span>

              {/* create */}
              <div className="h-full w-[40%] flex items-center justify-center md:gap-5">
                <div className="h-full w-[70%] md:w-[60%]  flex items-center justify-end md:justify-start md:pl-2">
                  {/* icons with small screen */}
                  <div className="block md:hidden items-center justify-center">
                    <PlusCircleIcon
                      className=" cursor-pointer text-slate-900"
                      size={26}
                    />
                  </div>
                  {/* normal screen */}
                  <div className="hidden md:flex w-full items-center justify-end md:justify-start xl:justify-end">
                    <Button
                      variant="outlined"
                      endIcon={<PlusCircleIcon size={22} />}
                      className="w-full md:w-auto xl:w-[70%] text-slate-700 hover:border-slate-600"
                    >
                      <span className="text-sm md:text-base font-medium capitalize text-slate-700">
                        {language === "en"
                          ? translations.en.add_new
                          : translations.vi.add_new}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* filter */}
                <div className="h-full w-[50%] flex items-center justify-center md:justify-start md:pl-2">
                  {/* icons with small screen */}
                  <div className="block md:hidden items-center justify-center">
                    <FilterIcon className=" cursor-pointer" size={26} />
                  </div>
                  <div className="hidden md:flex w-full items-center justify-center">
                    <FormControl
                      variant="outlined"
                      size="small"
                      sx={{
                        width: 160,
                        height: 32,
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <InputLabel>Bộ lọc</InputLabel>
                      <Select
                        value={sortOption}
                        onChange={handleChange}
                        label="Bộ lọc"
                        IconComponent={Filter}
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          "& .MuiSelect-icon": {
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: "12px",
                          },
                        }}
                      >
                        <MenuItem value="lowToHigh">
                          <div className="flex items-center gap-1">
                            <ArrowUp10 size={18} />
                            <span>
                              {language === "en"
                                ? translations.en.price_asc
                                : translations.vi.price_asc}
                            </span>
                          </div>
                        </MenuItem>
                        <MenuItem
                          value="highToLow"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <ArrowDown10 size={18} />
                            <span>
                              {language === "en"
                                ? translations.en.price_desc
                                : translations.vi.price_desc}
                            </span>
                          </div>
                        </MenuItem>
                        <MenuItem
                          value="aToZ"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <ArrowUpAZ size={18} />
                            <span>
                              {language === "en"
                                ? translations.en.name_asc
                                : translations.vi.name_asc}
                            </span>
                          </div>
                        </MenuItem>
                        <MenuItem
                          value="zToA"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <ArrowDownZA size={18} />
                            <span>
                              {language === "en"
                                ? translations.en.name_desc
                                : translations.vi.name_desc}
                            </span>
                          </div>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>

            {/* menu items */}
            <div className="w-full h-[84%] bg-slate-300 grid gap-3 grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2 px-4">
              <div className="bg-white p-4">Product 1</div>
              <div className="bg-white p-4">Product 2</div>
              <div className="bg-white p-4">Product 3</div>
              <div className="bg-white p-4">Product 4</div>
              <div className="bg-white p-4">Product 5</div>
              <div className="bg-white p-4">Product 6</div>
            </div>
            {/* pagination */}
            <div className="h-[8%] w-full px-3 flex items-center justify-between">
              <span className="text-base font-semibold text-slate-700"></span>

              <Pagination
                count={10}
                variant="outlined"
                shape="rounded"
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default MenuPage;
