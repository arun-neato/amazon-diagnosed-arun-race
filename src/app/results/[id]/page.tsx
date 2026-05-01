import { notFound } from "next/navigation";
import { getResult } from "@/lib/store";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResultsClient } from "./results-client";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result) {
    notFound();
  }

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
