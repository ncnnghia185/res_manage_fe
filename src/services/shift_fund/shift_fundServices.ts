import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

interface OpenShiftFundDataType{
	id:string,
	shift_date:string,
	open_time:string,
	open_cash:string,
	notes:string,
	owner_id:number,
	restaurant_id:number
}
// create open shift fund
export const createOpenShiftFund = async (data:OpenShiftFundDataType, accessToken:string) =>{
	const response = await axios.post(`${BASE_URL}/shift-fund/open-shift-fund`,data,{
		headers:{
			"Content-Type":"application/json",
			"Authorization": `Bearer ${accessToken}`
		}
	})

	return response.data
}

interface CloseShiftFundDataType{
	end_time:string,
	close_cash:string,
	total_revenue:string,
	expenses:string
}
// update end shift fund
export const updateCloseShiftFund = async (shiftId:string, data:CloseShiftFundDataType, owner_id:number, restaurant_id:number, accessToken:string) => {
	const response = await axios.put(`${BASE_URL}/shift-fund/close-shift-fund/${shiftId}?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,data,{
		headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${accessToken}`
    }
	})

	return response.data
}

// update shift fund notes
export const updateShiftFundNotes = async (shiftId:string, data:{notes:string}, owner_id:number, restaurant_id:number, accessToken:string) =>{
	const response = await axios.put(`${BASE_URL}/shift-fund/update-notes/${shiftId}?owner_id+${owner_id}&restaurant_id=${restaurant_id}`,data,{
		headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${accessToken}`
    }
	})

	return response.data
}

// get shift fund by date
export const getShiftFundByDate = async (date:string, owner_id:number, restaurant_id:number, accessToken:string) =>{
	const response = await axios.get(`${BASE_URL}/shift-fund/daily-shift-fund/${date}?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,{
		headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${accessToken}`
    }
	})
	return response.data
}

// get detail shift fund by id
export const getDetailShiftFundById = async (shiftId:string, owner_id:number, restaurant_id:number,accessToken:string) => {
	const response = await axios.get(`${BASE_URL}/shift-fund/detail-shift-fund/${shiftId}?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,{
		headers:{
				"Content-Type":"application/json",
				"Authorization": `Bearer ${accessToken}`
			}
		})
  return response.data

}

