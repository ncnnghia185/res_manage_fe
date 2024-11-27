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