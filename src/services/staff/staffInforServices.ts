import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

export interface StaffInfoData{
    id:string,
    fullname:string,
    gender:string,
    date_of_birth:string,
    phone_number:string,
    address:string,
    identification_card:string,
    hire_date:string,
    net_salary:string,
    staff_type:string,
    position:string,
    owner_id:number,
    restaurant_id:number
}

export const createNewStaffInfo = async (data:StaffInfoData, accessToken:string) => {
    const response = await axios.post(`${BASE_URL}/staff/add-staff`,data,{
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    })
    return response.data
}
// get all staffs
export const getAllStaff = async (owner_id:number, restaurant_id:number, accessToken:string) => {
    const response = await axios.get(`${BASE_URL}/staff/all-staffs?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    })
    return response.data
}
// get one staff info
export const getOneStaffInfo = async (staff_id:string, owner_id:number, restaurant_id:number, accessToken:string) =>{
    const response = await axios.get(`${BASE_URL}/staff/infor/${staff_id}?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    })

    return response.data
}

// delete one staff
export const deleteStaff = async(staff_id:string, owner_id:number, restaurant_id:number, accessToken:string) =>{
    const response = await axios.delete(`${BASE_URL}/staff/delete/${staff_id}?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    })
    return response.data
}