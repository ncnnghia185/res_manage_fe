"use client";
import React, { useEffect, useState } from "react";
import IconBreadcrumbs from "@/app/(components)/Breadcrumb";
import {
  Layout,
  Clipboard,
  Menu,
  PlusCircleIcon,
  FilterIcon,
  ArrowUp10,
  ArrowDown10,
  ArrowUpAZ,
  ArrowDownZA,
  PackageOpen,
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
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { CiFilter } from "react-icons/ci";
import ListCategory from "./category/listCategory";
import CardItem from "@/app/(components)/MenuItem";
import CreateModal from "./components/CreateModal";
import { fetchAllMenuItems } from "@/redux/menuState/menuSlice";
import ItemMenu from "@/app/(components)/MenuItem";
import { MdClear } from "react-icons/md";
import { MenuItemData } from "@/services/apiResponse";
import { sortMenuItems } from "@/utils/utils";

type Props = {};

const MenuPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const language = useAppSelector((state) => state.global.language);
  const owner_id = useAppSelector((state) => state.auth.userId);
  const restaurant_id = useAppSelector(
    (state) => state.restaurant.selected_restaurant.id
  );
  const all_categories = useAppSelector(
    (state) => state.category.all_categories
  );
  const all_menu_items = useAppSelector(
    (state) => state.menu_item.all_menu_items
  );
  const accessToken = useAppSelector((state) => state.auth.user);
  const selectedCategory = useAppSelector(
    (state) => state.category.selected_category
  );

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        dispatch(fetchAllMenuItems({ accessToken, owner_id, restaurant_id }));
      } catch (error) {
        toast.error(
          language === "en"
            ? translations.en.error_fecth_all_items
            : translations.vi.error_fecth_all_items
        );
      }
    };
    fetchMenuItems();
  }, []);
  // menu item state
  const [openCreateMenuModal, setOpenCreateMenuModal] =
    useState<boolean>(false);
  const [openDetailMenuDrawer, setOpenDetailMenuDrawer] = useState(false);
  const [sortOption, setSortOption] = useState<string>("");
  const [filterMenuItems, setFilterMenuItems] =
    useState<MenuItemData[]>(all_menu_items);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  // bread crumb
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
  // handle change sort
  const handleChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value);
  };
  // handle clear sort
  const handleClearSort = () => {
    setSortOption("");
  };
  // handle open create menu
  const handleOpenCreateMenuModal = () => {
    setOpenCreateMenuModal(true);
  };
  const handleCloseCreateMenuModal = () => {
    setOpenCreateMenuModal(false);
  };
  // filter and sort all items
  const filterAndSortItems = (
    all_items: MenuItemData[],
    selectedCategories: number[],
    selectedSort: string
  ) => {
    let filterItems = all_items;

    if (selectedCategories.length > 0) {
      filterItems = filterItems.filter((product) =>
        selectedCategories.includes(product.category_id)
      );
    }

    if (selectedSort) {
      const reverse =
        selectedSort === "price-desc" || selectedSort === "name-desc";
      const primer = selectedSort.includes("name")
        ? (value: string | number) =>
            typeof value === "string" ? value.toLowerCase() : value
        : undefined;
      const field = selectedSort.includes("price") ? "price" : "name";
      return [...filterItems].sort(sortMenuItems(field, reverse, primer));
    }
    return filterItems;
  };

  useEffect(() => {
    const filteredItems = filterAndSortItems(
      all_menu_items,
      selectedCategory,
      sortOption
    );
    setFilterMenuItems(filteredItems);
  }, [all_menu_items, selectedCategory, sortOption]);

  // paginations
  const totalPages = Math.ceil(filterMenuItems.length / itemsPerPage);
  const currentItems = filterMenuItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // handle change page
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };
  return (
    <BaseLayout>
      <div className="h-[88%] md:h-[90%]  w-full px-3 md:px-6 py-2 gap-2 md:gap-6 flex flex-col">
        {/* breadcrumb */}
        <div className="h-[3%] md:h-[6%] w-full flex items-center px-3 z-10">
          <IconBreadcrumbs items={breadcrumbItems} darkTheme={isDarkMode} />
        </div>
        <div className="flex md:hidden w-full h-[3%] items-center justify-start px-3">
          <span className="text-lg font-bold uppercase text-slate-700">
            {language === "en"
              ? translations.en.menu_manage
              : translations.vi.menu_manage}
          </span>
        </div>
        {/* main content */}
        <div className="h-[94%] w-full flex gap-2 sm:justify-center">
          {/* category manage */}
          <div className="flex flex-col h-full w-[30%] md:w-[18%] gap-2 border-r-[1px] border-slate-300">
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
              <ListCategory
                language={language}
                owner_id={owner_id}
                restaurant_id={restaurant_id}
                accessToken={accessToken}
              />
            </div>
            {/* create category */}
            <div className="h-[8%] w-full flex items-center justify-center">
              <CreateCategory
                language={language}
                accessToken={accessToken}
                owner_id={owner_id}
                restaurant_id={restaurant_id}
              />
            </div>
          </div>

          {/* menu manage */}
          <div className="w-[70%] h-full md:w-[80%] flex flex-col gap-1">
            <div className="h-[6%] w-full flex pr-2 md:pr-6 items-center justify-end md:justify-between pl-3">
              <span className="hidden md:flex text-lg font-bold uppercase text-slate-700">
                {language === "en"
                  ? translations.en.menu_manage
                  : translations.vi.menu_manage}
              </span>

              <div className="h-full w-full md:w-[40%] flex items-center justify-center md:gap-5">
                {/* create */}
                <div className="h-full w-[50%] md:w-[60%] flex items-center justify-end md:justify-start md:pl-2">
                  <div className="flex w-full items-center justify-end md:justify-start xl:justify-end">
                    <Button
                      variant="outlined"
                      endIcon={
                        <PlusCircleIcon
                          size={22}
                          color={isDarkMode ? "#ecf0f1" : "#121212"}
                        />
                      }
                      sx={{
                        backgroundColor: isDarkMode ? "none" : "#ecf0f1",
                        width: { sm: "70%", md: "80%" },
                        borderWidth: "1.5px",
                        borderColor: "#636e72",
                        ":hover": {
                          backgroundColor: "#dfe6e9",
                        },
                      }}
                      onClick={handleOpenCreateMenuModal}
                    >
                      <span className="text-sm md:text-base font-semibold md:font-medium capitalize text-slate-900">
                        {language === "en"
                          ? translations.en.add_new
                          : translations.vi.add_new}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* filter */}
                <div className="h-full w-[50%] flex items-center justify-end md:justify-start md:pl-2">
                  <div className="flex w-full items-center justify-center">
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
                      <InputLabel>
                        {language === "en"
                          ? translations.en.filter
                          : translations.vi.filter}
                      </InputLabel>
                      <Select
                        value={sortOption}
                        onChange={handleChange}
                        label="Bộ lọc"
                        IconComponent={
                          sortOption === "" ? CiFilter : () => <div />
                        }
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          borderColor: "#9ca3af",
                          "& .MuiSelect-icon": {
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: "22px",
                          },
                        }}
                      >
                        <MenuItem value="price-asc">
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
                          value="price-desc"
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
                          value="name-asc"
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
                          value="name-desc"
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
                      {sortOption && (
                        <IconButton
                          onClick={handleClearSort}
                          sx={{
                            position: "absolute",
                            right: 5,
                            top: "50%",
                            transform: "translateY(-50%)",
                            ":hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          {/* Icon xóa */}
                          <MdClear
                            style={{
                              fontSize: "15px",
                            }}
                          />
                        </IconButton>
                      )}
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>

            {/* menu items */}
            {currentItems.length === 0 ? (
              <div className="w-full h-[86%] flex flex-col items-center justify-center border-2 rounded-lg border-gray-300">
                <PackageOpen size={46} className="text-slate-900" />
                <span className="text-slate-900 font-semibold text-lg">
                  {language === "en"
                    ? translations.en.no_data_here
                    : translations.vi.no_data_here}
                </span>
              </div>
            ) : (
              <div className="w-full h-[86%] md:h-[85%] grid items-center justify-center gap-2 md:gap-5 grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2 pl-2 md:pl-5 md:py-2">
                {currentItems.map((item, index) => (
                  <ItemMenu
                    language={language}
                    accessToken={accessToken}
                    owner_id={owner_id}
                    restaurant_id={restaurant_id}
                    menu_item_id={item.id}
                    menu_item_name={item.name}
                    menu_item_image_url={item.image}
                    menu_item_price={item.price}
                    key={item.id}
                  />
                ))}
              </div>
            )}

            {/* pagination */}
            <div className="h-[6%] md:h-[8%] w-full px-3 flex items-center justify-between border-t-[1px] border-slate-200">
              <span className="text-base font-semibold text-slate-700">
                {language === "en"
                  ? translations.en.total_count_menu
                  : translations.vi.total_count_menu}
                {filterMenuItems.length}
              </span>

              {filterMenuItems.length > 0 ? (
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                  size="small"
                />
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
      <CreateModal
        isOpen={openCreateMenuModal}
        handleClose={handleCloseCreateMenuModal}
        language={language}
        accessToken={accessToken}
        owner_id={owner_id}
        restaurant_id={restaurant_id}
        all_categories={all_categories}
      />
    </BaseLayout>
  );
};

export default MenuPage;
