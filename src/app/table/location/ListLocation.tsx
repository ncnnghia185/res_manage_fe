"use client";
import React, { useEffect, useState } from "react";
import { menuServices } from "@/services";
import {
  deselectAllCategories,
  setCategories,
  selectAllCategories,
  selectCategories,
} from "@/redux/menuState/categorySlice";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { translations } from "@/constants/language/translation";
import { Trash, Edit2, MoreVerticalIcon } from "lucide-react";
type props = {
  language: string;
};
const ListCategory = ({ language }: props) => {
  const dispatch = useAppDispatch();
  const { categories, selected_category } = useAppSelector(
    (state) => state.category
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // category state
  const [openUpdateCategoryModal, setOpenUpdateCategoryModal] = useState(false);
  const [updateCategoryId, setUpdateCategoryId] = useState<number | null>();
  const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>();
  const [menuCategory, setMenuCategory] = useState<number | null>(null);

  // fetch all categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await menuServices.getAllCategories();
        if (response.success === true) {
          dispatch(setCategories(response.data));
        } else {
          toast.error(
            language === "en"
              ? translations.en.error_list_categories
              : translations.vi.error_list_categories
          );
        }
      } catch (error) {
        toast.error(
          language === "en"
            ? translations.en.error_list_categories
            : translations.vi.error_list_categories
        );
      }
    };

    getCategories();
  }, [dispatch]);

  // check all children checked
  const isAllSelected =
    categories.length > 0 && selected_category.length === categories.length;

  // handle check "all"
  const handleAllCheck = () => {
    if (isAllSelected) {
      dispatch(deselectAllCategories());
    } else {
      dispatch(selectAllCategories());
    }
  };

  // handle check category
  const handleCheckCategory = (categoryId: number) => {
    dispatch(selectCategories(categoryId));
  };

  // handle menu open
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    categoryId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuCategory(categoryId);
  };
  // handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCategory(null);
    setUpdateCategoryId(null);
    setOpenUpdateCategoryModal(false);
  };
  // handle open update category modal
  const handleOpenUpdate = (categoryId: number) => {
    setOpenUpdateCategoryModal(true);
    setUpdateCategoryId(categoryId);
    setAnchorEl(null);
    setMenuCategory(null);
  };

  // handle open delete category modal
  const handleOpenDelete = (categoryId: number) => {
    setOpenDeleteCategoryModal(true);
    setDeleteCategoryId(categoryId);
    setAnchorEl(null);
    setMenuCategory(null);
  };
  // handle close modal
  const handleCloseUpdateModal = () => {
    setOpenUpdateCategoryModal(false);
    setUpdateCategoryId(null);
  };
  return (
    <div className="h-full w-full pl-2">
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox checked={isAllSelected} onChange={handleAllCheck} />
          }
          label={
            <span className="text-slate-800">
              {language === "en"
                ? translations.en.label_all_categories
                : translations.vi.label_all_categories}
            </span>
          }
        />
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center group justify-between"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected_category.includes(category.id)}
                  onChange={() => handleCheckCategory(category.id)}
                />
              }
              label={<span className="text-slate-800">{category.name}</span>}
              className="pl-4"
            />
            {/* Icon button to open menu */}
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, category.id)}
              className={` hover:text-slate-700 opacity-100`}
            >
              <MoreVerticalIcon size={18} />
            </IconButton>

            {/* Dropdown menu */}
            <Menu
              anchorEl={anchorEl}
              open={menuCategory === category.id}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: 100 }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => handleOpenUpdate(category.id)}
                className="bg-blue-300"
              >
                <ListItemIcon>
                  <Edit2 size={18} />
                </ListItemIcon>
                <ListItemText>
                  <span>
                    {language === "en"
                      ? translations.en.update
                      : translations.vi.update}
                  </span>
                </ListItemText>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <Trash size={18} />
                </ListItemIcon>
                <ListItemText>
                  <span>
                    {language === "en"
                      ? translations.en.delete
                      : translations.vi.delete}
                  </span>
                </ListItemText>
              </MenuItem>
            </Menu>
          </div>
        ))}
      </FormGroup>
    </div>
  );
};

export default ListCategory;
