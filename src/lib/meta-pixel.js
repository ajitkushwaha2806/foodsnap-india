export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1674228269954185";

export const trackPageView = () => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
};

export const trackMetaEvent = (event, data = {}) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, data);
  }
};

export const trackMetaCustomEvent = (event, data = {}) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("trackCustom", event, data);
  }
};
