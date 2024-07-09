import axios, { AxiosInstance } from "axios";

export const createAxiosInstance = (): AxiosInstance => {
  const baseURL = "http://localhost:3131";

  if (!baseURL) {
    throw new Error(
      "Base URL is not defined. Please set REACT_APP_API_BASE_URL in your .env file."
    );
  }

  const instance = axios.create({
    baseURL: `${baseURL}/fm/`,
    timeout: 2000, // Optional timeout setting
    headers: {
      "Content-Type": "application/json",
      // Add other custom headers here
    },
  });

  // Optionally, you can add interceptors to handle requests or responses
  instance.interceptors.request.use(
    (config) => {
      // Modify request configuration here if needed
      return config;
    },
    (error) => {
      // Handle request error here
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      // Handle response data here
      return response;
    },
    (error) => {
      // Handle response error here
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createAxiosInstance;
