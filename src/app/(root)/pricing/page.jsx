"use client";
import { plans, services } from "@/constants";
import { useUser } from "@/store/hooks/useUser";
import { useSearchParams } from "next/navigation";
import Pricing from "@/components/global/pricing";
import React, { useEffect, useRef, Suspense } from "react";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";

function PricingContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const autoCheckout = searchParams.get("autoCheckout");
  const { user, isAuthenticated } = useUser();
  const { startCheckout } = useRazorpayCheckout();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (planParam && autoCheckout && (user || isAuthenticated) && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      const targetItem =
        plans.find((p) => p.key === planParam) ||
        services.find((s) => s.key === planParam) ||
        planParam;
      startCheckout(targetItem);
    }
  }, [planParam, autoCheckout, user, isAuthenticated, startCheckout]);

  return <Pricing plans={plans} services={services} />;
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-muted-foreground">Loading plans...</div>}>
      <PricingContent />
    </Suspense>
  );
}
