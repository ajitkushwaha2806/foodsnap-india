"use client";

import { useCallback } from "react";
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
  const logout = useCallback(
    () => dispatch(logoutUser()).unwrap(),
    [dispatch]
  );
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
