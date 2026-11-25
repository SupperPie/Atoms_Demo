"use client";

import Link from "next/link";
import { ArrowUpRight, Database } from "lucide-react";

import { BrandLockup } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SiteHeader({
  right,
  className,
}: {
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-white/[0.06] bg-[#05060b]/70 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-8">
        <Link href="/" className="transition-opacity hover:opacity-85">
          <BrandLockup />
        </Link>
        <div className="flex items-center gap-2.5">
          <Badge className="hidden gap-1.5 border-white/10 bg-white/[0.04] text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground sm:inline-flex">
            <Database className="size-3" />
            Local Persisted
          </Badge>
          {right}
        </div>
      </div>
    </header>
  );
}

export function DemoLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
    >
      {label}
      <ArrowUpRight className="size-3" />
    </Link>
  );
}
