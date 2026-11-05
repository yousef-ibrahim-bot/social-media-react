

export default function NotFound() {

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-deep-black px-6 py-8 text-white sm:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(#343B38 1px, transparent 1px),
            linear-gradient(90deg, #343B38 1px, transparent 1px)
          `,
          backgroundSize: "55px 55px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acid-lime/10 blur-[110px]"
      />

      <section className="relative z-10 flex flex-1 flex-col items-center justify-center py-16 text-center">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-acid-lime" />
          <p className="text-xs font-bold tracking-[0.25em] text-acid-lime">
            SIGNAL LOST / PAGE NOT FOUND
          </p>
        </div>

        <h1 className="relative text-[clamp(7rem,24vw,18rem)] font-black leading-none tracking-[-0.09em] text-acid-lime drop-shadow-[0_0_60px_rgba(200,255,97,0.15)]">
          404
        </h1>

        <div className="my-6 h-px w-48 bg-gradient-to-r from-transparent via-acid-lime to-transparent" />

      </section>

    </main>
  );
}
