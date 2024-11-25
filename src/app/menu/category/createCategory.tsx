"use client";
import { TextField } from "@mui/material";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { translations } from "@/constants/language/translation";
import { menuServices } from "@/services";
import { useAppDispatch } from "@/redux/store";
import { CreateCategoryResponse } from "@/services/apiResponse";
import {
  addCategories,
  fetchAllCategories,
} from "@/redux/menuState/categorySlice";
type Props = {
  language: string;
  accessToken: string;
  owner_id: number;
  restaurant_id: number;
};

const CreateCategory: React.FC<Props> = ({
  language,
  accessToken,
  owner_id,
  restaurant_id,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  // handle create category
  const handleCreateCategory = async () => {
    setLoading(true);
    try {
      if (restaurant_id === 0) {
        toast.error(
          language === "en"
            ? translations.en.please_select_restaurant
            : translations.vi.please_select_restaurant
        );
        setLoading(false);
        return;
      }
      const response: CreateCategoryResponse =
        await menuServices.createCategory(
          {
            name: categoryName,
            owner_id: owner_id,
            restaurant_id: restaurant_id,
          },
          accessToken
        );
      if (response.success === true) {
        toast.success(
          language === "en"
            ? translations.en.success_add_new_category
            : translations.vi.success_add_new_category
        );
        setCategoryName("");
        dispatch(addCategories(response.data));
      } else {
        toast.error(
          language === "en"
            ? translations.en.error_add_new_category
            : translations.vi.error_add_new_category
        );
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_add_new_category
          : translations.vi.error_add_new_category
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-full flex items-center px-2">
      <div className="w-[82%] h-full pl-2">
        <TextField
          className="w-full h-full "
          label={
            language === "en"
              ? translations.en.create_category_label
              : translations.vi.create_category_label
          }
          placeholder={
            language === "en"
              ? translations.en.create_category
              : translations.vi.create_category
          }
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          variant="standard"
        />
      </div>

      <div className="w-[18%] h-full flex items-end justify-center pb-1">
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <PlusCircle
            className="cursor-pointer text-slate-900"
            onClick={handleCreateCategory}
          />
        )}
      </div>
    </div>
  );
};

export default CreateCategory;
