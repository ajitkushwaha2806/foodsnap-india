"use client";
import { Breadcrumbs } from "../breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xs transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1.5 px-4 lg:gap-2.5 lg:px-6">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors" />
        <Separator
          orientation="vertical"
          className="mx-1.5 h-4 bg-slate-200 dark:bg-slate-800"
        />
        <Breadcrumbs />
      </div>
    </header>
  );
}

export default SiteHeader;
