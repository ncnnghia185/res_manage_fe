"use client";
import { translations } from "@/constants/language/translation";
import { menuServices } from "@/services";
import {
  CategoryData,
  GeneralItemInfo,
  GetMenuItemDetailResponse,
  IngredientsInfo,
} from "@/services/apiResponse";
import {
  Box,
  Drawer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { PackageOpen, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useAppSelector } from "@/redux/store";

type Props = {
  language: string;
  accessToken: string;
  owner_id: number;
  restaurant_id: number;
  menu_item_id: string;
  isOpen: boolean;
  toggleClose: () => void;
};

const DetailDrawer = ({
  language,
  accessToken,
  owner_id,
  restaurant_id,
  menu_item_id,
  isOpen,
  toggleClose,
}: Props) => {
  const all_categories = useAppSelector(
    (state) => state.category.all_categories
  );
  const [generalMenuItemInfo, setGeneralMenuItemInfo] =
    useState<GeneralItemInfo>();
  const [ingredientsMenuItem, setIngredientMenuItem] =
    useState<IngredientsInfo[]>();

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response: GetMenuItemDetailResponse =
          await menuServices.getMenuDetail(
            menu_item_id,
            owner_id,
            restaurant_id,
            accessToken
          );
        if (response.success === true) {
          setGeneralMenuItemInfo(response.data.generalInfo);
          setIngredientMenuItem(response.data.ingredients);
        }
      } catch (error) {
        toast.error(
          language === "en"
            ? translations.en.error_fetch_menu_item
            : translations.vi.error_fetch_menu_item
        );
      }
    };
    if (isOpen === true) {
      fetchMenuItem();
    }
  }, [isOpen]);

  const category_name =
    all_categories &&
    all_categories.find((item) => item.id === generalMenuItemInfo?.category_id)
      ?.name;

  const ingredientCondition =
    Array.isArray(ingredientsMenuItem) &&
    ingredientsMenuItem.length === 1 &&
    ingredientsMenuItem[0].ingredient_name === null &&
    ingredientsMenuItem[0].quantity === 0 &&
    ingredientsMenuItem[0].ingredient_unit === null &&
    ingredientsMenuItem[0].cost_per_unit === 0;

  return (
    <Drawer
      open={isOpen}
      onClose={toggleClose}
      PaperProps={{
        sx: {
          width: { sm: "70%", md: "40%" },
          height: "100%",
          backgroundColor: "#ecf0f1",
          paddingX: "10px",
          paddingY: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
        },
      }}
      anchor="right"
      disableEnforceFocus
      disableAutoFocus
    >
      {/* header */}
      <div className="w-full h-[8%] flex items-center justify-center">
        <div className="w-full h-[80%] bg-[#bdc3c7] flex items-center justify-start gap-5 border-b-[1px] border-slate-400 pl-5">
          <X
            size={26}
            className="text-[#ef4444] font-semibold hover:text-[#dc2626] cursor-pointer"
            onClick={toggleClose}
          />
          <span className="font-semibold text-[#121212] text-lg">
            {language === "en"
              ? translations.en.menu_item_detail_title
              : translations.vi.menu_item_detail_title}
          </span>
        </div>
      </div>

      {/* general info */}
      <div className="w-full h-[46%] flex flex-col items-center justify-center gap-1">
        <div className="w-full h-[80%] flex items-center justify-start gap-2">
          <div className="h-full w-[45%] md:w-[40%] flex items-center justify-center border-[1px] border-gray-300 rounded-md">
            <PhotoProvider>
              <PhotoView src={generalMenuItemInfo?.image}>
                <img
                  src={generalMenuItemInfo?.image}
                  alt="item image"
                  className="h-[70%] md:h-[90%] w-[90%] object-cover cursor-pointer"
                />
              </PhotoView>
            </PhotoProvider>
          </div>
          <div className="h-full w-[55%] md:w-[60%] flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center gap-2 pl-2">
              <div className="w-full h-[30%] ">
                <span className="text-base font-semibold text-[#121212]">
                  {language === "en"
                    ? translations.en.menu_item_code
                    : translations.vi.menu_item_code}
                </span>
              </div>
              <div className="w-full h-[70%] ">
                <span className="text-base font-semibold text-[#121212]">
                  {generalMenuItemInfo?.id}
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-2 pl-2">
              <div className="w-full h-[30%] ">
                <span className="text-base font-semibold text-[#121212]">
                  {language === "en"
                    ? translations.en.menu_item_category
                    : translations.vi.menu_item_category}
                </span>
              </div>
              <div className="w-full h-[70%] ">
                <span className="text-base font-semibold text-[#121212]">
                  {category_name}
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-2 pl-2">
              <div className="w-full h-[30%] ">
                <span className="text-base font-semibold text-[#121212]">
                  {language === "en"
                    ? translations.en.menu_item_price
                    : translations.vi.menu_item_price}
                </span>
              </div>
              <div className="w-full h-[70%] ">
                <span className="text-base font-semibold text-[#121212]">
                  {generalMenuItemInfo?.price}
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-2 pl-2">
              <div className="w-full h-[30%] ">
                <span className="text-base font-semibold text-[#121212]">
                  {language === "en"
                    ? translations.en.original_menu_item_price
                    : translations.vi.original_menu_item_price}
                </span>
              </div>
              <div className="w-full h-[70%] ">
                {generalMenuItemInfo?.original_cost === "0" ? (
                  <span className="italic text-base text-[#7f8c8d]">
                    {language === "en"
                      ? translations.en.no_data_here
                      : translations.vi.no_data_here}
                  </span>
                ) : (
                  <span className="text-base font-semibold text-[#121212]">
                    {generalMenuItemInfo?.original_cost}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[20%] flex flex-col items-start">
          <span className="text-[#121212] font-semibold text-lg pl-5">
            {language === "en"
              ? translations.en.menu_item_description
              : translations.vi.menu_item_description}
          </span>
          <span className="text-[#121212] text-base pl-5">
            {generalMenuItemInfo?.description === null ? (
              <span className="italic text-base text-[#7f8c8d]">
                {language === "en"
                  ? translations.en.no_data_here
                  : translations.vi.no_data_here}
              </span>
            ) : (
              <span className="text-base font-semibold text-[#121212]">
                {generalMenuItemInfo?.description}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* table ingredient */}
      <div className="w-full h-[56%] flex flex-col gap-1 ">
        <div className="w-full h-[8%] flex items-center justify-start pl-5">
          <span className="text-lg font-semibold text-[#121212]">
            {language === "en"
              ? translations.en.ingredient_menu_item
              : translations.vi.ingredient_menu_item}
          </span>
        </div>
        <div className="w-full h-[92%] flex items-center justify-start md:px-4 ">
          {ingredientCondition ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-5 bg-blue-200">
              <PackageOpen size={46} className="text-[#121212]" />
              <span className="italic text-base text-slate-500">
                {language === "en"
                  ? translations.en.no_data_here
                  : translations.vi.no_data_here}
              </span>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-start justify-start">
              <TableContainer component={Paper}>
                <Table
                  sx={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <TableHead
                    sx={{
                      backgroundColor: "#bdc3c7",
                    }}
                  >
                    <TableRow>
                      <TableCell align="right">
                        {language === "en"
                          ? translations.en.ingredient_menu_item_name
                          : translations.vi.ingredient_menu_item_name}
                      </TableCell>
                      <TableCell align="right">
                        {language === "en"
                          ? translations.en.ingredient_menu_item_quantity
                          : translations.vi.ingredient_menu_item_quantity}
                      </TableCell>
                      <TableCell align="right">
                        {language === "en"
                          ? translations.en.ingredient_menu_item_unit
                          : translations.vi.ingredient_menu_item_unit}
                      </TableCell>
                      <TableCell align="right">
                        {language === "en"
                          ? translations.en.ingredient_menu_item_cost_per_unit
                          : translations.vi.ingredient_menu_item_cost_per_unit}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ingredientsMenuItem?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          {item.ingredient_name}
                        </TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="center">
                          {item.ingredient_unit}
                        </TableCell>
                        <TableCell align="center">
                          {item.cost_per_unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default DetailDrawer;
