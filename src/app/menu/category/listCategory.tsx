"use client";
import React, { useEffect, useState } from "react";
import { menuServices } from "@/services";
import {
  deselectAllCategories,
  selectAllCategories,
  selectCategories,
  fetchAllCategories,
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
import UpdateCategoryModal from "./updateCategoryModal";
import { GetAllCategoriesResponse } from "@/services/apiResponse";
type props = {
  language: string;
  owner_id: number;
  restaurant_id: number;
  accessToken: string;
};
const ListCategory = ({
  language,
  owner_id,
  restaurant_id,
  accessToken,
}: props) => {
  const dispatch = useAppDispatch();
  const { all_categories, selected_category } = useAppSelector(
    (state) => state.category
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // category state
  const [openUpdateCategoryModal, setOpenUpdateCategoryModal] = useState(false);
  const [updateCategoryId, setUpdateCategoryId] = useState<number>();
  const [currentCategoryName, setCurrentCategoryName] = useState<string>();
  const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>();
  const [menuCategory, setMenuCategory] = useState<number | null>(null);

  // fetch all categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        dispatch(fetchAllCategories({ accessToken, owner_id, restaurant_id }));
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
    all_categories.length > 0 &&
    selected_category.length === all_categories.length;

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
    setUpdateCategoryId(0);
    setOpenUpdateCategoryModal(false);
  };
  // handle open update category modal
  const handleOpenUpdate = (categoryId: number, categoryName: string) => {
    setOpenUpdateCategoryModal(true);
    setUpdateCategoryId(categoryId);
    setCurrentCategoryName(categoryName);
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
    setUpdateCategoryId(0);
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
        {all_categories.map((category) => (
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
                onClick={() => handleOpenUpdate(category.id, category.name)}
                sx={{
                  ":hover": {
                    backgroundColor: "#ecf0f1",
                  },
                }}
              >
                <ListItemIcon>
                  <Edit2 size={18} color="#3498db" />
                </ListItemIcon>
                <ListItemText>
                  <span className="font-base font-semibold">
                    {language === "en"
                      ? translations.en.update
                      : translations.vi.update}
                  </span>
                </ListItemText>
              </MenuItem>
              <MenuItem
                onClick={handleMenuClose}
                sx={{
                  ":hover": {
                    backgroundColor: "#ecf0f1",
                  },
                }}
              >
                <ListItemIcon>
                  <Trash size={18} color="#e74c3c" />
                </ListItemIcon>
                <ListItemText>
                  <span className="font-base font-semibold">
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

      <UpdateCategoryModal
        isOpen={openUpdateCategoryModal}
        category_id={updateCategoryId}
        category_name={currentCategoryName}
        handleClose={handleCloseUpdateModal}
        language={language}
        owner_id={owner_id}
        restaurant_id={restaurant_id}
        accessToken={accessToken}
      />
    </div>
  );
};

export default ListCategory;
