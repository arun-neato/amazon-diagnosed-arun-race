import { getResult } from "@/lib/store";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResultsClient } from "./results-client";
import { ResultsFallback } from "./results-fallback";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResult(id);

  // If server has the result (Blob persistence or same-invocation memory), render it
  if (result) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-brand-almond">
          <ResultsClient result={result} />
        </main>
        <Footer />
      </>
    );
  }

  // Fallback: try to load from client sessionStorage
  return (
    <>
      <Header />
      <main className="flex-1 bg-brand-almond">
        <ResultsFallback id={id} />
      </main>
      <Footer />
    </>
  );
}
