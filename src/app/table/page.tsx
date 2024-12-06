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
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
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
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableBody,
  Box,
  Typography,
  Collapse,
  TableContainer,
  Paper,
  ButtonGroup,
  TableFooter,
  TablePagination,
} from "@mui/material";
import { FaCircle } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { toast } from "react-toastify";
import { MdTableRestaurant } from "react-icons/md";
// file import
import { translations } from "@/constants/language/translation";
import CreateLocation from "./location/CreateLocation";
import ListLocation from "./location/ListLocation";
import CreateTable from "./components/CreateModal";
import { fetchAllTables } from "@/redux/tableState/tableSlice";
import { getAllTables } from "@/services/table/tableServices";
import {
  GetAllTablesResponse,
  GetOneTableInfor,
  OneTableData,
  TableData,
} from "@/services/apiResponse";
import UpdateTable from "./components/UpdateModal";
import DeleteTable from "./components/DeleteModal";
import { menuServices, tableServices } from "@/services";

type Props = {};

const TablePage = (props: Props) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const language = useAppSelector((state) => state.global.language);
  const { user, userId } = useAppSelector((state) => state.auth);
  const restaurantId = useAppSelector(
    (state) => state.restaurant.selected_restaurant.id
  );
  const accessToken = useAppSelector((state) => state.auth.user);
  const allTables = useAppSelector((state) => state.table.all_tables);
  const allLocations = useAppSelector((state) => state.location.all_locations);
  const selected_locations = useAppSelector(
    (state) => state.location.selected_locations
  );

  // table state
  const [openCreateMenuModal, setOpenCreateMenuModal] = useState(false);
  const [sortOption, setSortOption] = useState<string>("");
  const [tablesDisplay, setTablesDisplay] = useState<TableData[]>([]);
  const [openRow, setOpenRow] = useState(null);
  const [openUpdateMenuModal, setOpenUpdateMenuModal] = useState(false);
  const [updateTableId, setUpdateTableId] = useState<number>(0);
  const [openDeleteMenuModal, setOpenDeleteMenuModal] = useState(false);
  const [deleteTableId, setDeleteTableId] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [tableDetailData, setTableDetailData] = useState<OneTableData>();
  const [loadingRow, setLoadingRow] = useState<boolean>(false);
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
  useEffect(() => {
    let filtedTables = [...allTables];

    if (selected_locations.length > 0) {
      filtedTables = filtedTables.filter((table) =>
        selected_locations.includes(table.location_id)
      );
    }

    if (sortOption !== "") {
      filtedTables = filtedTables.filter(
        (table) => table.status === sortOption
      );
    }

    setTablesDisplay(filtedTables);
  }, [allTables, selected_locations, sortOption]);

  // handle change select option
  const handleChange = (event: SelectChangeEvent) => {
    const filterValue = event.target.value;
    setSortOption(filterValue);
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

  const toggleRow = async (tableId: any) => {
    if (openRow === tableId) {
      setOpenRow(null);
      return;
    }
    setOpenRow(tableId);
    setLoadingRow(true);
    try {
      const response: GetOneTableInfor = await tableServices.getOneTableInfor(
        accessToken,
        tableId,
        userId,
        restaurantId
      );
      if (response.success === true) {
        setTableDetailData(response.data);
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_fetch_one_table
          : translations.vi.error_fetch_one_table
      );
    } finally {
      setLoadingRow(false);
    }
  };

  // update modal
  const handleOpenUpdateModal = (tableId: number) => {
    setOpenUpdateMenuModal(true);
    setUpdateTableId(tableId);
  };
  const handleCloseUpdateModal = () => {
    setOpenUpdateMenuModal(false);
    setUpdateTableId(0);
  };
  // delete modal
  const handleOpenDeleteModal = (tableId: number) => {
    setOpenDeleteMenuModal(true);
    setDeleteTableId(tableId);
  };
  const handleCloseDeleteModal = () => {
    setOpenDeleteMenuModal(false);
    setDeleteTableId(0);
  };

  // handle change page
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  return (
    <BaseLayout>
      <div className="h-[86%] w-full px-3 md:px-6 py-2 gap-2 md:gap-6 flex flex-col">
        {/* breadcrumb */}
        <div className="h-[3%] md:h-[6%] w-full flex items-center px-3 z-10">
          <IconBreadcrumbs items={breadcrumbItems} darkTheme={isDarkMode} />
        </div>

        <div className="flex md:hidden w-full h-[3%] items-center justify-start px-3">
          <span className="text-lg font-bold uppercase text-slate-700">
            {language === "en"
              ? translations.en.table_manage
              : translations.vi.table_manage}
          </span>
        </div>

        {/* main content */}
        <div className="h-[94%] w-full flex gap-2 sm:justify-center">
          {/* location manage */}
          <div className="flex flex-col h-full w-[30%] md:w-[18%] gap-2 border-r-[1px] border-slate-300">
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
          <div className="w-[70%] h-full md:w-[80%] flex flex-col gap-2 items-center">
            <div className="h-[6%] w-full flex pr-6 items-center justify-end md:justify-between pl-3">
              <span className="hidden md:flex text-lg font-bold uppercase text-slate-700">
                {language === "en"
                  ? translations.en.table_manage
                  : translations.vi.table_manage}
              </span>

              <div className="h-full w-full md:w-[40%] flex items-center justify-center md:gap-5">
                {/* create */}
                <div className="h-full w-[50%] md:w-[60%] flex items-center justify-end md:justify-start md:pl-2">
                  <div className="flex w-full items-center justify-end md:justify-start xl:justify-end">
                    <Button
                      variant="outlined"
                      endIcon={<PlusCircleIcon size={22} />}
                      sx={{
                        backgroundColor: isDarkMode ? "none" : "#ecf0f1",
                        width: { sm: "60%", md: "80%" },
                        height: "30px",
                        borderWidth: "1.5px",
                        borderColor: "#636e72",
                        ":hover": {
                          backgroundColor: "#dfe6e9",
                        },
                      }}
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
                          borderColor: "#9ca3af",
                          "& .MuiSelect-icon": {
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: "22px",
                            fontWeight: "500",
                          },
                        }}
                      >
                        <MenuItem value="available">
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
            <div className="w-full h-[94%] md:h-[93%] flex items-start justify-center">
              <TableContainer
                component={Paper}
                sx={{
                  height: "100%",
                  maxHeight: "100%",
                }}
              >
                <Table aria-label="collapsible table" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <span className="text-[#121212] font-semibold md:text-base">
                          {language === "en"
                            ? translations.en.table_name
                            : translations.vi.table_name}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <span className="text-[#121212] font-semibold md:text-base">
                          {language === "en"
                            ? translations.en.table_location
                            : translations.vi.table_location}
                        </span>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          minWidth: "95px",
                        }}
                      >
                        <span className="text-[#121212] font-semibold md:text-base">
                          {language === "en"
                            ? translations.en.table_status
                            : translations.vi.table_status}
                        </span>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ display: { sm: "none", md: "table-cell" } }}
                      >
                        <span className="text-[#121212] font-semibold md:text-base">
                          {language === "en"
                            ? translations.en.table_type
                            : translations.vi.table_type}
                        </span>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          maxWidth: { sm: "100px" },
                        }}
                      >
                        <span className="text-[#121212] font-semibold md:text-base">
                          {language === "en"
                            ? translations.en.table_actions
                            : translations.vi.table_actions}
                        </span>
                      </TableCell>
                      <TableCell sx={{ maxWidth: "20px" }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tablesDisplay
                      .slice(page * 6, page * 6 + 6)
                      .map((table) => (
                        <React.Fragment key={table.id}>
                          {/* Main Row */}
                          <TableRow>
                            <TableCell
                              sx={{
                                height: "100%",
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                                justifyContent: "center",
                                borderBottom: "none",
                                paddingTop: "22px",
                              }}
                              align="center"
                            >
                              <MdTableRestaurant size={21} />
                              {table.name}
                            </TableCell>
                            <TableCell align="center">
                              {table.location_name}
                            </TableCell>
                            <TableCell
                              sx={{
                                height: "100%",
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                                justifyContent: "center",
                                borderBottom: "none",
                                paddingTop: "22px",
                              }}
                              align="center"
                            >
                              {table.status === "available" ? (
                                language === "en" ? (
                                  <div className="flex items-center gap-2">
                                    <FaCircle size={12} color="#2ecc71" />
                                    <span>{translations.en.empty_table}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <FaCircle size={12} color="#2ecc71" />
                                    <span>{translations.vi.empty_table}</span>
                                  </div>
                                )
                              ) : table.status === "serving" ? (
                                language === "en" ? (
                                  <div className="flex items-center gap-2">
                                    <FaCircle size={12} color="#3498db" />
                                    <span>{translations.en.serving_table}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <FaCircle size={12} color="#3498db" />
                                    <span>{translations.vi.serving_table}</span>
                                  </div>
                                )
                              ) : language === "en" ? (
                                <div className="flex items-center gap-2">
                                  <FaCircle size={12} color="#f1c40f" />
                                  <span>{translations.en.reserved_table}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <FaCircle size={12} color="#f1c40f" />
                                  <span>{translations.en.reserved_table}</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ display: { sm: "none", md: "table-cell" } }}
                            >
                              {table.type === "vip"
                                ? language === "en"
                                  ? table.type
                                  : translations.vi.vip_table
                                : language === "en"
                                ? table.type
                                : translations.vi.regular_table}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                maxWidth: { sm: "100px" },
                              }}
                            >
                              <ButtonGroup
                                variant="text"
                                sx={{ marginRight: "3px" }}
                              >
                                <Button
                                  size="small"
                                  sx={{
                                    color: "#3b82f6",
                                  }}
                                  onClick={() =>
                                    handleOpenUpdateModal(table.id)
                                  }
                                >
                                  <Edit2 size={16} />
                                </Button>
                                <Button
                                  size="small"
                                  sx={{
                                    color: "#ef4444",
                                  }}
                                  onClick={() =>
                                    handleOpenDeleteModal(table.id)
                                  }
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </ButtonGroup>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                maxWidth: "50px",
                                overflow: "hidden",
                              }}
                            >
                              <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => toggleRow(table.id)}
                              >
                                {openRow === table.id ? (
                                  <ChevronUp />
                                ) : (
                                  <ChevronDown />
                                )}
                              </IconButton>
                            </TableCell>
                          </TableRow>

                          {/* Collapsible Row */}
                          <TableRow>
                            <TableCell colSpan={5} style={{ padding: 0 }}>
                              <Collapse
                                in={openRow === table.id}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Box
                                  margin={2}
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "3px",
                                  }}
                                >
                                  <h4 className="text-lg font-bold md:pl-14">
                                    {tableDetailData?.name}
                                  </h4>
                                  <div className="w-full flex items-center justify-around">
                                    <p>{tableDetailData?.location_name}</p>
                                    <span>
                                      {language === "en"
                                        ? translations.en.table_type
                                        : translations.vi.table_type}
                                      :{" "}
                                      {tableDetailData?.type === "vip"
                                        ? language === "en"
                                          ? tableDetailData.type
                                          : translations.vi.vip_table
                                        : language === "en"
                                        ? tableDetailData?.type
                                        : translations.vi.regular_table}
                                    </span>
                                    <span>
                                      {language === "en"
                                        ? translations.en.table_capacity
                                        : translations.vi.table_capacity}
                                      : {tableDetailData?.capacity}{" "}
                                      {language === "en" ? "people" : "người"}
                                    </span>
                                  </div>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={tablesDisplay.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={6}
                        rowsPerPageOptions={[]}
                        labelRowsPerPage=""
                        labelDisplayedRows={({ from, to, count }) =>
                          `${from}-${to} ${
                            language === "en"
                              ? translations.en.of
                              : translations.vi.of
                          } ${count} ${
                            language === "en"
                              ? translations.en.table.toLowerCase()
                              : translations.vi.table.toLowerCase()
                          }`
                        }
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
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
        {/* update modal */}
        <UpdateTable
          isOpen={openUpdateMenuModal}
          handleClose={handleCloseUpdateModal}
          tableId={updateTableId}
          language={language}
          all_locations={allLocations}
        />
        {/* delete modal */}
        <DeleteTable
          isOpen={openDeleteMenuModal}
          handleClose={handleCloseDeleteModal}
          tableId={deleteTableId}
          language={language}
        />
      </div>
    </BaseLayout>
  );
};

export default TablePage;
