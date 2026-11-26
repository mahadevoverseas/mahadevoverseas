"use client";

import { useMemo, useState, useTransition } from "react";
import { Download, Mail, Phone, Search, Trash2 } from "lucide-react";
import { deleteEnquiry, setEnquiryStatus } from "@/app/admin/actions";

const STATUS = {
  new: "bg-red-strong text-white",
  contacted: "bg-cyan-strong text-white",
  closed: "bg-navy/10 text-navy/70",
};

const fmt = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

function toCsv(rows) {
  const cols = ["receivedAt", "status", "source", "name", "phone", "email", "country", "intake", "message", "suggestions"];
  const esc = (v) => `"${String(Array.isArray(v) ? v.join(" / ") : v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

export default function Enquiries({ initial }) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [, startTransition] = useTransition();

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter(
      (e) =>
        (filter === "all" || e.status === filter) &&
        (!term || [e.name, e.phone, e.email, e.country, e.message].some((v) => String(v ?? "").toLowerCase().includes(term)))
    );
  }, [items, filter, q]);

  const setStatus = (id, status) => {
    setItems((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
    startTransition(() => setEnquiryStatus(id, status));
  };
  const remove = (id) => {
    if (!confirm("Delete this enquiry permanently?")) return;
    setItems((list) => list.filter((e) => e.id !== id));
    startTransition(() => deleteEnquiry(id));
  };
  const exportCsv = () => {
    const blob = new Blob([toCsv(shown)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Enquiries</h1>
          <p className="text-sm text-navy/60">From the contact form and the eligibility checker.</p>
        </div>
        <button type="button" onClick={exportCsv} disabled={!shown.length} className="inline-flex items-center gap-2 rounded-[10px] bg-navy px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">
          <Download className="size-4" /> Export CSV
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-navy/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, email…"
            className="w-full rounded-[10px] border border-navy/15 bg-white py-2.5 pr-3 pl-9 text-sm outline-none focus:border-cyan-strong"
          />
        </div>
        {["all", "new", "contacted", "closed"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${filter === s ? "bg-navy text-white" : "bg-white text-navy/70 hover:text-navy"}`}
          >
            {s} {s !== "all" && `(${items.filter((e) => e.status === s).length})`}
          </button>
        ))}
      </div>

      <ul className="mt-6 space-y-3">
        {shown.length === 0 && <li className="rounded-[10px] bg-white p-10 text-center text-sm text-navy/50">No enquiries yet.</li>}
        {shown.map((e) => (
          <li key={e.id} className="rounded-[10px] border border-navy/10 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">{e.name}</p>
                <p className="text-xs text-navy/50">
                  {fmt(e.receivedAt)} · {e.source}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={e.status}
                  onChange={(ev) => setStatus(e.id, ev.target.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize outline-none ${STATUS[e.status] ?? STATUS.new}`}
                  aria-label="Status"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
                <button type="button" onClick={() => remove(e.id)} className="grid size-8 place-items-center rounded-[8px] text-navy/40 hover:bg-mist hover:text-red-strong" aria-label="Delete">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1.5 font-semibold text-cyan-strong hover:underline">
                <Phone className="size-3.5" /> {e.phone}
              </a>
              <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1.5 font-semibold text-cyan-strong hover:underline">
                <Mail className="size-3.5" /> {e.email}
              </a>
              {e.country && <span className="text-navy/70">Country: {e.country}</span>}
              {e.intake && <span className="text-navy/70">Intake: {e.intake}</span>}
              {e.suggestions?.length > 0 && <span className="text-navy/70">Suggested: {e.suggestions.join(", ")}</span>}
            </div>
            {e.answers && (
              <p className="mt-2 text-xs text-navy/60">
                Answers: {Object.entries(e.answers).map(([k, v]) => `${k}: ${v}`).join(" · ")}
              </p>
            )}
            {e.message && <p className="mt-3 rounded-[8px] bg-mist p-3 text-sm whitespace-pre-wrap text-navy/80">{e.message}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
