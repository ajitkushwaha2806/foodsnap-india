"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/store/hooks/useUser";
import { useTicket } from "@/store/hooks/useTicket";
import TicketForm from "@/components/ticket/ticket-form";
import TicketTable from "@/components/ticket/ticket-card";

export default function SupportPage() {
  const { user, isAuthenticated } = useUser();
  const { tickets, loading, loadTickets } = useTicket();

  useEffect(() => {
    if (user || isAuthenticated) {
      loadTickets();
    }
  }, [user, isAuthenticated, loadTickets]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 lg:p-8 mx-auto space-y-8 min-h-screen"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Support & Feedback
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Have a question, issue, or feature request? We&apos;re here to help you.
        </p>
      </div>
      {(user || isAuthenticated || tickets.length > 0) && (
        <TicketTable tickets={tickets} loading={loading} />
      )}
      <TicketForm />
    </motion.div>
  );
}
