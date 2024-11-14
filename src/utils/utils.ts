import { translations } from "@/constants/language/translation";

// check extension of file image
export const checkImageFileValid = (file: File): boolean => {
  const allowExtensions = ["image/jpeg", "image/png"];
  return allowExtensions.includes(file.type);
};

// sort menu items
type SortByPrimer<T> = (value: T[keyof T]) => any;
export const sortMenuItems = <T>(
  field: keyof T,
  reverse: boolean,
  primer?: SortByPrimer<T>
): ((a: T, b: T) => number) => {
  const key = primer ? (x: T) => primer(x[field]) : (x: T) => x[field];

  const order = reverse ? -1 : 1;

  return (a: T, b: T): number => {
    const aValue = key(a);
    const bValue = key(b);
    return order * (aValue > bValue ? 1 : aValue < bValue ? -1 : 0);
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
export const getTableStatusStyle = (status:string, language:string):TableStatusStyle =>{
  switch(status.toLowerCase()){
    case "available":
      return {color:"#2ecc71", text: language === "en" ? translations.en.empty_table : translations.vi.empty_table}
    case "serving":
      return {color:"#3498db", text: language === "en" ? translations.en.serving_table : translations.vi.serving_table}
    case "reserved":
      return {color:"#f1c40f", text: language === "en" ? translations.en.reserved_table : translations.vi.reserved_table}
    default:
      return { color: "gray", text: "Unknown" };
  }
}