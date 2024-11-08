import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

interface locationDataType {
  id: number;
  name: string;
}

// Location APIs
// get all locations
export const getAllLocations = async (
  owner_id: number,
  restaurant_id: number
) => {
  const response = await axios.get(
    `${BASE_URL}/api/location/all-locations?owner_id=${owner_id}&restaurant_id=${restaurant_id}`
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
    `${BASE_URL}/api/location/infor?owner_id=${owner_id}&restaurant_id=${restaurant_id}/${location_id}}`
  );
  return response.data;
};

// create new location
export const createLocation = async () => {};

// update location
export const updateLocationName = async (
  owner_id: number,
  restaurant_id: number,
  location_id: number,
  data: any
) => {
  const response = await axios.put(
    `${BASE_URL}/api/location/update?owner_id=${owner_id}&restaurant=${restaurant_id}/${location_id}`,
    data
  );
  return response.data;
};

// Table APIs
