import { PLAN_TIER_CONFIGS, DEFAULT_PLAN_CONFIG } from "./constants";

export function getPlanTierConfig(key) {
  if (!key) return DEFAULT_PLAN_CONFIG;
  return PLAN_TIER_CONFIGS[key.toLowerCase()] || DEFAULT_PLAN_CONFIG;
}

export function formatCurrency(amount) {
  if (typeof amount !== "number") return amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
