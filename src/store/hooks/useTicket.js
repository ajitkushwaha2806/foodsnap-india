"use client";
import { useCallback } from "react";
import { useNotification } from "./useNotification";
import { useDispatch, useSelector } from "react-redux";
import { createTicket, fetchTickets, clearTickets } from "@/store/slice/ticketSlice";

export const useTicket = () => {
  const dispatch = useDispatch();
  const { success, error: notifyError } = useNotification();

  const { tickets = [], loading = false, creating = false, error = null } = useSelector(
    (state) => state.tickets || {}
  );

  const handleCreateTicket = useCallback(
    async (data) => {
      const resultAction = await dispatch(createTicket(data));
      if (createTicket.fulfilled.match(resultAction)) {
        success("Your support request has been submitted successfully!");
        return resultAction.payload;
      } else {
        notifyError(resultAction.payload || "Failed to submit request.");
        throw new Error(resultAction.payload);
      }
    },
    [dispatch, success, notifyError]
  );

  const loadTickets = useCallback(() => {
    return dispatch(fetchTickets());
  }, [dispatch]);

  const resetTickets = useCallback(() => {
    dispatch(clearTickets());
  }, [dispatch]);

  return {
    tickets,
    loading,
    creating,
    error,
    handleCreateTicket,
    loadTickets,
    resetTickets,
  };
};

export default useTicket;
