"use client";

import Image from "next/image";
import { useSite } from "@/components/providers/ContentProvider";
import SplitReveal from "@/components/ui/SplitReveal";

const ACCENTS = ["group-hover:text-red-strong", "group-hover:text-cyan-strong"];

function Tile({ u, i }) {
  return (
    <li className="group flex h-24 w-64 shrink-0 items-center justify-center rounded-[10px] border border-navy/8 bg-paper px-6 md:h-28 md:w-72">
      {u.logo ? (
        <Image
          src={u.logo}
          alt={u.name}
          width={200}
          height={70}
          className="h-12 w-auto object-contain opacity-60 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
        />
      ) : (
        <span className="text-center leading-tight">
          <span className={`font-display block text-2xl text-navy/45 transition-colors duration-500 ${ACCENTS[i % 2]}`}>{u.name}</span>
          <span className="mt-1 block text-[0.65rem] font-bold tracking-[0.25em] text-navy/45 uppercase">{u.country}</span>
        </span>
      )}
    </li>
  );
}

function Row({ items, reverse = false, duration = "45s" }) {
  return (
    <div className="group/row relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <ul
        className={`flex w-max gap-4 pr-4 group-hover/row:[animation-play-state:paused] motion-reduce:animate-none ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ "--marquee-duration": duration }}
      >
        {[...items, ...items].map((u, i) => (
          <Tile key={i} u={u} i={i} />
        ))}
      </ul>
    </div>
  );
}

export default function Universities() {
  const { universities } = useSite();
  return (
    <section aria-labelledby="unis-title" className="relative overflow-hidden bg-paper py-24 text-navy md:py-32">
      <div className="mx-auto mb-12 max-w-[1440px] px-5 text-center md:mb-16 md:px-10">
        <p className="eyebrow mb-5 text-red-strong">{universities.eyebrow}</p>
        <SplitReveal id="unis-title" className="font-display text-[clamp(2.4rem,6vw,5rem)]">
            {universities.title}
          </SplitReveal>
      </div>
      <div className="flex flex-col gap-4">
        <Row items={universities.rowOne} duration="50s" />
        <Row items={universities.rowTwo} reverse duration="55s" />
      </div>
    </section>
  );
}
