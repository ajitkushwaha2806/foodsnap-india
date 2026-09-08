"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { fssaiPlans } from "@/constants";
import { Check, ArrowRight, Loader2, ShieldCheck, Zap, Clock, Star } from "lucide-react";

export default function FSSAIPlanCard() {
  const { startCheckout, isProcessing, activePlanKey } = useRazorpayCheckout();

  const handleOrder = (plan) => (e) => {
    e.preventDefault();
    startCheckout({
      key: plan.key,
      name: `${plan.name} (₹${plan.amount} All Advance)`,
      amount: plan.amount,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch max-w-5xl mx-auto w-full">
      {fssaiPlans.map((plan, index) => {
        const isCurrentProcessing = isProcessing && activePlanKey === plan.key;
        const isFeatured = Boolean(plan.highlight);
        const Icon = plan.durationKey === "5yr" ? Star : Zap;

        return (
          <motion.div
            key={plan.key || index}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 border transition-all duration-300 bg-white ${
              isFeatured
                ? "border-primary shadow-xl shadow-primary/10 ring-2 ring-primary/40 bg-gradient-to-b from-primary/5 via-card to-card"
                : "border-slate-200/80 shadow-md hover:border-primary/40"
            }`}
          >

            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span
                  className={`px-3.5 py-1 text-xs tracking-wide uppercase rounded-full whitespace-nowrap font-bold flex items-center gap-1.5 shadow-sm ${
                    isFeatured
                      ? "bg-primary text-primary-foreground shadow-primary/30"
                      : "bg-slate-900 text-white"
                  }`}
                >
                  <Icon className="size-3 fill-current" />
                  <span>{plan.badge}</span>
                </span>
              </div>
            )}

            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary mb-2">
                    <Clock className="size-3" />
                    <span>Turnaround: {plan.turnaround}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                    {plan.name}
                  </h3>
                </div>
                <div
                  className={`p-2.5 rounded-2xl shrink-0 ${
                    isFeatured
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="size-5 fill-current" />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground mb-5 min-h-[36px]">
                {plan.description}
              </p>

              {/* Pricing Section */}
              <div className="pt-2 pb-5 border-y border-slate-100 mb-6 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-primary">
                    {plan.price}
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    All Advance
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-rose-500 pt-1">
                  <span>TOTAL: {plan.price} ({plan.savings})</span>
                  <span className="line-through text-slate-400 font-normal">
                    {plan.originalPrice}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-6 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Everything Included in {plan.durationLabel}:
                </p>
                <ul className="space-y-3 text-xs sm:text-sm">
                  {plan.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="size-4.5 rounded-full p-0.5 bg-primary/15 text-primary shrink-0 mt-0.5 flex items-center justify-center">
                        <Check className="size-3 stroke-[3]" />
                      </div>
                      <span className="text-slate-700 font-semibold leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2.5 pt-2">
              <motion.button
                type="button"
                onClick={handleOrder(plan)}
                disabled={isProcessing}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                  isFeatured
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                    : "border-2 border-primary text-primary bg-primary/5 hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {isCurrentProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin size-4" />
                    <span>Processing Order...</span>
                  </span>
                ) : (
                  <>
                    <span>{plan.button}</span>
                    <ArrowRight className="size-4 stroke-[2.5]" />
                  </>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>100% Safe &amp; Secure Payment (All Advance)</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
