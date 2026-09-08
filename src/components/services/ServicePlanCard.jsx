"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { CheckCircle2, ArrowRight, Loader2, Sparkles, Zap, Crown } from "lucide-react";

export default function ServicePlanCard({ plan, index }) {
  const { startCheckout, isProcessing, activePlanKey } = useRazorpayCheckout();
  const isCurrentPlanProcessing = isProcessing && activePlanKey === plan.key;
  const isFeatured = Boolean(plan.highlight);

  const handleOrder = (e) => {
    e.preventDefault();
    startCheckout({
      key: plan.key,
      name: `Done-For-You Photo Upload (${plan.name} - Up to ${plan.items} Dishes)`,
      tier: {
        label: plan.name,
        items: plan.items,
        amount: plan.amount,
      },
    });
  };

  const Icon = plan.items >= 150 ? Crown : plan.items >= 80 ? Zap : Sparkles;

  return (
    <motion.div
      key={plan.key || index}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 border backdrop-blur-sm transition-all duration-300 ${
        isFeatured
          ? "border-primary shadow-xl shadow-primary/10 ring-2 ring-primary/40 bg-gradient-to-b from-primary/5 via-card to-card"
          : "border-border/70 hover:border-primary/40 bg-card/70"
      }`}
    >
      {/* Top Badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span
            className={`px-3.5 py-1 text-xs tracking-wide uppercase rounded-full whitespace-nowrap font-semibold ${
              isFeatured
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                : "bg-slate-900 text-white shadow-xs"
            }`}
          >
            {plan.badge}
          </span>
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
          <div
            className={`p-2.5 rounded-xl ${
              isFeatured
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground min-h-[38px] mb-4">
          {plan.description || plan.tagline}
        </p>

        {/* Pricing Section */}
        <div className="pt-2 pb-4 border-b border-border/70 mb-5">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              {plan.price}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              / account
            </span>
          </div>
          {plan.perItem && (
            <span className="inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              {plan.perItem} • Up to {plan.items} dishes
            </span>
          )}
        </div>

        {/* Features List */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            What&apos;s Included:
          </p>
          <ul className="space-y-3 text-sm">
            {plan.features?.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="mt-0.5 rounded-full p-0.5 bg-primary/15 text-primary shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-foreground/90 font-medium leading-snug">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Button */}
      <motion.button
        type="button"
        onClick={handleOrder}
        disabled={isProcessing}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
          isFeatured
            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
            : "border border-primary text-primary bg-primary/5 hover:bg-primary hover:text-primary-foreground"
        } disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {isCurrentPlanProcessing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin size-4" />
            <span>Processing Order...</span>
          </span>
        ) : (
          <>
            <span>{plan.button || `Order ${plan.name}`}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
