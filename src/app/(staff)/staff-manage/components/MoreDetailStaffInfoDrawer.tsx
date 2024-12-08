"use client";
import { translations } from "@/constants/language/translation";
import { staffInfoServices } from "@/services";
import { GetOneStaffResponse, StaffInfo } from "@/services/apiResponse";
import { Button, Drawer } from "@mui/material";
import {
  Cake,
  CalendarCheck,
  Edit2,
  MapPinHouse,
  Phone,
  User2,
  UserRoundX,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UpdateStaffInfoModal from "./UpdateStaffInfoModal";
import StopWorkStaffModal from "./StopWorkStaffModal";
import { MdTransgender } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaUserTag } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  toggleClose: () => void;
  staff_id: string;
  owner_id: number;
  restaurant_id: number;
  accessToken: string;
  language: string;
};

const MoreDetailStaffInfoDrawer = ({
  isOpen,
  toggleClose,
  staff_id,
  owner_id,
  restaurant_id,
  accessToken,
  language,
}: Props) => {
  const [staffGeneralInfo, setStaffGeneralInfo] = useState<StaffInfo>();
  useEffect(() => {
    const fetchCurrentStaffInfo = async () => {
      try {
        const response: GetOneStaffResponse =
          await staffInfoServices.getOneStaffInfo(
            staff_id,
            owner_id,
            restaurant_id,
            accessToken
          );
        if (response.success === true) {
          setStaffGeneralInfo(response.data);
        }
      } catch (error) {
        toast.error(
          language === "en"
            ? translations.en.error_fetch_staff_general_info
            : translations.vi.error_fetch_staff_general_info
        );
      }
    };
    if (isOpen) {
      fetchCurrentStaffInfo();
    }
  }, [isOpen]);
  const [openUpdateStaffModal, setOpenUpdateStaffModal] =
    useState<boolean>(false);
  const [openStopWorkModal, setOpenStopWorkModal] = useState<boolean>(false);

  // handle open update info modal
  const handleOpenUpdateInfoModal = () => {
    setOpenUpdateStaffModal(true);
  };
  // handle close update info modal
  const handleCloseUpdateInfoModal = () => {
    setOpenUpdateStaffModal(false);
  };
  // handle open stop work modal
  const handleOpenStopWorkModal = () => {
    setOpenStopWorkModal(true);
  };
  // handle close stop work modal
  const handlCloseStopWorkModal = () => {
    setOpenStopWorkModal(false);
  };
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
              ? translations.en.staff_info_detail_title
              : translations.vi.staff_info_detail_title}
          </span>
        </div>
      </div>
      <div className="w-full h-[84%] flex flex-col gap-1">
        <div className="w-full h-[40%] flex flex-col bg-[#ecf0f1] px-2">
          <div className="w-full h-[16%] flex items-center justify-start gap-5">
            <div className="h-full w-[50%] flex items-center justify-start gap-2">
              <User2 size={18} className="text-[#121212]" />
              <span className="text-base text-[#121212] font-semibold">
                {language === "en" ? "Staff : " : "Nhân viên : "}{" "}
                {staffGeneralInfo?.fullname}
              </span>
            </div>
            <div className="h-full w-[50%] flex items-center justify-start">
              <span className="text-base text-[#121212]">
                {staffGeneralInfo?.id}
              </span>
            </div>
          </div>
          <div className="w-full h-[16%] flex items-center justify-start gap-5">
            <div className="h-full w-[50%] flex items-center justify-start gap-2">
              <MdTransgender size={18} className="text-[#121212]" />
              <span className="text-base text-[#121212] font-semibold">
                {language === "en" ? "Gender : " : "Giới tính : "}{" "}
                {staffGeneralInfo?.gender === "male"
                  ? language === "en"
                    ? "Male"
                    : "Nam"
                  : staffGeneralInfo?.gender === "female"
                  ? language === "en"
                    ? "Female"
                    : "Nữ"
                  : language === "en"
                  ? "Orther"
                  : "Khác"}
              </span>
            </div>
            <div className="h-full w-[50%] flex items-center justify-start gap-2">
              <Phone size={16} className="text-[#121212]" />
              <span className="text-base text-[#121212] font-semibold">
                {language === "en" ? "Phone number : " : "Số điện thoại : "}{" "}
                {staffGeneralInfo?.phone_number}
              </span>
            </div>
          </div>
          <div className="w-full h-[16%] flex items-center justify-start gap-5">
            <div className="h-full w-[50%] flex items-center justify-start gap-2">
              <Cake size={18} className="text-[#121212]" />
              <span className="text-base text-[#121212] font-semibold">
                {language === "en" ? "Date of birth : " : "Ngày sinh : "}{" "}
                {staffGeneralInfo?.date_of_birth}
              </span>
            </div>
            <div className="h-full w-[50%] flex items-center justify-start gap-2">
              <FaRegAddressCard size={18} className="text-[#121212]" />
              <span className="text-base text-[#121212] font-semibold">
                {language === "en" ? "Identification card : " : "Số CCCD : "}{" "}
                {staffGeneralInfo?.identification_card}
              </span>
            </div>
          </div>
          <div className="w-full h-[16%] flex items-center justify-start gap-5">
            <div className="h-full w-full flex items-center justify-start gap-2">
              <MapPinHouse size={18} className="text-[#121212]" />
              <span className="text-base text-[#121212] font-semibold">
                {language === "en" ? "Address : " : "Địa chỉ : "}{" "}
                {staffGeneralInfo?.address}
              </span>
            </div>
          </div>
          <div className="w-full h-[16%] flex items-center justify-start gap-5">
            <div className="h-full w-[50%] flex items-center justify-start gap-2">
              <CalendarCheck size={18} className="text-[#121212]" />
              <span className="text-base text-[#121212] font-semibold">
                {language === "en" ? "Hire date : " : "Ngày thuê : "}{" "}
                {staffGeneralInfo?.hire_date}
              </span>
            </div>
            <div className="h-full w-[50%] flex items-center justify-start gap-2">
              <GrUserWorker size={18} className="text-[#121212]" />
              <span className="text-base text-[#121212] font-semibold">
                {language === "en" ? "Position : " : "Vị trí : "}{" "}
                {staffGeneralInfo?.position}
              </span>
            </div>
          </div>
          <div className="w-full h-[16%] flex items-center justify-start gap-5">
            <div className="h-full w-[50%] flex items-center justify-start gap-2">
              <FaUserTag size={18} className="text-[#121212]" />
              <span className="text-base text-[#121212] font-semibold">
                {language === "en" ? "Type : " : "Loại hình : "}{" "}
                {staffGeneralInfo?.staff_type === "official"
                  ? language === "en"
                    ? translations.en.type_staff_offical
                    : translations.vi.type_staff_offical
                  : staffGeneralInfo?.staff_type === "probationary"
                  ? language === "en"
                    ? translations.en.type_staff_probationary
                    : translations.vi.type_staff_probationary
                  : language === "en"
                  ? translations.en.type_staff_parttime
                  : translations.vi.type_staff_parttime}
              </span>
            </div>
            <div className="h-full w-[50%] flex items-center justify-start gap-2">
              <FaMoneyBillWave size={18} className="text-[#121212]" />
              <span className="text-base text-[#121212] font-semibold">
                {language === "en" ? "Net salary : " : "Mức lương : "}{" "}
                {staffGeneralInfo?.net_salary}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full h-[60%] flex flex-col ">
          <div className="w-full h-[10%] flex items-center justify-start">
            <span className="text-lg font-semibold text-[#121212]">
              {language === "en"
                ? translations.en.attendance_last_7_days
                : translations.vi.attendance_last_7_days}
            </span>
          </div>

          <div className="w-full h-[90%] flex bg-blue-700"></div>
        </div>
      </div>
      <div className="h-[8%] w-full flex items-center justify-center gap-10">
        <button
          className="w-36 h-10 flex items-center justify-center gap-2 border-[1px] border-[#2980b9] rounded-lg bg-[#3498db]"
          onClick={handleOpenUpdateInfoModal}
        >
          <Edit2 size={16} className="text-[#fff] font-bold" />
          <span className="text-base text-[#fff] font-semibold">
            {language === "en" ? "Edit info" : "Sửa thông tin"}
          </span>
        </button>
        <button
          className="w-36 h-10 flex items-center justify-center gap-2 border-[1px] border-[#d35400] rounded-lg bg-[#e67e22]"
          onClick={handleOpenStopWorkModal}
        >
          <UserRoundX size={16} className="text-[#fff] font-bold" />
          <span className="text-base text-[#fff] font-semibold">
            {language === "en" ? "Stop working" : "Dừng làm việc"}
          </span>
        </button>
      </div>
      <UpdateStaffInfoModal
        isOpen={openUpdateStaffModal}
        handleClose={handleCloseUpdateInfoModal}
        staff_id={staff_id}
        owner_id={owner_id}
        restaurant_id={restaurant_id}
        accessToken={accessToken}
        language={language}
      />
      <StopWorkStaffModal
        isOpen={openStopWorkModal}
        handleClose={handlCloseStopWorkModal}
        staff_id={staff_id}
        owner_id={owner_id}
        restaurant_id={restaurant_id}
        accessToken={accessToken}
        language={language}
      />
    </Drawer>
  );
};

export default MoreDetailStaffInfoDrawer;
