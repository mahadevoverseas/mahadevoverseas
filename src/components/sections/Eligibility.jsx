"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Info, Loader2, RotateCcw } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSite } from "@/components/providers/ContentProvider";
import { submitEnquiry, PHONE_RE, EMAIL_RE } from "@/lib/submit-enquiry";
import SplitReveal from "@/components/ui/SplitReveal";
import { suggestCountries as suggest } from "@/lib/eligibility";


export default function Eligibility() {
  const { eligibility, countries } = useSite();
  const panelRef = useRef(null);
  const total = eligibility.steps.length;
  const [step, setStep] = useState(0); // 0..total-1 questions, total = results+form, total+1 = thanks
  const [answers, setAnswers] = useState({});
  const [lead, setLead] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(panelRef.current, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" });
    },
    { dependencies: [step], scope: panelRef }
  );

  const choose = (id, value) => {
    setAnswers((a) => ({ ...a, [id]: value }));
    setTimeout(() => setStep((s) => Math.min(total, s + 1)), 220);
  };

  const results = step >= total ? suggest(answers, countries, eligibility) : [];

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!lead.name.trim()) return setStatus({ state: "error", message: "Please enter your name." });
    if (!PHONE_RE.test(lead.phone.trim())) return setStatus({ state: "error", message: "Please enter a valid phone number." });
    if (!EMAIL_RE.test(lead.email.trim())) return setStatus({ state: "error", message: "Please enter a valid email address." });
    setStatus({ state: "loading", message: "" });
    try {
      await submitEnquiry({
        source: "eligibility-checker",
        ...lead,
        answers,
        suggestions: results.map((r) => r.name),
        website: e.currentTarget.website?.value ?? "",
      });
      setStatus({ state: "idle", message: "" });
      setStep(total + 1);
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setStatus({ state: "idle", message: "" });
  };

  const progress = Math.min(step, total) / total;
  const q = eligibility.steps[step];

  return (
    <section id="eligibility" aria-labelledby="elig-title" className="relative overflow-hidden bg-charcoal py-28 md:py-40">
      <div className="globe-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-5 text-brand-cyan">{eligibility.eyebrow}</p>
          <SplitReveal id="elig-title" className="font-display text-[clamp(2.8rem,7vw,6rem)] text-ink">
            {eligibility.title}
          </SplitReveal>
          <p className="mt-6 max-w-md text-muted">{eligibility.intro}</p>
          <p className="mt-8 flex max-w-md gap-3 rounded-[10px] border border-white/10 bg-card/60 p-4 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 size-4 shrink-0 text-brand-cyan" aria-hidden="true" />
            {eligibility.disclaimer}
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="card relative overflow-hidden p-6 md:p-10">
            {/* progress */}
            <div className="mb-8 flex items-center gap-4">
              <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full origin-left bg-brand-red transition-transform duration-700 ease-out-expo"
                  style={{ transform: `scaleX(${step > total ? 1 : progress})` }}
                />
              </div>
              <span className="font-display text-sm tracking-[0.2em] text-muted">
                {step < total ? `0${step + 1} / 0${total}` : "Done"}
              </span>
            </div>

            <div ref={panelRef} aria-live="polite">
              {step < total && (
                <fieldset>
                  <legend className="font-display mb-6 text-[clamp(1.9rem,4vw,3rem)] text-ink">{q.question}</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {q.options.map((o) => {
                      const selected = answers[q.id] === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => choose(q.id, o.value)}
                          aria-pressed={selected}
                          className={`flex items-center justify-between gap-3 rounded-[10px] border px-5 py-4 text-left text-sm font-semibold transition-colors ${
                            selected ? "border-brand-red bg-brand-red/10 text-ink" : "border-white/12 text-ink/90 hover:border-white/40 hover:bg-white/5"
                          }`}
                        >
                          {o.label}
                          <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${selected ? "border-brand-red bg-brand-red" : "border-white/30"}`}>
                            {selected && <Check className="size-3 text-white" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {step > 0 && (
                    <button type="button" onClick={() => setStep((s) => s - 1)} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
                      <ArrowLeft className="size-4" /> Back
                    </button>
                  )}
                </fieldset>
              )}

              {step === total && (
                <div>
                  <p className="text-xs font-bold tracking-[0.25em] text-brand-cyan uppercase">Countries that may suit you</p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                    {results.map((c, i) => (
                      <li key={c.id} className={`rounded-[10px] border p-4 ${i === 0 ? "border-brand-red/60 bg-brand-red/10" : "border-white/12"}`}>
                        <Image src={`https://flagcdn.com/w80/${c.flag}.png`} alt="" width={40} height={27} className="h-[27px] w-10 rounded-[3px] object-cover" />
                        <p className="font-display mt-3 text-2xl text-ink">{c.name}</p>
                        <p className="mt-1 text-xs text-muted">{c.tuition}</p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs leading-relaxed text-muted">
                    Guidance only — not a guarantee of admission or visa approval. Share your details and a counsellor will review your full profile for free.
                  </p>

                  <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-3 sm:grid-cols-3">
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                    <label className="sr-only" htmlFor="el-name">Name</label>
                    <input id="el-name" className="field" placeholder="Your name" autoComplete="name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
                    <label className="sr-only" htmlFor="el-phone">Phone</label>
                    <input id="el-phone" className="field" placeholder="Phone" type="tel" inputMode="tel" autoComplete="tel" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
                    <label className="sr-only" htmlFor="el-email">Email</label>
                    <input id="el-email" className="field" placeholder="Email" type="email" autoComplete="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
                    <div className="flex flex-wrap items-center gap-4 sm:col-span-3">
                      <button type="submit" disabled={status.state === "loading"} className="btn btn-red disabled:opacity-60">
                        {status.state === "loading" ? <Loader2 className="size-4 animate-spin" /> : null}
                        Get my free counselling call <ArrowRight className="size-4" />
                      </button>
                      <button type="button" onClick={reset} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
                        <RotateCcw className="size-4" /> Start over
                      </button>
                    </div>
                    {status.state === "error" && (
                      <p role="alert" className="text-sm font-semibold text-brand-red sm:col-span-3">
                        {status.message}
                      </p>
                    )}
                  </form>
                </div>
              )}

              {step > total && (
                <div className="py-6 text-center">
                  <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-red/15 text-brand-red">
                    <Check className="size-8" />
                  </span>
                  <p className="font-display mt-6 text-4xl text-ink">Thank you, {lead.name.split(" ")[0]}!</p>
                  <p className="mx-auto mt-3 max-w-md text-muted">A counsellor will call you soon to talk through your options.</p>
                  <button type="button" onClick={reset} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
                    <RotateCcw className="size-4" /> Check again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
