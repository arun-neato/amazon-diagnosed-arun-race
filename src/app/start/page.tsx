"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, CATEGORY_OPTIONS, ROLE_OPTIONS } from "@/lib/questions";
import { Header } from "@/components/header";

type Answers = Record<string, string | string[]>;

const PRE_GATE_QUESTIONS = QUESTIONS.slice(0, 6); // Q1-Q6

export default function StartPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0-5 = Q1-Q6, 6 = email gate
  const [answers, setAnswers] = useState<Answers>({});
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gate form
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("");
  const [gateError, setGateError] = useState("");

  const currentQuestion = step < 6 ? PRE_GATE_QUESTIONS[step] : null;
  const totalSteps = 9;

  const handleAnswer = useCallback(
    (letter: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: letter }));
      // Auto-advance for single select
      setDirection("forward");
      setTimeout(() => setStep((s) => s + 1), 150);
    },
    [currentQuestion],
  );

  const handleBack = useCallback(() => {
    if (step > 0) {
      setDirection("back");
      setStep((s) => s - 1);
    }
  }, [step]);

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/submit-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          email,
          firstName,
          company,
          role,
          category,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setGateError(data.error || "Something went wrong. Please try again.");
        return;
      }

      const { gateId } = await res.json();
      // Store gateId and navigate to details
      sessionStorage.setItem("gateId", gateId);
      router.push("/start/details");
    } catch {
      setGateError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isGateValid = email && firstName && company && role && category;

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col bg-brand-almond">
        <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm text-brand-sesame">
              <span>
                {step < 6
                  ? `Question ${step + 1} of ${totalSteps}`
                  : `Almost there`}
              </span>
              <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-brand-backbar">
              <div
                className="h-full rounded-full bg-brand-tender transition-all duration-300"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Question or Gate */}
          <div
            className="transition-all duration-300"
            style={{
              opacity: 1,
              transform:
                direction === "forward"
                  ? "translateX(0)"
                  : "translateX(0)",
            }}
          >
            {step < 6 && currentQuestion ? (
              <div key={currentQuestion.id}>
                <h2 className="text-xl font-bold text-brand-vault sm:text-2xl">
                  {currentQuestion.title}
                </h2>
                <p className="mt-2 text-sm italic text-brand-sesame">
                  {currentQuestion.helper}
                </p>

                <div className="mt-8 space-y-3">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt.letter}
                      onClick={() => handleAnswer(opt.letter)}
                      className={`w-full rounded-lg border-2 px-5 py-4 text-left transition-all ${
                        answers[currentQuestion.id] === opt.letter
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
              </div>
            ) : (
              /* Email Gate */
              <div>
                <h2 className="text-xl font-bold text-brand-vault sm:text-2xl">
                  You&apos;re 75% done. Where do we send the scorecard?
                </h2>
                <p className="mt-2 text-sm text-brand-sesame">
                  Drop your email and we&apos;ll save your progress. Three more
                  questions, one optional. The full scorecard hits your inbox in
                  under two minutes.
                </p>

                <form onSubmit={handleGateSubmit} className="mt-8 space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-brand-vault"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border-2 border-brand-backbar bg-white px-4 py-3 text-brand-vault outline-none transition-colors focus:border-brand-tender"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-1.5 block text-sm font-medium text-brand-vault"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-lg border-2 border-brand-backbar bg-white px-4 py-3 text-brand-vault outline-none transition-colors focus:border-brand-tender"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="mb-1.5 block text-sm font-medium text-brand-vault"
                    >
                      Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-lg border-2 border-brand-backbar bg-white px-4 py-3 text-brand-vault outline-none transition-colors focus:border-brand-tender"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="role"
                      className="mb-1.5 block text-sm font-medium text-brand-vault"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-lg border-2 border-brand-backbar bg-white px-4 py-3 text-brand-vault outline-none transition-colors focus:border-brand-tender"
                    >
                      <option value="">Select your role</option>
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="mb-1.5 block text-sm font-medium text-brand-vault"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-lg border-2 border-brand-backbar bg-white px-4 py-3 text-brand-vault outline-none transition-colors focus:border-brand-tender"
                    >
                      <option value="">Select your category</option>
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {gateError && (
                    <p className="text-sm text-score-critical">{gateError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={!isGateValid || isSubmitting}
                    className="w-full rounded-md bg-brand-tender px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-tender/90 disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : "Save my progress and continue"}
                  </button>

                  <p className="text-center text-xs text-brand-sesame">
                    One follow-up email with your scorecard. Nothing else unless
                    you ask.
                  </p>
                </form>
              </div>
            )}
          </div>

          {/* Back button */}
          {step > 0 && step < 6 && (
            <button
              onClick={handleBack}
              className="mt-6 text-sm font-medium text-brand-sesame transition-colors hover:text-brand-vault"
            >
              &larr; Back
            </button>
          )}
        </div>
      </main>
    </>
  );
}
