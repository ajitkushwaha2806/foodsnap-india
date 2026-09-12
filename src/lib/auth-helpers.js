"use client";
import axios from "axios";
import posthog from "posthog-js";
import { store } from "@/store";
import { addNotification } from "@/store/slice/notificationSlice";

let isInterceptorSetup = false;

export function promptLogin({ actionName = "download this image", message, customRedirectPath, duration = 4000, dispatch } = {}) {
  if (typeof window === "undefined") return;
  const currentPath =
    customRedirectPath ||
    window.location.pathname + window.location.search;

  posthog.capture("login_prompt_triggered", {
    action_name: actionName,
    current_path: currentPath,
  });

  const redirectUrl = `/sign-up?redirect=${encodeURIComponent(currentPath)}`;
  const notificationMessage =
    message || `Please sign up first to ${actionName}.`;

  const actionPayload = {
    type: "warning",
    message: notificationMessage,
    action: {
      redirect: redirectUrl,
      buttonText: "Sign Up",
      autoRedirect: true,
    },
    duration,
  };

  if (dispatch) {
    dispatch(addNotification(actionPayload));
  } else if (store?.dispatch) {
    store.dispatch(addNotification(actionPayload));
  }
}

export function promptPricing({ message, duration = 4000, dispatch } = {}) {
  if (typeof window === "undefined") return;

  posthog.capture("pricing_prompt_triggered", {
    reason: "out_of_credits",
  });

  const notificationMessage =
    message || "You have no download credits left. Please recharge your credits to download.";

  const actionPayload = {
    type: "warning",
    message: notificationMessage,
    action: {
      redirect: "/pricing",
      buttonText: "Recharge",
      autoRedirect: true,
    },
    duration,
  };

  if (dispatch) {
    dispatch(addNotification(actionPayload));
  } else if (store?.dispatch) {
    store.dispatch(addNotification(actionPayload));
  }
}


export function setupAxiosInterceptors() {
  if (isInterceptorSetup || typeof window === "undefined") return;
  isInterceptorSetup = true;

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const url = error.config?.url || "";

      const isSilentProbe =
        url.includes("/api/auth/me") || url.includes("/api/user/me");
      const isAuthPage =
        window.location.pathname.startsWith("/sign-in") ||
        window.location.pathname.startsWith("/sign-up");

      if (status === 401 && !isSilentProbe && !isAuthPage) {
        const currentPath =
          window.location.pathname + window.location.search;

        const serverMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Please log in to continue.";

        promptLogin({
          message: serverMessage.endsWith(".") ? serverMessage : `${serverMessage}.`,
          customRedirectPath: currentPath,
          duration: 4000,
        });
      }

      return Promise.reject(error);
    }
  );
}

export function redirectToLogin(customRedirectPath) {
  if (typeof window === "undefined") return;
  const currentPath =
    customRedirectPath ||
    window.location.pathname + window.location.search;
  window.location.href = `/sign-up?redirect=${encodeURIComponent(currentPath)}`;
}