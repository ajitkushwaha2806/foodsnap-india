"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { photoUploadPlans, zomatoSwiggyPlans } from "@/constants";
import ServicePlanCard from "@/components/services/ServicePlanCard";
import FSSAIPlanCard from "@/components/services/FSSAIPlanCard";
import ServiceWorkflow from "@/components/services/ServiceWorkflow";
import { HelpCircle, MessageSquare, Sparkles, Info } from "lucide-react";
import Link from "next/link";

const FAQS_PHOTO_UPLOAD = [
  {
    q: "How does the Done-For-You Photo Upload service work?",
    a: "After purchasing, an operations ticket is instantly created in your account. You can send us your dish list or image IDs from FoodSnap, and our specialist will format, resize, and upload all food photos directly to your Zomato/Swiggy merchant partner portal.",
  },
  {
    q: "How long does it take for my photos to go live?",
    a: "Our team completes all resizing, tagging, and uploading within 24–48 business hours. You get a confirmation message once all photos are uploaded and approved.",
  },
  {
    q: "Is my Zomato / Swiggy account login safe?",
    a: "Yes, 100%. We only access your merchant portal strictly to format & upload your menu dishes and food photography. You can also invite our manager email with restricted editor permissions.",
  },
  {
    q: "What if some photos need revisions or adjustments?",
    a: "We guarantee 100% platform approval. If any dish photo requires re-alignment or replacement, our team provides free post-upload revisions until your menu looks perfect.",
  },
];

const FAQS_ZOMATO_SWIGGY = [
  {
    q: "What is included in Complete Zomato + Swiggy Setup?",
    a: "Our team handles merchant account creation, documentation verification assistance, digital menu structuring up to 50 items, photo selection & uploading, and category mapping on both Zomato & Swiggy.",
  },
  {
    q: "Who pays the official Zomato & Swiggy onboarding fee?",
    a: "Official platform registration / onboarding fees (charged directly by Zomato/Swiggy in certain cities) are paid directly by you to the platforms during KYC verification. Our fee covers end-to-end setup and launch management.",
  },
  {
    q: "How many items are setup in this package?",
    a: "Up to 50 food dish items with complete descriptions, variants, pricing, category placement, and high-res photos on both platforms.",
  },
  {
    q: "How long does the entire setup take?",
    a: "The digital menu and documentation are prepared within 24–48 hours. The store goes live in 3–5 business days depending on Zomato & Swiggy KYC approval.",
  },
];

const FAQS_FOOD_LICENSE = [
  {
    q: "What is the difference between the 1-Year and 5-Year License?",
    a: "The 1-Year License is fast-tracked and submitted within 24 hours (₹699 all advance). The 5-Year License (₹2,499 all advance) gives you long-term validity for 5 straight years without the hassle of annual renewals and is processed within 7–15 days.",
  },
  {
    q: "What documents do I need to provide for FSSAI registration?",
    a: "Just your photo ID / Aadhaar card, electricity bill or rental agreement of the kitchen/premises, and your restaurant business name. Our compliance manager assists with the rest.",
  },
  {
    q: "Are the official government fees included in the package price?",
    a: "Yes! Government portal fees, application processing charges, and dedicated manager assistance are 100% included with no hidden costs.",
  },
  {
    q: "How will I receive my FSSAI certificate?",
    a: "Once approved by the authority, our team delivers your official FSSAI Registration Certificate directly via WhatsApp and email.",
  },
];

import posthog from "posthog-js";
import { trackMetaEvent } from "@/lib/meta-pixel";

function ServicesContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const isFoodLicense = serviceParam === "food-license";
  const isZomatoSwiggy = serviceParam === "zomato-swiggy-setup";

  React.useEffect(() => {
    posthog.capture("services_page_viewed", {
      service_tab: serviceParam || "all",
      is_food_license: isFoodLicense,
      is_zomato_swiggy: isZomatoSwiggy,
    });
    trackMetaEvent("ViewContent", {
      content_name: isFoodLicense
        ? "FSSAI License Service"
        : isZomatoSwiggy
        ? "Zomato Swiggy Setup Service"
        : "Photo Upload Growth Services",
      content_type: "service",
    });
  }, [serviceParam, isFoodLicense, isZomatoSwiggy]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Header */}
      {isFoodLicense ? (
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Transparent Pricing,{" "}
            <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-xl shadow-xs">
              No Hidden Fees
            </span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl">
            Get your 1-Year (24h) or 5-Year (7–15 days) FSSAI license processed with our all-inclusive packages.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <Sparkles className="size-3.5" />
            <span>{isZomatoSwiggy ? "Store Onboarding Package" : "Volume Pricing Plans"}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            {isZomatoSwiggy
              ? "Complete Zomato + Swiggy Onboarding & Setup"
              : "Choose Your Dish Upload Package"}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            {isZomatoSwiggy
              ? "End-to-end merchant setup, full menu digitization & photo uploads up to 50 items on both platforms."
              : "Transparent one-time pricing. No hidden fees, fast 24–48h turnaround, and 100% platform approval guaranteed."}
          </p>
        </div>
      )}

      {/* Plans Section */}
      {isFoodLicense ? (
        <FSSAIPlanCard />
      ) : isZomatoSwiggy ? (
        <div className="max-w-xl mx-auto space-y-4">
          {zomatoSwiggyPlans.map((plan, i) => (
            <ServicePlanCard key={plan.key || i} plan={plan} index={i} />
          ))}

          {/* Direct Platform Onboarding Fee Notice */}
          <div className="rounded-2xl p-4 bg-blue-50/70 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-900">
            <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-blue-950">
                Direct Platform Onboarding Fee Notice:
              </span>
              <p className="leading-relaxed text-blue-800">
                Official Zomato &amp; Swiggy partner onboarding registration fees (if charged by platforms in your city) are to be paid directly by you to Zomato and Swiggy during KYC verification. Our fee covers full end-to-end setup, document coordination, menu structuring, photo editing, and launch management.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch max-w-6xl mx-auto">
          {photoUploadPlans.map((plan, i) => (
            <ServicePlanCard key={plan.key || i} plan={plan} index={i} />
          ))}
        </div>
      )}

      {/* How It Works Workflow */}
      <ServiceWorkflow service={serviceParam || "dfy-photo-upload"} />

      {/* FAQs Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(isFoodLicense
            ? FAQS_FOOD_LICENSE
            : isZomatoSwiggy
            ? FAQS_ZOMATO_SWIGGY
            : FAQS_PHOTO_UPLOAD
          ).map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="text-sm font-bold text-foreground">{faq.q}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Support Help Box */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-bold text-emerald-950">
            Need a Custom Restaurant Growth Package?
          </h3>
          <p className="text-xs sm:text-sm text-emerald-800">
            Have multiple cloud kitchen outlets or a large restaurant chain? Talk directly to our onboarding head.
          </p>
        </div>

        <Link
          href="/support"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs shrink-0"
        >
          <MessageSquare className="size-4" />
          <span>Contact Support Desk</span>
        </Link>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-muted-foreground">Loading services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
