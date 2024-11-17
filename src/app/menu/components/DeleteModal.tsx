"use client";
import React, { useState } from "react";
import { Box, CircularProgress, Modal } from "@mui/material";
import { TriangleAlert, X } from "lucide-react";
import { updateModal } from "@/constants/customUI/box_modal";
import { translations } from "@/constants/language/translation";

type Props = {
  language: string;
  accessToken: string;
  owner_id: number;
  restaurant_id: number;
  menu_item_id: number;
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
  const [loading, setLoading] = useState<boolean>(false);
  // handle delete
  const handleDelete = async () => {};
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={updateModal}>
        {/* Header */}
        <div className="h-10 w-full border-b-[1px] border-gray-400 flex px-3 items-center justify-between">
          <span className="text-lg font-semibold text-slate-950">
            {language === "en"
              ? translations.en.delete_table_label
              : translations.vi.delete_table_label}
          </span>
          <X
            size={22}
            className="bg-red-500 hover:bg-red-600 cursor-pointer text-gray-100"
            onClick={handleClose}
          />
        </div>

        {/* Contents */}
        <div className="h-12 w-full flex items-center justify-center mt-2 gap-2">
          <TriangleAlert size={22} color="#e74c3c" />
          <span className="font-semibold text-base text-red-600">
            {language === "en"
              ? translations.en.accept_delete_menu_item
              : translations.vi.accept_delete_menu_item}
            {menu_item_name}
          </span>
        </div>

        {/* Footer */}
        <div className="w-full h-14  mt-2 flex items-center justify-end gap-2 pr-3">
          <button
            className="w-28 h-10 bg-red-500 border rounded-md hover:bg-red-600"
            type="submit"
            onClick={handleDelete}
          >
            {loading ? (
              <CircularProgress size={20} color="warning" />
            ) : (
              <span className="text-base font-bold text-slate-900">
                {language === "en"
                  ? translations.en.delete
                  : translations.vi.delete}
              </span>
            )}
          </button>
          <button
            className="w-28 h-10 bg-gray-400 border rounded-md hover:bg-gray-500"
            onClick={handleClose}
          >
            <span className="text-base font-bold text-slate-900">
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
