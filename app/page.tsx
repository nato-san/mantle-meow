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

        <div className="relative z-10 min-h-[640px] px-5 py-7 lg:min-h-[465px] lg:px-8 lg:py-5 xl:min-h-[490px]">
          <div className="relative z-20 flex max-w-[610px] flex-col justify-center lg:min-h-[465px] lg:justify-start lg:pt-7 xl:min-h-[490px] xl:pt-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-coral">{t.heroKicker}</p>
            <h1 className="hero-title mt-4 text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-[3.75rem] xl:text-[4.05rem]">
              {t.heroRaise}
              <span className="block mint-text">INTERN CAT</span>
            </h1>
            <p className="mt-6 max-w-xl text-xl font-bold leading-9 text-white/80 lg:mt-4 lg:text-lg lg:leading-8">{t.homeBodyFocused}</p>
            <div className="mt-7 flex flex-col gap-3 lg:mt-4 lg:flex-row lg:items-center lg:gap-4">
              <div className="order-1 flex flex-wrap gap-3 lg:order-2 lg:gap-2">
                {[t.aiAgent, t.onChain, t.identity].map((item) => (
                  <span key={item} className="rounded-lg border border-mint/55 bg-ink/60 px-4 py-3 text-sm font-black text-white shadow-glow lg:px-3 lg:py-2">
                    {item}
                  </span>
                ))}
              </div>
              <Link
                href="/create"
                className="order-2 inline-flex min-h-14 w-fit items-center justify-center rounded-lg bg-mint px-7 text-lg font-black text-ink shadow-glow transition hover:bg-white lg:order-1 lg:min-h-12 lg:px-6 lg:text-base"
              >
                {t.homeCta}
              </Link>
            </div>
            <div className="mt-6 max-w-xl lg:absolute lg:bottom-3 lg:left-0 lg:mt-0 lg:w-[560px]">
              <CatSpeech name={catName} text={t.catSaysHome} />
            </div>
          </div>

          <div className="relative mt-4 min-h-[330px] sm:min-h-[380px] lg:absolute lg:inset-y-0 lg:right-8 lg:mt-0 lg:w-[48%]">
            <Image
              src="/assets/mantle-meow-top.png"
              alt="Intern Cat analyzing Mantle network"
              width={1254}
              height={1254}
              priority
              className="absolute bottom-0 left-1/2 z-10 aspect-square w-[92%] max-w-[560px] -translate-x-1/2 rounded-lg border border-mint/25 object-cover object-center opacity-95 shadow-[0_0_44px_rgba(116,247,199,0.2)] lg:left-auto lg:right-0 lg:w-[min(100%,470px)] lg:translate-x-0 xl:w-[min(100%,500px)]"
            />
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
