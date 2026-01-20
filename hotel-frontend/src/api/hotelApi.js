import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../utils/constants";

export const getHotels = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.HOTELS);
  return response.data;
};

export const getHotelById = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.HOTEL_BY_ID(id));
  return response.data;
};

export const createHotel = async (hotelData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.HOTELS, hotelData);
  return response.data;
};

export const updateHotel = async (id, hotelData) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.HOTEL_BY_ID(id),
    hotelData,
  );
  return response.data;
};

export const deleteHotel = async (id) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.HOTEL_BY_ID(id));
  return response.data;
};
