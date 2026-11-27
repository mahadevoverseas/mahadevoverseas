"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Loader2, Send, CheckCircle2 } from "lucide-react";
import { useSite } from "@/components/providers/ContentProvider";
import { whatsappLink } from "@/lib/site";
import { submitEnquiry, PHONE_RE, EMAIL_RE } from "@/lib/submit-enquiry";
import { WhatsAppIcon } from "@/components/ui/icons";
import SplitReveal from "@/components/ui/SplitReveal";
import Magnetic from "@/components/ui/Magnetic";
import Reveal from "@/components/ui/Reveal";

const EMPTY = { name: "", phone: "", email: "", country: "", intake: "", message: "" };

export default function Contact() {
  const { contact, contactSection, countries } = useSite();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!PHONE_RE.test(form.phone.trim())) e.phone = "Please enter a valid phone number.";
    if (!EMAIL_RE.test(form.email.trim())) e.email = "Please enter a valid email.";
    if (!form.country) e.country = "Please choose a country.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus({ state: "loading", message: "" });
    try {
      await submitEnquiry({ source: "contact-form", ...form, website: e.currentTarget.website?.value ?? "" });
      setStatus({ state: "success", message: contactSection.successMessage });
      setForm(EMPTY);
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`;

  const Field = ({ id, label, error, children }) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-bold tracking-[0.2em] text-muted uppercase">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="text-xs font-semibold text-brand-red">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-charcoal py-28 md:py-40">
      <div className="globe-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-5 text-brand-cyan">{contactSection.eyebrow}</p>
          <SplitReveal id="contact-title" className="font-display text-[clamp(2.8rem,7vw,6rem)] text-ink">
            {contactSection.title}
          </SplitReveal>
          <p className="mt-6 max-w-md text-muted">{contactSection.intro}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <a href={whatsappLink(contact)} target="_blank" rel="noopener noreferrer" className="btn bg-[#1DA851] text-white hover:bg-[#25D366]">
                <WhatsAppIcon className="size-5" /> Chat on WhatsApp
              </a>
            </Magnetic>
            <Magnetic>
              <a href={`tel:${contact.phoneHref}`} className="btn btn-ghost">
                <Phone className="size-4" /> {contact.phone}
              </a>
            </Magnetic>
          </div>

          <Reveal as="ul" className="mt-12 grid gap-6 text-sm">
            <li className="flex gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand-red" aria-hidden="true" />
              <address className="not-italic text-ink/90">
                {contact.addressLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            </li>
            <li className="flex gap-4">
              <Mail className="mt-0.5 size-5 shrink-0 text-brand-red" aria-hidden="true" />
              <a href={`mailto:${contact.email}`} className="text-ink/90 underline-offset-4 hover:text-ink hover:underline">
                {contact.email}
              </a>
            </li>
            <li className="flex gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-brand-red" aria-hidden="true" />
              <span className="text-ink/90">
                {contact.hours.map((h) => (
                  <span key={h.days} className="block">
                    <span className="font-semibold">{h.days}:</span> {h.time}
                  </span>
                ))}
              </span>
            </li>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={onSubmit} noValidate className="card grid gap-5 p-6 md:grid-cols-2 md:p-10" aria-describedby="contact-status">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            {Field({
              id: "c-name",
              label: "Full name",
              error: errors.name,
              children: <input id="c-name" className="field" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} placeholder="Your name" />,
            })}
            {Field({
              id: "c-phone",
              label: "Phone",
              error: errors.phone,
              children: (
                <input id="c-phone" type="tel" inputMode="tel" className="field" autoComplete="tel" value={form.phone} onChange={set("phone")} aria-invalid={!!errors.phone} placeholder="+91" />
              ),
            })}
            {Field({
              id: "c-email",
              label: "Email",
              error: errors.email,
              children: <input id="c-email" type="email" className="field" autoComplete="email" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} placeholder="you@email.com" />,
            })}
            {Field({
              id: "c-country",
              label: "Country of interest",
              error: errors.country,
              children: (
                <select id="c-country" className="field" value={form.country} onChange={set("country")} aria-invalid={!!errors.country}>
                  <option value="">Select a country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              ),
            })}
            {Field({
              id: "c-intake",
              label: "Preferred intake",
              children: (
                <select id="c-intake" className="field" value={form.intake} onChange={set("intake")}>
                  <option value="">Select an intake</option>
                  {contactSection.intakes.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              ),
            })}
            <div className="hidden md:block" />
            <div className="md:col-span-2">
              {Field({
                id: "c-message",
                label: "Message (optional)",
                children: (
                  <textarea id="c-message" rows={4} className="field resize-none" value={form.message} onChange={set("message")} placeholder="Course, budget, questions…" />
                ),
              })}
            </div>
            <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-muted">We&apos;ll only use your details to contact you about your enquiry.</p>
              <button type="submit" disabled={status.state === "loading"} className="btn btn-red disabled:opacity-60">
                {status.state === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                Send enquiry
              </button>
            </div>
            <div id="contact-status" aria-live="polite" className="md:col-span-2">
              {status.state === "success" && (
                <p className="flex items-center gap-2 rounded-[10px] bg-brand-cyan/10 p-4 text-sm font-semibold text-ink">
                  <CheckCircle2 className="size-5 text-brand-cyan" /> {status.message}
                </p>
              )}
              {status.state === "error" && <p className="text-sm font-semibold text-brand-red">{status.message}</p>}
            </div>
          </form>

          <div className="mt-6 overflow-hidden rounded-[10px] border border-white/10">
            <iframe
              title={`Map showing ${contact.mapQuery}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-72 w-full grayscale-[0.35] invert-[0.9] hue-rotate-180 md:h-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
