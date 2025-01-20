import axios from "axios";

export const API_CONFIG = {
  baseURL: process.env.API_URL,
  endpoints: {
    tasks: '/tasks',
  },
  timeout: 10000,
  retryAttempts: 3,
};

const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});
