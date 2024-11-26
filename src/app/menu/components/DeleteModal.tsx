"use client";
import React, { useState } from "react";
import { Box, CircularProgress, Modal } from "@mui/material";
import { TriangleAlert, X } from "lucide-react";
import { toast } from "react-toastify";
// file import
import { updateModal } from "@/constants/customUI/box_modal";
import { translations } from "@/constants/language/translation";
import { DeleteMenuItemResponse } from "@/services/apiResponse";
import { menuServices } from "@/services";
import { useAppDispatch } from "@/redux/store";
import { fetchAllMenuItems } from "@/redux/menuState/menuSlice";

type Props = {
  language: string;
  accessToken: string;
  owner_id: number;
  restaurant_id: number;
  menu_item_id: string;
  menu_item_name: string;
  isOpen: boolean;
  handleClose: () => void;
};

const DeleteModal = ({
  language,
  accessToken,
  owner_id,
  restaurant_id,
  menu_item_id,
  menu_item_name,
  isOpen,
  handleClose,
}: Props) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  // handle delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response: DeleteMenuItemResponse =
        await menuServices.deleteMenuItem(
          menu_item_id,
          owner_id,
          restaurant_id,
          accessToken
        );
      if (response.success === true) {
        toast.success(
          language === "en"
            ? translations.en.success_delete_menu_item
            : translations.vi.success_delete_menu_item
        );
        dispatch(fetchAllMenuItems({ accessToken, owner_id, restaurant_id }));
        handleClose();
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_delete_menu_item
          : translations.vi.error_delete_menu_item
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={updateModal}>
        {/* Header */}
        <div className="h-10 w-full border-b-[1px] border-gray-400 flex px-3 items-center justify-between">
          <span className="text-lg font-semibold text-[#121212]">
            {language === "en"
              ? translations.en.delete_table_label
              : translations.vi.delete_table_label}
          </span>
          <X
            size={22}
            className="bg-[#ef4444] hover:bg-[#dc2626] cursor-pointer text-[#f3f4f6]"
            onClick={handleClose}
          />
        </div>

        {/* Contents */}
        <div className="h-12 w-full flex items-center justify-center mt-2 gap-2">
          <TriangleAlert size={22} color="#e74c3c" />
          <span className="font-semibold text-base text-[#ef4444]">
            {language === "en"
              ? translations.en.accept_delete_menu_item
              : translations.vi.accept_delete_menu_item}
          </span>
        </div>

        {/* Footer */}
        <div className="w-full h-14  mt-2 flex items-center justify-end gap-2 pr-3">
          <button
            className="w-28 h-10 bg-[#ef4444] border rounded-md hover:bg-[#dc2626]"
            type="submit"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && (
              <CircularProgress
                size="18px"
                sx={{
                  color: "#ecf0f1",
                }}
              />
            )}
            <span className="text-base font-bold text-[#f3f4f6]">
              {language === "en"
                ? translations.en.delete
                : translations.vi.delete}
            </span>
          </button>
          <button
            className="w-28 h-10 bg-[#6b7280] border rounded-md hover:bg-[#4b5563]"
            onClick={handleClose}
          >
            <span className="text-base font-bold text-[#f3f4f6]">
              {language === "en"
                ? translations.en.cancel_update
                : translations.vi.cancel_update}
            </span>
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
