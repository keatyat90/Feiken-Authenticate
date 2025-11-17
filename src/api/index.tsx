import axios from "axios";
import Constants from "expo-constants";

/**
 * Determine the API base URL automatically.
 * Works for both native and web builds.
 */
const apiUrl =
  // ✅ Web builds use process.env (Expo injects EXPO_PUBLIC_* automatically)
  process.env.EXPO_PUBLIC_API_URL ??
  // ✅ Native builds read from app.config.js (extra field)
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ??
  // ✅ Fallback (for local dev if .env missing)
  "https://feiken-dev-api.weperform.com.my";

console.log("🔗 API URL:", apiUrl);

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
