import Link from "next/link";
import { getCount } from "@/lib/counter";

export async function Footer() {
  const count = await getCount();

  return (
    <footer className="mt-auto border-t border-brand-backbar bg-brand-almond">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 pb-24 pt-8 sm:flex-row sm:justify-between sm:pb-8">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="text-sm text-brand-sesame">
            &copy; 2026 Neato. All rights reserved.
          </p>
          <p className="text-xs text-brand-sesame">
            {count}+ brands diagnosed since launch
          </p>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/methodology"
            className="text-sm text-brand-sesame transition-colors hover:text-brand-vault"
          >
            Methodology
          </Link>
          <Link
            href="#"
            className="text-sm text-brand-sesame transition-colors hover:text-brand-vault"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-sm text-brand-sesame transition-colors hover:text-brand-vault"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
