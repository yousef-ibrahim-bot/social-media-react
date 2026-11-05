import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LuHouse,
  LuUserRound,
  LuBell,
  LuMenu,
  LuX,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";
import { CreatedAuthenticationContext } from "../../Context/authContext";

type User = {
  name: string;
  username?: string;
  avatar?: string | null;
};

type NavbarProps = {
  user?: User | null;
  unreadCount?: number;
  onLogout?: () => void;
};

const navItems = [
  {
    label: "Feed",
    path: "/home",
    icon: LuHouse,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: LuUserRound,
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: LuBell,
  },
];

function Avatar({ name, src }: { name: string; src?: string | null }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-acid-lime/60 bg-input-gray sm:h-10 sm:w-10">
      {src && failedUrl !== src ? (
        <img
          src={src}
          alt={`${name}'s profile`}
          onError={() => setFailedUrl(src)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-xs font-black text-acid-lime">{initials}</span>
      )}
    </div>
  );
}

export default function Navbar({
  user = null,
  unreadCount = 0,
}: NavbarProps) {
const { removeToken } = useContext(CreatedAuthenticationContext)!;


  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name || "NEXO User";
  const safeUnreadCount = Math.max(0, unreadCount);

  // Close dropdown on outside click / Escape
  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-gray bg-deep-black/95 text-white backdrop-blur-xl">
      <div className="mx-auto grid h-[70px] w-full max-w-[1440px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1.5 px-2 min-[375px]:gap-2 min-[375px]:px-3 sm:h-20 sm:gap-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
        <Link
          to="/home"
          aria-label="NEXO Home"
          className="flex w-fit shrink-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-acid-lime shadow-[0_0_22px_rgba(200,255,97,0.12)] sm:h-12 sm:w-12 sm:rounded-2xl">
            <span className="text-sm font-black text-deep-black">NX</span>
          </div>

          <div className="hidden sm:block">
            <h1 className="text-2xl font-black leading-none tracking-[-0.06em]">
              NEX<span className="text-acid-lime">O.</span>
            </h1>

            <p className="mt-1 text-[9px] font-semibold tracking-[0.17em] text-gray-500">
              BEYOND THE FEED.
            </p>
          </div>
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex min-w-0 w-fit items-center justify-self-center gap-0.5 rounded-2xl border border-border-gray bg-charcoal p-1 sm:gap-1 sm:p-1.5"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isNotifications = item.label === "Notifications";

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={item.label}
                aria-label={
                  isNotifications
                    ? `Notifications, ${safeUnreadCount} unread`
                    : item.label
                }
                className={({ isActive }) =>
                  `relative flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 sm:h-11 sm:w-11 lg:w-auto lg:px-5 ${
                    isActive
                      ? "bg-acid-lime/10 text-acid-lime"
                      : "text-gray-400 hover:bg-input-gray hover:text-white"
                  }`
                }
              >
                <Icon size={21} aria-hidden="true" />

                <span className="hidden lg:inline">{item.label}</span>

                {isNotifications && safeUnreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full border border-deep-black bg-acid-lime px-1 text-[9px] font-black leading-none text-deep-black lg:static lg:border-0">
                    {safeUnreadCount > 9 ? "9+" : safeUnreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div ref={menuRef} className="relative flex min-w-0 justify-self-end">
          <div className="flex items-center gap-0.5 rounded-full border border-border-gray bg-charcoal p-1 sm:gap-2 sm:rounded-2xl sm:p-1.5">
            <Link
              to="/profile"
              title="My profile"
              aria-label="View profile"
              onClick={() => setMenuOpen(false)}
              className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-acid-lime"
            >
              <Avatar name={displayName} src={user?.avatar} />
            </Link>

            <div className="hidden min-w-0 text-left xl:block">
              <p className="max-w-32 truncate text-sm font-bold text-white">
                {displayName}
              </p>

              <p className="max-w-32 truncate text-[10px] text-gray-400">
                @{user?.username || "nexo_member"}
              </p>
            </div>

            <button
              type="button"
              aria-label={menuOpen ? "Close profile menu" : "Open profile menu"}
              aria-expanded={menuOpen}
              aria-controls="nexo-profile-dropdown"
              onClick={() => setMenuOpen((prev) => !prev)}
              className={`flex h-9 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-colors sm:h-10 sm:w-10 ${
                menuOpen
                  ? "bg-acid-lime/10 text-acid-lime"
                  : "text-gray-400 hover:bg-input-gray hover:text-acid-lime"
              }`}
            >
              {menuOpen ? <LuX size={21} /> : <LuMenu size={21} />}
            </button>
          </div>

          {menuOpen && (
            <div
              id="nexo-profile-dropdown"
              className="absolute right-0 top-full z-50 mt-3 w-64 max-w-[calc(100vw-16px)] overflow-hidden rounded-2xl border border-border-gray bg-charcoal p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-3 border-b border-border-gray px-3 py-4">
                <Avatar name={displayName} src={user?.avatar} />

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">
                    {displayName}
                  </p>

                  <p className="truncate text-xs text-gray-400">
                    @{user?.username || "nexo_member"}
                  </p>
                </div>
              </div>

              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-input-gray"
              >
                <LuUserRound size={20} className="text-acid-lime" />
                Profile
              </Link>

              {/* SETTINGS */}
              <Link
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-input-gray"
              >
                <LuSettings size={20} className="text-acid-lime" />
                Settings
              </Link>

              <div className="my-2 border-t border-border-gray" />

              {/* LOGOUT */}
              <button
                type="button"
                onClick={removeToken}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#E5778D] transition-colors hover:bg-[#E5778D]/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LuLogOut size={20} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
