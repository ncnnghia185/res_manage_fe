"use client";
import { updateModal } from "@/constants/customUI/box_modal";
import { translations } from "@/constants/language/translation";
import { menuServices } from "@/services";
import { useAppDispatch } from "@/redux/store";
import { updateCategory } from "@/redux/menuState/categorySlice";
import { Modal, Box, TextField } from "@mui/material";
import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  categoryId: number | null | undefined;
  handleClose: () => void;
  language: string;
};

const UpdateCategoryModal = (props: Props) => {
  const dispatch = useAppDispatch();
  const { isOpen, handleClose, categoryId, language } = props;
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  // update category
  const handleUpdateCategory = async () => {
    setLoading(true);
    try {
      const resposne = await menuServices;
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_update_category
          : translations.vi.error_update_category
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      className="flex justify-center items-start "
    >
      <Box className="bg-slate-400 p-4 " sx={updateModal}>
        <div className="h-10 w-full border-b-[1px] border-gray-100 flex px-3 items-center justify-between">
          <span className="text-lg font-semibold text-slate-950">
            {language === "en"
              ? translations.en.update_category
              : translations.vi.update_category}
          </span>
          <X
            size={22}
            className="bg-red-500 hover:bg-red-600 cursor-pointer text-gray-100"
            onClick={handleClose}
          />
        </div>
        <div className="w-full h-20 flex items-center justify-center">
          <TextField
            className="w-[80%]"
            variant="standard"
            label={
              language === "en"
                ? translations.en.update
                : translations.vi.update
            }
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </div>
        <div className="w-full h-12 flex items-center justify-end gap-8 pr-10">
          <button className="w-28 h-10 bg-blue-500 border rounded-md hover:bg-blue-600">
            <span className="text-base font-bold text-slate-900">
              {language === "en"
                ? translations.en.save_update
                : translations.vi.save_update}
            </span>
          </button>
          <button
            className="w-28 h-10 bg-red-500 border rounded-md hover:bg-red-600"
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

export default UpdateCategoryModal;
