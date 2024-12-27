import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

// select purchase summary by month
export const getPurchaseSummaryByMonth = async (month:number, year:number, owner_id:number, restaurant_id:number, accessToken:string) => {
    const response = await axios.get(`
        ${BASE_URL}/purchase/purchase-summary-by-month?month=${month}&year=${year}&owner_id=${owner_id}&restaurant_id=${restaurant_id}`,{
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
    return response.data
}

// select purchase summary by year
export const getPurchaseSummaryByYear = async (year:number, owner_id:number, restaurant_id:number, accessToken:string) => {
    const response = await axios.get(`
        ${BASE_URL}/purchase/purchase-summary-by-year?year=${year}&owner_id=${owner_id}&restaurant_id=${restaurant_id}`,{
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
    return response.data
}

// select purchase summary by date
export const getPurchaseSummaryByDate = async (date:string, owner_id:number, restaurant_id:number, accessToken:string) => {
    const response = await axios.get(`
        ${BASE_URL}/purchase/purchase-summary-by-date?date=${date}&owner_id=${owner_id}&restaurant_id=${restaurant_id}`,{
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
    return response.data
}

interface purchaseData {
	ingredient_name:string,
	quantity:number,
	unit:string,
	unit_price:number,
	note?:string
	total_purchase_item_price:number
}

interface PurchaseIngredientsData{
    date?:string,
    owner_id:number,
    restaurant_id:number,
    purchases:purchaseData[],
}

export const createPurchaseIngredients = async (data: PurchaseIngredientsData, accessToken:string) =>{
    const response = await axios.post(`${BASE_URL}/purchase/add-new`, data, {
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
    return response.data
}

