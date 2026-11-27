import Link from "next/link";
import FlightPath from "@/components/ui/FlightPath";

export default function NotFoundView() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-charcoal pt-28 pb-20">
      <div className="globe-grid pointer-events-none absolute inset-0" />
      <FlightPath variant="dip" className="absolute inset-x-0 top-24 opacity-70" start="top bottom" end="bottom top" />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <p className="eyebrow mb-6 text-brand-cyan">Error 404</p>
        <h1 className="font-display text-[clamp(3.2rem,10vw,9rem)] text-ink">
          Off the <span className="text-brand-red">flight path</span>
        </h1>
        <p className="mt-6 max-w-lg text-muted">This page could not be found. It may have moved, or the link may be mistyped.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-red">
            Back to home
          </Link>
          <Link href="/countries" className="btn btn-ghost">
            Explore countries
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
