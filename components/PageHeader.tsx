type PageHeaderProps = {
  kicker: string;
  title: string;
  body: string;
};

export function PageHeader({ kicker, title, body }: PageHeaderProps) {
  return (
    <header className="mb-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-coral">{kicker}</p>
      <h1 className="hero-title mt-2 text-4xl font-black leading-tight text-white sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68 sm:text-base">{body}</p>
    </header>
  );
}
