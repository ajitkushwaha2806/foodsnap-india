import { Sparkles, Crown } from "lucide-react";

export const plans = [
  {
    key: "basic",
    name: "Basic Plan",
    price: "₹499",
    description: "Download 40 high-quality food images.",
    features: [
      "40 image downloads",
      "Zomato & Swiggy approved photos",
      "Access to trending photo packs",
      "High-quality images",
    ],
    button: "Get Basic Plan",
    link: "/payment/cart?plan=basic",
    highlight: false,
    duration: 30,
    amount: 499,
    discountedAmount: 499,
    discountPercentage: 0,
    taxPercentage: 18,
    downloads: 40,
  },
  {
    key: "pro",
    name: "Pro Plan",
    price: "₹999",
    description: "Download 100 high-quality food images.",
    features: [
      "100 image downloads",
      "Access to entire photo library",
      "Zomato & Swiggy approved photos",
      "High-quality food images",
      "Priority photo requests",
    ],
    button: "Go Pro",
    link: "/payment/cart?plan=pro",
    highlight: false,
    duration: 30,
    amount: 999,
    discountedAmount: 999,
    discountPercentage: 0,
    taxPercentage: 18,
    downloads: 100,
  },
  {
    key: "premium",
    name: "Premium Plan",
    price: "₹1999",
    description: "Download unlimited high-quality food images.",
    features: [
      "Unlimited image downloads",
      "Full access to photo library",
      "Zomato & Swiggy approved photos",
      "Priority photo request handling",
      "Exclusive new photo collections",
      "High-quality images",
    ],
    button: "Go Premium",
    link: "/payment/cart?plan=premium",
    highlight: true,
    duration: 30,
    amount: 1999,
    discountedAmount: 1999,
    discountPercentage: 0,
    taxPercentage: 18,
    downloads: "unlimited",
  },
];

export const PLAN_TIER_CONFIGS = {
  basic: {
    icon: Sparkles,
    perImage: "₹12.47 / image",
    tagline: "Great for expanding multi-cuisine restaurants",
    badge: null,
    badgeClass: "",
    accentColor: "border-border/70 hover:border-primary/40",
    buttonClass:
      "border border-primary text-primary bg-primary/5 hover:bg-primary hover:text-primary-foreground font-semibold",
    isFeatured: false,
  },
  pro: {
    icon: Sparkles,
    perImage: "₹9.99 / image",
    tagline: "Best value for growing restaurants & food chains",
    badge: null,
    badgeClass: "",
    accentColor: "border-border/70 hover:border-primary/40",
    buttonClass:
      "border border-primary text-primary bg-primary/5 hover:bg-primary hover:text-primary-foreground font-semibold",
    isFeatured: false,
  },
  premium: {
    icon: Crown,
    perImage: "Unlimited Downloads",
    tagline: "Unlimited access for agencies & restaurant groups",
    badge: "⭐ Unlimited Access",
    badgeClass:
      "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/30",
    accentColor:
      "border-primary shadow-xl shadow-primary/10 ring-2 ring-primary/40 bg-gradient-to-b from-primary/5 via-card to-card",
    buttonClass:
      "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 font-semibold",
    isFeatured: true,
  },
};

export const DEFAULT_PLAN_CONFIG = {
  icon: Sparkles,
  perImage: null,
  tagline: "High quality food photography",
  badge: null,
  badgeClass: "",
  accentColor: "border-border hover:border-primary/30",
  buttonClass:
    "border border-primary text-primary bg-primary/5 hover:bg-primary hover:text-primary-foreground font-semibold",
  isFeatured: false,
};
