"use client";

import { Wallet } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex h-16 items-center border-b bg-card px-4 md:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold text-primary-foreground"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Wallet className="h-5 w-5" />
        </div>
        <span className="font-bold text-foreground">PocketWise</span>
      </Link>
    </header>
  );
}
