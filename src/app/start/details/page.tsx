"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/lib/questions";
import { Header } from "@/components/header";

const Q7 = QUESTIONS[6]; // index 6 = Q7
const Q8 = QUESTIONS[7]; // index 7 = Q8

export default function DetailsPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0=Q7, 1=Q8, 2=Q9
  const [q7, setQ7] = useState<string[]>([]);
  const [q8, setQ8] = useState("");
  const [q9, setQ9] = useState("");
  const [gateId, setGateId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("gateId");
    if (!stored) {
      router.push("/start");
      return;
    }
    setGateId(stored);
  }, [router]);

  const toggleQ7 = (letter: string) => {
    setQ7((prev) => {
      if (prev.includes(letter)) {
        return prev.filter((l) => l !== letter);
      }
      if (prev.length >= 2) return prev;
      return [...prev, letter];
    });
  };

  const handleQ8Answer = (letter: string) => {
    setQ8(letter);
    setTimeout(() => setStep(2), 150);
  };

  const handleSubmit = async (skipAsin: boolean) => {
    if (!gateId) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/submit-final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateId,
          q7,
          q8,
          q9: skipAsin ? undefined : q9 || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      const { resultId } = await res.json();
      sessionStorage.removeItem("gateId");
      router.push(`/results/${resultId}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 9;
  const currentStepNum = step + 7; // Q7=7, Q8=8, Q9=9

  if (!gateId) return null;

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col bg-brand-almond">
        <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm text-brand-sesame">
              <span>Question {currentStepNum} of {totalSteps}</span>
              <span>{Math.round((currentStepNum / totalSteps) * 100)}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-brand-backbar">
              <div
                className="h-full rounded-full bg-brand-tender transition-all duration-300"
                style={{
                  width: `${(currentStepNum / totalSteps) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Q7 */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-brand-vault sm:text-2xl">
                {Q7.title}
              </h2>
              <p className="mt-2 text-sm italic text-brand-sesame">
                {Q7.helper}
              </p>

              <div className="mt-8 space-y-3">
                {Q7.options.map((opt) => (
                  <button
                    key={opt.letter}
                    onClick={() => toggleQ7(opt.letter)}
                    className={`w-full rounded-lg border-2 px-5 py-4 text-left transition-all ${
                      q7.includes(opt.letter)
                        ? "border-brand-tender bg-brand-tender/5 text-brand-vault"
                        : "border-brand-backbar bg-white text-brand-vault hover:border-brand-tender/40"
                    }`}
                  >
                    <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand-almond text-xs font-semibold text-brand-sesame">
                      {opt.letter}
                    </span>
                    <span className="text-sm font-medium sm:text-base">
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                disabled={q7.length === 0}
                className="mt-6 w-full rounded-md bg-brand-tender px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-tender/90 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}

          {/* Q8 */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-brand-vault sm:text-2xl">
                {Q8.title}
              </h2>
              <p className="mt-2 text-sm italic text-brand-sesame">
                {Q8.helper}
              </p>

              <div className="mt-8 space-y-3">
                {Q8.options.map((opt) => (
                  <button
                    key={opt.letter}
                    onClick={() => handleQ8Answer(opt.letter)}
                    className={`w-full rounded-lg border-2 px-5 py-4 text-left transition-all ${
                      q8 === opt.letter
                        ? "border-brand-tender bg-brand-tender/5 text-brand-vault"
                        : "border-brand-backbar bg-white text-brand-vault hover:border-brand-tender/40"
                    }`}
                  >
                    <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand-almond text-xs font-semibold text-brand-sesame">
                      {opt.letter}
                    </span>
                    <span className="text-sm font-medium sm:text-base">
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(0)}
                className="mt-6 text-sm font-medium text-brand-sesame transition-colors hover:text-brand-vault"
              >
                &larr; Back
              </button>
            </div>
          )}

          {/* Q9 (optional ASIN) */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-brand-vault sm:text-2xl">
                Want a live read on your hero ASIN?
              </h2>
              <p className="mt-2 text-sm italic text-brand-sesame">
                +30 seconds, optional. Drop a hero ASIN and we pull live Buy Box
                health, unauthorized-seller exposure, and content completeness
                from the same SmartScout backbone the top 2P operators use. Skip
                and we&apos;ll use category-level benchmarks.
              </p>

              <div className="mt-8">
                <label
                  htmlFor="asin"
                  className="mb-1.5 block text-sm font-medium text-brand-vault"
                >
                  ASIN (optional)
                </label>
                <input
                  id="asin"
                  type="text"
                  value={q9}
                  onChange={(e) => setQ9(e.target.value.toUpperCase())}
                  placeholder="B0XXXXXXXXX"
                  className="w-full rounded-lg border-2 border-brand-backbar bg-white px-4 py-3 font-mono text-brand-vault outline-none transition-colors focus:border-brand-tender"
                />
                {q9 && !/^B0[A-Z0-9]{8}$/.test(q9) && (
                  <p className="mt-1 text-xs text-brand-sesame">
                    ASINs typically start with B0 followed by 8 characters.
                    We&apos;ll use category benchmarks if this doesn&apos;t
                    match.
                  </p>
                )}
              </div>

              {error && (
                <p className="mt-4 text-sm text-score-critical">{error}</p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                  className="flex-1 rounded-md border-2 border-brand-backbar bg-white px-8 py-4 text-base font-semibold text-brand-vault transition-colors hover:border-brand-tender/40 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Skip and finish"}
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting}
                  className="flex-1 rounded-md bg-brand-tender px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-tender/90 disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : "Submit and see my score"}
                </button>
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-6 text-sm font-medium text-brand-sesame transition-colors hover:text-brand-vault"
              >
                &larr; Back
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
