"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Mobile: bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-backbar bg-white/95 px-4 py-3 backdrop-blur-sm sm:hidden">
        <Link
          href="/start"
          className="block w-full rounded-md bg-brand-tender px-6 py-3.5 text-center text-sm font-semibold text-white"
        >
          Run the diagnostic &mdash; 90 seconds
        </Link>
        <p className="mt-1.5 text-center text-xs text-brand-sesame">
          8 questions &middot; top 10% benchmark &middot; scorecard in 2 min
        </p>
      </div>

      {/* Desktop: sticky side card */}
      <div className="fixed bottom-8 right-8 z-50 hidden w-[280px] rounded-lg border border-brand-backbar bg-white p-5 sm:block">
        <p className="text-sm font-bold text-brand-vault">
          Ready to see where you sit?
        </p>
        <p className="mt-1 text-xs text-brand-sesame">
          8 questions &middot; top 10% benchmark &middot; scorecard in 2 min
        </p>
        <Link
          href="/start"
          className="mt-3 block w-full rounded-md bg-brand-tender px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-tender/90"
        >
          Run the diagnostic
        </Link>
      </div>
    </>
  );
}
