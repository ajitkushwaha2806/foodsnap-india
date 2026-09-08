import React from "react";
import PlansGrid from "./components/PlansGrid";
import PricingHeader from "./components/PricingHeader";
import PricingEmptyState from "./components/PricingEmptyState";
import { plans as defaultPlans } from "./constants";

export default function PricingSection({ plans = defaultPlans }) {
  const displayPlans = plans && plans.length > 0 ? plans : defaultPlans;

  return (
    <section className="relative px-4 sm:px-6 py-4 md:py-8 bg-background text-foreground overflow-hidden">
      <div className="mx-auto">
        <PricingHeader />

        {displayPlans.length === 0 ? (
          <PricingEmptyState />
        ) : (
          <PlansGrid plans={displayPlans} />
        )}
      </div>
    </section>
  );
}
