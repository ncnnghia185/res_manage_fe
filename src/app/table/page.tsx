"use client";
// package import
import React, { useEffect, useState } from "react";
import IconBreadcrumbs from "@/app/(components)/Breadcrumb";
import {
  Layout,
  TableCellsSplit,
  Menu,
  PlusCircleIcon,
  FilterIcon,
  Filter,
} from "lucide-react";
import BaseLayout from "@/app/(components)/BaseLayout";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { MdClear } from "react-icons/md";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  IconButton,
  Pagination,
} from "@mui/material";
import { FaCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { toast } from "react-toastify";
// file import
import { translations } from "@/constants/language/translation";
import CreateLocation from "./location/CreateLocation";
import ListLocation from "./location/ListLocation";
import CreateTable from "./components/CreateModal";
import { fetchAllTables } from "@/redux/tableState/tableSlice";
import { getAllTables } from "@/services/table/tableServices";
import { GetAllTablesResponse, TableData } from "@/services/apiResponse";
import TableItem from "../(components)/TableItem";
// import Pagination from "../(components)/Pagination";

type Props = {};

const TablePage = (props: Props) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const language = useAppSelector((state) => state.global.language);
  const { user, userId } = useAppSelector((state) => state.auth);
  const restaurantId = useAppSelector(
    (state) => state.restaurant.selected_restaurant.id
  );
  const allTables = useAppSelector((state) => state.table.all_tables);
  const allLocations = useAppSelector((state) => state.location.all_locations);
  const selected_locations = useAppSelector(
    (state) => state.location.selected_locations
  );

  // table state

  const [openCreateMenuModal, setOpenCreateMenuModal] = useState(false);
  const [openDetailMenuDrawer, setOpenDetailMenuDrawer] = useState(false);
  const [sortOption, setSortOption] = useState<string>("");
  const [tablesDisplay, setTablesDisplay] = useState<TableData[]>([]);
  // fetch all tables
  useEffect(() => {
    const fetchTables = async () => {
      try {
        dispatch(
          fetchAllTables({
            accessToken: user,
            owner_id: userId,
            restaurant_id: restaurantId,
          })
        );
      } catch (error) {
        toast.error(
          language === "en"
            ? translations.en.error_list_table
            : translations.vi.error_list_table
        );
      }
    };

    fetchTables();
  }, [dispatch, userId, restaurantId]);
  // filter table with locations
  const filterTables =
    selected_locations.length > 0
      ? allTables.filter((table) =>
          selected_locations.includes(table.location_id)
        )
      : allTables;

  // handle change select option
  const handleChange = (event: SelectChangeEvent) => {
    const filterValue = event.target.value;
    setSortOption(filterValue);
    setTablesDisplay(
      filterTables.filter((table) => {
        if (filterValue === "empty") return table.status === "available";
        if (filterValue === "serving") return table.status === "serving";
        if (filterValue === "reserved") return table.status === "reserved";
        return filterTables;
      })
    );
  };

  // clear select option
  const handleClear = () => {
    setSortOption("");
  };

  // breadcrumb items
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
      label: language === "en" ? translations.en.table : translations.vi.table,
      href: "/table",
      icon: TableCellsSplit,
    },
  ];

  // create modal
  const handleOpenCreateModal = () => {
    setOpenCreateMenuModal(true);
  };
  const handleCloseCreateModal = () => {
    setOpenCreateMenuModal(false);
  };

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

          {/* location manage */}
          <div className="hidden md:flex flex-col h-full w-[18%] gap-2 border-r-[1px] border-slate-300">
            <div className="h-[8%] w-full flex flex-col items-start justify-center pl-4 gap-2">
              <span className="text-lg font-bold uppercase text-slate-700">
                {language === "en"
                  ? translations.en.location
                  : translations.vi.location}
              </span>
              <div className="h-[1px] border-b-2 border-slate-300 w-3/4 shadow-sm" />
            </div>
            {/* list location */}
            <div className="w-full h-auto">
              <ListLocation
                language={language}
                accessToken={user}
                owner_id={userId}
                restaurant_id={restaurantId}
              />
            </div>
            {/* create category */}
            <div className="h-[8%] w-full flex items-center justify-center">
              <CreateLocation
                language={language}
                accessToken={user}
                owner_id={userId}
                restaurant_id={restaurantId}
              />
            </div>
          </div>

          {/* table manage */}
          <div className="w-[100%] h-full md:w-[80%] flex flex-col gap-2">
            <div className="h-[6%] w-full flex pr-6 items-center justify-between pl-3">
              <span className="text-lg font-bold uppercase text-slate-700">
                {language === "en"
                  ? translations.en.table_manage
                  : translations.vi.table_manage}
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
                      onClick={handleOpenCreateModal}
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
                        position: "relative",
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
                          "& .MuiSelect-icon": {
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: "22px",
                            fontWeight: "500",
                          },
                        }}
                      >
                        <MenuItem value="empty">
                          <div className="flex items-center gap-2">
                            <FaCircle size={12} color="#2ecc71" />
                            <span>
                              {language === "en"
                                ? translations.en.empty_table
                                : translations.vi.empty_table}
                            </span>
                          </div>
                        </MenuItem>

                        <MenuItem
                          value="serving"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <FaCircle size={12} color="#3498db" />
                            <span>
                              {language === "en"
                                ? translations.en.serving_table
                                : translations.vi.serving_table}
                            </span>
                          </div>
                        </MenuItem>
                        <MenuItem
                          value="reserved"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <FaCircle size={12} color="#f1c40f" />
                            <span>
                              {language === "en"
                                ? translations.en.reserved_table
                                : translations.vi.reserved_table}
                            </span>
                          </div>
                        </MenuItem>
                      </Select>
                      {sortOption && (
                        <IconButton
                          onClick={handleClear}
                          sx={{
                            position: "absolute",
                            right: 5,
                            top: "50%",
                            transform: "translateY(-50%)",
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
            <div className="w-full h-[86%] grid items-center justify-center gap-5 grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2 pl-5 py-2">
              {filterTables.map((table) => (
                <TableItem
                  key={table.id}
                  language={language}
                  table_id={table.id}
                  table_name={table.name}
                  table_status={table.status}
                  table_location={table.location_name}
                  all_locations={allLocations}
                />
              ))}
            </div>

            {/* pagination */}
            <div className="h-[8%] w-full px-3 flex items-center justify-between border-t-[1px] border-slate-200">
              <span className="text-base font-semibold text-slate-700">
                {language === "en"
                  ? translations.en.total_count_table
                  : translations.vi.total_count_table}
                {filterTables.length}
              </span>

              <Pagination
                count={10}
                variant="outlined"
                shape="rounded"
                size="small"
              />
            </div>
          </div>
        </div>
        <CreateTable
          language={language}
          isOpen={openCreateMenuModal}
          handleClose={handleCloseCreateModal}
          accessToken={user}
          owner_id={userId}
          restaurant_id={restaurantId}
          all_locations={allLocations}
        />
      </div>
    </BaseLayout>
  );
};

export default TablePage;
