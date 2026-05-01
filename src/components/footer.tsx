import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-backbar bg-brand-almond">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
        <p className="text-sm text-brand-sesame">
          &copy; 2026 Neato. All rights reserved.
        </p>
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
