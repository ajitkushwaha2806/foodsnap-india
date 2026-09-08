"use client";
import { ShoppingCart, Ticket, PhoneCall, CheckCircle2, ShieldCheck } from "lucide-react";

const WORKFLOW_MAP = {
  "food-license": {
    title: "How Our FSSAI Registration Process Works",
    subtitle: "Fast, hassle-free food license compliance handled by our expert legal team.",
    steps: [
      {
        step: "01",
        title: "Choose License Validity",
        desc: "Select 1-Year (24h fast-track) or 5-Year (7–15 days) and pay securely all advance.",
        icon: ShoppingCart,
        color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      },
      {
        step: "02",
        title: "Compliance Ticket Raised",
        desc: "A priority compliance ticket is instantly raised in your dashboard with dedicated support.",
        icon: Ticket,
        color: "bg-blue-50 text-blue-600 border-blue-200",
      },
      {
        step: "03",
        title: "WhatsApp Doc Collection",
        desc: "Our compliance manager connects via WhatsApp to gather your ID proof & electricity bill.",
        icon: PhoneCall,
        color: "bg-amber-50 text-amber-600 border-amber-200",
      },
      {
        step: "04",
        title: "Filing & Certificate Delivery",
        desc: "We file on the government portal and deliver your official FSSAI certificate via WhatsApp & email.",
        icon: ShieldCheck,
        color: "bg-purple-50 text-purple-600 border-purple-200",
      },
    ],
  },
  "zomato-swiggy-setup": {
    title: "How Complete Store Onboarding Works",
    subtitle: "From merchant account registration to going live with full menus & photos in 3–5 days.",
    steps: [
      {
        step: "01",
        title: "Order Full Setup",
        desc: "Choose the Complete Zomato + Swiggy onboarding package and checkout securely.",
        icon: ShoppingCart,
        color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      },
      {
        step: "02",
        title: "Onboarding Ticket Raised",
        desc: "A dedicated merchant setup ticket is generated and assigned to our senior launch manager.",
        icon: Ticket,
        color: "bg-blue-50 text-blue-600 border-blue-200",
      },
      {
        step: "03",
        title: "Menu & KYC Collection",
        desc: "We collect your outlet details, food menu up to 50 items, pricing, variants, and photos.",
        icon: PhoneCall,
        color: "bg-amber-50 text-amber-600 border-amber-200",
      },
      {
        step: "04",
        title: "Store Live & Ready",
        desc: "We create accounts, map categories, upload photos, and launch your restaurant in 3–5 business days.",
        icon: CheckCircle2,
        color: "bg-purple-50 text-purple-600 border-purple-200",
      },
    ],
  },
  "dfy-photo-upload": {
    title: "How Our Done-For-You Process Works",
    subtitle: "Zero hassle for you. Fast, reliable execution tracked through your support dashboard.",
    steps: [
      {
        step: "01",
        title: "Select Dish Volume",
        desc: "Choose from 40, 80, or 150 items volume package and pay securely via UPI, Card, or NetBanking.",
        icon: ShoppingCart,
        color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      },
      {
        step: "02",
        title: "Auto-Ticket Raised",
        desc: "A high-priority operations ticket is instantly created in your dashboard with your order details.",
        icon: Ticket,
        color: "bg-blue-50 text-blue-600 border-blue-200",
      },
      {
        step: "03",
        title: "Specialist Connects",
        desc: "Our operations manager contacts you within 1–2 hours to gather menu files & outlet credentials.",
        icon: PhoneCall,
        color: "bg-amber-50 text-amber-600 border-amber-200",
      },
      {
        step: "04",
        title: "Delivered & Live",
        desc: "We resize, format, and upload photos directly to your Zomato & Swiggy menus within 24–48 hours.",
        icon: CheckCircle2,
        color: "bg-purple-50 text-purple-600 border-purple-200",
      },
    ],
  },
};

export default function ServiceWorkflow({ service = "dfy-photo-upload" }) {
  const currentWorkflow = WORKFLOW_MAP[service] || WORKFLOW_MAP["dfy-photo-upload"];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {currentWorkflow.title}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {currentWorkflow.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {currentWorkflow.steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="relative flex flex-col items-center text-center p-4 rounded-xl bg-slate-50/60 border border-slate-200/60 transition-all duration-200 hover:border-slate-300 hover:shadow-xs"
            >
              <div className="absolute -top-3 left-4 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold tracking-wider">
                STEP {item.step}
              </div>

              <div className={`size-12 rounded-xl flex items-center justify-center border mt-2 mb-3 ${item.color}`}>
                <Icon className="size-5" />
              </div>

              <h3 className="text-sm font-bold text-foreground mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
