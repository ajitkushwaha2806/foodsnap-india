import { AlertTriangle, CheckCircle2, Info, AlertCircle } from "lucide-react";

export const NOTIFICATION_VARIANTS = {
  error: {
    border: "border-red-200 dark:border-red-900/60",
    bg: "bg-red-50/95 dark:bg-red-950/50 backdrop-blur-md",
    text: "text-red-900 dark:text-red-200",
    iconBg: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
    button: "bg-red-600 hover:bg-red-700 text-white",
    defaultIcon: <AlertCircle className="size-4 sm:size-4.5 shrink-0" />,
  },
  success: {
    border: "border-emerald-200 dark:border-emerald-900/60",
    bg: "bg-emerald-50/95 dark:bg-emerald-950/50 backdrop-blur-md",
    text: "text-emerald-900 dark:text-emerald-200",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-700 text-white",
    defaultIcon: <CheckCircle2 className="size-4 sm:size-4.5 shrink-0" />,
  },
  warning: {
    border: "border-amber-200 dark:border-amber-900/60",
    bg: "bg-amber-50/95 dark:bg-amber-950/50 backdrop-blur-md",
    text: "text-amber-900 dark:text-amber-200",
    iconBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
    button: "bg-amber-600 hover:bg-amber-700 text-white",
    defaultIcon: <AlertTriangle className="size-4 sm:size-4.5 shrink-0" />,
  },
  info: {
    border: "border-slate-200 dark:border-slate-800",
    bg: "bg-slate-50/95 dark:bg-slate-900/70 backdrop-blur-md",
    text: "text-slate-900 dark:text-slate-100",
    iconBg: "bg-primary/10 text-primary",
    button: "bg-primary hover:bg-primary/90 text-primary-foreground",
    defaultIcon: <Info className="size-4 sm:size-4.5 shrink-0" />,
  },
};
