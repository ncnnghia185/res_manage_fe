"use client";
import { Edit, Info, Plus, Save, XIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/vi";
import { Button, CircularProgress, TextField, Tooltip } from "@mui/material";
import { translations } from "@/constants/language/translation";
import { formatCurrency, formatInputCurrency } from "@/utils/utils";
import { toast } from "react-toastify";
import { CreatePurchaseIngredientsResponse } from "@/services/apiResponse";
import { purchaseServices } from "@/services";
dayjs.locale("vi");

interface IngredientData {
  ingredient_name: string;
  quantity: number;
  unit: string;
  unit_price: string;
  note?: string;
  total_purchase_item_price: string;
}
type Props = {
  language: string;
  owner_id: number;
  restaurant_id: number;
  accessToken: string;
  setOpenAddBuyIngredients: (isOpen: boolean) => void;
  isDarkMode: boolean;
};

const AddBuyIngredients = ({
  language,
  owner_id,
  restaurant_id,
  accessToken,
  setOpenAddBuyIngredients,
  isDarkMode,
}: Props) => {
  const [purchaseDate, setPurchaseDate] = useState<Dayjs | null>(dayjs());
  const [purchaseIngredients, setPurchaeIngredients] = useState<
    IngredientData[]
  >([
    {
      ingredient_name: "",
      quantity: 0,
      unit: "",
      unit_price: "",
      note: "",
      total_purchase_item_price: "",
    },
  ]);
  const [purchaseDataRow, setPurchaseDataRow] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  // handle add purchase row
  const handleAddPurchaseRow = () => {
    const newRow = purchaseDataRow + 1;
    const newRowData: IngredientData = {
      ingredient_name: "",
      quantity: 0,
      unit: "",
      unit_price: "",
      note: "",
      total_purchase_item_price: "",
    };
    setPurchaeIngredients([...purchaseIngredients, newRowData]);
    setPurchaseDataRow(newRow);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [purchaseIngredients]);

  const handleInputChange = (
    index: number,
    field: keyof IngredientData,
    value: string | number
  ) => {
    const updatedIngredients = [...purchaseIngredients];

    // Xác định rõ kiểu của field trước khi gán giá trị
    if (
      field === "ingredient_name" ||
      field === "unit" ||
      field === "note" ||
      field === "unit_price" ||
      field === "total_purchase_item_price"
    ) {
      updatedIngredients[index][field] = value as string;
    } else if (field === "quantity") {
      updatedIngredients[index][field] = value as number;
    }
    const quantity = updatedIngredients[index].quantity || 0;
    const unitPrice = Number(
      updatedIngredients[index].unit_price.replace(/\./g, "") || 0
    );

    updatedIngredients[index].total_purchase_item_price = (
      quantity * unitPrice
    ).toLocaleString("vi-VN");
    setPurchaeIngredients(updatedIngredients);
  };

  const handleRemoveRow = (index: number) => {
    const updatedIngredients = purchaseIngredients.filter(
      (_, i) => i !== index
    );
    setPurchaeIngredients(updatedIngredients);
    setPurchaseDataRow((prev) => prev - 1);
  };

  // handle create purchase ingredients
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        owner_id,
        restaurant_id,
        date: purchaseDate?.format("DD/MM/YYYY"),
        purchases: purchaseIngredients.map((ingredient) => ({
          ingredient_name: ingredient.ingredient_name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          unit_price: parseFloat(ingredient.unit_price),
          note: ingredient.note,
          total_purchase_item_price: parseFloat(
            ingredient.total_purchase_item_price
          ),
        })),
      };
      const response: CreatePurchaseIngredientsResponse =
        await purchaseServices.createPurchaseIngredients(data, accessToken);
      if (response.success === true) {
        toast.success(
          language === "en"
            ? translations.en.success_create_purchase_ingredients
            : translations.vi.success_create_purchase_ingredients
        );
        if (purchaseDate) {
          purchaseServices.getPurchaseSummaryByMonth(
            purchaseDate?.month() + 1,
            purchaseDate?.year(),
            owner_id,
            restaurant_id,
            accessToken
          );
        }

        setOpenAddBuyIngredients(false);
        setPurchaeIngredients([
          {
            ingredient_name: "",
            quantity: 0,
            unit: "",
            unit_price: "",
            note: "",
            total_purchase_item_price: "",
          },
        ]);
        setPurchaseDataRow(1);
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? translations.en.error_create_purchase_ingredients
          : translations.vi.error_create_purchase_ingredients
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <XIcon
        className="absolute right-3 top-1 w-7 h-7 cursor-pointer text-red-500 hover:text-red-600"
        onClick={() => {
          setOpenAddBuyIngredients(false);
        }}
      />
      <div className="w-full h-[18%] flex items-center gap-5">
        <div className="h-full w-[40%] md:w-[50%] flex items-center justify-start pl-5 gap-5">
          <span className="text-base font-semibold text-slate-900">
            {language === "en" ? "Purchase date" : "Ngày mua"}
          </span>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="h-5 w-40 flex items-center justify-center">
              <DatePicker
                value={purchaseDate}
                onChange={(newValue) => setPurchaseDate(newValue)}
                format="DD/MM/YYYY"
                sx={{
                  m: 1,
                  minWidth: 150,
                  "& .MuiInputBase-root": {
                    height: 32,
                    width: 140,
                  },
                }}
              />
            </div>
          </LocalizationProvider>
        </div>
        <div className="h-full w-[60%] md:w-[50%] flex items-center gap-5">
          <div className="h-full w-[25%] md:w-[14%] flex items-center relative">
            <Tooltip
              title={
                language === "en"
                  ? translations.en.tooltip_infor_amount
                  : translations.vi.tooltip_infor_amount
              }
              placement="right"
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -8],
                      },
                    },
                  ],
                },
              }}
            >
              <Info
                className="absolute top-2 right-3"
                size={15}
                color="#121212"
              />
            </Tooltip>

            <span className="text-base font-semibold text-slate-900">
              {language === "en" ? "Total" : "Tổng tiền"}
            </span>
          </div>
          <div className="h-full w-[75%] md:w-[86%] flex items-center">
            <span className="text-base font-semibold text-slate-900">123</span>
          </div>
        </div>
      </div>
      <div className="w-full h-[82%] flex flex-col items-center">
        <div className="w-full h-[82%] max-h-[82%] flex flex-col pl-3 md:px-8 gap-2 ">
          <div className="w-full h-[18%] flex gap-[6px] md:gap-5">
            <div className="h-full flex-[1.5] md:flex-1 flex items-center justify-center border-b-[1px] border-gray-500">
              <span className="text-base font-semibold text-slate-900">
                {language === "en" ? "Name" : "Nguyên liệu"}
              </span>
            </div>
            <div className="h-full flex-[0.75] md:flex-1 flex items-center justify-center border-b-[1px] border-gray-500">
              <span className="text-base font-semibold text-slate-900">
                {language === "en" ? "Quantity" : "Số lượng"}
              </span>
            </div>
            <div className="h-full flex-[0.75] md:flex-1 flex items-center justify-center border-b-[1px] border-gray-500">
              <span className="text-base font-semibold text-slate-900">
                {language === "en" ? "Unit" : "Đơn vị"}
              </span>
            </div>
            <div className="h-full flex-1 flex items-center justify-center border-b-[1px] border-gray-500">
              <span className="text-base font-semibold text-slate-900">
                {language === "en" ? "Price/Unit" : "Giá tiền"}
              </span>
            </div>
            <div className="h-full flex-1 flex items-center justify-center border-b-[1px] border-gray-500">
              <span className="text-base font-semibold text-slate-900">
                {language === "en" ? "Amount" : "Tổng"}
              </span>
            </div>
            <div className="h-full flex-[0.5] md:flex-[0.25] flex items-center justify-center"></div>
          </div>

          <div
            className="w-full h-[82%] max-h-56 flex flex-col gap-2 overflow-y-auto scroll-container"
            ref={scrollContainerRef}
          >
            <div className="w-full flex-grow flex flex-col items-center gap-3">
              {purchaseIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="w-full h-16 flex gap-[6px] md:gap-5 relative"
                >
                  <div className="h-full flex-[1.5] md:flex-1 flex items-center justify-center">
                    <TextField
                      variant="standard"
                      size="small"
                      value={ingredient.ingredient_name}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "ingredient_name",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="h-full flex-[0.75] md:flex-1 flex items-center justify-center">
                    <TextField
                      variant="standard"
                      size="small"
                      value={ingredient.quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          handleInputChange(
                            index,
                            "quantity",
                            value === "" ? 0 : parseFloat(value)
                          );
                        }
                      }}
                    />
                  </div>
                  <div className="h-full flex-[0.75] md:flex-1 flex items-center justify-center">
                    <TextField
                      variant="standard"
                      size="small"
                      value={ingredient.unit}
                      onChange={(e) =>
                        handleInputChange(index, "unit", e.target.value)
                      }
                    />
                  </div>
                  <div className="h-full flex-1 flex items-center justify-center">
                    <TextField
                      variant="standard"
                      size="small"
                      value={ingredient.unit_price}
                      onChange={(e) => {
                        const formattedValue = formatInputCurrency(
                          e.target.value
                        );
                        handleInputChange(index, "unit_price", formattedValue);
                      }}
                    />
                  </div>
                  <div className="h-full flex-1 flex items-center justify-center">
                    <TextField
                      variant="standard"
                      size="small"
                      // })()}
                      value={ingredient.total_purchase_item_price}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/\./g, "");
                        handleInputChange(
                          index,
                          "total_purchase_item_price",
                          cleanValue
                        );
                      }}
                    />
                  </div>
                  <div className="h-full flex-[0.5] md:flex-[0.25] flex items-center justify-start">
                    <Tooltip
                      title={language === "en" ? "Note" : "Ghi chú"}
                      placement="bottom"
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -10],
                              },
                            },
                          ],
                        },
                      }}
                    >
                      <Edit size={18} className="cursor-pointer" />
                    </Tooltip>
                  </div>

                  <XIcon
                    className="absolute top-0 right-2 md:right-0 text-red-500 cursor-pointer"
                    size={20}
                    onClick={() => handleRemoveRow(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full h-[18%] flex items-center justify-center gap-10">
          <Button
            variant="outlined"
            startIcon={<Save size={18} />}
            sx={{
              height: "28px",
              width: "150px",
              bgcolor: "#3498db",
              borderColor: "#2980b9",
              color: "#ffffff",
            }}
            onClick={handleSubmit}
          >
            <span className="text-base font-semibold text-[#ffffff] capitalize">
              {language === "en" ? "Save" : "Lưu"}
            </span>
          </Button>

          <Button
            variant="outlined"
            startIcon={loading === false && <Plus size={18} />}
            sx={{
              height: "28px",
              width: "150px",
              bgcolor: "#2ecc71",
              borderColor: "#27ae60",
              color: "#ffffff",
            }}
            onClick={handleAddPurchaseRow}
          >
            {loading ? (
              <CircularProgress size="25px" />
            ) : (
              <span className="text-base font-semibold text-[#ffffff] capitalize">
                {language === "en" ? "Add Row" : "Thêm hàng"}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddBuyIngredients;
