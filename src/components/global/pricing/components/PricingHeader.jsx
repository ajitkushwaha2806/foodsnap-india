"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PricingHeader() {
  return (
    <div className="text-center mx-auto mb-12">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 text-foreground"
      >
        Choose Your <span className="text-primary">Perfect Plan</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mx-auto"
      >
        High-converting culinary imagery and food assets built to boost your online orders on Zomato, Swiggy, and direct menus.
      </motion.p>
    </div>
  );
}
