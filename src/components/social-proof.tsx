import { getCount } from "@/lib/counter";

export async function SocialProof() {
  const count = await getCount();

  return (
    <section className="border-t border-brand-backbar bg-brand-almond">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-14">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-2xl font-semibold text-brand-vault sm:text-3xl">
              $679M+
            </p>
            <p className="mt-0.5 text-xs leading-tight text-brand-sesame">
              Amazon revenue across the
              <br className="sm:hidden" /> cohort we benchmark against
            </p>
          </div>

          <div className="hidden h-8 w-px bg-brand-backbar sm:block" aria-hidden="true" />

          <div>
            <p className="text-2xl font-semibold text-brand-vault sm:text-3xl">
              540M
            </p>
            <p className="mt-0.5 text-xs leading-tight text-brand-sesame">
              ASINs in our dataset
            </p>
          </div>

          <div className="hidden h-8 w-px bg-brand-backbar sm:block" aria-hidden="true" />

          <div>
            <p className="text-2xl font-semibold text-brand-vault sm:text-3xl">
              {count}+
            </p>
            <p className="mt-0.5 text-xs leading-tight text-brand-sesame">
              brands diagnosed
            </p>
          </div>

          <div className="hidden h-8 w-px bg-brand-backbar sm:block" aria-hidden="true" />

          <div className="max-w-[220px]">
            <p className="text-sm font-medium leading-snug text-brand-vault">
              Trusted by Fortune 500 CPG brands, mid-market leaders, and
              strategic investors
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
