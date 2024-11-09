// login success response
export interface AuthResponse{
	errCode: number,
	accessToken: string,
	userId: number
}



// restaurant api response
interface RestaurantData{
	id:number, 
	name: string
}
export interface AllRestaurantResponse{
	success: boolean,
	message: string,
	data: RestaurantData[]
}

interface successAddRestaurant{
	id:number,
	name:string,
	address:string,
	phone_number:string
}
export interface CreateRestaurantResponse{
	success: boolean,
  message: string,
  data: successAddRestaurant
}