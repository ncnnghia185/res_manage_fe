import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

export interface orderDataType {
  id: string;
  table_id: number;
  order_time: string;
  customer_name: string;
  number_of_customer: number;
  order_status: string;
  notes?: string;
  owner_id: number;
  restaurant_id: number;
}
// create new order
export const createNewOrder = async (
  data: orderDataType,
  accessToken: string
) => {
  const response = await axios.post(`${BASE_URL}/orders/add-order`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// get order info
export const getServingOrderOfTable = async (table_id:number, owner_id:number, restaurant_id:number, accessToken:string) => {
  const response = await axios.get(`${BASE_URL}/orders/serving-order/${table_id}?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}
