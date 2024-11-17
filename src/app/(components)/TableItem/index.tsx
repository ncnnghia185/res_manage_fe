"use client";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Edit2, MoreVerticalIcon, Trash } from "lucide-react";
import React, { useState } from "react";
import { SiAirtable } from "react-icons/si";
import { FaCircle } from "react-icons/fa";
import { translations } from "@/constants/language/translation";
import { getTableStatusStyle } from "@/utils/utils";
import DeleteTable from "@/app/table/components/DeleteModal";
import UpdateTable from "@/app/table/components/UpdateModal";
import { LocationData } from "@/services/apiResponse";

type Props = {
  language: string;
  table_id: number;
  table_name: string;
  table_status: string;
  all_locations: LocationData[];
  table_location: string;
};

const TableItem = ({
  language,
  table_id,
  table_name,
  table_status,
  all_locations,
  table_location,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuCategory, setMenuCategory] = useState<number | null>(null);
  const [openUpdateMenuModal, setOpenUpdateMenuModal] = useState(false);
  const [updateTableId, setUpdateTableId] = useState<number>(0);
  const [openDeleteMenuModal, setOpenDeleteMenuModal] = useState(false);
  const [deleteTableId, setDeleteTableId] = useState<number>(0);
  // update modal
  const handleOpenUpdateModal = (tableId: number) => {
    setOpenUpdateMenuModal(true);
    setUpdateTableId(tableId);
    setAnchorEl(null);
    setMenuCategory(null);
  };
  const handleCloseUpdateModal = () => {
    setOpenUpdateMenuModal(false);
    setUpdateTableId(0);
    setAnchorEl(null);
    setMenuCategory(null);
  };
  // delete modal
  const handleOpenDeleteModal = (tableId: number) => {
    setOpenDeleteMenuModal(true);
    setDeleteTableId(tableId);
  };
  const handleCloseDeleteModal = () => {
    setOpenDeleteMenuModal(false);
    setDeleteTableId(0);
  };
  // handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setMenuCategory(id);
  };

  // handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCategory(null);
  };

  const { color, text } = getTableStatusStyle(table_status, language);
  return (
    <div className="w-[90%]  flex flex-col gap-1 px-4 py-2 border rounded-md border-slate-300">
      <div className="h-12 w-full flex items-center justify-between px-3">
        <div className="h-full flex flex-col gap-1">
          <span className="text-base font-semibold text-slate-900">
            {table_name}
          </span>
          <div className="flex items-center gap-2">
            <FaCircle size={10} color={color} />
            <span className={`text-sm font-semibold text-slate-900`}>
              {text}
            </span>
          </div>
        </div>
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, table_id)}
          className={`hover:text-slate-700 opacity-100`}
        >
          <MoreVerticalIcon size={18} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl && menuCategory === table_id)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: 100 }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem
            onClick={() => {
              handleOpenUpdateModal(table_id);
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
              handleOpenDeleteModal(table_id);
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
      <div className="flex-grow w-full flex items-center justify-center">
        <SiAirtable size={150} color="#bdc3c7" className="cursor-pointer" />
      </div>
      <div className="h-10 w-full flex items-center justify-center">
        <span className="text-base font-semibold text-slate-900">
          {table_location}
        </span>
      </div>

      {/* update modal */}
      <UpdateTable
        isOpen={openUpdateMenuModal}
        handleClose={handleCloseUpdateModal}
        tableId={updateTableId}
        tableName={table_name}
        language={language}
        all_locations={all_locations}
      />
      {/* delete modal */}
      <DeleteTable
        isOpen={openDeleteMenuModal}
        handleClose={handleCloseDeleteModal}
        tableId={deleteTableId}
        tableName={table_name}
        language={language}
      />
    </div>
  );
};

export default TableItem;
