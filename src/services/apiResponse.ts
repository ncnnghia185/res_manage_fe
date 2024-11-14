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

// location api response

export interface LocationData{
	id:number,
	name:string,
	active:boolean
}
export interface GetAllLocationResponse{
	success: boolean,
	message: string,
  data: LocationData[]
}
export interface CreateLocationResponse{
	success: boolean,
  message: string,
  data: LocationData
}

export interface UpdateLocationResponse{
	success:boolean,
	message: string
}

// table api response
export interface TableData{
	id:number,
	name:string,
	status:string,
	location_id:number,
	location_name:string,
}
export interface OneTableData{
	id:number,
	name:string,
	location_id:number,
	type:string,
	capacity:number,
	location_name:string
}
export interface CreateTableResponse{
	success:boolean,
	message:string
}
export interface GetAllTablesResponse{
	success: boolean,
  message: string,
  data: TableData[]
}
export interface GetOneTableInfor{
	success:boolean,
	message: string,
  data: OneTableData
}
export interface UpdateTableInforResponse{
	success:true,
	message:string
}
export interface DeleteTableResponse{
	success:true,
	message:string
}