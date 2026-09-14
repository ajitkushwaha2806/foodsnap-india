"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { getPlanTierConfig } from "../helpers";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { CheckCircle2, ArrowRight, Loader2, Sparkles } from "lucide-react";
import posthog from "posthog-js";

export default function PlanCard({ plan, index }) {
  const [includeUploadAddon, setIncludeUploadAddon] = useState(false);
  const config = getPlanTierConfig(plan.key);
  const Icon = config.icon;
  const { startCheckout, isProcessing, activePlanKey } = useRazorpayCheckout();

  const isCurrentPlanProcessing = isProcessing && activePlanKey === plan.key;
  const baseAmount = plan.discountedAmount || plan.amount || 499;
  const totalAmount = includeUploadAddon ? baseAmount + 1000 : baseAmount;
  const displayTotal = `₹${totalAmount.toLocaleString("en-IN")}`;

  const handleAddonToggle = (nextValue) => {
    setIncludeUploadAddon(nextValue);
    posthog.capture("upload_addon_toggled", {
      plan_key: plan.key,
      plan_name: plan.name,
      enabled: nextValue,
    });
  };

  const handlePlanClick = (e) => {
    e.preventDefault();
    startCheckout({ ...plan, includeUploadAddon });
  };

  return (
    <motion.div
      key={plan.key || index}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 border backdrop-blur-sm transition-all duration-300 ${config.accentColor} ${
        config.isFeatured ? "bg-card shadow-lg" : "bg-card/70"
      }`}
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
            className={`p-2.5 rounded-xl ${
              config.isFeatured
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
              {includeUploadAddon ? displayTotal : plan.price}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              / {plan.key === 'yearly' ? 'year' : 'month'}
            </span>
          </div>
          {config.perImage && (
            <span className="inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              {config.perImage}
            </span>
          )}
        </div>

        <div className="mb-5">
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

        {/* Upload Add-on Checkbox */}
        <div
          onClick={() => handleAddonToggle(!includeUploadAddon)}
          className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none mb-6 ${
            includeUploadAddon
              ? "bg-primary/10 border-primary/40 shadow-xs ring-1 ring-primary/25"
              : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-start gap-2.5">
            <input
              type="checkbox"
              checked={includeUploadAddon}
              onChange={(e) => handleAddonToggle(e.target.checked)}
              className="mt-0.5 size-4 accent-primary rounded cursor-pointer shrink-0"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <span className="text-xs font-bold text-foreground flex items-center gap-1">
                  <Sparkles className="size-3 text-amber-500 fill-amber-500" />
                  <span>Upload on my behalf</span>
                </span>
                <span className="text-[11px] font-bold text-primary px-2 py-0.5 rounded bg-primary/15 whitespace-nowrap">
                  +₹1,000 / account
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                Our team will resize, format & upload photos to your Zomato & Swiggy menus (up to max 100 items).
              </p>
            </div>
          </div>
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
            <span>
              {includeUploadAddon
                ? `Pay ${displayTotal} & Subscribe`
                : plan.button || "Choose Plan"}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
