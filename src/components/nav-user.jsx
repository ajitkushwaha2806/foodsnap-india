"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/store/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown, LogOut, Sparkles, Zap, FolderDown, HelpCircle, LogIn } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, loading, isAuthenticated, fetchUser, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const displayName = user?.name || (user?.phone ? `User-${user.phone.slice(-4)}` : "Guest User");
  const avatarFallback = displayName.charAt(0).toUpperCase();
  const planKey = (user?.subscription?.plan || "free").toLowerCase();
  const isSubscribed = Boolean(
    (user?.subscription?.isActive && planKey !== "free") ||
    (planKey !== "free" && user?.subscription?.expiresAt && new Date(user.subscription.expiresAt) > new Date())
  );
  const isPro = isSubscribed;
  const planDisplay = isSubscribed
    ? planKey === "basic"
      ? "Basic"
      : planKey === "pro"
      ? "Pro"
      : planKey === "premium"
      ? "Premium"
      : planKey
    : "Free";
  const credits = user?.credits ?? 0;

  const logoutUser = async () => {
    await logout();
    router.push("/sign-in");
  };

  if (!loading && !isAuthenticated && !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            size="lg"
            className="rounded-md border border-dashed border-slate-200 dark:border-slate-800 hover:bg-primary/5 hover:text-primary transition-all"
          >
            <Link href="/sign-in" className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <LogIn className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-xs">Sign In / Register</span>
                <span className="text-[11px] text-muted-foreground">Access your account</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="relative rounded-md transition-all duration-200 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 p-2"
            >
              {loading ? (
                <div className="flex items-center gap-2.5 w-full animate-pulse">
                  <div className="h-8 w-8 rounded-md bg-slate-200 dark:bg-slate-700 shrink-0" />
                  <div className="flex-1 space-y-1.5 group-data-[collapsible=icon]:hidden">
                    <div className="h-3 w-20 rounded-md bg-slate-200 dark:bg-slate-700" />
                    <div className="h-2.5 w-28 rounded-md bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative shrink-0">
                    <Avatar className="h-8 w-8 rounded-md border border-slate-200 dark:border-slate-700">
                      <AvatarImage
                        src={
                          user?.avatar
                            ? user.avatar.startsWith("http")
                              ? user.avatar
                              : `${process.env.NEXT_PUBLIC_BASE_URL || ""}/${user.avatar}`
                            : ""
                        }
                        alt={displayName}
                      />
                      <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    {isPro && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                      </span>
                    )}
                  </div>

                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-semibold text-xs text-foreground">
                        {displayName}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wide uppercase",
                          isPro
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        )}
                      >
                        {planDisplay}
                      </span>
                    </div>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {user?.email || user?.phone || `${credits} credits`}
                    </span>
                  </div>

                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-md p-1.5 shadow-xl border border-slate-200/80 dark:border-slate-800"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="flex items-center gap-3 text-left">
                <Avatar className="h-9 w-9 rounded-md border border-slate-200 dark:border-slate-700">
                  <AvatarImage
                    src={
                      user?.avatar
                        ? user.avatar.startsWith("http")
                          ? user.avatar
                          : `${process.env.NEXT_PUBLIC_BASE_URL || ""}/${user.avatar}`
                        : ""
                    }
                    alt={displayName}
                  />
                  <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-foreground">
                    {displayName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email || user?.phone || "Free Member"}
                  </span>
                </div>
              </div>

              {/* Credits & Plan summary badge */}
              <div className="mt-2.5 flex items-center justify-between rounded-md bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Zap className="size-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Credits
                  </span>
                </div>
                <span className="text-xs font-bold text-primary">
                  {credits} left
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuGroup className="space-y-0.5">
              <Link href="/pricing">
                <DropdownMenuItem className="cursor-pointer gap-2.5 rounded-md py-2 text-xs font-medium text-amber-600 dark:text-amber-400 focus:bg-amber-50 dark:focus:bg-amber-950/30">
                  <Sparkles className="size-4" />
                  <span>{isPro ? "Manage Plan" : "Upgrade to Pro"}</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/downloads">
                <DropdownMenuItem className="cursor-pointer gap-2.5 rounded-md py-2 text-xs font-medium focus:bg-slate-100 dark:focus:bg-slate-800">
                  <FolderDown className="size-4 text-muted-foreground" />
                  <span>My Downloads</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/support">
                <DropdownMenuItem className="cursor-pointer gap-2.5 rounded-md py-2 text-xs font-medium focus:bg-slate-100 dark:focus:bg-slate-800">
                  <HelpCircle className="size-4 text-muted-foreground" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={logoutUser}
              className="cursor-pointer gap-2.5 rounded-md py-2 text-xs font-medium text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-600"
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
