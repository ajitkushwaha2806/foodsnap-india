export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    ME: "/api/auth/me",
    LOGOUT: "/api/auth/logout",
  },
  IMAGES: {
    SEARCH: "/api/images/search",
    LATEST: "/api/images/latest",
    GET_BY_ID: (id) => `/api/images/${id}`,
    DOWNLOAD: (id) => `/api/images/${id}/download`,
    DOWNLOADS: "/api/images/downloads",
    REPORT: "/api/images/report",
  },
  PAYMENT: {
    CREATE_ORDER: "/api/payment/create-order",
    VERIFY: "/api/payment/verify",
  },
  SUPPORT: {
    TICKETS: "/api/tickets",
  },
};

export default API_ENDPOINTS;