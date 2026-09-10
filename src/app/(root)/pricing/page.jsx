"use client";
import { plans, services } from "@/constants";
import { useUser } from "@/store/hooks/useUser";
import { useSearchParams } from "next/navigation";
import Pricing from "@/components/global/pricing";
import React, { useEffect, useRef, Suspense } from "react";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";

import posthog from "posthog-js";
import { trackMetaEvent } from "@/lib/meta-pixel";

function PricingContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const autoCheckout = searchParams.get("autoCheckout");
  const { user, isAuthenticated } = useUser();
  const { startCheckout } = useRazorpayCheckout();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    posthog.capture("pricing_page_viewed", {
      referred_plan: planParam || undefined,
      auto_checkout: Boolean(autoCheckout),
    });
    trackMetaEvent("ViewContent", {
      content_name: planParam ? `Plan - ${planParam}` : "Pricing Plans",
      content_type: "product_group",
    });
  }, [planParam, autoCheckout]);

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
