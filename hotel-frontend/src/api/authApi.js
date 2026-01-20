import { API_ENDPOINTS } from "../utils/constants";
import axiosInstance from "./axios";

export const login = async (username, password) => {
  const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
    username,
    password,
  });

  return response.data;
};

export const verifyToken = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};
