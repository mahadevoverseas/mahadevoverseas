/**
 * Large faint "01", "02"… numbers. Purely decorative: drawn with CSS content
 * and hidden from screen readers, so they don't count as low-contrast text.
 */
export default function DecoNum({ n, className = "" }) {
  return <span aria-hidden="true" data-n={String(n).padStart(2, "0")} className={`before:content-[attr(data-n)] ${className}`} />;
}
