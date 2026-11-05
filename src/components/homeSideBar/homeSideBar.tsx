import { Link } from "react-router-dom";
import {
  LuHouse,
  LuCompass,
  LuBookmark,
  LuUserRound,
  LuSparkles,
} from "react-icons/lu";
import type { HomeView } from "../../pages/Home/home.types";

interface HomeSideBarProps {
  activeView: HomeView;
  setActiveView: (view: HomeView) => void;
  savedCount: number;
}

export default function HomeSideBar({
  activeView,
  setActiveView,
  savedCount,
}: HomeSideBarProps) {
  return (
    <>
      <aside className="hidden xl:block">
        <div className="sticky top-28 space-y-5">
          <div className="rounded-3xl border border-border-gray bg-charcoal p-4">
            <p className="mb-5 px-3 text-[10px] font-black tracking-[0.2em] text-gray-500">
              YOUR SPACE 
            </p>

            <div className="space-y-1">
              <button
                onClick={() => setActiveView("latest")}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeView === "latest"
                    ? "bg-acid-lime text-deep-black"
                    : "text-gray-400 hover:bg-input-gray hover:text-white"
                }`}
              >
                <LuHouse size={19} />
                Home
              </button>

              <button
                onClick={() => setActiveView("popular")}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeView === "popular"
                    ? "bg-acid-lime text-deep-black"
                    : "text-gray-400 hover:bg-input-gray hover:text-white"
                }`}
              >
                <LuCompass size={19} />
                Discover
              </button>

              <button
                onClick={() => setActiveView("saved")}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeView === "saved"
                    ? "bg-acid-lime text-deep-black"
                    : "text-gray-400 hover:bg-input-gray hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <LuBookmark size={19} />
                  Saved Posts
                </span>
                <span className="text-xs">{savedCount}</span>
              </button>

              <Link
                to="/profile"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-400 transition hover:bg-input-gray hover:text-white"
              >
                <LuUserRound size={19} />
                My Profile
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-acid-lime/20 bg-dark-forest p-5">
            <LuSparkles size={23} className="text-acid-lime" />

            <h3 className="mt-5 text-xl font-black leading-tight">
              FIND YOUR
              <br />
              FREQUENCY<span className="text-acid-lime">.</span>
            </h3>

            <p className="mt-3 text-xs leading-6 text-gray-400">
              Thoughts become conversations. Conversations become connections.
            </p>

            <div className="mt-5 h-1 w-16 rounded-full bg-acid-lime" />
          </div>
        </div>
      </aside>
    </>
  );
}
