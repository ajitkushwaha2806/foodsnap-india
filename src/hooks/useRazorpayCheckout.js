"use client";
import { apiClient } from "@/lib/api-client";
import { useState, useCallback } from "react";
import { useUser } from "@/store/hooks/useUser";
import { promptLogin } from "@/lib/auth-helpers";
import { useNotification } from "@/store/hooks/useNotification";
import posthog from "posthog-js";
import { trackMetaEvent } from "@/lib/meta-pixel";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);

    if (window.Razorpay) {
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function useRazorpayCheckout() {
  const { user, isAuthenticated, fetchUser } = useUser();
  const { success, error: notifyError, info } = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePlanKey, setActivePlanKey] = useState(null);

  const startCheckout = useCallback(
    async (plan, optionsParam = {}) => {
      const planKey = typeof plan === "string" ? plan : plan?.key;
      const planName = typeof plan === "object" ? plan.name : "Subscription Plan";
      const tier = typeof plan === "object" ? plan.tier : optionsParam.tier;
      const includeUploadAddon = Boolean(
        typeof plan === "object" ? plan.includeUploadAddon : optionsParam.includeUploadAddon
      );

      if (!user && !isAuthenticated) {
        promptLogin({
          actionName: "purchase this plan",
          message: "Please sign in first to subscribe to a plan.",
          customRedirectPath: `/pricing?plan=${planKey}&includeUploadAddon=${includeUploadAddon}&autoCheckout=true`,
          duration: 4000,
        });
        return;
      }

      setIsProcessing(true);
      setActivePlanKey(planKey);

      try {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          throw new Error("Failed to load Razorpay Checkout SDK. Please check your connection.");
        }

        // 1. Create order on backend
        const orderRes = await apiClient.post("/api/payment/create-order", {
          planKey,
          tier,
          includeUploadAddon,
        });

        const { order_id, amount, currency, key_id } = orderRes.data;

        if (!order_id || !key_id) {
          throw new Error("Could not initialize payment order.");
        }

        // 2. Configure and open Razorpay Standard Checkout Modal
        const descriptionText = includeUploadAddon
          ? `${planName} + Done-For-You Photo Upload Add-on`
          : tier?.items
          ? `${planName} (Up to ${tier.items} Items)`
          : `${planName} - High-Res Food Photo Library`;

        const options = {
          key: key_id,
          amount,
          currency: currency || "INR",
          name: "FoodSnap India",
          description: descriptionText,
          image: "/assets/logo-transparent.png",
          order_id,
          prefill: {
            name: user?.name || "",
            contact: user?.phone || "",
          },
          theme: {
            color: "#16a34a",
          },
          handler: async (response) => {
            try {
              info("Verifying payment...");
              // 3. Verify signature on backend
              const verifyRes = await apiClient.post("/api/payment/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planKey,
                tier,
                includeUploadAddon,
              });

              if (verifyRes.data?.success) {
                posthog.capture("payment_completed", {
                  plan_key: planKey,
                  plan_name: planName,
                  amount_paise: amount,
                  currency: currency || "INR",
                  include_upload_addon: includeUploadAddon,
                  is_service: Boolean(verifyRes.data?.isService),
                  has_upload_addon: Boolean(verifyRes.data?.hasUploadAddon),
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                });
                trackMetaEvent("Purchase", {
                  content_name: planName,
                  value: amount / 100,
                  currency: currency || "INR",
                  content_type: "product",
                });
                if (verifyRes.data?.isService || verifyRes.data?.hasUploadAddon) {
                  success(
                    verifyRes.data?.message ||
                      "Payment successful! Our team will contact you shortly to upload your photos to Zomato & Swiggy.",
                    6000,
                    {
                      action: {
                        redirect: "/support",
                        buttonText: "View Support Request",
                        autoRedirect: true,
                      },
                    }
                  );
                } else {
                  success(
                    "Payment successful! Your plan and credits are now active.",
                    5000,
                    {
                      action: {
                        redirect: "/",
                        buttonText: "Go to Home",
                        autoRedirect: true,
                      },
                    }
                  );
                }
                await fetchUser?.();
              } else {
                notifyError("Payment verification failed. Please contact support.");
              }
            } catch (err) {
              notifyError(
                err?.response?.data?.message || "Payment verification failed."
              );
            } finally {
              setIsProcessing(false);
              setActivePlanKey(null);
            }
          },
          modal: {
            ondismiss: () => {
              posthog.capture("checkout_dismissed", {
                plan_key: planKey,
                plan_name: planName,
                amount_paise: amount,
              });
              setIsProcessing(false);
              setActivePlanKey(null);
              info("Payment checkout window closed.");
            },
          },
        };

        posthog.capture("checkout_started", {
          plan_key: planKey,
          plan_name: planName,
          amount_paise: amount,
          currency: currency || "INR",
          include_upload_addon: includeUploadAddon,
        });

        trackMetaEvent("InitiateCheckout", {
          content_name: planName,
          value: amount / 100,
          currency: currency || "INR",
        });

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (failResponse) => {
          posthog.capture("payment_failed", {
            plan_key: planKey,
            error_code: failResponse.error?.code,
            error_reason: failResponse.error?.reason,
          });
          notifyError(
            failResponse.error?.description || "Payment failed. Please try another method."
          );
          setIsProcessing(false);
          setActivePlanKey(null);
        });

        rzp.open();
      } catch (err) {
        console.error("Checkout initiation error:", err);
        const status = err?.response?.status;
        if (status === 401) {
          promptLogin({
            actionName: "purchase this plan",
            customRedirectPath: `/pricing?plan=${planKey}&autoCheckout=true`,
            duration: 4000,
          });
        } else {
          notifyError(
            err?.response?.data?.message || err?.message || "Failed to start checkout."
          );
        }
        setIsProcessing(false);
        setActivePlanKey(null);
      }
    },
    [user, isAuthenticated, fetchUser, success, notifyError, info]
  );

  return {
    startCheckout,
    isProcessing,
    activePlanKey,
  };
}

export default useRazorpayCheckout;
