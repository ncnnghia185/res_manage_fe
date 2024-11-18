import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API

interface loginDataType  {
	username:string,
	password:string
}

interface registerDataType{
	email: string,
	fullname: string,
	phone: string,
	password: string
}
export const loginAccount = async (data:loginDataType) =>{
	const response = await axios.post(`${BASE_URL}/owner/login-account`, data, {
	})
	
	return response.data
}

export const registerAccount = async(data: registerDataType) =>{
	const response = await axios.post(`${BASE_URL}/owner/register-account`, data)
	return response.data
}