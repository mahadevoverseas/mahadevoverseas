"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  BarChart3, BookOpen, Braces, Compass, ExternalLink, FileText, Footprints, Globe2, GraduationCap, Inbox,
  LayoutTemplate, Loader2, LogOut, Map, Menu, MessageSquareQuote, Navigation, Phone, RotateCcw, Save,
  Settings, Sparkles, Ticket, X, CheckCircle2, AlertTriangle, ListChecks, Images, UserRound, HandCoins, Search, CircleHelp, Newspaper,
} from "lucide-react";
import { Field } from "./FieldEditor";
import Enquiries from "./Enquiries";
import { saveSections, resetSections, logout } from "@/app/admin/actions";
import { defaultContent } from "@/lib/site";

const GROUPS = [
  { id: "general", label: "General", icon: Settings, keys: ["site"], page: "/" },
  { id: "seo", label: "SEO (Google)", icon: Search, keys: ["seo"], page: "/" },
  { id: "contact", label: "Contact details", icon: Phone, keys: ["contact", "whatsappFloat"], page: "/contact" },
  { id: "navigation", label: "Menu & call-to-action", icon: Navigation, keys: ["nav", "cta", "ctaBand"], page: "/" },
  { id: "pages", label: "Page banners", icon: LayoutTemplate, keys: ["pages"], page: "/services" },
  { id: "hero", label: "Home hero", icon: Sparkles, keys: ["hero"], page: "/" },
  { id: "stats", label: "Stats", icon: BarChart3, keys: ["stats"], page: "/" },
  { id: "about", label: "About", icon: BookOpen, keys: ["about"], page: "/about" },
  { id: "owner", label: "Founder", icon: UserRound, keys: ["owner"], page: "/about" },
  { id: "countries", label: "Countries", icon: Globe2, keys: ["countriesSection", "countries", "origin"], page: "/countries" },
  { id: "journey", label: "Journey", icon: Map, keys: ["journey"], page: "/journey" },
  { id: "services", label: "Services", icon: Compass, keys: ["services"], page: "/services" },
  { id: "loans", label: "Education loans", icon: HandCoins, keys: ["loans"], page: "/services" },
  { id: "stories", label: "Success stories", icon: Ticket, keys: ["stories"], page: "/success-stories" },
  { id: "universities", label: "Universities", icon: GraduationCap, keys: ["universities"], page: "/about" },
  { id: "eligibility", label: "Eligibility checker", icon: ListChecks, keys: ["eligibility"], page: "/eligibility" },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote, keys: ["testimonials"], page: "/success-stories" },
  { id: "gallery", label: "Gallery", icon: Images, keys: ["gallery"], page: "/gallery" },
  { id: "guides", label: "Guides (blog)", icon: Newspaper, keys: ["guides"], page: "/guides" },
  { id: "faq", label: "FAQ", icon: CircleHelp, keys: ["faq"], page: "/contact" },
  { id: "contactSection", label: "Contact page", icon: FileText, keys: ["contactSection"], page: "/contact" },
  { id: "footer", label: "Footer", icon: Footprints, keys: ["footer"], page: "/" },
];

const SECTION_LABELS = {
  site: "Website",
  contact: "Contact details",
  whatsappFloat: "Floating WhatsApp button",
  nav: "Menu links",
  cta: "Header button",
  ctaBand: "Red call-to-action band",
  countriesSection: "Section text",
  countries: "Countries",
  origin: "Flight origin (globe)",
  contactSection: "Contact page",
};

export default function AdminApp({ initialContent, initialEnquiries }) {
  const [saved, setSaved] = useState(initialContent);
  const [draft, setDraft] = useState(initialContent);
  const [active, setActive] = useState("general");
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [toast, setToast] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const group = GROUPS.find((g) => g.id === active) ?? GROUPS[0];
  const dirtyKeys = useMemo(
    () => Object.keys(defaultContent).filter((k) => JSON.stringify(draft[k]) !== JSON.stringify(saved[k])),
    [draft, saved]
  );
  const groupDirty = (g) => g.keys.some((k) => dirtyKeys.includes(k));
  const newEnquiries = initialEnquiries.filter((e) => e.status === "new").length;

  useEffect(() => {
    const warn = (e) => {
      if (dirtyKeys.length) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirtyKeys.length]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const openGroup = (id) => {
    setActive(id);
    setJsonMode(false);
    setNavOpen(false);
    window.scrollTo({ top: 0 });
  };

  const groupData = (g) => Object.fromEntries(g.keys.map((k) => [k, draft[k]]));

  const save = () => {
    let patch = groupData(group);
    if (jsonMode) {
      try {
        patch = JSON.parse(jsonText);
      } catch {
        setToast({ type: "error", text: "The JSON has a syntax error." });
        return;
      }
    }
    startTransition(async () => {
      try {
        const res = await saveSections(patch);
        setSaved(res.content);
        setDraft((d) => ({ ...d, ...Object.fromEntries(Object.keys(patch).map((k) => [k, res.content[k]])) }));
        if (jsonMode) setJsonText(JSON.stringify(patch, null, 2));
        setToast({ type: "ok", text: "Saved — the website is updated." });
      } catch (e) {
        setToast({ type: "error", text: e.message || "Could not save." });
      }
    });
  };

  const discard = () => {
    setDraft((d) => ({ ...d, ...Object.fromEntries(group.keys.map((k) => [k, saved[k]])) }));
    if (jsonMode) setJsonText(JSON.stringify(groupData({ keys: group.keys }), null, 2));
  };

  const reset = () => {
    if (!confirm(`Reset "${group.label}" to the original default content? This replaces what's saved.`)) return;
    startTransition(async () => {
      try {
        const res = await resetSections(group.keys);
        setSaved(res.content);
        setDraft((d) => ({ ...d, ...Object.fromEntries(group.keys.map((k) => [k, res.content[k]])) }));
        setToast({ type: "ok", text: "Restored defaults." });
      } catch (e) {
        setToast({ type: "error", text: e.message });
      }
    });
  };

  const toggleJson = () => {
    if (!jsonMode) setJsonText(JSON.stringify(groupData(group), null, 2));
    else {
      try {
        const parsed = JSON.parse(jsonText);
        setDraft((d) => ({ ...d, ...parsed }));
      } catch {
        setToast({ type: "error", text: "Fix the JSON before switching back." });
        return;
      }
    }
    setJsonMode((m) => !m);
  };

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto p-4" aria-label="Admin sections">
      <p className="px-3 pt-2 pb-2 text-[0.65rem] font-bold tracking-[0.25em] text-muted uppercase">Inbox</p>
      <SideBtn active={active === "enquiries"} onClick={() => openGroup("enquiries")} icon={Inbox} label="Enquiries" badge={newEnquiries || null} />
      <p className="px-3 pt-5 pb-2 text-[0.65rem] font-bold tracking-[0.25em] text-muted uppercase">Website content</p>
      {GROUPS.map((g) => (
        <SideBtn key={g.id} active={active === g.id} onClick={() => openGroup(g.id)} icon={g.icon} label={g.label} dot={groupDirty(g)} />
      ))}
    </nav>
  );

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[272px_1fr]">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-svh flex-col bg-charcoal text-ink lg:flex">
        <div className="border-b border-white/10 p-5">
          <Image src="/brand/logo-on-dark.png" alt="Mahadev Overseas" width={1417} height={832} sizes="100px" className="h-12 w-auto" />
        </div>
        {sidebar}
        <form action={logout} className="border-t border-white/10 p-4">
          <button type="submit" className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-muted hover:bg-white/5 hover:text-ink">
            <LogOut className="size-4" /> Log out
          </button>
        </form>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-charcoal px-4 py-3 text-ink lg:hidden">
        <Image src="/brand/logo-on-dark.png" alt="Mahadev Overseas" width={1417} height={832} sizes="80px" className="h-9 w-auto" />
        <button type="button" onClick={() => setNavOpen(true)} className="grid size-10 place-items-center rounded-[10px] border border-white/15" aria-label="Open sections">
          <Menu className="size-5" />
        </button>
      </div>
      {navOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-72 bg-charcoal text-ink">
            <div className="flex justify-end p-3">
              <button type="button" onClick={() => setNavOpen(false)} className="grid size-10 place-items-center" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            {sidebar}
            <form action={logout} className="p-4">
              <button type="submit" className="flex items-center gap-3 text-sm font-semibold text-muted">
                <LogOut className="size-4" /> Log out
              </button>
            </form>
          </div>
          <button type="button" aria-label="Close" className="flex-1 bg-black/50" onClick={() => setNavOpen(false)} />
        </div>
      )}

      {/* Main */}
      <main className="min-w-0">
        {active === "enquiries" ? (
          <Enquiries initial={initialEnquiries} />
        ) : (
          <>
            <header className="sticky top-0 z-30 border-b border-navy/10 bg-mist/90 backdrop-blur lg:top-0">
              <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-8">
                <div>
                  <h1 className="font-display text-3xl">{group.label}</h1>
                  <a href={group.page} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-strong hover:underline">
                    View on website <ExternalLink className="size-3" />
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={toggleJson} className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-xs font-bold text-navy/60 hover:bg-white hover:text-navy" title="Advanced: edit as JSON">
                    <Braces className="size-4" /> {jsonMode ? "Form" : "JSON"}
                  </button>
                  <button type="button" onClick={reset} disabled={pending} className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-xs font-bold text-navy/60 hover:bg-white hover:text-navy">
                    <RotateCcw className="size-4" /> Defaults
                  </button>
                  <button
                    type="button"
                    onClick={discard}
                    disabled={!groupDirty(group) || pending}
                    className="rounded-[10px] border border-navy/15 px-4 py-2.5 text-sm font-bold text-navy/70 hover:bg-white disabled:opacity-40"
                  >
                    Discard
                  </button>
                  <button type="button" onClick={save} disabled={(!groupDirty(group) && !jsonMode) || pending} className="btn btn-red py-2.5 disabled:opacity-40">
                    {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save changes
                  </button>
                </div>
              </div>
            </header>

            <div className="mx-auto max-w-4xl space-y-6 px-5 py-8 md:px-8">
              {jsonMode ? (
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  spellCheck={false}
                  className="h-[70vh] w-full rounded-[10px] border border-navy/15 bg-white p-4 font-mono text-xs leading-relaxed text-navy outline-none focus:border-cyan-strong"
                />
              ) : (
                group.keys.map((k) => (
                  <section key={k} className="rounded-[10px] border border-navy/10 bg-white p-5 shadow-[0_10px_30px_-25px_rgba(20,26,38,0.4)] md:p-7">
                    {group.keys.length > 1 && <h2 className="font-display mb-5 text-2xl">{SECTION_LABELS[k] ?? k}</h2>}
                    <Field
                      k={k}
                      label={group.keys.length > 1 ? "" : undefined}
                      value={draft[k]}
                      template={defaultContent[k]}
                      onChange={(v) => setDraft((d) => ({ ...d, [k]: v }))}
                    />
                  </section>
                ))
              )}
              <p className="text-xs text-navy/50">
                Changes go live as soon as you save. Never promise visa approval or a “100% visa guarantee” in any text.
              </p>
            </div>
          </>
        )}
      </main>

      {toast && (
        <div
          role="status"
          className={`fixed right-5 bottom-5 z-[70] flex items-center gap-2 rounded-[10px] px-4 py-3 text-sm font-semibold shadow-xl ${
            toast.type === "ok" ? "bg-navy text-white" : "bg-red-strong text-white"
          }`}
        >
          {toast.type === "ok" ? <CheckCircle2 className="size-4 text-brand-cyan" /> : <AlertTriangle className="size-4" />} {toast.text}
        </div>
      )}
    </div>
  );
}

function SideBtn({ active, onClick, icon: Icon, label, badge, dot }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
        active ? "bg-white/10 text-ink" : "text-muted hover:bg-white/5 hover:text-ink"
      }`}
    >
      <Icon className={`size-4 shrink-0 ${active ? "text-brand-red" : ""}`} />
      <span className="flex-1 truncate">{label}</span>
      {dot && <span className="size-2 rounded-full bg-brand-cyan" title="Unsaved changes" />}
      {badge && <span className="rounded-full bg-red-strong px-2 py-0.5 text-[0.65rem] font-bold text-white">{badge}</span>}
    </button>
  );
}
