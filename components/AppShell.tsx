"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <nav className="glass sticky top-3 z-50 mb-5 flex flex-col gap-4 rounded-lg p-4 shadow-glow lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/assets/mantle-logo.png" alt="Mantle logo" width={54} height={54} className="h-11 w-11 rounded-full object-cover shadow-glow" />
          <div>
            <p className="text-xl font-black tracking-tight text-white sm:text-2xl">
              Mantle <span className="mint-text">Meow</span>
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">INTERN CAT</p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`min-h-10 rounded-lg px-3 py-2 text-sm font-black transition ${
                  active ? "bg-mint text-ink" : "border border-white/10 text-white/70 hover:border-mint hover:text-white"
                }`}
              >
                {t[item.key]}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <DemoModeButton />
          <WalletButton />
          <OwnerBadge compact />
          <LanguageToggle locale={locale} onChange={setLocale} />
        </div>
      </nav>
      {children}
      <LevelUpModal />
    </main>
  );
}
