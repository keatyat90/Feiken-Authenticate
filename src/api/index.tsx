import axios from "axios"; // ✅ Import from `.env`

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.API_URL
    : process.env.PROD_API_URL;

// ✅ Global Axios instance with API prefix
const api = axios.create({
  baseURL: `${BASE_URL}`, // ✅ Every request will start with `/api/products`
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
