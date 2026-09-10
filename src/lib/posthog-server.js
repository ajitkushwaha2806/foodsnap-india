import { PostHog } from "posthog-node";

let posthogClient = null;

export function getPostHogServer() {
  if (!posthogClient && process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
    posthogClient = new PostHog(
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
      {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
        flushAt: 1,
        flushInterval: 0,
      }
    );
  }
  return posthogClient;
}

export default getPostHogServer;
