"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Copy, ImageUp, Loader2, Plus, Trash2 } from "lucide-react";
import { SERVICE_ICON_NAMES, SERVICE_ICONS } from "@/lib/service-icons";

/* ---------- helpers ---------- */

const LONG_KEYS = new Set([
  "paragraph", "text", "quote", "description", "blurb", "legal", "disclaimer", "intro", "work",
  "footnote", "note", "message", "whatsappMessage", "overview", "successMessage", "bio",
]);
const IMAGE_KEYS = new Set(["photo", "logo", "image"]);

const HINTS = {
  flag: "2-letter country code used for the flag image (e.g. ca, gb, au).",
  id: "Used in the page address, e.g. /countries/canada. Lowercase, no spaces.",
  whatsapp: "Digits only, with country code — e.g. 919876543210.",
  phoneHref: "Phone number used for click-to-call — digits with country code, e.g. +919876543210.",
  href: "A page path like /contact, or a full link starting with https://",
  url: "Your live website address — used for SEO and sharing.",
  mapQuery: "What to search on Google Maps, e.g. your business name and city.",
  lat: "Latitude (decimal degrees).",
  lng: "Longitude (decimal degrees).",
  value: "Number the counter animates to.",
  icon: "Icon shown on the card.",
  logo: "Optional. Leave empty to show the name as text.",
  weights: "Scores used by the eligibility checker. Higher = better fit for that answer.",
  enabled: "Show or hide this element.",
  video: "Optional MP4/WebM video (max 100 MB). When set, the tile plays this video; the image is used as its cover.",
  category: "Used for the filter buttons on the gallery page.",
  bio: "One box per paragraph. Write in the founder's own voice.",
  highlights: "Short facts shown as big numbers. Only use figures you can back up.",
  credentials: "Qualifications, trainings or memberships — only ones you can verify.",
  points: "The highlighted cards. Never promise or guarantee loan approval — lenders decide.",
  footnote: "Keep the *Subject to lender approval note whenever a card has an asterisk.",
  photo: "A clear, well-lit portrait works best (portrait shape, at least 800 px wide).",
};

export function humanize(key) {
  return String(key)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function blankLike(v) {
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blankLike(x)]));
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return v;
  return "";
}

function itemTitle(item, i) {
  if (typeof item !== "object" || item === null) return `Item ${i + 1}`;
  return item.name || item.title || item.label || item.question || item.quote?.slice(0, 50) || `Item ${i + 1}`;
}

const inputCls =
  "w-full rounded-[10px] border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition focus:border-cyan-strong focus:ring-2 focus:ring-cyan-strong/20";

/* ---------- leaf fields ---------- */

function ImageField({ value, onChange, kind = "image" }) {
  const isVideo = kind === "video";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      onChange(data.url);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-[10px] border border-navy/10 bg-mist">
        {value && isVideo ? (
          <video src={value} muted playsInline preload="metadata" className="size-full object-cover" />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <ImageUp className="size-6 text-navy/30" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <input className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={isVideo ? "/gallery/… .mp4 or a Cloudflare URL" : "/images/… or /media/…"} />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-[10px] bg-navy px-3 py-2 text-xs font-bold text-white hover:bg-navy/85 disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <ImageUp className="size-3.5" />} {isVideo ? "Upload video" : "Upload image"}
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className="text-xs font-semibold text-navy/60 hover:text-red-strong">
              Remove
            </button>
          )}
          <input ref={fileRef} type="file" accept={isVideo ? "video/mp4,video/webm" : "image/png,image/jpeg,image/webp,image/gif,image/avif"} className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        </div>
        {error && <p className="text-xs font-semibold text-red-strong">{error}</p>}
      </div>
    </div>
  );
}

function IconField({ value, onChange }) {
  const Icon = SERVICE_ICONS[value];
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-mist text-cyan-strong">{Icon ? <Icon className="size-5" /> : "?"}</span>
      <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
        {!SERVICE_ICON_NAMES.includes(value) && <option value={value}>{value || "Choose an icon"}</option>}
        {SERVICE_ICON_NAMES.map((n) => (
          <option key={n} value={n}>
            {humanize(n)}
          </option>
        ))}
      </select>
    </div>
  );
}

function Leaf({ k, value, onChange }) {
  if (typeof value === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[#C8141F]" /> {value ? "On" : "Off"}
      </label>
    );
  }
  if (typeof value === "number") {
    return <input type="number" step="any" className={inputCls} value={value} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />;
  }
  if (IMAGE_KEYS.has(k)) return <ImageField value={value} onChange={onChange} />;
  if (k === "video") return <ImageField value={value} onChange={onChange} kind="video" />;
  if (k === "icon") return <IconField value={value} onChange={onChange} />;
  if (k === "flag") {
    return (
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value && <img src={`https://flagcdn.com/w80/${value}.png`} alt="" className="h-6 w-9 rounded-[3px] object-cover" />}
        <input className={inputCls} value={value} maxLength={2} onChange={(e) => onChange(e.target.value.toLowerCase())} />
      </div>
    );
  }
  const str = value ?? "";
  if (LONG_KEYS.has(k) || str.length > 90) {
    return <textarea rows={Math.min(8, Math.max(3, Math.ceil(str.length / 90)))} className={`${inputCls} resize-y leading-relaxed`} value={str} onChange={(e) => onChange(e.target.value)} />;
  }
  return <input className={inputCls} value={str} onChange={(e) => onChange(e.target.value)} />;
}

/* ---------- arrays ---------- */

function ArrayField({ k, value, onChange, template }) {
  const [open, setOpen] = useState(() => new Set());
  const isPrimitive = value.length ? typeof value[0] !== "object" : typeof template !== "object" || template === null;

  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i) => {
    if (!confirm("Remove this item?")) return;
    onChange(value.filter((_, x) => x !== i));
  };
  const add = () => {
    const base = value[0] ?? template ?? "";
    const item = blankLike(base);
    onChange([...value, item]);
    setOpen((s) => new Set(s).add(value.length));
  };
  const duplicate = (i) => onChange([...value.slice(0, i + 1), structuredClone(value[i]), ...value.slice(i + 1)]);
  const toggle = (i) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });

  if (isPrimitive) {
    return (
      <div className="space-y-2">
        {value.map((v, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              <Leaf k={k} value={v} onChange={(nv) => onChange(value.map((x, j) => (j === i ? nv : x)))} />
            </div>
            <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
              <ChevronUp className="size-4" />
            </IconBtn>
            <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === value.length - 1}>
              <ChevronDown className="size-4" />
            </IconBtn>
            <IconBtn label="Remove" onClick={() => onChange(value.filter((_, j) => j !== i))} danger>
              <Trash2 className="size-4" />
            </IconBtn>
          </div>
        ))}
        <AddBtn onClick={add}>Add {humanize(k).replace(/s$/, "").toLowerCase() || "item"}</AddBtn>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {value.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className="overflow-hidden rounded-[10px] border border-navy/10 bg-white">
            <div className="flex items-center gap-1 pr-2">
              <button type="button" onClick={() => toggle(i)} className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left">
                <span className="font-display text-lg text-navy/25">{String(i + 1).padStart(2, "0")}</span>
                <span className="truncate text-sm font-bold">{itemTitle(item, i)}</span>
                <ChevronDown className={`ml-auto size-4 shrink-0 text-navy/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                <ChevronUp className="size-4" />
              </IconBtn>
              <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === value.length - 1}>
                <ChevronDown className="size-4" />
              </IconBtn>
              <IconBtn label="Duplicate" onClick={() => duplicate(i)}>
                <Copy className="size-4" />
              </IconBtn>
              <IconBtn label="Remove" onClick={() => remove(i)} danger>
                <Trash2 className="size-4" />
              </IconBtn>
            </div>
            {isOpen && (
              <div className="border-t border-navy/8 bg-mist/50 p-4">
                <ObjectFields value={item} onChange={(nv) => onChange(value.map((x, j) => (j === i ? nv : x)))} template={value[0]} />
              </div>
            )}
          </div>
        );
      })}
      <AddBtn onClick={add}>Add {humanize(k).replace(/s$/, "").toLowerCase() || "item"}</AddBtn>
    </div>
  );
}

function IconBtn({ children, label, onClick, disabled, danger }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid size-8 shrink-0 place-items-center rounded-[8px] text-navy/50 transition hover:bg-mist disabled:opacity-25 ${danger ? "hover:text-red-strong" : "hover:text-navy"}`}
    >
      {children}
    </button>
  );
}

function AddBtn({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-[10px] border border-dashed border-navy/25 px-4 py-2 text-xs font-bold text-navy/70 hover:border-red-strong hover:text-red-strong"
    >
      <Plus className="size-3.5" /> {children}
    </button>
  );
}

/* ---------- objects ---------- */

function ObjectFields({ value, onChange, template }) {
  return (
    <div className="grid gap-5">
      {Object.entries(value).map(([k, v]) => (
        <Field key={k} k={k} value={v} template={template?.[k]} onChange={(nv) => onChange({ ...value, [k]: nv })} />
      ))}
    </div>
  );
}

export function Field({ k, value, onChange, template, label }) {
  const isObj = value && typeof value === "object" && !Array.isArray(value);
  const isArr = Array.isArray(value);
  return (
    <div>
      {(label ?? humanize(k)) || HINTS[k] ? (
        <div className="mb-2">
          {(label ?? humanize(k)) && <p className="text-xs font-bold tracking-[0.12em] text-navy/70 uppercase">{label ?? humanize(k)}</p>}
          {HINTS[k] && <p className="mt-0.5 text-xs text-navy/50">{HINTS[k]}</p>}
        </div>
      ) : null}
      {isArr ? (
        <ArrayField k={k} value={value} onChange={onChange} template={Array.isArray(template) ? template[0] : undefined} />
      ) : isObj ? (
        <div className="rounded-[10px] border border-navy/10 bg-white/60 p-4">
          <ObjectFields value={value} onChange={onChange} template={template} />
        </div>
      ) : (
        <Leaf k={k} value={value} onChange={onChange} />
      )}
    </div>
  );
}
