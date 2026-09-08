import { API_ENDPOINTS } from "@/services/frontend/api-endpoints";
import { apiClient, setSessionToken, clearSessionToken } from "@/lib/api-client";

async function handleAuthAction(requestPromise) {
  const response = await requestPromise;
  const result = response.data;

  if (result?.token) {
    setSessionToken(result.token);
  }

  return result;
}

export const registerUser = async (data) => {
  return handleAuthAction(apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data));
};

export const loginUser = async (data) => {
  return handleAuthAction(apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data));
};

export const getMe = async (customToken) => {
  const headers = {};
  if (customToken) {
    headers.Authorization = `Bearer ${customToken}`;
  }
  const response = await apiClient.get(API_ENDPOINTS.AUTH.ME, { headers });
  return response.data;
};

export const logoutUser = async () => {
  try {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (err) {
    console.warn("[AuthService] Logout API warning:", err?.message || err);
  } finally {
    clearSessionToken();
  }
  return { success: true, message: "Logged out successfully." };
};

const AuthService = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};

export default AuthService;