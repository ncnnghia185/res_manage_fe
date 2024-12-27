"use client";
import BaseLayout from "@/app/(components)/BaseLayout";
import IconBreadcrumbs from "@/app/(components)/Breadcrumb";
import { translations } from "@/constants/language/translation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Layout, Plus, ShoppingCart } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { months } from "@/constants/months/months";
import "dayjs/locale/vi";
import { GetPurchasesSummaryByMonthResponse } from "@/services/apiResponse";
import { purchaseServices } from "@/services";
import AddBuyIngredients from "./components/BuyIngredients";
dayjs.locale("vi");

const BuyIngredientPage = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.global.language);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const accessToken = useAppSelector((state) => state.auth.user);
  const owner_id = useAppSelector((state) => state.auth.userId);
  const restaurant_id = useAppSelector(
    (state) => state.restaurant.selected_restaurant.id
  );
  const selectedRestaurantName = useAppSelector(
    (state) => state.restaurant.selected_restaurant.name
  );

  const [selectViewBy, setSelectViewBy] = useState<string>("month");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedMonth, setSelectedMonth] = useState<string>(
    dayjs().format("MM")
  );
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(dayjs());
  const [openAddBuyIngredients, setOpenAddBuyIngredients] =
    useState<boolean>(false);
  const breadcrumbItems = useMemo(
    () => [
      {
        label:
          language === "en"
            ? translations.en.dashboard
            : translations.vi.dashboard,
        href: "/dashboard",
        icon: Layout,
      },
      {
        label:
          language === "en"
            ? translations.en.ingredient_sub_side_link1
            : translations.vi.ingredient_sub_side_link1,
        href: "/buy-ingredients",
        icon: ShoppingCart,
      },
    ],
    [language]
  );

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (newValue: Dayjs | null) => {
    setSelectedYear(newValue);
  };

  const handleChangeViewBy = (event: SelectChangeEvent<string>) => {
    setSelectViewBy(event.target.value);
    setSelectedDate(dayjs());
    if (event.target.value === "month") {
      setSelectedMonth(dayjs().format("MM"));
      setSelectedYear(dayjs());
    }
  };

  if (selectViewBy === "day") {
    console.log("Selected Date: ", selectedDate?.format("DD/MM/YYYY"));
  } else if (selectViewBy === "month") {
    console.log("Selected Month: ", selectedMonth);
  } else console.log("Selected Year: ", selectedYear?.format("YYYY"));

  useEffect(() => {
    const fetchPurchaseSummaryByMonth = async () => {
      if (selectedYear) {
        const year = selectedYear.format("YYYY");
        const response: GetPurchasesSummaryByMonthResponse =
          await purchaseServices.getPurchaseSummaryByMonth(
            parseInt(selectedMonth),
            parseInt(year),
            owner_id,
            restaurant_id,
            accessToken
          );

        console.log("check response", response.data);
      }
    };
    fetchPurchaseSummaryByMonth();
  }, [selectedMonth, selectedYear, owner_id, restaurant_id, accessToken]);

  // handle open add buy ingredients
  const handleOpenAddBuyIngredients = () => {
    setOpenAddBuyIngredients(true);
  };
  return (
    <BaseLayout>
      <div className="h-[3%] md:h-[6%] w-full flex items-center px-3 z-10">
        <IconBreadcrumbs items={breadcrumbItems} darkTheme={isDarkMode} />
      </div>
      <div className="flex md:hidden w-full h-[3%] items-center justify-start px-3">
        <span className="text-lg font-bold uppercase text-slate-700">
          {language === "en"
            ? translations.en.add_ingredient_label
            : translations.vi.add_ingredient_label}
        </span>
      </div>

      <div className="h-[94%] max-h-[94%] w-full flex flex-col items-center gap-2 md:gap-2">
        <div className="hidden md:flex w-full h-[8%] items-center">
          <div className="h-full w-[50%] flex items-center justify-start">
            <span className="text-lg font-bold uppercase text-slate-700 pl-5">
              {language === "en"
                ? translations.en.add_ingredient_label
                : translations.vi.add_ingredient_label}
            </span>
          </div>
          <div className="h-full w-[50%] flex items-center justify-center gap-6">
            <span className="text-lg font-semibold text-slate-700">
              {language === "en" ? "View by" : "Xem theo"}
            </span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="h-full w-[70%] flex items-center justify-center gap-4">
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <Select
                    labelId="view-by-label"
                    value={selectViewBy}
                    onChange={handleChangeViewBy}
                  >
                    <MenuItem value="day">
                      {language === "en" ? "Day" : "Ngày"}
                    </MenuItem>
                    <MenuItem value="month">
                      {language === "en" ? "Month" : "Tháng"}
                    </MenuItem>
                    <MenuItem value="year">
                      {language === "en" ? "Year" : "Năm"}
                    </MenuItem>
                  </Select>
                </FormControl>

                {selectViewBy === "day" && (
                  <div className="h-5 w-40 flex items-center justify-center">
                    <DatePicker
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                      sx={{
                        m: 1,
                        minWidth: 150,
                        "& .MuiInputBase-root": {
                          height: 36,
                          width: 135,
                        },
                      }}
                    />
                  </div>
                )}

                {selectViewBy === "month" && (
                  <div className="flex gap-4 items-center justify-center">
                    <TextField
                      size="small"
                      value={selectedYear ? selectedYear.year().toString() : ""}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const year = event.target.value;
                        if (/^\d{4}$/.test(year)) {
                          setSelectedYear(dayjs(`${year}-01-01`));
                        } else if (year === "") {
                          setSelectedYear(null);
                        }
                      }}
                      sx={{ m: 1, width: 120 }}
                    />
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <Select
                        labelId="month-label"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                      >
                        {months[language].map((month) => (
                          <MenuItem key={month.value} value={month.value}>
                            {month.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}

                {selectViewBy === "year" && (
                  <DatePicker
                    views={["year"]}
                    value={selectedYear}
                    onChange={handleYearChange}
                    minDate={dayjs().subtract(10, "year")}
                    maxDate={dayjs().add(10, "year")}
                    sx={{
                      m: 1,
                      minWidth: 150,
                      "& .MuiInputBase-root": {
                        height: 36,
                        width: 120,
                      },
                    }}
                  />
                )}
              </div>
            </LocalizationProvider>
          </div>
        </div>
        <div className="w-full h-full md:h-[92%] flex flex-col">
          <div className="flex md:hidden h-[8%] w-full items-center justify-between px-5">
            <span className="text-lg font-semibold text-slate-700">
              {language === "en" ? "View by" : "Xem theo"}
            </span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="h-full w-[70%] flex items-center justify-center gap-4">
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <Select
                    labelId="view-by-label"
                    value={selectViewBy}
                    onChange={handleChangeViewBy}
                  >
                    <MenuItem value="day">
                      {language === "en" ? "Day" : "Ngày"}
                    </MenuItem>
                    <MenuItem value="month">
                      {language === "en" ? "Month" : "Tháng"}
                    </MenuItem>
                    <MenuItem value="year">
                      {language === "en" ? "Year" : "Năm"}
                    </MenuItem>
                  </Select>
                </FormControl>

                {selectViewBy === "day" && (
                  <div className="h-5 w-40 flex items-center justify-center">
                    <DatePicker
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                      sx={{
                        m: 1,
                        minWidth: 150,
                        "& .MuiInputBase-root": {
                          height: 36,
                          width: 135,
                        },
                      }}
                    />
                  </div>
                )}

                {selectViewBy === "month" && (
                  <div className="flex gap-4 items-center justify-center">
                    <TextField
                      size="small"
                      value={selectedYear ? selectedYear.year() : ""}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const year = event.target.value;
                        setSelectedYear(year ? dayjs(`${year}-01-01`) : null);
                      }}
                      sx={{ m: 1, width: 120 }}
                    />
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <Select
                        labelId="month-label"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                      >
                        {months[language].map((month) => (
                          <MenuItem key={month.value} value={month.value}>
                            {month.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}

                {selectViewBy === "year" && (
                  <DatePicker
                    views={["year"]}
                    value={selectedYear}
                    onChange={handleYearChange}
                    minDate={dayjs().subtract(10, "year")}
                    maxDate={dayjs().add(10, "year")}
                    sx={{
                      m: 1,
                      minWidth: 150,
                      "& .MuiInputBase-root": {
                        height: 36,
                        width: 120,
                      },
                    }}
                  />
                )}
              </div>
            </LocalizationProvider>
          </div>
          <div className="w-full h-[92%] md:h-full flex flex-col items-center justify-center">
            <div className="h-[92%] w-full flex overflow-y-auto scroll-container">
              {/* today purchase ingredient */}
              <div
                className={`w-full flex ${
                  openAddBuyIngredients
                    ? "h-[48%] flex-col"
                    : "h-[10%] flex-row"
                } items-center border-b-[1px] border-gray-900 `}
              >
                {openAddBuyIngredients ? (
                  <div className="h-full w-full flex">
                    <AddBuyIngredients
                      language={language}
                      owner_id={owner_id}
                      restaurant_id={restaurant_id}
                      accessToken={accessToken}
                      setOpenAddBuyIngredients={setOpenAddBuyIngredients}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                ) : (
                  <div
                    className={`h-full w-full flex items-center justify-center bg-gray-200`}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<Plus />}
                      sx={{
                        height: "32px",
                        width: "250px",
                        borderStyle: "dashed",
                        borderWidth: "2px",
                        borderColor: isDarkMode ? "#bdc3c7" : "#2c3e50",
                        color: isDarkMode ? "#ffffff" : "#121212",
                        ":hover": {
                          borderStyle: "dashed",
                          borderColor: "primary.dark",
                        },
                      }}
                      onClick={handleOpenAddBuyIngredients}
                    >
                      <span className="text-base font-semibold text-slate-900">
                        {language === "en"
                          ? translations.en.add_buy_ingredient
                          : translations.vi.add_buy_ingredient}
                      </span>
                    </Button>
                  </div>
                )}

                <div className={``}></div>
              </div>
              {/* purchase summary in month */}
              <div></div>
            </div>
            {/* pagination */}
            <div className="h-[8%] w-full flex bg-blue-600"></div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default BuyIngredientPage;
