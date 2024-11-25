"use client";
// package import
import React, {
  ChangeEvent,
  SyntheticEvent,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Select,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from "@mui/material";
import { Asterisk, Image, Info, Plus, Trash2, Upload, X } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import * as Yup from "yup";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
// file import
import {
  CategoryData,
  CreateMenuIngredientResponse,
  CreateMenuItemResponse,
} from "@/services/apiResponse";
import { translations } from "@/constants/language/translation";
import { generateId } from "@/utils/utils";
import { menuServices } from "@/services";
import { useAppDispatch } from "@/redux/store";
import { fetchAllMenuItems } from "@/redux/menuState/menuSlice";

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
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("1");
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [previewItemImage, setPreviewItemImage] = useState<string>("");
  const [itemCode, setItemCode] = useState<string>("");
  const [ingredientArrayLength, setIngredientArrayLength] = useState<number>(1);
  const [removedIndices, setRemovedIndices] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [originalCost, setOriginalCost] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

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
      setItemImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewItemImage(imageUrl);
    }
  };
  const handleRemoveImage = () => {
    setPreviewItemImage("");
  };

  // validate general infor schema
  const validateGeneralSchema = Yup.object().shape({
    id: Yup.string().required("Required"),
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
    price: Yup.string()
      .typeError(
        language === "en"
          ? translations.en.type_menu_item_price
          : translations.vi.type_menu_item_price
      )
      .required(
        language === "en"
          ? translations.en.required_menu_item_price
          : translations.vi.required_menu_item_price
      ),
    description: Yup.string(),
  });
  // initial general data
  const initialGeneralData = {
    id: itemCode,
    name: "",
    category_id: 0,
    price: "",
    description: "",
  };
  const {
    control: controlForm1,
    handleSubmit: handleSubmitForm1,
    setValue: setValueForm1,
    reset: resetForm1,
    formState: { errors: errorsForm1, touchedFields: touchedFieldsForm1 },
    getValues: getValuesForm1,
  } = useForm({
    defaultValues: initialGeneralData,
    resolver: yupResolver(validateGeneralSchema),
  });

  // validate ingredient schema
  const validateIngredientSchema = Yup.object().shape({
    ingredients: Yup.array().of(
      Yup.object().shape({
        ingredient_name: Yup.string(),
        quantity: Yup.number(),
        ingredient_unit: Yup.string(),
        cost_per_unit: Yup.number().positive(),
      })
    ),
  });
  // ingredient infor values
  const initialIngredientValues = {
    menu_item_id: itemCode,
    ingredients: [
      {
        ingredient_name: "",
        quantity: 0,
        ingredient_unit: "",
        cost_per_unit: 0,
      },
    ],
  };

  const {
    control: controlForm2,
    handleSubmit: handleSubmitForm2,
    setValue: setValueForm2,
    reset: resetForm2,
    formState: { errors: errorsForm2, touchedFields: touchedFieldsForm2 },
    getValues: getValuesForm2,
    watch,
  } = useForm({
    defaultValues: initialIngredientValues,
    resolver: yupResolver(validateIngredientSchema),
  });
  // handle add ingredient
  const handleAddIngredient = () => {
    const ingredients = getValuesForm2("ingredients") || [];
    ingredients.push({
      ingredient_name: "",
      quantity: 0,
      ingredient_unit: "",
      cost_per_unit: 0,
    });
    setValueForm2("ingredients", ingredients);
    setIngredientArrayLength((prev) => prev + 1);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 0);
  };
  // const handle remove ingredient
  const handleRemoveIngredient = (indexToRemove: number) => {
    // Thêm chỉ số vào mảng removedIndices
    setRemovedIndices((prev) => [...prev, indexToRemove]);

    // Lấy danh sách ingredients hiện tại từ form
    const ingredients = getValuesForm2("ingredients") || [];

    // Xóa ingredient tại vị trí indexToRemove
    const updatedIngredients = ingredients.filter(
      (_, index) => index !== indexToRemove
    );

    // Cập nhật lại danh sách ingredients trong form
    setValueForm2("ingredients", updatedIngredients);

    // Tính lại giá trị original cost sau khi xóa ingredient
    const validIngredients = updatedIngredients.filter(
      (ingredient) =>
        (ingredient.quantity ?? 0) > 0 && (ingredient.cost_per_unit ?? 0) > 0
    );
    calculateOriginalCost(validIngredients);
  };

  // calculate original cost
  const calculateOriginalCost = (
    ingredients: Array<{
      ingredient_name?: string;
      quantity?: number;
      ingredient_unit?: string;
      cost_per_unit?: number;
    }>
  ) => {
    const cost = ingredients.reduce((total, ingredient) => {
      const quantity = Number(
        ingredient.quantity !== undefined ? ingredient.quantity : 0
      );
      const costPerUnit = Number(
        ingredient.cost_per_unit !== undefined ? ingredient.cost_per_unit : 0
      );
      return total + quantity * costPerUnit;
    }, 0);
    setOriginalCost(cost);
  };
  const handleIngredientChange = (
    index: number,
    field: "ingredient_name" | "quantity" | "ingredient_unit" | "cost_per_unit",
    value: any
  ) => {
    // Cập nhật giá trị của field (quantity hoặc cost_per_unit) tại vị trí index
    setValueForm2(`ingredients.${index}.${field}`, value);

    // Lấy danh sách ingredients hiện tại từ form
    const ingredients = getValuesForm2("ingredients") || [];

    // Tính lại tổng giá trị originalCost
    calculateOriginalCost(ingredients);
  };
  useEffect(() => {
    const ingredients = watch("ingredients") || [];
    const validIngredients = ingredients.filter(
      (ingredient) =>
        (ingredient.quantity ?? 0) > 0 && (ingredient.cost_per_unit ?? 0) > 0
    );

    if (validIngredients.length > 0) {
      calculateOriginalCost(validIngredients);
    }
  }, [watch("ingredients")]);

  // handle submit form
  const handleCombinedSubmit = async () => {
    const generalFormData = getValuesForm1();
    const ingredientFormData = getValuesForm2();
    const generalData = {
      ...generalFormData,
      id: itemCode,
      image: itemImage ? itemImage : null,
      original_price: String(originalCost),
      owner_id: owner_id,
      restaurant_id: restaurant_id,
    };
    const ingredientData = {
      ...ingredientFormData,
      menu_item_id: itemCode,
      owner_id: owner_id,
      restaurant_id: restaurant_id,
    };
    setLoading(true);
    try {
      if (
        generalData.name === "" ||
        generalData.category_id === 0 ||
        generalData.price === "" ||
        generalData.image === null
      ) {
        toast.error(
          language === "en"
            ? translations.en.missing_required_data
            : translations.vi.missing_required_data
        );
        return;
      }
      const responseCreateGeneral: CreateMenuItemResponse =
        await menuServices.createMenuItem(generalData, "", accessToken);
      const responseCreateIngredient: CreateMenuIngredientResponse =
        await menuServices.createMenuItemIngredient(
          ingredientData,
          accessToken
        );
      if (
        responseCreateGeneral.success === true &&
        responseCreateIngredient.success === true
      ) {
        toast.success(
          language === "en"
            ? translations.en.success_create_menu_item
            : translations.vi.success_create_menu_item
        );
        dispatch(fetchAllMenuItems({ accessToken, owner_id, restaurant_id }));
        handleClose();
        setActiveTab("1");
        resetForm1(initialGeneralData);
        resetForm2(initialIngredientValues);
        setItemImage(null);
        setPreviewItemImage("");
        setOriginalCost(0);
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_create_menu_item
          : translations.vi.error_create_menu_item
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setActiveTab("1");
    resetForm1(initialGeneralData);
    resetForm2(initialIngredientValues);
    setItemImage(null);
    setPreviewItemImage("");
    setOriginalCost(0);
  };
  return (
    <Modal open={isOpen} sx={{ minWidth: 640 }}>
      <Box
        sx={{
          width: { xs: "100%", sm: "90%", md: "65%", lg: "50%" },
          position: "absolute",
          top: { xs: "20%", sm: "20%", md: "20%" },
          left: "50%",
          transform: "translate(-50%, -20%)",
          bgcolor: "#f1f2f6",
          boxShadow: 24,
          px: { xs: 2, sm: 3 },
          py: { xs: 1, sm: 2 },
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: { sm: "15px" },
        }}
      >
        {/* Header */}
        <div className="h-20 w-full flex flex-col gap-2 justify-center items-center">
          {/* label */}
          <div className="h-10 w-full border-gray-400 flex px-3 items-center justify-between">
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
              onClick={handleCloseModal}
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

        <div className="w-full h-80 md:h-80 max-h-96 mt-1">
          {/* general info tab content */}
          {activeTab === "1" && (
            <form
              className="h-full w-full flex px-2 items-center justify-center gap-5"
              onSubmit={handleSubmitForm1(handleCombinedSubmit)}
            >
              <div className="h-full w-[40%] flex flex-col py-3">
                <div className="h-[5%] flex items-center justify-center gap-1">
                  <span className="text-base font-semibold text-[#121212]">
                    {language === "en"
                      ? translations.en.menu_item_image
                      : translations.vi.menu_item_image}
                  </span>
                  <Tooltip
                    title={
                      language === "en"
                        ? translations.en.required_menu_data
                        : translations.vi.required_menu_data
                    }
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, -14],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    <Asterisk size={14} color="#e74c3c" />
                  </Tooltip>
                </div>
                <div className="h-[80%] w-full flex items-center justify-center">
                  <PhotoProvider>
                    {previewItemImage ? (
                      <div className="relative flex">
                        <PhotoView src={previewItemImage}>
                          <img
                            src={previewItemImage}
                            alt="Uploaded Preview"
                            style={{
                              width: "200px",
                              height: "200px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                              cursor: "pointer",
                            }}
                          />
                        </PhotoView>
                        <IconButton
                          onClick={handleRemoveImage}
                          sx={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            backgroundColor: "#dfe6e9",
                            "&:hover": {
                              backgroundColor: "#bdc3c7",
                            },
                          }}
                        >
                          <Trash2 size={20} color="#FF5A5F" />
                        </IconButton>
                      </div>
                    ) : (
                      <Box
                        sx={{
                          width: { sm: "180px", md: "200px" },
                          height: { sm: "180px", md: "200px" },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #bdc3c7",
                          borderRadius: "8px",
                          color: "#636e72",
                          gap: "5px",
                        }}
                      >
                        <Image size={32} />
                        <span className="text-lg">
                          {language === "en"
                            ? translations.en.no_item_image
                            : translations.vi.no_item_image}
                        </span>
                      </Box>
                    )}
                  </PhotoProvider>
                </div>

                {/* button upload */}
                <div className="h-[15%] w-full flex items-center justify-center">
                  <Button
                    variant="text"
                    component="label"
                    sx={{
                      width: "60%",
                      ":hover": {
                        backgroundColor: "#bdc3c7",
                      },
                    }}
                    startIcon={<Upload size={16} color="#121212" />}
                  >
                    <span className="text-sm text-[#121212] pt-1">
                      {language === "en"
                        ? translations.en.upload_image_menu
                        : translations.vi.upload_image_menu}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </Button>
                </div>
              </div>

              <div className="h-full w-[60%] flex flex-col gap-1 ">
                {/* item code */}
                <div className="flex-1 flex gap-3 items-center justify-start h-full">
                  <span className="w-[35%] md:w-[25%] text-base text-[#121212] font-semibold pb-2">
                    {language === "en"
                      ? translations.en.menu_item_code
                      : translations.vi.menu_item_code}
                  </span>
                  <Controller
                    name="id"
                    control={controlForm1}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="flex-1 h-full"
                        disabled
                        variant="standard"
                        value={itemCode}
                      />
                    )}
                  />
                </div>
                {/* item name */}
                <div className="flex-1 flex h-full gap-3 items-center justify-start">
                  <div className="w-[35%] md:w-[25%] flex items-start justify-start gap-1">
                    <span className=" text-base font-semibold text-[#121212]">
                      {language === "en"
                        ? translations.en.menu_item_name
                        : translations.vi.menu_item_name}
                    </span>
                    <Tooltip
                      title={
                        language === "en"
                          ? translations.en.required_menu_data
                          : translations.vi.required_menu_data
                      }
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -14],
                              },
                            },
                          ],
                        },
                      }}
                    >
                      <Asterisk size={14} color="#e74c3c" />
                    </Tooltip>
                  </div>
                  <Controller
                    name="name"
                    control={controlForm1}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="flex-1 h-full"
                        variant="standard"
                        placeholder={
                          language === "en"
                            ? translations.en.placeholder_menu_item_name
                            : translations.vi.placeholder_menu_item_name
                        }
                      />
                    )}
                  />
                </div>
                {/* item category */}
                <div className="flex-1 flex h-full gap-3 items-center justify-start">
                  <div className="w-[35%] md:w-[25%] flex items-start justify-start gap-1">
                    <span className=" text-base font-semibold text-[#121212]">
                      {language === "en"
                        ? translations.en.menu_item_category
                        : translations.vi.menu_item_category}
                    </span>
                    <Tooltip
                      title={
                        language === "en"
                          ? translations.en.required_menu_data
                          : translations.vi.required_menu_data
                      }
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -14],
                              },
                            },
                          ],
                        },
                      }}
                    >
                      <Asterisk size={14} color="#e74c3c" />
                    </Tooltip>
                  </div>
                  <Controller
                    name="category_id"
                    control={controlForm1}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""}
                        className="flex-1 h-10 mb-2 md:mb-4"
                        variant="standard"
                      >
                        <MenuItem value="" disabled>
                          {language === "en"
                            ? translations.en.category_menu
                            : translations.vi.category_menu}
                        </MenuItem>
                        {all_categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                {/* item price */}
                <div className="flex-1 h-full flex gap-3 items-center justify-start">
                  <div className="w-[35%] md:w-[25%] flex items-start justify-start gap-1">
                    <span className=" text-base font-semibold text-[#121212]">
                      {language === "en"
                        ? translations.en.menu_item_price
                        : translations.vi.menu_item_price}
                    </span>
                    <Tooltip
                      title={
                        language === "en"
                          ? translations.en.required_menu_data
                          : translations.vi.required_menu_data
                      }
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -14],
                              },
                            },
                          ],
                        },
                      }}
                    >
                      <Asterisk size={14} color="#e74c3c" />
                    </Tooltip>
                  </div>
                  <Controller
                    name="price"
                    control={controlForm1}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        className="flex-1 h-full"
                        variant="standard"
                        placeholder={
                          language === "en"
                            ? translations.en.placeholder_menu_item_price
                            : translations.vi.placeholder_menu_item_price
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {language === "en" ? (
                                <span className="text-base font-semibold">
                                  $
                                </span>
                              ) : (
                                <span className="text-base font-semibold">
                                  &#8363;
                                </span>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </div>

                {/* item description */}
                <div className="flex-[2] flex flex-col h-full">
                  <span className="w-full h-10 text-start pt-3 text-base font-semibold text-[#121212]">
                    {language === "en"
                      ? translations.en.menu_item_description
                      : translations.vi.menu_item_description}
                  </span>
                  <Controller
                    name="description"
                    control={controlForm1}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="flex-1"
                        multiline
                        rows={2}
                        placeholder={
                          language === "en"
                            ? translations.en.placeholder_menu_item_description
                            : translations.vi.placeholder_menu_item_description
                        }
                      />
                    )}
                  />
                </div>
              </div>
            </form>
          )}

          {/* ingredient info tab content */}
          {activeTab === "2" && (
            <form
              className="h-full w-full flex flex-col gap-1 px-4 pt-2"
              onSubmit={handleSubmitForm2(handleCombinedSubmit)}
            >
              {/* item code */}
              <div className="h-10 md:h-12 w-full flex items-center justify-start">
                <span className="w-[30%] font-semibold text-base text-[#121212]">
                  {language === "en"
                    ? translations.en.menu_item_code
                    : translations.vi.menu_item_code}
                </span>
                <TextField
                  name="menu_item_id"
                  className="h-full"
                  value={itemCode}
                  disabled
                  variant="standard"
                />
              </div>

              {/* item ingredients */}
              <div className="h-60 flex flex-col">
                <div className="w-full h-8 flex items-start justify-start">
                  <span className="font-semibold text-base text-[#121212]">
                    {language === "en"
                      ? translations.en.ingredient_menu_item
                      : translations.vi.ingredient_menu_item}
                  </span>
                </div>
                <div className="h-52 max-h-52 flex flex-col w-full gap-2">
                  <div
                    className="flex-1 w-full min-h-0 max-h-52 overflow-y-auto grid grid-cols-1 gap-1 scroll-container"
                    ref={scrollRef}
                  >
                    {Array.from({ length: ingredientArrayLength })
                      .map((_, index) => index)
                      .filter((index) => !removedIndices.includes(index))
                      .map((index) => (
                        <div
                          key={index}
                          className="w-full h-[81px] flex items-end justify-center gap-1"
                        >
                          <div className="h-full flex-1 grid grid-cols-4 gap-1">
                            {/* ingredient name */}
                            <div className="h-full w-full flex flex-col justify-center pl-2">
                              <span className="text-base font-semibold text-[#121212]">
                                {language === "en"
                                  ? translations.en.ingredient_menu_item_name
                                  : translations.vi.ingredient_menu_item_name}
                              </span>
                              <Controller
                                name={`ingredients.${index}.ingredient_name`}
                                control={controlForm2}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    variant="standard"
                                    value={field.value || ""}
                                  />
                                )}
                              />
                            </div>
                            {/* ingredient quantity */}
                            <div className="h-full w-full flex flex-col justify-center pl-2">
                              <span className="text-base font-semibold text-[#121212]">
                                {language === "en"
                                  ? translations.en
                                      .ingredient_menu_item_quantity
                                  : translations.vi
                                      .ingredient_menu_item_quantity}
                              </span>
                              <Controller
                                name={`ingredients.${index}.quantity`}
                                control={controlForm2}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    variant="standard"
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      handleIngredientChange(
                                        index,
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                  />
                                )}
                              />
                            </div>
                            {/* ingredient unit */}
                            <div className="h-full w-full flex flex-col justify-center pl-2">
                              <span className="text-base font-semibold text-[#121212]">
                                {language === "en"
                                  ? translations.en.ingredient_menu_item_unit
                                  : translations.vi.ingredient_menu_item_unit}
                              </span>
                              <Controller
                                name={`ingredients.${index}.ingredient_unit`}
                                control={controlForm2}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    variant="standard"
                                    value={field.value || ""}
                                  />
                                )}
                              />
                            </div>
                            {/* cost per unit */}
                            <div className="h-full w-full flex flex-col justify-center pl-2">
                              <span className="text-base font-semibold text-[#121212]">
                                {language === "en"
                                  ? translations.en
                                      .ingredient_menu_item_cost_per_unit
                                  : translations.vi
                                      .ingredient_menu_item_cost_per_unit}
                              </span>
                              <Controller
                                name={`ingredients.${index}.cost_per_unit`}
                                control={controlForm2}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    variant="standard"
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      handleIngredientChange(
                                        index,
                                        "cost_per_unit",
                                        e.target.value
                                      )
                                    }
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <Tooltip
                            title={
                              language === "en"
                                ? translations.en.button_remove_ingredient
                                : translations.vi.button_remove_ingredient
                            }
                          >
                            <Trash2
                              size={18}
                              color="#FF5A5F"
                              className="cursor-pointer ml-2 mb-5"
                              onClick={() => handleRemoveIngredient(index)}
                            />
                          </Tooltip>
                        </div>
                      ))}
                  </div>
                  <div className="h-6 w-full flex items-center justify-center">
                    <Button
                      variant="text"
                      endIcon={<Plus color="#121212" size={18} />}
                      onClick={handleAddIngredient}
                    >
                      <span className="text-base capitalize text-[#121212]">
                        {language === "en"
                          ? translations.en.button_add_ingredient
                          : translations.vi.button_add_ingredient}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* item original price */}
              <div className="h-10 md:h-12 w-full flex items-center justify-start">
                <div className="w-[30%] h-full flex items-start justify-start gap-1">
                  <span className="pt-3 font-semibold text-base text-[#121212]">
                    {language === "en"
                      ? translations.en.original_menu_item_price
                      : translations.vi.original_menu_item_price}
                  </span>
                  <Tooltip
                    title={
                      language === "en"
                        ? translations.en.info_original_price_tooltip
                        : translations.vi.info_original_price_tooltip
                    }
                    arrow
                    placement="top-start"
                  >
                    <Info
                      size={12}
                      className="text-[#121212] cursor-pointer mt-2"
                    />
                  </Tooltip>
                </div>
                <TextField
                  variant="standard"
                  id="total_price"
                  name="total_price"
                  value={originalCost}
                  disabled
                />
              </div>
            </form>
          )}
        </div>

        {/* button */}
        <div className="w-full h-14 mt-2 flex items-center justify-end gap-2 pr-3">
          <button
            className="w-28 h-10 bg-blue-500 border rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
            type="button"
            onClick={handleCombinedSubmit}
            disabled={loading}
          >
            {loading && (
              <CircularProgress
                size="18px"
                sx={{
                  color: "#ecf0f1",
                }}
              />
            )}
            <span className="text-base font-bold text-gray-100">
              {language === "en"
                ? translations.en.save_update
                : translations.vi.save_update}
            </span>
          </button>
          <button
            className="w-28 h-10 bg-red-500 border rounded-md hover:bg-red-600"
            onClick={handleCloseModal}
          >
            <span className="text-base font-bold text-gray-100">
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
