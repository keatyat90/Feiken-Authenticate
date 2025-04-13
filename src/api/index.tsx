import axios from "axios"; // ✅ Import from `.env`
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.API_URL;
console.log('API:', apiUrl);

const BASE_URL = apiUrl

// ✅ Global Axios instance with API prefix
const api = axios.create({
  baseURL: `${BASE_URL}`, // ✅ Every request will start with `/api/products`
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
