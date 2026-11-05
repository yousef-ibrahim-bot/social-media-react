import { NavLink, Outlet } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "CREATE",
  },
  {
    number: "02",
    title: "DISCOVER",
  },
  {
    number: "03",
    title: "CONNECT",
  },
  {
    number: "04",
    title: "ENGAGE",
  },
  {
    number: "05",
    title: "EXPRESS",
  },
];

export default function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-deep-black text-white lg:grid-cols-2">
      <section className="flex flex-col justify-center bg-dark-forest p-6 text-white sm:p-10 lg:p-14">
        <div>
          <h1 className="text-5xl font-black leading-none tracking-tight sm:text-6xl">
            BEYOND
            <br />
            THE <span className="text-acid-lime">FEED.</span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
            More than a place to scroll. Share what matters, discover fresh
            perspectives, and connect through real conversations.
          </p>

          <div className="mt-8 rounded-2xl border border-border-gray bg-charcoal p-5 sm:p-6">
            <p className="text-xs font-bold tracking-widest text-acid-lime">
               THE EXPERIENCE
            </p>

            <h2 className="mt-3 text-xl font-bold">
              Everything starts with a connection.
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Your thoughts deserve more than a passing scroll. Turn moments
              into conversations and connections into something meaningful.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.number}
                  className="rounded-xl border border-border-gray bg-input-gray p-3 transition-all duration-300 hover:-translate-y-1 hover:border-acid-lime/50"
                >
                  <span className="text-xs text-gray-500">
                    / {feature.number}
                  </span>

                  <h3 className="mt-3 text-sm font-black text-acid-lime">
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-7 text-xs font-bold tracking-widest text-acid-lime">
            ● REAL PEOPLE. REAL CONVERSATIONS.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-charcoal p-8">
        <div className="w-full max-w-md">
          <nav className="mb-8 grid grid-cols-2 gap-1.5 rounded-2xl border border-border-gray bg-input-gray p-1 text-center bold text-[16px] font-bold">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "bg-acid-lime text-deep-black shadow-[0_3px_14px_#C8FF6124] rounded-xl py-1"
                  : "py-1 text-gray-400"
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive
                  ? "bg-acid-lime text-deep-black shadow-[0_3px_14px_#C8FF6124] rounded-xl py-1"
                  : "py-1 text-gray-400"
              }
            >
              Sign Up
            </NavLink>
          </nav>

          <Outlet />
        </div>
      </section>
    </main>
  );
}
