import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b border-brand-backbar bg-brand-almond">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-brand-vault"
        >
          Neato
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/methodology"
            className="text-sm font-medium text-brand-sesame transition-colors hover:text-brand-vault"
          >
            Methodology
          </Link>
          <Link
            href="/start"
            className="rounded-md bg-brand-tender px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-tender/90"
          >
            Run the diagnostic
          </Link>
        </nav>
      </div>
    </header>
  );
}
