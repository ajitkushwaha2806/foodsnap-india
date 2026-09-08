"use client";
import React from "react";
import { motion } from "framer-motion";
import { getPlanTierConfig } from "../helpers";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";

export default function PlanCard({ plan, index }) {
  const config = getPlanTierConfig(plan.key);
  const Icon = config.icon;
  const { startCheckout, isProcessing, activePlanKey } = useRazorpayCheckout();

  const isCurrentPlanProcessing = isProcessing && activePlanKey === plan.key;

  const handlePlanClick = (e) => {
    e.preventDefault();
    startCheckout(plan);
  };

  return (
    <motion.div
      key={plan.key || index}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 border backdrop-blur-sm transition-all duration-300 ${config.accentColor
        } ${config.isFeatured ? "bg-card shadow-lg" : "bg-card/70"}`}
    >
      {config.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span
            className={`px-3.5 py-1 text-xs tracking-wide uppercase rounded-full whitespace-nowrap ${config.badgeClass}`}
          >
            {config.badge}
          </span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
          <div
            className={`p-2.5 rounded-xl ${config.isFeatured
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground"
              }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground min-h-[38px] mb-4">
          {plan.description || config.tagline}
        </p>

        <div className="pt-2 pb-4 border-b border-border/70 mb-5">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              {plan.price}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              / pack
            </span>
          </div>
          {config.perImage && (
            <span className="inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              {config.perImage}
            </span>
          )}
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Included in plan:
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

      <motion.button
        type="button"
        onClick={handlePlanClick}
        disabled={isProcessing}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-all duration-200 cursor-pointer ${config.buttonClass} disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {isCurrentPlanProcessing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin size-4" />
            <span>Processing...</span>
          </span>
        ) : (
          <>
            <span>{plan.button || "Choose Plan"}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
