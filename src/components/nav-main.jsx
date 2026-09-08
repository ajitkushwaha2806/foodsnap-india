"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function NavMain({ groups = [] }) {
  const pathname = usePathname();

  return (
    <div className="space-y-4 px-2 py-2">
      {groups.map((group, groupIdx) => (
        <SidebarGroup key={groupIdx} className="p-0">
          {group.label && (
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 px-2 mb-1.5 group-data-[collapsible=icon]:hidden">
              {group.label}
            </SidebarGroupLabel>
          )}
          <SidebarMenu className="gap-1">
            {group.items.map((item) => {
              const isActive =
                item.url === "/"
                  ? pathname === "/"
                  : pathname === item.url || pathname?.startsWith(`${item.url}/`);

              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive}
                    className={cn(
                      "relative h-10 px-3 rounded-md font-medium transition-all duration-200 group/btn",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3 w-full">
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-md group-data-[collapsible=icon]:hidden" />
                      )}

                      {Icon && (
                        <div
                          className={cn(
                            "flex items-center justify-center size-5 shrink-0 transition-transform duration-200 group-hover/btn:scale-110",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover/btn:text-foreground"
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                      )}

                      <span className="truncate text-sm flex-1 group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>

                      {item.badge && (
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider group-data-[collapsible=icon]:hidden",
                            item.badgeColor ||
                            "bg-primary/15 text-primary"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </div>
  );
}
