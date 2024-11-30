import { v4 as uuidv4 } from "uuid";
import { translations } from "@/constants/language/translation";

// check extension of file image
export const checkImageFileValid = (file: File): boolean => {
  const allowExtensions = ["image/jpeg", "image/png"];
  return allowExtensions.includes(file.type);
};

// sort menu items
type SortByPrimer<T> = (value: T[keyof T]) => any;
export const sortMenuItems = (field: string, reverse: boolean, primer?: (value: any) => any) => {
  return (a: any, b: any) => {
    let comparison = 0;
    if (a[field] < b[field]) {
      comparison = -1;
    } else if (a[field] > b[field]) {
      comparison = 1;
    }

    // Nếu là sắp xếp theo giá, chuyển đổi thành số
    if (field === "price") {
      const priceA = parseFloat(a[field]);
      const priceB = parseFloat(b[field]);
      comparison = priceA < priceB ? -1 : priceA > priceB ? 1 : 0;
    }

    return reverse ? comparison * -1 : comparison;
  };
};


// pagination
export const paginationData = <T>(
  data: T[],
  page: number,
  itemsPerPage: number
) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
};

// get color and status
type TableStatusStyle = {
  color: string;
  text: string;
};
export const getTableStatusStyle = (
  status: string,
  language: string
): TableStatusStyle => {
  switch (status.toLowerCase()) {
    case "available":
      return {
        color: "#2ecc71",
        text:
          language === "en"
            ? translations.en.empty_table
            : translations.vi.empty_table,
      };
    case "serving":
      return {
        color: "#3498db",
        text:
          language === "en"
            ? translations.en.serving_table
            : translations.vi.serving_table,
      };
    case "reserved":
      return {
        color: "#f1c40f",
        text:
          language === "en"
            ? translations.en.reserved_table
            : translations.vi.reserved_table,
      };
    default:
      return { color: "gray", text: "Unknown" };
  }
};

// generate Id
export const generateId = (code: string) => {
  const uuid = uuidv4();
  const id = uuid.replace(/-/g, "").slice(0, 6);

  return `${code}-${id.toUpperCase()}`;
};

// format currency
export const formatCurrency = (amount:string, language:string) :string=>{
  const numericAmount = amount.replace(/[^0-9.]/g, '');
  if (language === 'en') {
    const [integerPart, decimalPart] = numericAmount.split('.'); 
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart.slice(0, 2)}` 
      : formattedInteger;
  } else if (language === 'vi') {
    const integerOnly = numericAmount.split('.')[0]; 
    return integerOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
  }

  return numericAmount;
}