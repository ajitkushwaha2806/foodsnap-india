"use client";
import React, { useState } from "react";
import { User, Calendar, Mail, AlertCircle, Inbox, Phone } from "lucide-react";

const statusStyles = {
  open: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  "in-progress": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  closed: "bg-muted text-muted-foreground border border-border",
};

const priorityStyles = {
  high: "text-red-500 font-semibold",
  medium: "text-amber-500 font-medium",
  low: "text-muted-foreground",
};

export default function TicketTable({ tickets = [], loading = false }) {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="mt-6 rounded-xl overflow-hidden border border-border bg-card shadow-xs">
        <div className="bg-muted/40 px-4 py-3 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
          Previous Requests
        </div>

        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse px-4 py-4 border-b border-border flex items-center justify-between gap-4"
          >
            <div className="w-1/4 h-3.5 bg-muted rounded"></div>
            <div className="w-1/3 h-3.5 bg-muted rounded"></div>
            <div className="w-16 h-3.5 bg-muted rounded"></div>
            <div className="w-20 h-3.5 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="mt-6 rounded-xl overflow-hidden border border-border bg-card shadow-xs">
        <div className="bg-muted/40 px-4 py-3 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
          Previous Requests
        </div>

        <div className="py-10 text-center">
          <Inbox size={36} className="mx-auto text-muted-foreground/50" />
          <h3 className="text-sm font-semibold mt-2 text-foreground">
            No Tickets Submitted Yet
          </h3>
          <p className="text-muted-foreground mt-1 text-xs max-w-xs mx-auto">
            Your submitted support requests and status updates will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
      <div className="bg-muted/40 px-4 py-3 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider flex items-center justify-between">
        <span>Previous Requests</span>
        <span className="text-[11px] font-normal text-muted-foreground">({tickets.length} total)</span>
      </div>

      <table className="w-full min-w-[800px] text-left text-xs sm:text-sm">
        <thead className="bg-muted/30 text-muted-foreground font-medium text-xs border-b border-border sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 font-semibold">Subject</th>
            <th className="px-4 py-3 font-semibold">Message</th>
            <th className="px-4 py-3 font-semibold">Contact</th>
            <th className="px-4 py-3 font-semibold">Priority</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Date</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {tickets.map((ticket) => {
            const details = ticket.details || {};
            const fullMessage = details.message || "";
            const shortMessage =
              fullMessage.length > 70
                ? fullMessage.substring(0, 70) + "..."
                : fullMessage;

            const isExpanded = expandedRows[ticket._id];

            return (
              <tr
                key={ticket._id}
                className="hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3 max-w-[180px] font-medium text-foreground truncate">
                  {details.subject || "Support Ticket"}
                </td>

                <td className="px-4 py-3 max-w-[260px]">
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {isExpanded ? fullMessage : shortMessage}
                  </p>

                  {fullMessage.length > 70 && (
                    <button
                      type="button"
                      onClick={() => toggleRow(ticket._id)}
                      className="mt-1 text-primary hover:underline text-[11px] font-medium cursor-pointer"
                    >
                      {isExpanded ? "View Less" : "View More"}
                    </button>
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-foreground font-medium text-xs">
                    <User size={13} className="text-primary" />
                    {details.name || "User"}
                  </div>

                  {details.email && (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mt-0.5">
                      <Mail size={11} />
                      {details.email}
                    </div>
                  )}

                  {details.phone && (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mt-0.5">
                      <Phone size={11} />
                      {details.phone}
                    </div>
                  )}
                </td>

                <td className="px-4 py-3">
                  <div
                    className={`flex items-center gap-1 text-xs ${priorityStyles[ticket.priority] || priorityStyles.low
                      }`}
                  >
                    <AlertCircle size={13} />
                    <span className="capitalize">{ticket.priority || "medium"}</span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 text-[11px] font-medium rounded-md uppercase tracking-wider ${statusStyles[ticket.status] || statusStyles.open
                      }`}
                  >
                    {(ticket.status || "open").replace("-", " ")}
                  </span>
                </td>

                <td className="px-4 py-3 text-muted-foreground text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar size={13} />
                    {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { TicketTable };
