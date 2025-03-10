// login success response
export interface AuthResponse{
	errCode: number,
	accessToken: string,
	userId: number
}
export interface ResgisterResponse{
	success:boolean,
	message:string
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

export interface GetCurrentRestaurantResponse{
	success:boolean,
	message:string,
	data:{
		id:number,
		name:string,
    address:string,
    phone_number:string,
		image?:string,
		description?:string,
    owner_id:number
	}
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

export interface GetCountTablesOfLocationResponse{
	success:boolean,
	message:string,
	data:number
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

export interface DeleteLocationResponse {
	success:boolean,
	message:string
}

// table api response
export interface TableData{
	id:number,
	name:string,
	status:string,
	location_id:number,
	location_name:string,
	type:string
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

// category api response
export interface CategoryData{
	id:number,
	name:string
}
export interface GetAllCategoriesResponse{
	success:boolean,
	message:string,
	data: CategoryData[]
}
export interface GetCountItemsOfCategory{
	success:boolean,
	message:string,
	data:number
}
export interface CreateCategoryResponse{
	success:boolean,
	message:string,
	data: CategoryData
}

export interface UpdateCategoryResponse{
  success: boolean,
  message: string
}

export interface DeleteCategoryResponse{
	success: boolean,
	message: string
}

// menu api response
export interface MenuItemData{
	id:string,
	name:string,
	image:string,
	price:string,
	category_id:number
} 
export interface GetAllMenuItemResponse{
	success:boolean,
	message:string,
	data: MenuItemData[]
}

export interface CreateMenuItemResponse{
	success: boolean,
  message: string,
}

export interface CreateMenuIngredientResponse{
	success:boolean,
	message:string
}

export interface DeleteMenuItemResponse{
	success:boolean,
	message:string
}

export interface GeneralItemInfo{
	id:string,
	name:string,
	price:string,
	image:string,
	description?:string,
	original_cost:string
	category_id:number
}

export interface IngredientsInfo{
	ingredient_name: string | null,
  quantity: number | null,
  ingredient_unit: string | null, 
  cost_per_unit: number | null
}

export interface GetMenuItemDetailResponse{
	success:boolean,
	message:string,
	data: {
		generalInfo: GeneralItemInfo,
    ingredients: IngredientsInfo[]
	}
}

// shift fund api response
export interface CreateShiftFundResponse{
	success:boolean,
	message:string,
}
export interface OpenShiftFundData{
	id:string,
	shift_date:string,
	open_time:string,
	end_time:string,
	open_cash:string,
	close_cash:string,
	total_revenue:string,
	expenses:string,
	notes:string
}
export interface GetDailyOpenShiftFundResponse{
	success:boolean,
	message:string,
	data:OpenShiftFundData[]
}
export interface GetDetailShiftFund{
	success:boolean,
	message:string,
	data: OpenShiftFundData
}
export interface UpdateEndShiftFund{
	success:boolean,
	message:string
}
export interface UpdateShiftFundNotesResponse{
	success:boolean,
	message:string
}

// order api response
export interface CreateOrderResponse{
	success: boolean,
    message: string,
	data:{
		orderId:string,
		tableId:number
	}
}
export interface OrderInfoData{
	id:string,
	table_id:number,
	order_time:string,
	total_amout:number,
	order_status:string,
	notes:string,
	status_payment:string,
	customer_name:string,
	number_of_customer:string,
	total_amount:number,
	payment_type:string,

}
export interface GetOrderInfo{
	success:boolean,
	message:string,
	data:OrderInfoData
}

// order details response 
export interface CreateOrderDetailResponse{
	success:boolean,
	message:string
}

export interface AllStaffData{
	id:string,
	fullname:string,
	gender:string,
	phone_number:string,
	hire_date:string,
	net_salary:string,
	position:string,
	status_work:string,
	staff_type:string
}
export interface StaffInfo{
	id:string,
	fullname:string,
	gender:string,
	date_of_birth:string,
	phone_number:string,
	address:string,
	identification_card:string,
	hire_date:string,
	net_salary:string,
	status_work:string,
	end_date_hire:string | null,
	staff_type:string,
	position:string,
}
// staff information response
export interface CreateNewStaffResponse{
	success:boolean,
	message:string
}

export interface GetAllStaffResponse{
	success:boolean,
	message:string,
	data: AllStaffData[]
}

export interface GetOneStaffResponse{
	success:boolean,
	message:string,
	data: StaffInfo
}

export interface UpdateStaffResponse{
    success: boolean,
    message: string
}

export interface DeleteStaffResponse{
    success: boolean,
    message: string
}

// INGREDIENTS API RESPONSE
export interface AllPurchaseSummaryByMonthData {
	id:number,
	month:number,
	year:number,
	total_daily_purchase:number,
	date:string
}
export interface GetPurchasesSummaryByMonthResponse{
	success:boolean,
	message:string,
	data: AllPurchaseSummaryByMonthData[]
}

export interface CreatePurchaseIngredientsResponse{
	success: boolean,
    message: string
}