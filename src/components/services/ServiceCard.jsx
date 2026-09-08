"use client";
import React, { useState } from "react";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { Check, ArrowRight, Loader2, Clock, ShieldCheck } from "lucide-react";

export default function ServiceCard({ service, isHighlighted = false, id }) {
  const hasTiers = Array.isArray(service.tiers) && service.tiers.length > 0;
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);

  const selectedTier = hasTiers ? service.tiers[selectedTierIndex] : null;
  const currentPrice = selectedTier ? selectedTier.price : service.price;

  const { startCheckout, isProcessing, activePlanKey } = useRazorpayCheckout();
  const isCurrentProcessing = isProcessing && activePlanKey === service.key;

  const handleOrder = () => {
    startCheckout({
      key: service.key,
      name: service.name,
      tier: selectedTier,
    });
  };

  return (
    <div
      id={id || `service-${service.key}`}
      className={`relative rounded-2xl overflow-hidden bg-white border transition-all duration-300 flex flex-col justify-between ${
        isHighlighted
          ? "border-primary shadow-lg shadow-primary/5 ring-1 ring-primary/20"
          : "border-slate-200/90 shadow-xs hover:border-slate-300"
      }`}
    >
      {/* Top Banner Graphic with Badge */}
      <div className="relative w-full h-44 sm:h-52 bg-slate-100 overflow-hidden border-b border-slate-100">
        <img
          src={service.image || "/assets/banners/upload-service.webp"}
          alt={service.name}
          className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Badge */}
        {service.badge && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-xs">
            {service.badge}
          </div>
        )}

        {/* Price Tag Overlay on Bottom Left of Image */}
        <div className="absolute bottom-3 left-3 text-white">
          <div className="text-xl sm:text-2xl font-black drop-shadow-md">
            {currentPrice}
          </div>
          <div className="text-[11px] text-slate-200 drop-shadow-xs">
            {selectedTier ? `${selectedTier.label} • All inclusive` : "One-time payment • All inclusive"}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {service.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* If service has multiple item tiers (e.g. dfy-photo-upload) */}
          {hasTiers && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Select Volume Tier:</span>
                <span className="text-primary font-semibold">
                  {selectedTier.label} ({selectedTier.price})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {service.tiers.map((tier, tIdx) => {
                  const isSelected = tIdx === selectedTierIndex;
                  return (
                    <button
                      key={tier.key || tIdx}
                      type="button"
                      onClick={() => setSelectedTierIndex(tIdx)}
                      className={`relative p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary/40"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300"
                      }`}
                    >
                      {tier.badge && (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full w-max mb-1 ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {tier.badge}
                        </span>
                      )}
                      <div className="text-xs font-bold leading-tight">
                        {tier.label}
                      </div>
                      <div className="text-xs font-extrabold mt-1">
                        {tier.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 py-2 border-y border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="size-3.5 text-amber-500" />
              <span>24–48h Delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>Auto Ops Ticket</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              What&apos;s Included:
            </div>
            <ul className="space-y-2">
              {selectedTier && (
                <li className="flex items-start gap-2 text-xs sm:text-[13px] font-semibold text-emerald-800 bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/60">
                  <div className="size-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-2.5 stroke-[3]" />
                  </div>
                  <span>Upload &amp; tag up to {selectedTier.items} food dish photos on Zomato &amp; Swiggy</span>
                </li>
              )}
              {service.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700">
                  <div className="size-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-2.5 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-3">
          <button
            type="button"
            onClick={handleOrder}
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              isHighlighted
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isCurrentProcessing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>
                  {selectedTier
                    ? `Order ${selectedTier.label} (${selectedTier.price})`
                    : service.button || `Order ${service.name}`}
                </span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            Instant ticket confirmation &amp; direct specialist follow-up.
          </p>
        </div>
      </div>
    </div>
  );
}
