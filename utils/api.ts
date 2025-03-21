import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://realestate-backend-89xm.onrender.com/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: any) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleError = (error: {
  response: { status: any; data: { message: string } };
  request: any;
  message: string;
}) => {
  let message = "Something went wrong!";
  let title = "Error";

  if (error.response) {
    const status = error.response.status;
    message = error.response.data?.message || message;

    if (status === 401) message = "Unauthorized! Please login again.";
    if (status === 403) message = "Forbidden! You don’t have permission.";
    if (status === 500) message = "Server error! Try again later.";
  } else if (error.request) {
    message = "No response from server!";
  } else {
    message = error.message;
  }

  Toast.show({ type: "error", text1: title, text2: message });

  return Promise.reject({ status: error.response?.status, message });
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => handleError(error)
);

const api = {
  get: async (url: string, params = {}, extraHeaders = {}) => {
    try {
      const response = await apiClient.get(url, {
        params,
        headers: { ...apiClient.defaults.headers, ...extraHeaders },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (url: string, data = {}, extraHeaders = {}) => {
    try {
      const response = await apiClient.post(url, data, {
        headers: { ...apiClient.defaults.headers, ...extraHeaders },
      });
      // Toast.show({
      //   type: "success",
      //   text1: "Success",
      //   text2: "Request successful",
      // });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  put: async (url: string, data = {}, extraHeaders = {}) => {
    try {
      const response = await apiClient.put(url, data, {
        headers: { ...apiClient.defaults.headers, ...extraHeaders },
      });
      // Toast.show({
      //   type: "success",
      //   text1: "Success",
      //   text2: "Updated successfully",
      // });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (url: string, extraHeaders = {}) => {
    try {
      const response = await apiClient.delete(url, {
        headers: { ...apiClient.defaults.headers, ...extraHeaders },
      });
      // Toast.show({
      //   type: "success",
      //   text1: "Success",
      //   text2: "Deleted successfully",
      // });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
