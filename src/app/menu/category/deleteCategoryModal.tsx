"use client";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Modal } from "@mui/material";
import { TriangleAlert, X } from "lucide-react";
import { toast } from "react-toastify";
// file import
import { updateModal } from "@/constants/customUI/box_modal";
import { translations } from "@/constants/language/translation";
import {
  DeleteCategoryResponse,
  GetCountItemsOfCategory,
} from "@/services/apiResponse";
import { menuServices } from "@/services";
import { useAppDispatch } from "@/redux/store";
import { fetchAllCategories } from "@/redux/menuState/categorySlice";

type Props = {
  language: string;
  accessToken: string;
  owner_id: number;
  restaurant_id: number;
  category_id?: number;
  isOpen: boolean;
  handleClose: () => void;
};

const DeleteCategoryModal = ({
  language,
  accessToken,
  owner_id,
  restaurant_id,
  category_id,
  isOpen,
  handleClose,
}: Props) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [countItems, setCountItems] = useState<number>();
  useEffect(() => {
    const getCountItems = async () => {
      const response: GetCountItemsOfCategory =
        await menuServices.getCategoryDetail(
          owner_id,
          restaurant_id,
          accessToken,
          category_id
        );
      if (response.success === true) {
        setCountItems(response.data);
      }
    };
    if (isOpen) {
      getCountItems();
    }
  }, [isOpen]);

  // handle delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response: DeleteCategoryResponse =
        await menuServices.deleteCategory(
          owner_id,
          restaurant_id,
          accessToken,
          category_id
        );
      if (response.success === true) {
        toast.success(
          language === "en"
            ? translations.en.success_delete_menu_item
            : translations.vi.success_delete_menu_item
        );
        dispatch(fetchAllCategories({ accessToken, owner_id, restaurant_id }));
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
        <div className="h-10 w-full border-b-[1px] border-[#bdc3c7] flex px-3 items-center justify-between">
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
        {countItems !== 0 ? (
          <div className="h-14 w-full flex items-center justify-center mt-2 gap-2">
            <TriangleAlert size={22} color="#e74c3c" />
            <div className="h-full flex-1 flex flex-col gap-2">
              <span className="text-base font-semibold text-[#ea580c]">
                {language === "en"
                  ? translations.en.current_have
                  : translations.vi.current_have}{" "}
                {countItems}{" "}
                {language === "en"
                  ? translations.en.warning_item_in_category
                  : translations.vi.warning_item_in_category}
              </span>
              <span className="text-base font-semibold text-[#121212]">
                {language === "en"
                  ? translations.en.delete_item_before
                  : translations.vi.delete_item_before}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-12 w-full flex items-center justify-center mt-2 gap-2">
            <TriangleAlert size={22} color="#e74c3c" />
            <span className="font-semibold text-base text-[#ef4444]">
              {language === "en"
                ? translations.en.accept_delete_category
                : translations.vi.accept_delete_category}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="w-full h-14  mt-2 flex items-center justify-end gap-2 pr-3">
          {countItems !== 0 ? (
            <button
              className="w-28 h-10 bg-[#ef4444] border rounded-md"
              type="submit"
              disabled={true}
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
          ) : (
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
          )}

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

export default DeleteCategoryModal;
