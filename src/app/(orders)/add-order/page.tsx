"use client";
import BaseLayout from "@/app/(components)/BaseLayout";
import IconBreadcrumbs from "@/app/(components)/Breadcrumb";
import { translations } from "@/constants/language/translation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Layout,
  ConciergeBell,
  TableCellsSplit,
  PackageOpen,
} from "lucide-react";
import { fetchAllLocations } from "@/redux/tableState/locationSlice";
import { toast } from "react-toastify";
import { getRestaurantInfo } from "@/services/restaurant/restaurantServices";
import {
  CategoryData,
  GetCurrentRestaurantResponse,
  GetOrderInfo,
  LocationData,
  MenuItemData,
  OrderInfoData,
} from "@/services/apiResponse";
import { fetchAllTables } from "@/redux/tableState/tableSlice";
import { useMediaQuery } from "react-responsive";
import { tableStatus } from "@/constants/tableStatus/tableStatus";
import { FormControlLabel, Pagination, Radio, RadioGroup } from "@mui/material";
import { SiAirtable } from "react-icons/si";
import CreateOrderForm from "./components/CreateOrderForm";
import { orderServices } from "@/services";
import CreateOrderDetail from "./components/CreateOrderDetail";
import { fetchAllCategories } from "@/redux/menuState/categorySlice";
import { fetchAllMenuItems } from "@/redux/menuState/menuSlice";
import { formatCurrency } from "@/utils/utils";

export interface selectedItemType {
  id: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
}
const AddOrderPage = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.global.language);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const accessToken = useAppSelector((state) => state.auth.user);
  const owner_id = useAppSelector((state) => state.auth.userId);
  const restaurant_id = useAppSelector(
    (state) => state.restaurant.selected_restaurant.id
  );
  const selectedRestaurantName = useAppSelector(
    (state) => state.restaurant.selected_restaurant.name
  );
  const allLocations = useAppSelector((state) => state.location.all_locations);

  const allTables = useAppSelector((state) => state.table.all_tables);
  const allCategories = useAppSelector(
    (state) => state.category.all_categories
  );
  const allMenuItems = useAppSelector(
    (state) => state.menu_item.all_menu_items
  );
  const isSmallScreen = useMediaQuery({ minWidth: 640, maxWidth: 768 });

  const [restaurantInfo, setRestaurantInfo] = useState({
    address: "",
    phone_number: "",
  });
  const [activeDiv, setActiveDiv] = useState<number>(1);
  const [selectedLocationId, setSelectedLocationId] = useState<number>(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentMenuPage, setCurrentMenuPage] = useState<number>(1);
  const [formVisibility, setFormVisibility] = useState<boolean>(false);
  const [servingOrderOfTable, setServingOrderOfTable] = useState<OrderInfoData>(
    {
      id: "",
      table_id: 0,
      order_time: "",
      total_amout: 0,
      order_status: "",
      notes: "",
      status_payment: "",
      customer_name: "",
      number_of_customer: "",
      total_amount: 0,
      payment_type: "",
    }
  );
  const [selectedTable, setSelectedTable] = useState({
    table_id: 0,
    table_name: "",
  });

  const [selectedMenuItems, setSelectedMenuItems] = useState<
    selectedItemType[]
  >([]);
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
            ? translations.en.add_order_label
            : translations.vi.add_order_label,
        href: "/add-order",
        icon: ConciergeBell,
      },
    ],
    [language]
  );
  const all: LocationData = useMemo(
    () => ({
      id: 0,
      name:
        language === "en"
          ? translations.en.label_all_location
          : translations.vi.label_all_location,
      active: true,
    }),
    [language]
  );

  const allCatagorylabel: CategoryData = useMemo(
    () => ({
      id: 0,
      name:
        language === "en"
          ? translations.en.label_all_categories
          : translations.vi.label_all_categories,
      active: true,
    }),
    [language]
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchAllLocations({ accessToken, owner_id, restaurant_id }));
      dispatch(fetchAllTables({ accessToken, owner_id, restaurant_id }));

      try {
        const response: GetCurrentRestaurantResponse = await getRestaurantInfo(
          restaurant_id,
          owner_id,
          accessToken
        );
        if (response.success) {
          setRestaurantInfo({
            address: response.data.address,
            phone_number: response.data.phone_number,
          });
        }
      } catch (error) {
        toast.error(
          language === "en"
            ? translations.en.error_fetch_restaurant_info
            : translations.vi.error_fetch_restaurant_info
        );
      }
    };

    if (activeDiv === 1) {
      fetchData();
    }
  }, [activeDiv, accessToken, owner_id, restaurant_id, language, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchAllCategories({ accessToken, owner_id, restaurant_id }));
      dispatch(fetchAllMenuItems({ accessToken, owner_id, restaurant_id }));
    };

    if (activeDiv === 2) {
      fetchData();
    }
  }, [activeDiv, accessToken, owner_id, restaurant_id, language, dispatch]);

  // handle change active div
  const handleDivChange = useCallback((index: number) => {
    setActiveDiv(index);
  }, []);

  // All locations with initial "All" location
  const allLocationsDisplay = useMemo(
    () => [all, ...allLocations],
    [all, allLocations]
  );

  // all categories
  const allCategoriesDisplay = useMemo(
    () => [allCatagorylabel, ...allCategories],
    [allCatagorylabel, allCategories]
  );

  // Filter tables wih locations and status
  const filterTables = useMemo(() => {
    return allTables.filter((table) => {
      const matchLocation =
        selectedLocationId === 0 || table.location_id === selectedLocationId;
      const matchStatus =
        selectedStatus === "all" || table.status === selectedStatus;
      return matchLocation && matchStatus;
    });
  }, [allTables, selectedLocationId, selectedStatus]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handlePageMenuChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentMenuPage(value);
  };
  const itemsPerPage = isSmallScreen ? 4 : 8;
  const menuItemsPerPage = isSmallScreen ? 6 : 10;
  const totalPages = Math.ceil(filterTables.length / itemsPerPage);
  const paginatedItems = filterTables.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  useEffect(() => {
    if (filterTables.length < itemsPerPage) {
      setCurrentPage(1);
    }
  }, [filterTables.length]);

  // handle table click
  const handleClickAvailableTable = (table_id: number, table_name: string) => {
    setFormVisibility(true);
    setSelectedTable({ table_id, table_name });
  };

  // handle serving table click
  const handleClickServingTable = async (
    table_id: number,
    owner_id: number,
    restaurant_id: number,
    accessToken: string
  ) => {
    try {
      const response: GetOrderInfo = await orderServices.getServingOrderOfTable(
        table_id,
        owner_id,
        restaurant_id,
        accessToken
      );
      setServingOrderOfTable(response.data);
      handleDivChange(2);
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_fetch_serving_order
          : translations.vi.error_fetch_serving_order
      );
    }
  };

  // filter menu items by category
  const filterMenuItem = useMemo(() => {
    return allMenuItems.filter((item) => {
      const matchCategory =
        selectedCategoryId === 0 || item.category_id === selectedCategoryId;
      return matchCategory;
    });
  }, [allMenuItems, selectedCategoryId]);
  const totalMenuItemPages = Math.ceil(filterMenuItem.length / itemsPerPage);
  const paginatedMenuItems = filterMenuItem.slice(
    (currentMenuPage - 1) * menuItemsPerPage,
    currentMenuPage * menuItemsPerPage
  );
  useEffect(() => {
    setCurrentMenuPage(1);
  }, [menuItemsPerPage]);

  useEffect(() => {
    if (filterMenuItem.length < menuItemsPerPage) {
      setCurrentMenuPage(1);
    }
  }, [filterMenuItem.length]);

  // handle select item to order
  const handleSelectMenuItem = (item: MenuItemData) => {
    setSelectedMenuItems((prevItems) => {
      const existed = prevItems.find((i) => i.id === item.id);
      if (existed) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  // handle remove item
  const handleRemoveItem = (itemId: string) => {
    setSelectedMenuItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };
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
              ? translations.en.add_order_label
              : translations.vi.add_order_label}
          </span>
        </div>

        {/* Main content */}
        <div className="h-[94%] max-h-[94%] w-full flex items-center gap-2 md:gap-4">
          <div className="h-full w-[60%] md:w-[70%] flex flex-col">
            <div className="h-[10%] w-[90%] flex items-center justify-start pl-8 md:pl-10 gap-3 md:gap-5">
              <div
                onClick={() => handleDivChange(1)}
                className={`w-36 h-9 flex items-center justify-center cursor-pointer border-[1px] border-gray-300 rounded-lg gap-3 ${
                  activeDiv === 1
                    ? "bg-blue-300 text-slate-900 border-blue-500"
                    : "bg-gray-300 text-slate-900"
                }`}
              >
                <TableCellsSplit size={18} className="text-slate-900" />
                <span
                  className={`text-base ${
                    activeDiv === 1 ? "font-semibold" : ""
                  }`}
                >
                  {language === "en"
                    ? translations.en.location_and_table
                    : translations.vi.location_and_table}
                </span>
              </div>

              <div
                onClick={() => handleDivChange(2)}
                className={`w-36 h-9 flex items-center justify-center cursor-pointer border-[1px] border-gray-300 rounded-lg gap-3 ${
                  activeDiv === 2
                    ? "bg-blue-300 text-slate-900 border-blue-500"
                    : "bg-gray-300 text-slate-900"
                }`}
              >
                <ConciergeBell size={18} className="text-slate-900" />
                <span
                  className={`text-base ${
                    activeDiv === 2 ? "font-semibold" : ""
                  }`}
                >
                  {language === "en"
                    ? translations.en.menu
                    : translations.vi.menu}
                </span>
              </div>
            </div>
            {activeDiv === 1 ? (
              <div className="flex-1 w-full border-2 border-slate-300 rounded-lg flex flex-col">
                <div
                  className={`w-full ${
                    allLocationsDisplay.length <= 5 ? "h-[12%]" : "h-[17%]"
                  } border-b-[1px] border-gray-400 rouder-b-sm px-3 py-3 md:px-5 overflow-y-auto scroll-container`}
                >
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${
                        isSmallScreen ? 3 : 5
                      }, minmax(0, 1fr))`,
                    }}
                  >
                    {allLocationsDisplay.map((location, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedLocationId(location.id)}
                        className={`w-full md:w-[70%] h-full flex items-center justify-center border p-2 rounded-md cursor-pointer ${
                          selectedLocationId === location.id
                            ? "bg-blue-400"
                            : "bg-blue-200"
                        }`}
                      >
                        <span className="text-sm font-semibold text-slate-900">
                          {location.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full h-[14%] md:h-[8%] flex items-center pt-2 pl-2 md:pl-6">
                  <RadioGroup
                    row
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {tableStatus.map((status) => (
                      <FormControlLabel
                        key={status}
                        value={status}
                        control={<Radio />}
                        label={
                          status === "all" ? (
                            <span className="text-sm text-slate-900">
                              {language === "en" ? "All" : "Tất cả"}
                            </span>
                          ) : status === "available" ? (
                            language === "en" ? (
                              <span className="text-sm text-slate-900">
                                {translations.en.empty_table}
                              </span>
                            ) : (
                              <span className="text-sm text-slate-900">
                                {translations.vi.empty_table}
                              </span>
                            )
                          ) : status === "serving" ? (
                            language === "en" ? (
                              <span className="text-sm text-slate-900">
                                {translations.en.serving_table}
                              </span>
                            ) : (
                              <span className="text-sm text-slate-900">
                                {translations.vi.serving_table}
                              </span>
                            )
                          ) : language === "en" ? (
                            <span className="text-sm text-slate-900">
                              {translations.en.reserved_table}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-900">
                              {translations.vi.reserved_table}
                            </span>
                          )
                        }
                      />
                    ))}
                  </RadioGroup>
                </div>
                <div
                  className={`w-full ${
                    allLocationsDisplay.length <= 5
                      ? "h-[77%] md:h-[80%]"
                      : "h-[77%] md:h-[75%]"
                  }  flex flex-col px-2 py-2 gap-1 md:gap-2`}
                >
                  {paginatedItems.length === 0 ? (
                    <div className="w-full h-[90%] flex flex-col items-center justify-center">
                      <PackageOpen size={46} className="text-slate-900" />
                      <span className="text-slate-900 font-semibold text-lg">
                        {language === "en"
                          ? translations.en.no_data_here
                          : translations.vi.no_data_here}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-[90%] grid gap-2 md:gap-4 grid-rows-2 grid-cols-2 md:grid-cols-4 md:grid-rows-2">
                      {paginatedItems.map((table, index) => (
                        <div
                          key={index}
                          className="w-full border border-gray-300 rounded-md p-2 text-center bg-gray-300 flex flex-col items-center justify-center"
                        >
                          <div
                            className="w-[80%] flex flex-col cursor-pointer items-center justify-center"
                            onClick={
                              table.status === "available"
                                ? () =>
                                    handleClickAvailableTable(
                                      table.id,
                                      table.name
                                    )
                                : () =>
                                    handleClickServingTable(
                                      table.id,
                                      owner_id,
                                      restaurant_id,
                                      accessToken
                                    )
                            }
                          >
                            <SiAirtable
                              className={`h-20 w-28 md:h-28 md:w-32 ${
                                table.status === "serving"
                                  ? "text-blue-500"
                                  : table.status === "reserved"
                                  ? "text-orange-500"
                                  : "text-slate-900"
                              }`}
                            />

                            <span className="text-sm font-semibold text-slate-900">
                              {table.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="w-full h-[10%] flex justify-center items-center">
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      shape="rounded"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 h-[88%] max-h-[88%] md:h-[90%] md:max-h-[90%] w-full border-2 border-slate-300 rounded-lg flex flex-col">
                <div
                  className={`w-full ${
                    allCategoriesDisplay.length <= 5 ? "h-[15%]" : "h-[18%]"
                  } border-b-[1px] border-gray-400 rouder-b-sm px-3 py-3 md:px-5 overflow-y-auto scroll-container`}
                >
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${
                        isSmallScreen ? 3 : 4
                      }, minmax(0, 1fr))`,
                    }}
                  >
                    {allCategoriesDisplay.map((category, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`w-full md:w-[70%] h-full flex items-center justify-center border p-2 rounded-md cursor-pointer ${
                          selectedCategoryId === category.id
                            ? "bg-blue-400"
                            : "bg-blue-200"
                        }`}
                      >
                        <span className="text-sm font-semibold text-slate-900">
                          {category.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className={`w-full ${
                    allCategories.length <= 5
                      ? "h-[84%] md:h-[82%]"
                      : "h-[84%] md:h-[82%]"
                  }  flex flex-col px-2 py-2 gap-1 md:gap-2`}
                >
                  {paginatedMenuItems.length === 0 ? (
                    <div className="w-full h-[90%] flex flex-col items-center justify-center">
                      <PackageOpen size={46} className="text-slate-900" />
                      <span className="text-slate-900 font-semibold text-lg">
                        {language === "en"
                          ? translations.en.no_data_here
                          : translations.vi.no_data_here}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-[90%] grid gap-2 md:gap-3 grid-rows-3 grid-cols-2 md:grid-cols-5 md:grid-rows-2">
                      {paginatedMenuItems.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelectMenuItem(item)}
                          className="w-full border border-gray-300 rounded-md p-1 text-center bg-gray-300 flex flex-col items-center justify-center cursor-pointer"
                        >
                          <div className="w-full h-[80%] flex ">
                            <img
                              src={item.image}
                              alt=""
                              width="100%"
                              height="100%"
                              style={{
                                objectFit: "fill",
                                mixBlendMode: "multiply",
                              }}
                            />
                          </div>
                          <div className="w-full h-[20%] flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">
                              {item.name}
                            </span>
                            <span className="text-sm font-semibold text-slate-900">
                              {formatCurrency(item.price, language)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="w-full h-[10%] flex justify-center items-center">
                    <Pagination
                      count={totalMenuItemPages}
                      page={currentMenuPage}
                      onChange={handlePageMenuChange}
                      color="primary"
                      shape="rounded"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {activeDiv === 1 ? (
            <div className="h-full md:h-[79%] w-[40%] md:w-[30%] flex flex-col border-[1px] border-[#bdc3c7] rounded-md">
              <div className="w-full h-[20%] flex flex-col items-center justify-center border-b-[1px] border-[#95a5a6]">
                <div className="w-full h-[45%] flex items-center justify-center">
                  <span className="text-lg md:text-xl font-bold text-slate-900">
                    {selectedRestaurantName}
                  </span>
                </div>
                <div className="w-full h-[55%] flex flex-col items-center justify-center gap-1">
                  <div className="w-full h-[50%] flex items-center justify-center">
                    <span className="text-sm md:text-base text-slate-600 italic">
                      {language === "en"
                        ? translations.en.address_restaurant
                        : translations.vi.address_restaurant}
                    </span>
                    <span className="text-sm md:text-base text-slate-600 italic">
                      {restaurantInfo.address}
                    </span>
                  </div>
                  <div className="w-full h-[50%] flex items-center justify-center">
                    <span className="text-sm md:text-base text-slate-600 italic">
                      {language === "en"
                        ? translations.en.phone_restaurant
                        : translations.vi.phone_restaurant}
                    </span>
                    <span className="text-sm md:text-base text-slate-600 italic">
                      {restaurantInfo.phone_number}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-[80%] flex items-center justify-center">
                <CreateOrderForm
                  isVisible={formVisibility}
                  table_id={selectedTable.table_id}
                  table_name={selectedTable.table_name}
                  owner_id={owner_id}
                  restaurant_id={restaurant_id}
                  accessToken={accessToken}
                  language={language}
                  handleChangActiveDiv={handleDivChange}
                />
              </div>
            </div>
          ) : (
            <div className="h-[96%] md:h-full md:max-h-full w-[40%] md:w-[30%] flex flex-col border-[1px] border-[#bdc3c7] rounded-md">
              <div className="w-full h-[20%] flex flex-col items-center justify-center border-b-[1px] border-[#95a5a6]">
                <div className="w-full h-[45%] flex items-center justify-center">
                  <span className="text-lg md:text-xl font-bold text-slate-900">
                    {selectedRestaurantName}
                  </span>
                </div>
                <div className="w-full h-[55%] flex flex-col items-center justify-center gap-1">
                  <div className="w-full h-[50%] flex items-center justify-center">
                    <span className="text-sm md:text-base text-slate-600 italic">
                      {language === "en"
                        ? translations.en.address_restaurant
                        : translations.vi.address_restaurant}
                    </span>
                    <span className="text-sm md:text-base text-slate-600 italic">
                      {restaurantInfo.address}
                    </span>
                  </div>
                  <div className="w-full h-[50%] flex items-center justify-center">
                    <span className="text-sm md:text-base text-slate-600 italic">
                      {language === "en"
                        ? translations.en.phone_restaurant
                        : translations.vi.phone_restaurant}
                    </span>
                    <span className="text-sm md:text-base text-slate-600 italic">
                      {restaurantInfo.phone_number}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-[80%] max-h-[80%] flex-1 flex items-center justify-center">
                <CreateOrderDetail
                  language={language}
                  owner_id={owner_id}
                  restaurant_id={restaurant_id}
                  accessToken={accessToken}
                  items={selectedMenuItems}
                  handleRemoveItems={handleRemoveItem}
                  order_table_id={selectedTable.table_id}
                  order_table_name={selectedTable.table_name}
                  handleActiveDiv={handleDivChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};
export default AddOrderPage;
