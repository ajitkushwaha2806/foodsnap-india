"use client";
import Link from "next/link";
import { useUser } from "@/store/hooks/useUser";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Rocket, FileText } from "lucide-react";

const BANNER_SLIDES = [
  {
    id: "dfy-upload",
    key: "dfy-photo-upload",
    badge: "⚡ Done-For-You Service",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    title: "Upload Photos on Your Behalf",
    subtitle: "Our experts format & upload up to 100 food photos to your Zomato & Swiggy menus.",
    price: "Starting from ₹1,000",
    priceUnit: "/ account",
    ctaText: "View Details & Order",
    ctaLink: "/services",
    image: "/assets/banners/upload-service.webp",
    bgGradient: "from-emerald-500/10 via-emerald-50/40 to-white",
    borderColor: "border-emerald-200/80",
    accentColor: "text-emerald-600",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs",
    icon: Sparkles,
  },
  {
    id: "zomato-swiggy-setup",
    key: "zomato-swiggy-setup",
    badge: "🚀 Full Store Onboarding",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    title: "Complete Zomato + Swiggy Setup",
    subtitle: "End-to-end merchant onboarding & full menu setup up to 50 items on both platforms.",
    price: "₹3,499",
    priceUnit: "one-time",
    ctaText: "Explore Full Setup",
    ctaLink: "/services?service=zomato-swiggy-setup",
    image: "/assets/banners/store-setup.jpg",
    bgGradient: "from-amber-500/10 via-amber-50/40 to-white",
    borderColor: "border-amber-200/80",
    accentColor: "text-amber-600",
    buttonClass: "bg-amber-600 hover:bg-amber-700 text-white shadow-xs",
    icon: Rocket,
  },
  {
    id: "food-license",
    key: "food-license",
    badge: "📋 Fast Compliance",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    title: "FSSAI Food License Registration",
    subtitle: "Fast-track 1-Year (in 24h) or 5-Year (7–15 days) food license registration with all government fees included.",
    price: "₹699",
    priceUnit: "(1-Yr) / ₹2,499 (5-Yr)",
    ctaText: "Get License Help",
    ctaLink: "/services?service=food-license",
    image: "/assets/banners/food-license.png",
    bgGradient: "from-emerald-500/10 via-emerald-50/40 to-white",
    borderColor: "border-emerald-200/80",
    accentColor: "text-emerald-600",
    buttonClass: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs",
    icon: FileText,
  },
];

export default function ServiceBannerCarousel() {
  const { user, isAuthenticated } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const planKey = (user?.subscription?.plan || "free").toLowerCase();
  const isPaidUser = Boolean(
    isAuthenticated &&
    user &&
    ((user?.subscription?.isActive && planKey !== "free") ||
      (planKey !== "free" &&
        user?.subscription?.expiresAt &&
        new Date(user.subscription.expiresAt) > new Date()) ||
      (user?.credits > 0 && planKey !== "free"))
  );

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  }, []);

  // Auto-play every 4 seconds, pausing only on active mouse hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

  const slide = BANNER_SLIDES[currentIndex];
  const Icon = slide.icon;

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  if (!isPaidUser) {
    return null;
  }

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-xs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle Auto-play progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/5 z-10 overflow-hidden">
        <motion.div
          key={currentIndex + (isPaused ? "-paused" : "-playing")}
          initial={{ width: "0%" }}
          animate={{ width: isPaused ? "0%" : "100%" }}
          transition={{ duration: isPaused ? 0 : 3.8, ease: "linear" }}
          className="h-full bg-primary/50"
        />
      </div>

      <div className={`relative bg-gradient-to-r ${slide.bgGradient} p-3.5 sm:p-5 md:px-6 md:py-5 transition-colors duration-500`}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col gap-3"
          >
            {/* Top row: Content on left, Graphic on right */}
            <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-6">
              {/* Left Content */}
              <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border ${slide.badgeColor}`}
                  >
                    <Icon className="size-3 shrink-0" />
                    <span className="truncate">{slide.badge}</span>
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-foreground">
                    {slide.price}{" "}
                    <span className="text-[10px] sm:text-xs font-normal text-muted-foreground">
                      {slide.priceUnit}
                    </span>
                  </span>
                </div>

                <h2 className="text-xs sm:text-base md:text-lg font-bold text-foreground tracking-tight line-clamp-1">
                  {slide.title}
                </h2>

                <p className="text-[11px] sm:text-xs md:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {slide.subtitle}
                </p>
              </div>

              {/* Right Graphic / Image */}
              <div className="relative shrink-0 w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-28 rounded-xl overflow-hidden shadow-xs border border-white/80 bg-slate-100">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-300 hover:scale-105"
                  loading="eager"
                />
              </div>
            </div>

            {/* Bottom action & navigation bar */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
              <Link
                href={slide.ctaLink}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0 ${slide.buttonClass}`}
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="size-3 sm:size-3.5" />
              </Link>

              {/* Navigation Controls (Dots + Chevrons) */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="flex items-center gap-1">
                  {BANNER_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setDirection(idx > currentIndex ? 1 : -1);
                        setCurrentIndex(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentIndex ? "w-4 sm:w-5 bg-primary" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                        }`}
                      title={`Go to slide ${idx + 1}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="p-1 rounded-md text-slate-500 hover:text-foreground hover:bg-white/80 transition-colors cursor-pointer"
                    title="Previous banner"
                    aria-label="Previous banner"
                  >
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="p-1 rounded-md text-slate-500 hover:text-foreground hover:bg-white/80 transition-colors cursor-pointer"
                    title="Next banner"
                    aria-label="Next banner"
                  >
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
