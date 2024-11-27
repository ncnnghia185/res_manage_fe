"use client";
import React, { useEffect, useState } from "react";
import { tableServices } from "@/services";

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
import {
  selectAllLocations,
  selectLocations,
  deselectAllLocations,
  fetchAllLocations,
} from "@/redux/tableState/locationSlice";
import UpdateLocationModal from "./UpdateLocationModal";
import { updateLocationName } from "@/services/table/tableServices";
import DeleteLocationModal from "./DeleteLocationModal";
type props = {
  language: string;
  accessToken: string;
  owner_id: number;
  restaurant_id: number;
};
const ListLocation = ({
  language,
  accessToken,
  owner_id,
  restaurant_id,
}: props) => {
  const dispatch = useAppDispatch();
  const { all_locations, selected_locations } = useAppSelector(
    (state) => state.location
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // category state
  const [openUpdateLocationModal, setOpenUpdateLocationModal] = useState(false);
  const [updateLocationId, setUpdateLocationId] = useState<number>();
  const [currentLocationName, setCurrentLocationName] = useState<string>();
  const [openDeleteLocationModal, setOpenDeleteLocationModal] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState<number>();
  const [menuCategory, setMenuCategory] = useState<number | null>(null);

  // fetch all categories
  useEffect(() => {
    const getLocations = async () => {
      if (owner_id == null || restaurant_id == null) {
        return;
      }
      try {
        dispatch(fetchAllLocations({ accessToken, owner_id, restaurant_id }));
      } catch (error) {
        toast.error(
          language === "en"
            ? translations.en.error_list_locations
            : translations.vi.error_list_locations
        );
      }
    };

    getLocations();
  }, [dispatch]);

  // check all children checked
  const isAllSelected =
    all_locations.length > 0 &&
    selected_locations.length === all_locations.length;

  // handle check "all"
  const handleAllCheck = () => {
    if (isAllSelected) {
      dispatch(deselectAllLocations());
    } else {
      dispatch(selectAllLocations());
    }
  };

  // handle check location
  const handleCheckLocation = (locationId: number) => {
    dispatch(selectLocations(locationId));
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
    setUpdateLocationId(0);
    setOpenUpdateLocationModal(false);
  };
  // handle open update category modal
  const handleOpenUpdate = (locationId: number, locationName: string) => {
    setOpenUpdateLocationModal(true);
    setUpdateLocationId(locationId);
    setCurrentLocationName(locationName);
    setAnchorEl(null);
    setMenuCategory(null);
  };

  // handle open delete category modal
  const handleOpenDelete = (locationId: number) => {
    setOpenDeleteLocationModal(true);
    setDeleteLocationId(locationId);
    setAnchorEl(null);
    setMenuCategory(null);
  };
  // handle close modal
  const handleCloseDeleteModal = () => {
    setOpenDeleteLocationModal(false);
    setDeleteLocationId(0);
  };
  // handle close modal
  const handleCloseUpdateModal = () => {
    setOpenUpdateLocationModal(false);
    setUpdateLocationId(0);
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
                ? translations.en.label_all_location
                : translations.vi.label_all_location}
            </span>
          }
        />
        {all_locations.map((location) => (
          <div
            key={location.id}
            className="flex items-center group justify-between"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected_locations.includes(location.id)}
                  onChange={() => handleCheckLocation(location.id)}
                />
              }
              label={<span className="text-slate-800">{location.name}</span>}
              className="pl-4"
            />
            {/* Icon button to open menu */}
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, location.id)}
              className={`hover:text-slate-700 opacity-100`}
            >
              <MoreVerticalIcon size={18} />
            </IconButton>

            {/* Dropdown menu */}
            <Menu
              anchorEl={anchorEl}
              open={menuCategory === location.id}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: 100 }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => handleOpenUpdate(location.id, location.name)}
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
                onClick={() => handleOpenDelete(location.id)}
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

      <UpdateLocationModal
        isOpen={openUpdateLocationModal}
        handleClose={handleCloseUpdateModal}
        owner_id={owner_id}
        restaurant_id={restaurant_id}
        accessToken={accessToken}
        location_id={updateLocationId}
        location_name={currentLocationName}
        language={language}
      />

      <DeleteLocationModal
        isOpen={openDeleteLocationModal}
        handleClose={handleCloseDeleteModal}
        language={language}
        owner_id={owner_id}
        restaurant_id={restaurant_id}
        accessToken={accessToken}
        location_id={deleteLocationId}
      />
    </div>
  );
};

export default ListLocation;
