"use client";
import Link from "next/link";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useUser } from "@/store/hooks/useUser";
import { Compass, Sparkles, FolderDown, HelpCircle, ArrowRight, Rocket } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarSeparator } from "@/components/ui/sidebar";

const navigationData = {
    groups: [
        {
            label: "Explore",
            items: [
                {
                    title: "Discover Images",
                    url: "/",
                    icon: Compass,
                },
                {
                    title: "Growth Services",
                    url: "/services",
                    icon: Rocket,
                },
                {
                    title: "My Downloads",
                    url: "/downloads",
                    icon: FolderDown,
                },
            ],
        },

        {
            label: "Help",
            items: [
                {
                    title: "Help & Support",
                    url: "/support",
                    icon: HelpCircle,
                },
            ],
        },
    ],
};

function CreditsBanner() {
    const { user } = useUser();
    const credits = user?.credits ?? 0;
    const planKey = (user?.subscription?.plan || "free").toLowerCase();
    const isSubscribed = Boolean(
        (user?.subscription?.isActive && planKey !== "free") ||
        (planKey !== "free" && user?.subscription?.expiresAt && new Date(user.subscription.expiresAt) > new Date())
    );

    const planName = isSubscribed
        ? planKey === "basic"
            ? "Basic Plan"
            : planKey === "pro"
            ? "Pro Plan"
            : planKey === "premium"
            ? "Premium Plan"
            : `${planKey.charAt(0).toUpperCase() + planKey.slice(1)} Plan`
        : "Free Plan";

    return (
        <div className="mx-3 my-2 p-3.5 rounded-md bg-slate-50 border border-slate-200/80 shadow-xs group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                    <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Sparkles className="size-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                        {planName}
                    </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                    {credits} Credits
                </span>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                {isSubscribed
                    ? "Enjoy high-res food photo downloads and premium assets."
                    : "Upgrade to unlock unlimited high-res food photo downloads."}
            </p>

            <Link
                href="/pricing"
                className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs transition-all duration-200 group/btn"
            >
                <span>{isSubscribed ? "Get More Credits" : "Upgrade to Pro"}</span>
                <ArrowRight className="size-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </Link>
        </div>
    );
}

export function AppSidebar({ ...props }) {
    return (
        <Sidebar
            collapsible="icon"
            className="border-r border-slate-200/80 bg-white"
            {...props}
        >
            <SidebarHeader className="p-3 border-b border-slate-100">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100/70 transition-colors"
                >
                    <div className="flex items-center gap-2 bg-primary group-data-[collapsible=icon]:hidden">
                        <img
                            src="/assets/logo-transparent.png"
                            alt="Foodsnap"
                            className="object-contain"
                        />
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="overflow-y-auto no-scrollbar pb-2">
                <NavMain groups={navigationData.groups} />
            </SidebarContent>

            <div className="mt-auto">
                <CreditsBanner />
                <SidebarSeparator className="my-1 opacity-60" />
            </div>

            <SidebarFooter className="p-2 border-t border-slate-100">
                <NavUser />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
