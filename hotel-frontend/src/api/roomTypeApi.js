import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

export const getRoomTypes = async (hotelId = null) => {
  const url = hotelId 
    ? `${API_ENDPOINTS.ROOM_TYPES}?hotel_id=${hotelId}`
    : API_ENDPOINTS.ROOM_TYPES;
  
  const response = await axiosInstance.get(url);
  return response.data;
};


export const getRoomTypeById = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ROOM_TYPE_BY_ID(id));
  return response.data;
};


export const createRoomType = async (roomTypeData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ROOM_TYPES, roomTypeData);
  return response.data;
};

export const updateRoomType = async (id, roomTypeData) => {
  const response = await axiosInstance.put(API_ENDPOINTS.ROOM_TYPE_BY_ID(id), roomTypeData);
  return response.data;
};

export const deleteRoomType = async (id) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.ROOM_TYPE_BY_ID(id));
  return response.data;
};