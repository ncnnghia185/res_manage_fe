"use client";
import { TextField } from "@mui/material";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { translations } from "@/constants/language/translation";
import { tableServices } from "@/services";
import { useAppDispatch } from "@/redux/store";
import { addLocation } from "@/redux/tableState/locationSlice";
import { CreateLocationResponse } from "@/services/apiResponse";
type Props = {
  language: string;
  accessToken: string;
  owner_id: number;
  restaurant_id: number;
};

const CreateLocation: React.FC<Props> = ({
  language,
  accessToken,
  owner_id,
  restaurant_id,
}) => {
  const [locationName, setLocationName] = useState("");
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  // handle create category
  const handleCreateCategory = async () => {
    setLoading(true);
    try {
      const data = {
        name: locationName,
        owner_id: owner_id,
        restaurant_id: restaurant_id,
      };
      const response: CreateLocationResponse =
        await tableServices.createLocation(data, accessToken);
      if (response.success === true) {
        toast.success(
          language === "en"
            ? translations.en.success_add_new_location
            : translations.vi.success_add_new_location
        );
        setLocationName("");
        dispatch(addLocation(response.data));
      } else {
        toast.error(
          language === "en"
            ? translations.en.error_add_new_location
            : translations.vi.error_add_new_location
        );
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_add_new_location
          : translations.vi.error_add_new_location
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
              ? translations.en.create_location_label
              : translations.vi.create_location_label
          }
          placeholder={
            language === "en"
              ? translations.en.create_location_placeholder
              : translations.vi.create_location_placeholder
          }
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
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

export default CreateLocation;
