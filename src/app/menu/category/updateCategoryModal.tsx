"use client";
import { updateModal } from "@/constants/customUI/box_modal";
import { translations } from "@/constants/language/translation";
import { menuServices } from "@/services";
import { useAppDispatch } from "@/redux/store";
import { Modal, Box, TextField } from "@mui/material";
import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { UpdateCategoryResponse } from "@/services/apiResponse";
import { fetchAllCategories } from "@/redux/menuState/categorySlice";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  language: string;
  category_id?: number;
  category_name?: string;
  owner_id: number;
  restaurant_id: number;
  accessToken: string;
};

const UpdateCategoryModal = ({
  isOpen,
  handleClose,
  language,
  category_id,
  category_name,
  owner_id,
  restaurant_id,
  accessToken,
}: Props) => {
  const dispatch = useAppDispatch();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  // update category
  const handleUpdateCategory = async () => {
    setLoading(true);
    try {
      const data = {
        name: newCategoryName,
      };
      const response: UpdateCategoryResponse =
        await menuServices.updateCategoryName(
          owner_id,
          restaurant_id,
          accessToken,
          data,
          category_id
        );
      if (response.success === true) {
        toast.success(
          language === "en"
            ? translations.en.success_update_category
            : translations.vi.success_update_category
        );
        setNewCategoryName("");
        dispatch(fetchAllCategories({ accessToken, owner_id, restaurant_id }));
        handleClose();
      } else {
        toast.error(
          language === "en"
            ? translations.en.error_update_category
            : translations.vi.error_update_category
        );
      }
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
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={updateModal}>
        <div className="h-10 w-full border-b-[1px] border-gray-400 flex px-3 items-center justify-between">
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
        <div className="h-12 w-full flex items-center justify-center mt-2">
          <TextField
            className="w-[80%]"
            variant="standard"
            id="name"
            label={
              language === "en"
                ? translations.en.update
                : translations.vi.update
            }
            value={newCategoryName}
            placeholder={category_name}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </div>
        <div className="w-full h-14  mt-2 flex items-center justify-end gap-2 pr-3">
          <button
            className="w-28 h-10 bg-green-500 border rounded-md hover:bg-green-600"
            type="submit"
            onClick={handleUpdateCategory}
          >
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
