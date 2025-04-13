import axios from "axios"; // ✅ Import from `.env`
import { default as dotenvConfig } from 'react-native-dotenv';

const API_URL = dotenvConfig.API_URL;

const BASE_URL = API_URL

// ✅ Global Axios instance with API prefix
const api = axios.create({
  baseURL: `${BASE_URL}`, // ✅ Every request will start with `/api/products`
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
