import { fillTemplate } from "@/lib/structured-data";

/** Renders guide blocks: "## " heading, "- " bullets, *emphasis*, else paragraph. */
function inline(text) {
  return String(text)
    .split(/(\*[^*]+\*)/g)
    .map((part, i) => (/^\*[^*]+\*$/.test(part) ? <em key={i}>{part.slice(1, -1)}</em> : part));
}

export default function GuideBody({ blocks, vars }) {
  const out = [];
  let list = null;
  blocks.forEach((raw, i) => {
    const b = fillTemplate(raw, vars).trim();
    if (b.startsWith("- ")) {
      list ??= [];
      list.push(<li key={i}>{inline(b.slice(2))}</li>);
      return;
    }
    if (list) {
      out.push(<ul key={`l${i}`} className="my-5 list-disc space-y-2 pl-6 marker:text-red-strong">{list}</ul>);
      list = null;
    }
    if (b.startsWith("## ")) out.push(<h2 key={i} className="font-display mt-12 mb-4 text-3xl text-navy md:text-4xl">{b.slice(3)}</h2>);
    else if (b) out.push(<p key={i} className="my-5">{inline(b)}</p>);
  });
  if (list) out.push(<ul key="lend" className="my-5 list-disc space-y-2 pl-6 marker:text-red-strong">{list}</ul>);
  return <div className="text-lg leading-relaxed text-navy/80">{out}</div>;
}
