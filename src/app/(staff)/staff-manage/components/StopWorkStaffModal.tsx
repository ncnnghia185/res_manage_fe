import { updateModal } from "@/constants/customUI/box_modal";
import { translations } from "@/constants/language/translation";
import { Box, Modal } from "@mui/material";
import { X } from "lucide-react";
import React from "react";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  staff_id: string;
  owner_id: number;
  restaurant_id: number;
  accessToken: string;
  language: string;
};

const StopWorkStaffModal = ({
  isOpen,
  handleClose,
  staff_id,
  owner_id,
  restaurant_id,
  accessToken,
  language,
}: Props) => {
  return (
    <Modal open={isOpen}>
      <Box sx={updateModal}>
        {/* Header */}
        <div className="h-10 w-full border-b-[1px] border-[#bdc3c7] flex px-3 items-center justify-between">
          <span className="text-lg font-semibold text-[#121212]">
            {language === "en"
              ? translations.en.stop_work_staff_label
              : translations.vi.stop_work_staff_label}
          </span>
          <X
            size={22}
            className="bg-[#ef4444] hover:bg-[#dc2626] cursor-pointer text-[#f3f4f6]"
            onClick={handleClose}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default StopWorkStaffModal;
