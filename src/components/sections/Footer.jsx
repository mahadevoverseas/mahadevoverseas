"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useSite } from "@/components/providers/ContentProvider";
import { whatsappLink } from "@/lib/site";
import { SocialIcon, WhatsAppIcon } from "@/components/ui/icons";
import FlightPath from "@/components/ui/FlightPath";

export default function Footer() {
  const { site, contact, nav, footer } = useSite();
  return (
    <footer className="relative overflow-hidden bg-charcoal pt-10 pb-10">
      <FlightPath variant="rise" start="top bottom" end="bottom bottom" />
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image src="/brand/logo-on-dark.png" alt="Mahadev Overseas" width={1417} height={832} className="h-24 w-auto" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{footer.blurb}</p>
            <div className="mt-6 flex gap-2">
              {contact.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-[10px] border border-white/12 text-ink/80 transition-colors hover:border-brand-red hover:text-ink"
                >
                  <SocialIcon name={s.icon} className="size-4" />
                </a>
              ))}
              <a
                href={whatsappLink(contact)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid size-10 place-items-center rounded-[10px] border border-white/12 text-ink/80 transition-colors hover:border-[#25D366] hover:text-[#25D366]"
              >
                <WhatsAppIcon className="size-4" />
              </a>
            </div>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <p className="text-xs font-bold tracking-[0.25em] text-ink uppercase">Explore</p>
            <ul className="mt-5 grid gap-3 text-sm">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/eligibility" className="text-muted transition-colors hover:text-ink">
                  Eligibility checker
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="text-xs font-bold tracking-[0.25em] text-ink uppercase">Visit</p>
            <ul className="mt-5 grid gap-4 text-sm text-muted">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden="true" />
                <address className="not-italic">
                  {contact.addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden="true" />
                <span>
                  {contact.hours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days}: {h.time}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-bold tracking-[0.25em] text-ink uppercase">Talk to us</p>
            <ul className="mt-5 grid gap-4 text-sm">
              <li>
                <a href={`tel:${contact.phoneHref}`} className="flex items-center gap-3 text-muted hover:text-ink">
                  <Phone className="size-4 text-brand-red" aria-hidden="true" /> {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-muted hover:text-ink">
                  <Mail className="size-4 text-brand-red" aria-hidden="true" /> {contact.email}
                </a>
              </li>
            </ul>
            <Link href="/contact" className="btn btn-red mt-6">
              Book free counselling
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {site.foundedYear}–2026 {site.name}. All rights reserved. {/* TODO: update the year range yearly */}
          </p>
          <p className="max-w-xl md:text-right">{footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
