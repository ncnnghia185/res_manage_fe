import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

interface locationDataType {
  name: string;
  owner_id?: number;
  restaurant_id?: number;
}

// Location APIs
// get all locations
export const getAllLocations = async (
  accessToken: string,
  owner_id?: number,
  restaurant_id?: number
) => {
  const response = await axios.get(
    `${BASE_URL}/location/all-locations?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
// get location infor
export const getLocationInfor = async (
  owner_id: number,
  restaurant_id: number,
  location_id: number
) => {
  const response = await axios.get(
    `${BASE_URL}/location/infor?owner_id=${owner_id}&restaurant_id=${restaurant_id}/${location_id}}`
  );
  return response.data;
};

// create new location
export const createLocation = async (
  data: locationDataType,
  accessToken: string
) => {
  const response = await axios.post(`${BASE_URL}/location/add-location`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// update location
export const updateLocationName = async (
  owner_id: number,
  restaurant_id: number,
  accessToken: string,
  data: any,
  location_id?: number
) => {
  const response = await axios.put(
    `${BASE_URL}/location/update/${location_id}?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// Table APIs
// create new table
interface TableDataType {
  name: string;
  location_id: string;
  capacity: string;
  type: string;
  owner_id?: number;
  restaurant_id?: number;
}
export const createNewTable = async (
  data: TableDataType,
  accessToken: string
) => {
  const response = await axios.post(`${BASE_URL}/tables/add-table`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const getAllTables = async (
  accessToken: string,
  owner_id?: number,
  restaurant_id?: number
) => {
  const response = await axios.get(
    `${BASE_URL}/tables/all-tables?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
export const getOneTableInfor = async (
  accessToken: string,
  table_id: number,
  owner_id?: number,
  restaurant_id?: number
) => {
  const response = await axios.get(
    `${BASE_URL}/tables/infor/${table_id}?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
export const updateOneTableInfo = async (
  accessToken: string,
  table_id: number,
  data: any,
  owner_id?: number,
  restaurant_id?: number
) => {
  const response = await axios.put(
    `${BASE_URL}/tables/update-infor/${table_id}?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
export const deleteTable = async (
  id: number,
  accessToken: string,
  owner_id?: number,
  restaurant_id?: number
) => {
  const response = await axios.delete(
    `${BASE_URL}/tables/delete/table/${id}?owner_id=${owner_id}&restaurant_id=${restaurant_id}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
};
