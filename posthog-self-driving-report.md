# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for this web application. Session Replay, Error Tracking, and Support were enabled, and the health, error-tracking, and support signal sources were switched on. Findings should begin appearing in the [Self-driving inbox](https://eu.posthog.com/project/271307/inbox) within about 30 minutes.

## AI data processing

Approved by the organization-level setup gate.

## GitHub

Connected before this setup began. GitHub Issues was not selected as a Self-driving source, so no GitHub Issues responder was enabled.

## Products enabled

| Product | Status | Notes |
| --- | --- | --- |
| Session Replay | enabled | This is a browser app and the `posthog.init` configuration does not disable recording. No recordings were present during setup. |
| Error Tracking | enabled | The browser SDK already has exception capture enabled. |
| Support | enabled | Connect an inbound email, inbox, or Slack channel in PostHog before Support tickets can arrive. |

## Signal sources

| Signal source | Action | Details |
| --- | --- | --- |
| `health_checks` / `health_issue` | enabled | Source config `01a08c47-edf7-721c-a02b-c72fbe08c80f`. |
| `error_tracking` / `issue_created` | enabled | Source config `01a08c47-ed32-7326-bad5-57f271b5d792`. |
| `error_tracking` / `issue_reopened` | enabled | Source config `01a08c47-ed08-7e46-9b9b-438dd0206701`. |
| `error_tracking` / `issue_spiking` | enabled | Source config `01a08c47-ee10-725e-8696-577fb65744c8`. |
| `conversations` / `ticket` | enabled | Source config `01a08c47-ed24-7408-9c96-71400cc3162b`; remains idle until an inbound Support channel is connected. |
| `signals_scout` / `cross_source_issue` | skipped | Scout findings are enabled by default; no opt-out row existed. |
| Session replay responder | skipped | Replay data reaches Self-driving through the Replay Vision scanners below, not a source-config row. |

## Connected tools

No external issue tracker, error tracker, support desk, security scanner, feedback tool, database-performance tool, or search-analytics source was selected. No connected-tool responders were created.

## Scout troop

**Run budget:** 100 maximum runs per day; 0 used and 100 remaining when configured. The project is enrolled in early access; the platform banner says to contact `team-self-driving@posthog.com` to request more runs.

| Scout | Status | Reason |
| --- | --- | --- |
| `general` | enabled | Cross-product correlations and otherwise-uncovered surfaces. |
| `product-analytics` | enabled | Core user flows such as image search, download, account, and support interactions. |
| `web-analytics` | enabled | Website traffic, landing-page health, attribution, and bounce/404 changes. |
| `revenue-analytics` | enabled | Payment and revenue capture/configuration health. |
| `signals-scout-razorpay-checkout` | enabled | Approved custom coverage for checkout reliability. |
| `ai-observability` | disabled | No AI/LLM telemetry was found. |
| `anomaly-detection` | disabled | No established dashboard or insight watchlist was found. |
| `apm` | disabled | No APM/OpenTelemetry surface was found. |
| `conversations` | disabled | The Support product has no inbound channel or Conversations events yet. |
| `csp-violations` | disabled | No CSP reporting configuration was found. |
| `customer-analytics` | disabled | No B2B account/group analytics surface was found. |
| `data-pipelines` | disabled | No PostHog CDP or export pipeline was found. |
| `data-warehouse` | disabled | No warehouse sources were connected. |
| `error-tracking` | disabled | Covered by the native Error Tracking responders. |
| `experiments` | disabled | No active experiment surface was found. |
| `feature-flags` | disabled | No feature flag usage was found. |
| `health-checks` | disabled | Native health-check responder supplies this route. |
| `inbox-validation` | disabled | Fresh setup has no resolved Self-driving reports to validate. |
| `insight-alerts` | disabled | No configured insight-alert surface was found. |
| `logs` | disabled | No PostHog logs usage was found. |
| `mcp-tool-calls` | disabled | Not a product telemetry surface for this application. |
| `observability-gaps` | disabled | Kept the troop focused; enable later if insight-coverage recommendations are wanted. |
| `replay-vision` | disabled | No pre-existing Replay Vision observations existed; the two new scanners need time to collect observations. |
| `session-replay` | disabled | Covered by the Replay Vision scanners below. |
| `skills-store` | disabled | Not an application-product surface. |
| `surveys` | disabled | No surveys were found. |
| `tasks` | disabled | No PostHog Tasks surface was found. |
| `web-vitals` | disabled | No Web Vitals evidence was available; enable if page-performance monitoring becomes a priority. |

## Custom scouts

| Scout | Status | Coverage and discriminator |
| --- | --- | --- |
| `signals-scout-razorpay-checkout` | created and enabled | Watches checkout starts, completed payments, and payment failures. It reports only sustained high-volume completion-rate regressions, failure-rate spikes, or continued attempts with missing completions after settlement lag. The generic revenue scout watches broader revenue data/configuration health; it does not own this browser-checkout reliability discriminator. |
| Image search-to-download health | proposed, declined | This candidate would have detected healthy search volume with download collapse or rising image reports—an entry-volume/content-quality gap that the conversion scout only partly covers. |

If a custom scout proves noisy, set `emit: false` on its scout configuration in PostHog to leave it running in dry-run mode without sending inbox reports.

## Replay Vision scanners

A Replay Vision scanner is an LLM that watches individual session recordings on a schedule and pushes what it finds to the Self-driving inbox. These are the only items in this setup that spend Replay Vision quota. Findings arrive at half weight and need independent corroboration before they are promoted into a report.

| Brief | Status | Scope | Sampling | Estimate |
| --- | --- | --- | --- | --- |
| Breakage monitor: **FoodSnap purchase breakage** | created | Recordings whose URL matches the pricing or services routes, the purchase completion flow and its service predecessor. Looks for visibly broken checkout loading, order/verification, credit activation, and service confirmation. | 50% | 0 observations and 0 credits/month from the recent seven-day sample. |
| Frustration monitor: **FoodSnap user frustration** | created | Recordings containing `$rageclick` only; no URL filter was added. Looks for visible struggle in image search/download, purchase/payment, authentication, or support-form submission. | 100% | 0 observations and 0 credits/month from the recent seven-day sample. |

The organization had 2,500 Replay Vision credits remaining and was not exhausted at setup. No session recordings were found, so both scanners are armed and will start working when recordings begin.

## Files modified or created

| Path | Change |
| --- | --- |
| `posthog-self-driving-report.md` | Created this setup report. |
| `.claude/skills/replay-vision-scanners-core/` | Installed shared scanner workflow skill. |
| `.claude/skills/replay-vision-scanner-broken-experiences/` | Installed the breakage-monitor brief. |
| `.claude/skills/replay-vision-scanner-user-frustration/` | Installed the frustration-monitor brief. |

No application source files or environment files were changed.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so the enabled Support responder can receive tickets.
- [ ] Generate real browser traffic so Session Replay receives recordings; the new Replay Vision scanners then begin producing observations automatically.
- [ ] Reauthorize the PostHog MCP connection with `property_definition:read` if you want interactive event-schema inspection from this environment. The configuration was based on the repository’s existing PostHog captures because that read scope was unavailable.
- [ ] Consider enabling `web-vitals` if Core Web Vitals monitoring becomes important, and `observability-gaps` once the project has saved insights and dashboards to assess.

## What happens next

Fresh scout configurations are picked up by the coordinator within about 30 minutes and draw from the project’s daily run budget. Findings cluster into reports in the [Self-driving inbox](https://eu.posthog.com/project/271307/inbox); immediately actionable reports can initiate coding tasks.
