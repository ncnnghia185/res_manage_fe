import React, { useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { updateModal } from "@/constants/customUI/box_modal";
import { translations } from "@/constants/language/translation";
import { tableServices } from "@/services";
import { UpdateLocationResponse } from "@/services/apiResponse";
import { useAppDispatch } from "@/redux/store";
import { fetchAllLocations } from "@/redux/tableState/locationSlice";
import { fetchAllTables } from "@/redux/tableState/tableSlice";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  owner_id: number;
  location_id?: number;
  location_name?: string;
  restaurant_id: number;
  language: string;
  accessToken: string;
};

function UpdateLocationModal({
  isOpen,
  handleClose,
  owner_id,
  location_id,
  restaurant_id,
  location_name,
  language,
  accessToken,
}: Props) {
  const dispatch = useAppDispatch();
  const [newLocationName, setNewLocationName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // handle close and reset input
  const handleCloseModal = () => {
    setNewLocationName("");
    handleClose();
  };
  // const handle update
  const handleUpdateLocation = async () => {
    setLoading(true);
    try {
      const data = {
        name: newLocationName,
      };
      const response: UpdateLocationResponse =
        await tableServices.updateLocationName(
          owner_id,
          restaurant_id,
          accessToken,
          data,
          location_id
        );
      if (response.success === true) {
        toast.success(
          language === "en"
            ? translations.en.success_update_location
            : translations.vi.success_update_location
        );
        setNewLocationName("");
        dispatch(fetchAllLocations({ accessToken, owner_id, restaurant_id }));
        dispatch(fetchAllTables({ accessToken, owner_id, restaurant_id }));
        handleClose();
      } else {
        setNewLocationName("");
        toast.error(
          language === "en"
            ? translations.en.error_update_location
            : translations.vi.error_update_location
        );
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.success_update_location
          : translations.vi.success_update_location
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal open={isOpen} onClose={handleCloseModal}>
      <Box sx={updateModal}>
        {/* Header */}
        <div className="h-10 w-full border-b-[1px] border-[#bdc3c7] flex px-3 items-center justify-between">
          <span className="text-lg font-semibold text-[#121212]">
            {language === "en"
              ? translations.en.update_location_label
              : translations.vi.update_location_label}
          </span>
          <X
            size={22}
            className="bg-[#ef4444] hover:bg-[#dc2626] cursor-pointer text-[#f3f4f6]"
            onClick={handleClose}
          />
        </div>

        {/* Contents */}
        <div className="h-12 w-full flex items-center justify-center mt-2">
          <TextField
            onChange={(e) => setNewLocationName(e.target.value)}
            placeholder={location_name}
            variant="standard"
            id="name"
            value={newLocationName}
            label={
              language === "en"
                ? translations.en.update_location_placeholder
                : translations.vi.update_location_placeholder
            }
            className="w-[80%] placeholder:italic"
          />
        </div>

        {/* Footer */}
        <div className="w-full h-14  mt-2 flex items-center justify-end gap-2 pr-3">
          <button
            className="w-28 h-10 bg-[#3b82f6] border rounded-md hover:bg-[#0891b2]"
            type="submit"
            onClick={handleUpdateLocation}
          >
            <span className="text-base font-bold text-[#f1f5f9]">
              {language === "en"
                ? translations.en.save_update
                : translations.vi.save_update}
            </span>
          </button>
          <button
            className="w-28 h-10 bg-[#ef4444] border rounded-md hover:bg-[#dc2626]"
            onClick={handleCloseModal}
          >
            <span className="text-base font-bold text-[#f1f5f9]">
              {language === "en"
                ? translations.en.cancel_update
                : translations.vi.cancel_update}
            </span>
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default UpdateLocationModal;
