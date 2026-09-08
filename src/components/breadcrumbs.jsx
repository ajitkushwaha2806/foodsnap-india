"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname ? pathname.split("/").filter(Boolean) : [];

  return (
    <div className="flex justify-between w-full items-center">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors font-medium">
          Home
        </Link>

        {segments.map((segment, idx) => {
          const href = "/" + segments.slice(0, idx + 1).join("/");
          const isLast = idx === segments.length - 1;
          const formattedText = decodeURIComponent(segment).replace(/-/g, " ");

          return (
            <span key={href} className="flex items-center gap-1">
              <ChevronRight size={14} className="text-muted-foreground/70 shrink-0" />
              {isLast ? (
                <span className="text-foreground font-semibold capitalize">
                  {formattedText}
                </span>
              ) : (
                <Link href={href} className="hover:text-foreground transition-colors capitalize">
                  {formattedText}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}

export default Breadcrumbs;
