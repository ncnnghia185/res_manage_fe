import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

interface OrderItemData{
    item_id:string,
    item_name:string,
    item_quantity:number,
    item_price:number,
    total_item_price:number
}
export interface OrderDetailData {
    owner_id:number,
    restaurant_id:number
    data:OrderItemData[],
}

// create new order detail
export const createNewOrderDetail = async(orderId:string, table_id:number,data:OrderDetailData, accessToken:string) =>{
    const response = await axios.post(`${BASE_URL}/order-details/add-order-details/${orderId}/${table_id}`,data,{
        headers:{
            "Content-Type":"application/json",
            "Authorization" :`Bearer ${accessToken}`
        }
    })
    return response.data
}