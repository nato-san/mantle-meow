"use client";

import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { CatSpeech } from "@/components/CatSpeech";
import { useCat } from "@/lib/catStore";

export default function Home() {
  const { t, catName } = useCat();

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-lg border border-mint/35 bg-ink shadow-glow">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(116,247,199,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(116,247,199,0.07)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink via-ink/78 to-transparent" />

        <div className="relative z-10 px-4 py-5 lg:min-h-[465px] lg:px-8 lg:py-5 xl:min-h-[490px]">
          <div className="relative z-20 flex max-w-[610px] flex-col justify-start lg:min-h-[465px] lg:pt-7 xl:min-h-[490px] xl:pt-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral sm:text-sm">{t.heroKicker}</p>
            <h1 className="hero-title mt-3 text-4xl font-black leading-[0.95] text-white sm:text-6xl lg:mt-4 lg:text-[3.75rem] xl:text-[4.05rem]">
              {t.heroRaise}
              <span className="block mint-text">INTERN CAT</span>
            </h1>
            <p className="mt-4 max-w-xl text-base font-bold leading-7 text-white/80 sm:text-xl sm:leading-9 lg:text-lg lg:leading-8">{t.homeBodyFocused}</p>
            <div className="mt-5 grid gap-3 lg:mt-4 lg:flex lg:items-center lg:gap-4">
              <Link
                href="/create"
                className="inline-flex min-h-14 w-full items-center justify-center rounded-lg bg-mint px-6 text-lg font-black text-ink shadow-glow transition hover:bg-white sm:w-fit sm:text-lg lg:order-1 lg:min-h-12 lg:px-6 lg:text-base"
              >
                {t.homeCta}
              </Link>
              <div className="flex flex-wrap gap-2 lg:order-2 lg:gap-2">
                {[t.aiAgent, t.onChain, t.identity].map((item) => (
                  <span key={item} className="pointer-events-none cursor-default rounded-md border border-mint/25 bg-ink/35 px-3 py-2 text-xs font-black text-white/65 lg:rounded-lg lg:border-mint/55 lg:bg-ink/60 lg:px-3 lg:text-sm lg:text-white lg:shadow-glow">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-4 aspect-square w-full max-w-[340px] sm:max-w-[390px] lg:absolute lg:inset-y-0 lg:right-8 lg:mt-0 lg:w-[48%] lg:max-w-none">
            <Image
              src="/assets/mantle-meow-top.png"
              alt="Intern Cat analyzing Mantle network"
              width={1254}
              height={1254}
              priority
              className="absolute inset-0 z-10 aspect-square h-full w-full rounded-lg border border-mint/25 object-cover object-center opacity-95 shadow-[0_0_44px_rgba(116,247,199,0.2)] lg:inset-auto lg:bottom-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[min(100%,470px)] xl:w-[min(100%,500px)]"
            />
          </div>

          <div className="relative z-20 mt-4 max-w-xl lg:absolute lg:bottom-3 lg:left-8 lg:mt-0 lg:w-[560px]">
            <CatSpeech name={catName} text={t.catSaysHome} />
          </div>
        </div>

        <div className="relative z-20 px-5 pb-6 lg:px-8 lg:pb-5">
          <p className="mb-4 text-lg font-black uppercase tracking-[0.14em] text-white lg:mb-2">{t.whatNext}</p>
          <div className="grid gap-4 md:grid-cols-3 lg:gap-3">
            {[
              { title: t.talkTitle, body: t.talkBody, image: "/assets/cat-front.png" },
              { title: t.shareTitle, body: t.shareBody, image: "/assets/cat-side.png" },
              { title: t.evolveTitle, body: t.evolveBody, image: "/assets/cat-back.png" },
            ].map((item, index) => (
              <article key={item.title} className="neon-panel cyber-card min-h-44 rounded-lg p-5 lg:flex lg:min-h-24 lg:items-center lg:justify-between lg:gap-3 lg:p-3">
                <div className="flex items-start gap-4 lg:flex-1 lg:gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint text-lg font-black text-ink lg:h-9 lg:w-9">{index + 1}</span>
                  <div className="min-w-0">
                    <h2 className="text-2xl font-black uppercase text-white lg:text-lg">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/72 lg:leading-5">{item.body}</p>
                  </div>
                </div>
                <div className="relative ml-auto mt-1 h-20 w-32 lg:ml-0 lg:mt-0 lg:h-16 lg:w-20 lg:shrink-0">
                  <Image src={item.image} alt="" fill className="object-contain object-right-bottom" />
                </div>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-6 w-fit rounded-lg border border-mint/55 px-5 py-3 text-sm font-black text-mint lg:mt-4 lg:py-2">{t.powered}</p>
        </div>
      </section>
    </AppShell>
  );
}
