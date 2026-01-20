import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

export const getRateAdjustmentHistory = async (roomTypeId) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.RATE_ADJUSTMENT_HISTORY(roomTypeId)
  );
  return response.data;
};

export const createRateAdjustment = async (adjustmentData) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.RATE_ADJUSTMENTS,
    adjustmentData
  );
  return response.data;
};