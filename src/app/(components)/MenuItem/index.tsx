"use client";
import DeleteModal from "@/app/menu/components/DeleteModal";
import DetailDrawer from "@/app/menu/components/DetailDrawer";
import { translations } from "@/constants/language/translation";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Edit2, MoreVertical, MoreVerticalIcon, Trash } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

type Props = {
  language: string;
  accessToken: string;
  owner_id: number;
  restaurant_id: number;
  menu_item_id: string;
  menu_item_name: string;
  menu_item_image_url: string;
  menu_item_price: string;
};

const ItemMenu = ({
  language,
  accessToken,
  owner_id,
  restaurant_id,
  menu_item_id,
  menu_item_name,
  menu_item_image_url,
  menu_item_price,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDetailItemDrawer, setOpenDetailItemDrawer] =
    useState<boolean>(false);
  const [openUpdateItemModal, setOpenUpdateItemModal] =
    useState<boolean>(false);
  const [openDeleteItemModal, setOpenDeleteItemModal] =
    useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string>("");

  // handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    // setMenuCategory(id);
  };

  // handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    // setMenuCategory(null);
  };

  // toggle open detail drawer
  const toggleOpenDetailDrawer = () => {
    setOpenDetailItemDrawer(true);
  };
  // toggle close detail drawer
  const toggleCloseDetailDrawer = () => {
    setOpenDetailItemDrawer(false);
  };
  // handle open update item modal
  const handleOpenUpdateModal = (itemId: string) => {
    setOpenUpdateItemModal(true);
  };

  // delete modal
  const handleOpenDeleteModal = (itemId: string) => {
    setOpenDeleteItemModal(true);
    setDeleteItemId(itemId);
  };

  // handle menu close
  const handleCloseDeleteModal = () => {
    setOpenDeleteItemModal(false);
    setDeleteItemId("");
  };
  return (
    <div className="w-full h-[90%] max-h-full flex flex-col bg-gray-200 gap-2 items-center justify-center py-1 px-3 border-[1px] border-gray-400 rounded-md">
      <div className="h-[15%] w-full flex items-center justify-between border-b-[1px] border-slate-300">
        <span
          className="text-base md:text-lg font-semibold text-slate-900 pl-3 md:pl-5 cursor-pointer"
          onClick={toggleOpenDetailDrawer}
        >
          {menu_item_name}
        </span>
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e)}
          sx={{
            ":hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <MoreVerticalIcon size={18} className={`text-slate-900`} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: 100 }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem
            onClick={() => {
              handleOpenUpdateModal(menu_item_id);
            }}
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
            onClick={() => {
              handleOpenDeleteModal(menu_item_id);
            }}
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

      <img
        src={menu_item_image_url}
        alt="menu_item_image"
        className="w-[80%] md:w-[70%] h-[70%] max-h-[70%] object-scale-down cursor-pointer"
        onClick={toggleOpenDetailDrawer}
      />

      <span className="w-full h-[15%] text-base font-semibold text-slate-900 flex items-center justify-center">
        {language === "en"
          ? translations.en.price_item
          : translations.vi.price_item}{" "}
        {menu_item_price}
      </span>
      {/* Detail item drawer */}
      <DetailDrawer
        language={language}
        accessToken={accessToken}
        owner_id={owner_id}
        restaurant_id={restaurant_id}
        menu_item_id={menu_item_id}
        isOpen={openDetailItemDrawer}
        toggleClose={toggleCloseDetailDrawer}
      />
      {/* delete item modal */}
      <DeleteModal
        language={language}
        accessToken={accessToken}
        owner_id={owner_id}
        restaurant_id={restaurant_id}
        menu_item_id={deleteItemId}
        menu_item_name={menu_item_name}
        isOpen={openDeleteItemModal}
        handleClose={handleCloseDeleteModal}
      />
    </div>
  );
};

export default ItemMenu;
