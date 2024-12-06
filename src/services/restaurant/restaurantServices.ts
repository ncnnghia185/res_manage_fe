import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API

export interface restaurantDataType{
	name: string,
	address:string,
	phone_number:string,
	owner_id?:number
}
// create new restaurant
export const createNewRestaurant = async(data: restaurantDataType, accessToken:string)=>{
	const response = await axios.post(`${BASE_URL}/restaurant/add-infor`, data, {
		headers: { Authorization: `Bearer ${accessToken}` },
	})
	return response.data
}

// get restaurant information
export const getRestaurantInfo = async (res_id:number, owner_id:number,accessToke:string) =>{
	const response = await axios.get(`${BASE_URL}/restaurant/restaurant-infor/${res_id}?owner_id=${owner_id}`,{
		headers:{
      Authorization: `Bearer ${accessToke}`
    }
	})
	return response.data
}

// get all restaurant of owner
export const getAllRestaurants = async(owner_id:number) =>{
	const response = await axios.get(`${BASE_URL}/restaurant/all-restaurant-name/${owner_id}`)
	return response.data
}