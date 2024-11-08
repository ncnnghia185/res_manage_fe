// check extension of file image
export const checkImageFileValid = (file: File): boolean => {
  const allowExtensions = ["image/jpeg", "image/png"];
  return allowExtensions.includes(file.type);
};

// filter menu items
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
