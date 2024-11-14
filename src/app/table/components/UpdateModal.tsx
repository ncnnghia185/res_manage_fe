"use client";
// package import
import { Box, MenuItem, Modal, TextField } from "@mui/material";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// file import
import { updateModal } from "@/constants/customUI/box_modal";
import { translations } from "@/constants/language/translation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  GetOneTableInfor,
  LocationData,
  OneTableData,
  UpdateTableInforResponse,
} from "@/services/apiResponse";
import { tableServices } from "@/services";
import { fetchAllTables } from "@/redux/tableState/tableSlice";
type Props = {
  isOpen: boolean;
  handleClose: () => void;
  tableId: number;
  tableName: string;
  language: string;
  all_locations: LocationData[];
};

const UpdateTable = ({
  isOpen,
  handleClose,
  tableId,
  tableName,
  language,
  all_locations,
}: Props) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.user);
  const owner_id = useAppSelector((state) => state.auth.userId);
  const restaurant_id = useAppSelector(
    (state) => state.restaurant.selected_restaurant.id
  );
  const [selectedTable, setSelectedTable] = useState<OneTableData>();
  const [loading, setLoading] = useState<boolean>(false);
  // fetch current table infor
  useEffect(() => {
    const getTableInfo = async () => {
      if (tableId === 0) return;
      const response: GetOneTableInfor = await tableServices.getOneTableInfor(
        accessToken,
        tableId,
        owner_id,
        restaurant_id
      );
      if (response.success === true) {
        setSelectedTable(response.data);
      } else {
        toast.error(
          language === "en"
            ? translations.en.error_get_table_info
            : translations.vi.error_get_table_info
        );
      }
    };
    getTableInfo();
  }, [isOpen && tableId !== 0]);
  // initial value
  const initialValues = {
    name: selectedTable?.name || "",
    location_id: selectedTable?.location_id || "",
    capacity: selectedTable?.capacity || "",
    type: selectedTable?.type || "",
  };

  // handle submit
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const updateValues = Object.entries(values).reduce(
        (changes, [key, value]) => {
          if (value !== initialValues[key as keyof typeof initialValues]) {
            changes[key as keyof typeof initialValues] = value as
              | string
              | undefined;
          }
          return changes;
        },
        {} as Partial<typeof initialValues>
      );
      if (Object.keys(updateValues).length > 0) {
        const response: UpdateTableInforResponse =
          await tableServices.updateOneTableInfo(
            accessToken,
            tableId,
            updateValues,
            owner_id,
            restaurant_id
          );
        if (response.success === true) {
          toast.success(
            language === "en"
              ? translations.en.success_update_table
              : translations.vi.success_update_table
          );
          dispatch(fetchAllTables({ accessToken, owner_id, restaurant_id }));
          handleClose();
        } else {
          toast.error(
            language === "en"
              ? translations.en.error_update_table
              : translations.vi.error_update_table
          );
        }
      } else {
        toast.info(
          language === "en"
            ? translations.en.no_changes_made
            : translations.vi.no_changes_made
        );
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_update_table
          : translations.vi.error_update_table
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen}>
      <Box sx={updateModal}>
        {/* Header */}
        <div className="h-10 w-full border-b-[1px] border-gray-400 flex px-3 items-center justify-between">
          <span className="text-lg font-semibold text-slate-950">
            {language === "en"
              ? translations.en.update_table_label
              : translations.vi.update_table_label}
          </span>
          <X
            size={22}
            className="bg-red-500 hover:bg-red-600 cursor-pointer text-gray-100"
            onClick={handleClose}
          />
        </div>

        {/* Contents */}
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="w-full mt-5 gap-5 h-auto ">
              {/* table name */}
              <div className="mb-5 flex flex-col w-full items-center justify-center h-12">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-slate-900 text-base font-bold">
                      {language === "en"
                        ? translations.en.table_name
                        : translations.vi.table_name}
                    </span>
                  </div>
                  <Field
                    as={TextField}
                    className=" h-12 w-[65%]  py-2 px-3 text-gray-700 "
                    id="name"
                    name="name"
                    type="text"
                    label={
                      language === "en"
                        ? translations.en.table_name
                        : translations.vi.table_name
                    }
                    placeholder={selectedTable?.name}
                    size="small"
                    variant="standard"
                  />
                </div>
                {errors.name && touched.name && (
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>

              {/* table location */}
              <div className="mb-5 flex flex-col w-full items-center justify-center h-12">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-slate-900 text-base font-bold">
                      {language === "en"
                        ? translations.en.table_location
                        : translations.vi.table_location}
                    </span>
                  </div>
                  <Select
                    className=" h-12 w-[65%] py-2  text-gray-700 "
                    id="location_id"
                    name="location_id"
                    defaultValue={selectedTable?.location_id.toString()}
                    value={values.location_id?.toString()}
                    label={
                      language === "en"
                        ? translations.en.table_location
                        : translations.vi.table_location
                    }
                    variant="standard"
                    onChange={(e: SelectChangeEvent) =>
                      setFieldValue("location_id", e.target.value)
                    }
                  >
                    {all_locations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                {errors.location_id && touched.location_id && (
                  <ErrorMessage
                    name="location_id"
                    component="div"
                    className="text-red-500 text-sm mb-2 pl-7"
                  />
                )}
              </div>

              {/* table capacity */}
              <div className="mb-5 flex flex-col w-full items-center justify-center h-12">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-slate-900 text-base font-bold">
                      {language === "en"
                        ? translations.en.table_capacity
                        : translations.vi.table_capacity}
                    </span>
                  </div>
                  <Select
                    className=" h-12 w-[65%] py-2 text-gray-700 "
                    id="capacity"
                    name="capacity"
                    defaultValue={selectedTable?.capacity.toString()}
                    value={values.capacity?.toString()}
                    label={
                      language === "en"
                        ? translations.en.table_capacity
                        : translations.vi.table_capacity
                    }
                    onChange={(e: SelectChangeEvent) => {
                      setFieldValue("capacity", e.target.value);
                    }}
                    size="small"
                    variant="standard"
                  >
                    <MenuItem value="6">
                      {language === "en"
                        ? translations.en.capacity_six
                        : translations.vi.capacity_six}
                    </MenuItem>
                    <MenuItem value="10">
                      {language === "en"
                        ? translations.en.capacity_ten
                        : translations.vi.capacity_ten}
                    </MenuItem>
                  </Select>
                </div>
                {errors.capacity && touched.capacity && (
                  <ErrorMessage
                    name="capacity"
                    component="div"
                    className="text-red-500 text-sm mb-2 pl-5"
                  />
                )}
              </div>

              {/* table type */}
              <div className="mb-5 flex flex-col w-full items-center justify-center h-12">
                <div className="w-full flex items-center justify-center gap-2">
                  <div className="w-[25%] h-8 flex items-end">
                    <span className="text-slate-900 text-base font-bold">
                      {language === "en"
                        ? translations.en.table_type
                        : translations.vi.table_type}
                    </span>
                  </div>
                  <Select
                    className=" h-12 w-[65%] py-2 text-gray-700 "
                    id="type"
                    name="type"
                    defaultValue={selectedTable?.type.toString()}
                    value={values.type}
                    label={
                      language === "en"
                        ? translations.en.table_type
                        : translations.vi.table_type
                    }
                    onChange={(e: SelectChangeEvent) => {
                      setFieldValue("type", e.target.value);
                    }}
                    size="small"
                    variant="standard"
                  >
                    <MenuItem value="vip">VIP (Bàn VIP)</MenuItem>
                    <MenuItem value="regular">Regular (Bàn thường)</MenuItem>
                  </Select>
                </div>
                {errors.type && touched.type && (
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />
                )}
              </div>

              {/* Footer */}
              <div className="w-full h-12 flex items-center justify-end gap-8 pr-10 pt-3">
                <button
                  className="w-28 h-10 bg-green-500 border rounded-md hover:bg-green-600"
                  type="submit"
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
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default UpdateTable;
