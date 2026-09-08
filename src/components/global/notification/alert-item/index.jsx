"use client";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NOTIFICATION_VARIANTS } from "../helpers/constants";

export function AlertItem({ id, message, variant = "info", icon, action, duration = 4000, onDismiss, customSlot }) {
  const router = useRouter();
  const timerRef = useRef(null);
  const styles = NOTIFICATION_VARIANTS[variant] || NOTIFICATION_VARIANTS.info;

  const handleDismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (onDismiss) {
      onDismiss(id);
    }
  }, [id, onDismiss]);

  const handleAction = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (action?.onClick) {
      action.onClick();
    }
    if (action?.redirect) {
      router.push(action.redirect);
    }
    handleDismiss();
  }, [action, router, handleDismiss]);

  useEffect(() => {
    if (duration && duration > 0) {
      timerRef.current = setTimeout(() => {
        if (action?.redirect && action?.autoRedirect) {
          router.push(action.redirect);
        }
        handleDismiss();
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, action, router, handleDismiss]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id || message}
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={cn(
          "w-full rounded-lg border p-2.5 sm:p-3.5 shadow-xs flex items-center justify-between gap-3 transition-all overflow-hidden",
          styles.border,
          styles.bg,
          styles.text
        )}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div
            className={cn(
              "flex items-center justify-center size-7 sm:size-8 rounded-md shrink-0 shadow-xs",
              styles.iconBg
            )}
          >
            {icon || styles.defaultIcon}
          </div>

          <p
            className="text-xs sm:text-sm font-medium leading-snug truncate sm:whitespace-normal flex-1"
            title={typeof message === "string" ? message : undefined}
          >
            {message}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {action?.buttonText && (
            <button
              type="button"
              className={cn(
                "h-7 sm:h-8 px-2.5 sm:px-3 text-xs font-semibold rounded-md shadow-xs shrink-0 cursor-pointer transition-all duration-150 active:scale-95",
                styles.button
              )}
              onClick={handleAction}
            >
              {action.buttonText}
            </button>
          )}

          {customSlot}

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss notification"
            className="flex items-center justify-center size-7 sm:size-8 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="size-3.5 sm:size-4" />
          </button>
        </div>

        {duration && duration > 0 && (
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 bg-current opacity-35"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}