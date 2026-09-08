"use client";
import React from "react";
import { Sparkles, ShieldCheck, Zap, Headphones } from "lucide-react";

export default function ServiceHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-6 sm:p-10 md:p-12 shadow-xl border border-slate-800">
      <div className="absolute -top-24 -left-24 size-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 size-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="size-3.5" />
          <span>Done-For-You Restaurant Growth Services</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
          Let Our Experts Handle Your{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            Zomato & Swiggy
          </span>{" "}
          Operations
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Save dozens of hours. From uploading 100+ food photos, setting up complete new restaurant menus, to obtaining food licenses—our team handles the execution so you can focus on cooking great food.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-medium text-slate-200">
          <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <Zap className="size-4 text-amber-400 shrink-0" />
            <span>24–48h Turnaround</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
            <span>100% Platform Compliant</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <Headphones className="size-4 text-blue-400 shrink-0" />
            <span>Dedicated Specialist</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <Sparkles className="size-4 text-purple-400 shrink-0" />
            <span>Auto Support Ticket</span>
          </div>
        </div>
      </div>
    </div>
  );
}
