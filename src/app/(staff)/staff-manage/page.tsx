"use client";
import BaseLayout from "@/app/(components)/BaseLayout";
import IconBreadcrumbs from "@/app/(components)/Breadcrumb";
import { translations } from "@/constants/language/translation";
import { fetchAllStaffs } from "@/redux/staffState/staffSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { staffInfoServices } from "@/services";
import {
  AllStaffData,
  GetOneStaffResponse,
  StaffInfo,
} from "@/services/apiResponse";
import { formatCurrency } from "@/utils/utils";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import {
  ArrowDownAZ,
  CalendarArrowDown,
  Circle,
  CircleArrowDown,
  CircleArrowUp,
  Layout,
  MoveRight,
  PackageOpen,
  PlusCircleIcon,
  UsersRound,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { MdClear } from "react-icons/md";
import { toast } from "react-toastify";
import CreateNewStaffModal from "./components/CreateNewStaffModal";
import MoreDetailStaffInfoDrawer from "./components/MoreDetailStaffInfoDrawer";

type Props = {};

const StaffInfoManagePage = (props: Props) => {
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
            ? translations.en.staff_sub_side_link1
            : translations.vi.staff_sub_side_link1,
        href: "/add-order",
        icon: UsersRound,
      },
    ],
    [language]
  );

  useEffect(() => {
    const fetchStaffs = () => {
      dispatch(fetchAllStaffs({ owner_id, restaurant_id, accessToken }));
    };

    fetchStaffs();
  }, [dispatch, owner_id, accessToken, restaurant_id]);

  // states
  const [openDetailDrawer, setOpenDetailDrawer] = useState<boolean>(false);
  const [openDetailStaffId, setOpenDetailStaffId] = useState<string>("");
  const [openCreateNewStaffModal, setOpenCreateNewStaffModal] =
    useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [staffList, setStaffList] = useState<AllStaffData[]>(all_staffs);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;
  // handle change sort
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;

    if (value === "working" || value === "stop") {
      // Chọn lọc trạng thái
      setSortOption("");
      setFilterStatus(value === "working" ? "working" : "stop");
    } else {
      // Chọn sắp xếp
      setFilterStatus("");
      setSortOption(value);
    }
  };
  // handle clear sort
  const handleClearSort = () => {
    setSortOption("");
    setFilterStatus("");
  };

  // handle open create modal
  const handleOpenCreateModal = () => {
    setOpenCreateNewStaffModal(true);
  };

  // handle close create modal
  const handleCloseCreateModal = () => {
    setOpenCreateNewStaffModal(false);
  };

  // handle open detail drawer
  const handleOpenDetailDrawer = (staff_id: string) => {
    setOpenDetailDrawer(true);
    setOpenDetailStaffId(staff_id);
  };
  // handle close detail drawer
  const handleCloseDetailDrawer = () => {
    setOpenDetailDrawer(false);
  };
  // filter staff
  const filterAndSortStaff = (
    all_staff: AllStaffData[],
    selectedStatus: string,
    selectedSort: string
  ) => {
    let filteredStaff = all_staff;
    if (selectedStatus && selectedStatus !== "") {
      const status = selectedStatus === "working" ? "working" : "stop";
      filteredStaff = filteredStaff.filter(
        (staff) => staff.status_work === status
      );
    }
    if (selectedSort && selectedSort !== "") {
      if (selectedSort === "name-asc") {
        // Sắp xếp theo tên A-Z
        filteredStaff = [...filteredStaff].sort((a, b) =>
          a.fullname.localeCompare(b.fullname)
        );
      } else if (selectedSort === "date-asc") {
        // Sắp xếp theo ngày vào làm tăng dần
        filteredStaff = [...filteredStaff].sort(
          (a, b) =>
            new Date(a.hire_date).getTime() - new Date(b.hire_date).getTime()
        );
      }
    }
    return filteredStaff;
  };
  useEffect(() => {
    if (filterStatus === "" && sortOption === "") {
      setStaffList(all_staffs);
      return;
    }
    const filteredAndSortedStaff = filterAndSortStaff(
      all_staffs,
      filterStatus,
      sortOption
    );
    setStaffList(filteredAndSortedStaff);
  }, [sortOption, filterStatus, all_staffs]);

  // paginations
  const totalPages = Math.ceil(staffList.length / itemsPerPage);
  const currentItems = staffList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // handle change page
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
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
              ? translations.en.staff_sub_side_link1
              : translations.vi.staff_sub_side_link1}
          </span>
        </div>

        {/* main content */}
        <div className="h-[94%] w-full flex flex-col gap-2 sm:justify-center ">
          {/* Header */}
          <div className="w-full h-[10%] md:h-[8%] flex items-center justify-end md:justify-between">
            <span className="hidden md:flex text-lg font-bold uppercase text-slate-700 ">
              {language === "en"
                ? translations.en.staff_sub_side_link1
                : translations.vi.staff_sub_side_link1}
            </span>
            <span className="flex md:hidden text-lg font-semibold text-slate-900 uppercase text-start w-[50%]">
              {language === "en"
                ? translations.en.total_staff
                : translations.vi.total_staff}{" "}
              {all_staffs.length}
            </span>
            <div className="h-full w-[50%] flex items-center justify-center">
              {/* add new staff */}
              <div className="flex w-[50%] md:w-full items-center justify-end pr-10">
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
                    width: { sm: "100%", md: "28%" },
                    borderWidth: "1.5px",
                    borderColor: "#636e72",
                    ":hover": {
                      backgroundColor: "#dfe6e9",
                    },
                  }}
                  onClick={handleOpenCreateModal}
                >
                  <span className="text-sm md:text-base font-semibold md:font-medium capitalize text-slate-900">
                    {language === "en"
                      ? translations.en.add_new
                      : translations.vi.add_new}
                  </span>
                </Button>
              </div>

              {/* filter staff */}
              <div className="h-full w-[50%] flex md:hidden items-center justify-end md:justify-start md:pl-2">
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
                      value={sortOption || filterStatus}
                      onChange={handleChange}
                      label="Bộ lọc"
                      IconComponent={
                        !sortOption && !filterStatus ? CiFilter : () => <div />
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
                      <MenuItem disabled>
                        <strong>
                          {language === "en" ? "Sort by" : "Sắp xếp theo"}
                        </strong>
                      </MenuItem>
                      <MenuItem
                        value="name-asc"
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-1">
                          <ArrowDownAZ size={18} />
                          <span>
                            {language === "en"
                              ? translations.en.sort_staff_name
                              : translations.vi.sort_staff_name}
                          </span>
                        </div>
                      </MenuItem>
                      <MenuItem
                        value="date-asc"
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-1">
                          <CalendarArrowDown size={18} />
                          <span>
                            {language === "en"
                              ? translations.en.sort_hire_date
                              : translations.vi.sort_hire_date}
                          </span>
                        </div>
                      </MenuItem>
                      <MenuItem disabled>
                        <strong>
                          {language === "en" ? "Filter by" : "Lọc theo"}
                        </strong>
                      </MenuItem>
                      {/* Group: Lọc */}
                      <MenuItem
                        value="working"
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-1">
                          <Circle size={15} color="#3498db" fill="#3498db" />
                          <span>
                            {language === "en"
                              ? translations.en.filter_working_status
                              : translations.vi.filter_working_status}
                          </span>
                        </div>
                      </MenuItem>
                      <MenuItem
                        value="stop"
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-1">
                          <Circle size={15} color="#e74c3c" fill="#e74c3c" />
                          <span>
                            {language === "en"
                              ? translations.en.filter_terminated_status
                              : translations.vi.filter_terminated_status}
                          </span>
                        </div>
                      </MenuItem>
                    </Select>
                    {(sortOption || filterStatus) && (
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
          <div className="w-full h-[8%] hidden md:flex items-center justify-between ">
            <span className="text-lg font-semibold text-slate-900 uppercase md:normal-case text-start w-[50%]">
              {language === "en"
                ? translations.en.total_staff
                : translations.vi.total_staff}{" "}
              {all_staffs.length}
            </span>
            <div className="h-full w-[50%] flex items-center justify-end ">
              <div className="flex pr-10 items-center justify-center">
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
                    value={sortOption || filterStatus}
                    onChange={handleChange}
                    label="Bộ lọc"
                    IconComponent={
                      !sortOption && !filterStatus ? CiFilter : () => <div />
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
                    <MenuItem disabled>
                      <strong>
                        {language === "en" ? "Sort by" : "Sắp xếp theo"}
                      </strong>
                    </MenuItem>
                    <MenuItem
                      value="name-asc"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-1">
                        <ArrowDownAZ size={18} />
                        <span>
                          {language === "en"
                            ? translations.en.sort_staff_name
                            : translations.vi.sort_staff_name}
                        </span>
                      </div>
                    </MenuItem>
                    <MenuItem
                      value="name-desc"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-1">
                        <CalendarArrowDown size={18} />
                        <span>
                          {language === "en"
                            ? translations.en.sort_hire_date
                            : translations.vi.sort_hire_date}
                        </span>
                      </div>
                    </MenuItem>

                    <MenuItem disabled>
                      <strong>
                        {language === "en" ? "Filter by" : "Lọc theo"}
                      </strong>
                    </MenuItem>
                    {/* Group: Lọc */}
                    <MenuItem
                      value="working"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-1">
                        <Circle size={15} color="#3498db" fill="#3498db" />
                        <span>
                          {language === "en"
                            ? translations.en.filter_working_status
                            : translations.vi.filter_working_status}
                        </span>
                      </div>
                    </MenuItem>
                    <MenuItem value="stop" className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Circle size={15} color="#e74c3c" fill="#e74c3c" />
                        <span>
                          {language === "en"
                            ? translations.en.filter_terminated_status
                            : translations.vi.filter_terminated_status}
                        </span>
                      </div>
                    </MenuItem>
                  </Select>
                  {(sortOption || filterStatus) && (
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
          <div className="w-full h-[74%] md:h-[74%] flex flex-col items-center scroll-container overflow-y-auto ">
            {/* all staff */}
            {currentItems.length === 0 ? (
              <div className="w-full flex-grow flex flex-col items-center justify-center gap-1">
                <PackageOpen size={46} className="text-slate-900" />
                <span className="text-slate-900 font-semibold text-lg">
                  {language === "en"
                    ? translations.en.no_data_here
                    : translations.vi.no_data_here}
                </span>
              </div>
            ) : (
              <div className="w-full flex-grow flex flex-col items-center gap-5">
                {currentItems.map((staff) => (
                  <div
                    key={staff.id}
                    className={`h-36 w-full md:w-[90%] flex flex-col items-center justify-center border-[1px] border-[#ecf0f1] rounded-lg relative bg-gray-300 px-5 py-2 gap-1`}
                  >
                    <div
                      className={`w-full h-[35%] flex items-center justify-between`}
                    >
                      <div className="h-full w-[65%] flex flex-col gap-1">
                        <div className="w-full h-[50%] flex items-center justify-start gap-3">
                          <span className="text-base text-slate-900">
                            {language === "en" ? "Staff : " : "Nhân viên : "}
                          </span>
                          <span className="text-base text-slate-900 font-semibold">
                            {staff.fullname}
                          </span>
                        </div>
                        <div className="w-full h-[50%] flex items-center justify-start gap-3">
                          <span className="text-base text-slate-900">
                            {language === "en"
                              ? "Staff id : "
                              : "Mã nhân viên : "}{" "}
                          </span>
                          <span className="text-base text-slate-900 font-semibold">
                            {staff.id}
                          </span>
                        </div>
                      </div>

                      <div className="h-full w-[35%] flex items-center justify-center gap-5">
                        <span className="text-base text-slate-900">
                          {language === "en" ? "Status : " : "Trạng thái : "}
                        </span>
                        <div className="h-full w-auto flex items-center justify-center gap-1">
                          {staff.status_work === "working" ? (
                            <Circle size={16} color="#3498db" fill="#3498db" />
                          ) : (
                            <Circle size={16} color="#e74c3c" fill="#e74c3c" />
                          )}
                          <span className="text-base text-slate-900">
                            {staff.status_work === "working"
                              ? language === "en"
                                ? "Working"
                                : "Đang làm"
                              : language === "en"
                              ? "Stopped"
                              : "Đã nghỉ"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="h-[1px] w-[98%] border-[1px] border-[#bdc3c7]" />

                    <div className={`w-full h-[65%] flex flex-col`}>
                      <div className="w-full h-[50%] flex items-center justify-start gap-3">
                        <div className="h-full w-[50%] flex items-center justify-start gap-1">
                          <span className="text-base text-slate-900 font-semibold">
                            {language === "en" ? "Position :" : "Vị trí :"}
                          </span>
                          <span className="text-base text-slate-900">
                            {staff.position}
                          </span>
                        </div>

                        <div className="h-full w-[50%] flex items-center justify-center gap-1">
                          <span className="text-base text-slate-900 font-semibold">
                            {language === "en" ? "Type :" : "Loại hình :"}
                          </span>
                          <span className="text-base text-slate-900">
                            {staff.staff_type === "official"
                              ? language === "en"
                                ? translations.en.type_staff_offical
                                : translations.vi.type_staff_offical
                              : staff.staff_type === "probationary"
                              ? language === "en"
                                ? translations.en.type_staff_probationary
                                : translations.vi.type_staff_probationary
                              : language === "en"
                              ? translations.en.type_staff_parttime
                              : translations.vi.type_staff_parttime}
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-[50%] flex items-center justify-start gap-3">
                        <div className="h-full w-[50%] flex items-center justify-start gap-1">
                          <span className="text-base text-slate-900 font-semibold">
                            {language === "en"
                              ? "Phone number :"
                              : "Số điện thoại :"}
                          </span>
                          <span className="text-base text-slate-900">
                            {staff.phone_number}
                          </span>
                        </div>

                        <div className="h-full w-[50%] flex items-center justify-center gap-1 pr-12">
                          <span className="text-base text-slate-900 font-semibold">
                            {language === "en"
                              ? "Net salary :"
                              : "Lương cứng :"}
                          </span>
                          <span className="text-base text-slate-900">
                            {staff.net_salary} {language === "en" ? "$" : "đ"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Tooltip
                      title={
                        language === "en"
                          ? translations.en.detail_tooltip_label
                          : translations.vi.detail_tooltip_label
                      }
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -6],
                              },
                            },
                          ],
                        },
                      }}
                    >
                      <MoveRight
                        className={`block absolute right-4 bottom-2 cursor-pointer`}
                        color="#34495e"
                        size={22}
                        onClick={() => {
                          handleOpenDetailDrawer(staff.id);
                        }}
                      />
                    </Tooltip>
                  </div>
                ))}
              </div>
            )}

            {/* pagination */}
          </div>
          <div className="w-full h-[8%] flex items-center justify-center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChangePage}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </div>
      </div>

      <CreateNewStaffModal
        isOpen={openCreateNewStaffModal}
        handleClose={handleCloseCreateModal}
        owner_id={owner_id}
        restaurant_id={restaurant_id}
        language={language}
        accessToken={accessToken}
      />

      <MoreDetailStaffInfoDrawer
        isOpen={openDetailDrawer}
        toggleClose={handleCloseDetailDrawer}
        staff_id={openDetailStaffId}
        owner_id={owner_id}
        restaurant_id={restaurant_id}
        accessToken={accessToken}
        language={language}
      />
    </BaseLayout>
  );
};

export default StaffInfoManagePage;
