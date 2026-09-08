"use client";
import { store } from "@/store";
import { useEffect } from "react";
import { Provider } from "react-redux";
import Notification from "../notification";
import { usePathname } from "next/navigation";
import QueryProvider from "@/providers/QueryProvider";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { setupAxiosInterceptors } from "@/lib/auth-helpers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AppShell({ children }) {
    const pathname = usePathname();
    const AUTH_ROUTES = ["/sign-in", "/sign-up", "/login", "/register"];
    const isAuthPage = AUTH_ROUTES.some((route) => pathname?.startsWith(route));

    useEffect(() => {
        setupAxiosInterceptors?.();
    }, []);

    useEffect(() => {
        const handleContext = (e) => e.preventDefault();
        document.addEventListener("contextmenu", handleContext);
        return () => document.removeEventListener("contextmenu", handleContext);
    }, []);

    useEffect(() => {
        const preventDrag = (e) => {
            if (e.target.tagName === "IMG") e.preventDefault();
        };

        document.addEventListener("dragstart", preventDrag);
        return () => document.removeEventListener("dragstart", preventDrag);
    }, []);

    return (
        <Provider store={store}>
            <QueryProvider>
                <InnerAppShell isAuthPage={isAuthPage}>{children}</InnerAppShell>
            </QueryProvider>
        </Provider>
    );
}

function InnerAppShell({ isAuthPage, children }) {
    if (isAuthPage) {
        return <main className="min-h-screen w-full">{children}</main>;
    }

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            }}
        >
            <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar variant="inset" />

                <SidebarInset className="flex flex-1 flex-col min-w-0 overflow-hidden">
                    <SiteHeader />
                    <div className="w-full px-3 pt-2.5 sm:px-5 sm:pt-3.5 shrink-0">
                        <Notification />
                    </div>
                    <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}