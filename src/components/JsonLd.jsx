import { jsonLdString } from "@/lib/structured-data";

/** Renders one or more schema.org objects as <script type="application/ld+json">. */
export default function JsonLd({ data }) {
  const list = (Array.isArray(data) ? data : [data]).filter(Boolean);
  return list.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(d) }} />);
}
