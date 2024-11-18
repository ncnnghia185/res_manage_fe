"use client";
// package import
import React, { ChangeEvent, SyntheticEvent, useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { Image, Trash2, Upload, X } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import * as Yup from "yup";
// file import
import { CategoryData } from "@/services/apiResponse";
import { translations } from "@/constants/language/translation";
import { generateId } from "@/utils/utils";
import { Form, Formik } from "formik";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  language: string;
  accessToken: string;
  owner_id: number;
  restaurant_id: number;
  all_categories: CategoryData[];
};

const CreateModal = ({
  isOpen,
  handleClose,
  language,
  accessToken,
  owner_id,
  restaurant_id,
  all_categories,
}: Props) => {
  const [activeTab, setActiveTab] = useState("1");
  const [itemImage, setItemImage] = useState<string>("");
  const [itemCode, setItemCode] = useState<string>("");

  // generate item code
  useEffect(() => {
    if (isOpen) {
      const code = generateId("MMA");
      setItemCode(code);
    }
  }, [isOpen]);
  // handle change tab
  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  // handle image change
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setItemImage(imageUrl);
    }
  };
  const handleRemoveImage = () => {
    setItemImage("");
  };

  // validate general infor schema
  const validateGeneralSchema = Yup.object().shape({
    name: Yup.string().required(
      language === "en"
        ? translations.en.required_menu_item_name
        : translations.vi.required_menu_item_name
    ),
    category_id: Yup.number().required(
      language === "en"
        ? translations.en.required_menu_item_category
        : translations.vi.required_menu_item_category
    ),
    price: Yup.number().required(
      language === "en"
        ? translations.en.required_menu_item_price
        : translations.vi.required_menu_item_price
    ),
    description: Yup.string(),
  });

  // initial general infor values
  const initialGeneralValues = {
    code: itemCode,
    name: "",
    category_id: "",
    price: "",
    desctiption: "",
    owner_id: owner_id,
    restaurant_id: restaurant_id,
  };
  return (
    <Modal open={isOpen}>
      <Box
        sx={{
          width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" },
          position: "absolute",
          top: { xs: "10%", sm: "15%", md: "20%" },
          left: "50%",
          transform: "translate(-50%, -20%)",
          bgcolor: "#f1f2f6",
          boxShadow: 24,
          px: { xs: 2, sm: 3 },
          py: { xs: 1, sm: 2 },
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: { xs: "10px", sm: "15px" },
        }}
      >
        {/* Header */}
        <div className="h-20 w-full flex flex-col gap-2 justify-center items-center">
          {/* label */}
          <div className="h-10 w-full  border-gray-400 flex px-3 items-center justify-between">
            <div className="w-[95%] flex h-full items-center justify-center pl-14">
              <span className="text-lg font-semibold text-slate-950">
                {language === "en"
                  ? translations.en.create_menu_item_label
                  : translations.vi.create_menu_item_label}
              </span>
            </div>

            <X
              size={22}
              className="bg-red-500 hover:bg-red-600 cursor-pointer text-gray-100"
              onClick={handleClose}
            />
          </div>
          {/* tab change */}
          <div className="h-10 w-full flex flex-col px-3 items-start justify-center gap-1">
            <div>
              <Tabs
                value={activeTab}
                onChange={handleChangeTab}
                sx={{ height: "24px" }}
              >
                <Tab
                  label={
                    <span className="text-sm text-[#121212] font-semibold">
                      {language === "en"
                        ? translations.en.tab_general_info
                        : translations.vi.tab_general_info}
                    </span>
                  }
                  value="1"
                />
                <Tab
                  label={
                    <span className="text-sm text-[#121212] font-semibold">
                      {language === "en"
                        ? translations.en.tab_ingredient_info
                        : translations.vi.tab_ingredient_info}
                    </span>
                  }
                  value="2"
                />
              </Tabs>
            </div>
            <div className="h-[1px] w-full border-b-[1px] border-gray-400" />
          </div>
        </div>

        <div className="w-full h-72 max-h-96 mt-1">
          {/* general info tab content */}
          {activeTab === "1" && (
            <Formik
              initialValues={initialGeneralValues}
              validationSchema={validateGeneralSchema}
              onSubmit={() => {}}
            >
              {({ isSubmitting }) => (
                <Form className="h-full w-full flex flex-col lg:flex-row px-5 sm:pt-3 lg:pt-3 items-center lg:items-start justify-center gap-5 bg-blue-400"></Form>
              )}
            </Formik>
          )}
          {/* ingredient info tab content */}
          {activeTab === "2" && (
            <div className="h-full w-full flex flex-col bg-slate-400">
              this is tab ingredient info : {itemCode}
            </div>
          )}
        </div>

        {/* button */}
        <div className="w-full h-14  mt-2 flex items-center justify-end gap-2 pr-3">
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
      </Box>
    </Modal>
  );
};

export default CreateModal;
