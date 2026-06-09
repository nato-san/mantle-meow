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
    <main className="mx-auto min-h-screen w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-5 lg:px-8">
      <nav className="glass relative z-50 mb-4 flex flex-col gap-3 rounded-lg p-3 shadow-glow lg:sticky lg:top-3 lg:mb-5 lg:flex-row lg:items-center lg:justify-between lg:p-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/assets/mantle-logo.png" alt="Mantle logo" width={54} height={54} className="h-10 w-10 rounded-full object-cover shadow-glow sm:h-11 sm:w-11" />
          <div>
            <p className="text-lg font-black tracking-tight text-white sm:text-2xl">
              Mantle <span className="mint-text">Meow</span>
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">INTERN CAT</p>
          </div>
        </Link>

        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`min-h-9 shrink-0 rounded-lg px-3 py-2 text-sm font-black transition lg:min-h-10 ${
                  active ? "bg-mint text-ink" : "border border-white/10 text-white/70 hover:border-mint hover:text-white"
                }`}
              >
                {t[item.key]}
              </Link>
            );
          })}
        </div>

        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
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
