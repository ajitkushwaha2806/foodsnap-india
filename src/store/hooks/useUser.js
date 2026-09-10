"use client";

import { useCallback } from "react";
import posthog from "posthog-js";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, logoutUser, loadUser, clearError, resetUser, registerUser } from "../slice/userSlice";

export const useUser = () => {
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated, error } = useSelector(
    (state) => state.user || {}
  );

  const register = useCallback(
    (userData) => dispatch(registerUser(userData)).unwrap(),
    [dispatch]
  );
  const login = useCallback(
    (credentials) => dispatch(loginUser(credentials)).unwrap(),
    [dispatch]
  );
  const logout = useCallback(async () => {
    posthog.capture("user_signed_out");
    const result = await dispatch(logoutUser()).unwrap();
    posthog.reset();
    return result;
  }, [dispatch]);
  const fetchUser = useCallback(async () => {
    try {
      const res = await dispatch(loadUser());
      return res?.payload;
    } catch {
      return null;
    }
  }, [dispatch]);

  const clearUserError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );
  const reset = useCallback(
    () => dispatch(resetUser()),
    [dispatch]
  );

  return {
    user,
    loading,
    isAuthenticated,
    error,
    register,
    login,
    logout,
    fetchUser,
    clearUserError,
    reset,
  };
};

export default useUser;
