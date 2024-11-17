import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;
import { checkImageFileValid } from "@/utils/utils";

// CATEGORY NEW DATA TYPES
interface categoryDataType {
  name: string;
  owner_id:number,
  restaurant_id:number
}

// MENU NEW DATA TYPES
interface menuDataType {
  image: File;
}
// CATEGORIES APIS
// create new category
export const createCategory = async (
  data: categoryDataType, accessToken:string
) => {
  const response = await axios.post(
    `${BASE_URL}/categories/add-category`,
    data,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
// get all categories
export const getAllCategories = async (accessToken:string,owner_id?:number, restaurant_id?:number) => {
  const response = await axios.get(`${BASE_URL}/categories/all-categories?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// get one category
export const getCategoryDetail = async (id: any) => {
  const response = await axios.get(`${BASE_URL}/categories/infor/${id}`);
  return response.data;
};
export const updateCategoryName = async (owner_id: number,
  restaurant_id: number,
  accessToken: string,
  data: any,
  category_id?: number) =>{
    const response = await axios.put(
      `${BASE_URL}/categories/update/${category_id}?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

// MENU APIS
// create new menu
export const createMenu = async (data: menuDataType, errorMessage: string) => {
  if (data.image && !checkImageFileValid(data.image)) {
    throw new Error(errorMessage);
  }
  const response = await axios.post(`${BASE_URL}/menu/add-item`, data);
  return response.data;
};

// get all menu
export const getAllMenu = async () => {
  const response = await axios.get(`${BASE_URL}/menu/all-item`);
  return response.data;
};

// get one menu item
export const getMenuDetail = async (id: any) => {
  const response = await axios.get(`${BASE_URL}/menu/item/${id}`);
  return response.data;
};

// update menu item
export const updateMenuItem = async (id: any, data: any) => {
  const response = await axios.put(`${BASE_URL}/menu/update/${id}`, data);
  return response.data;
};

// delete menu item
export const deleteMenuItem = async (id: any) => {
  const response = await axios.delete(`${BASE_URL}/menu/item/${id}`);
  return response.data;
};
