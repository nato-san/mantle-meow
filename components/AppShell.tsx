"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { DemoModeButton } from "@/components/DemoModeButton";
import { LanguageToggle } from "@/components/LanguageToggle";
import { LevelUpModal } from "@/components/LevelUpModal";
import { OwnerBadge } from "@/components/OwnerBadge";
import { WalletButton } from "@/components/WalletButton";
import { useCat } from "@/lib/catStore";

const navItems = [
  { href: "/", key: "navHome" },
  { href: "/create", key: "navCreate" },
  { href: "/my-cat", key: "navMyCat" },
  { href: "/discoveries", key: "navDiscoveries" },
  { href: "/passport", key: "navPassport" },
  { href: "/retirement-booth", key: "navRetirement" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale, setLocale, t } = useCat();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-5 lg:px-8">
      <nav className="glass relative z-50 mb-4 rounded-lg p-3 shadow-glow lg:sticky lg:top-3 lg:mb-5 lg:p-4">
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <Image src="/assets/mantle-logo.png" alt="Mantle logo" width={54} height={54} className="h-9 w-9 rounded-full object-cover shadow-glow" />
            <div className="min-w-0">
              <p className="text-lg font-black leading-tight tracking-tight text-white">
                Mantle <span className="mint-text">Meow</span>
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">INTERN CAT</p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <div className="max-[390px]:hidden">
              <LanguageToggle locale={locale} onChange={setLocale} />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-mint/40 bg-mint/10 text-white transition hover:bg-mint hover:text-ink"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div className="hidden items-center justify-between gap-3 lg:flex">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image src="/assets/mantle-logo.png" alt="Mantle logo" width={54} height={54} className="h-10 w-10 rounded-full object-cover shadow-glow sm:h-11 sm:w-11" />
            <div>
              <p className="text-lg font-black tracking-tight text-white sm:text-2xl">
                Mantle <span className="mint-text">Meow</span>
              </p>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">INTERN CAT</p>
            </div>
          </Link>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-nowrap items-center gap-1 xl:gap-2">
              {navItems.slice(0, 4).map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`min-h-10 shrink-0 rounded-lg px-2 py-2 text-xs font-black transition xl:px-3 xl:text-sm ${
                      active ? "bg-mint text-ink" : "border border-white/10 text-white/70 hover:border-mint hover:text-white"
                    }`}
                  >
                    {t[item.key]}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center">
              {navItems.slice(4).map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`min-h-10 shrink-0 rounded-lg px-3 py-2 text-sm font-black transition ${
                    active ? "bg-mint text-ink" : "border border-white/10 text-white/70 hover:border-mint hover:text-white"
                  }`}
                >
                  {t[item.key]}
                </Link>
              );
            })}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <DemoModeButton />
            <WalletButton />
            <OwnerBadge compact />
            <LanguageToggle locale={locale} onChange={setLocale} />
          </div>
        </div>

        {menuOpen ? (
          <div className="mt-3 grid gap-3 border-t border-mint/20 pt-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`min-h-11 rounded-lg px-3 py-3 text-center text-sm font-black transition ${
                      active ? "bg-mint text-ink" : "border border-white/10 text-white/75 hover:border-mint hover:text-white"
                    }`}
                  >
                    {t[item.key]}
                  </Link>
                );
              })}
            </div>

            <div className="grid gap-2 min-[420px]:grid-cols-2">
              <DemoModeButton />
              <WalletButton />
              <OwnerBadge compact />
              <div className="min-[391px]:hidden">
                <LanguageToggle locale={locale} onChange={setLocale} />
              </div>
            </div>
          </div>
        ) : null}
      </nav>
      {children}
      <LevelUpModal />
    </main>
  );
}
