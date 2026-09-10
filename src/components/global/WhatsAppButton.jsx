"use client";

import React from "react";
import { motion } from "framer-motion";
import posthog from "posthog-js";

export default function WhatsAppButton() {
  const phoneNumber = "919311507651";
  const message = encodeURIComponent(
    "Hi FoodSnap, I have a query regarding food photos & services."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  const handleClick = () => {
    try {
      posthog.capture("whatsapp_support_clicked", {
        phone: phoneNumber,
        page: typeof window !== "undefined" ? window.location.pathname : "",
      });
    } catch {
      // ignore
    }
  };

  return (
    <aside
      aria-label="WhatsApp Support"
      className="fixed bottom-5 right-5 z-40 flex items-center group pointer-events-auto"
    >
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block mr-2 px-2.5 py-1 rounded-md bg-slate-900/90 text-white text-xs font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Chat with us
      </span>

      {/* Floating Button - subtle, non-distracting, no pulse */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Chat with us on WhatsApp at 9311507651"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center size-11 sm:size-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md hover:shadow-lg opacity-85 hover:opacity-100 transition-all duration-200 cursor-pointer"
      >
        {/* WhatsApp SVG Icon */}
        <svg
          className="size-5 sm:size-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.101-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.176.201-.351.226-.653.076-.301-.151-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.151-.176.201-.301.301-.502.101-.201.05-.377-.025-.527-.075-.151-.678-1.634-.929-2.237-.245-.588-.494-.508-.678-.518l-.578-.01c-.201 0-.527.075-.804.377s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.151.201 2.124 3.244 5.146 4.549.719.311 1.28.497 1.718.636.723.23 1.381.197 1.901.12.579-.087 1.782-.728 2.033-1.431.251-.703.251-1.306.176-1.431-.076-.126-.276-.201-.577-.352z" />
          <path d="M12.004 0C5.372 0 0 5.373 0 12.004c0 2.115.552 4.177 1.6 6l-1.7 6.209 6.36-1.667c1.761.96 3.754 1.462 5.744 1.462 6.631 0 12.004-5.373 12.004-12.004C24.008 5.373 18.635 0 12.004 0zm0 21.942c-1.802 0-3.568-.484-5.11-1.4l-.366-.217-3.778.991 1.008-3.682-.238-.379c-1.009-1.606-1.542-3.468-1.542-5.251 0-5.498 4.47-9.968 9.972-9.968 5.502 0 9.972 4.47 9.972 9.968 0 5.498-4.47 9.972-9.972 9.972z" />
        </svg>
      </motion.a>
    </aside>
  );
}
