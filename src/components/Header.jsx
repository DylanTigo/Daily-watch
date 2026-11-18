import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Bookmark, Clapperboard, Home, Search, Tv } from "lucide-react";
import logo from "../assets/logoblanc.png";
import { SearchBox } from "./SearchBox";
import { useLibrary } from "../lib/library";

const LINKS = [
  { to: "/", label: "Accueil", icon: Home, end: true },
  { to: "/films", label: "Films", icon: Clapperboard },
  { to: "/series", label: "Séries", icon: Tv },
  { to: "/ma-liste", label: "Ma liste", icon: Bookmark },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { watchlist } = useLibrary();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled
            ? "bg-night/80 shadow-[0_1px_0_rgba(242,237,227,0.08)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent"
        }`}
      >
        {!scrolled && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-night/85 via-night/40 to-transparent"
          />
        )}
        <div className="relative mx-auto flex h-16 max-w-page items-center gap-4 px-4 md:h-[4.5rem] md:gap-8 md:px-10">
          <Link to="/" className="shrink-0 rounded" aria-label="Daily Watch, accueil">
            <img src={logo} alt="" className="h-9 w-auto md:h-10" width="90" height="36" />
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
            {LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `relative rounded-[3px] px-3 py-2 text-[0.9rem] font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-board text-board-ink shadow-[0_6px_18px_-10px_rgba(242,237,227,0.6)]"
                      : "text-fg/75 hover:text-fg"
                  }`
                }
              >
                {label}
                {to === "/ma-liste" && watchlist.length > 0 && (
                  <span className="ml-1.5 font-mono text-[0.72rem] tabular opacity-70">{watchlist.length}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden md:block">
            <SearchBox />
          </div>
          <Link
            to="/recherche"
            className="btn btn-ghost btn-icon ml-auto h-10 w-10 md:hidden"
            aria-label="Rechercher"
          >
            <Search size={19} />
          </Link>
        </div>
      </header>

      <nav
        aria-label="Navigation mobile"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-night/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 pb-2 pt-2.5 text-[0.7rem] font-medium transition-colors active:scale-95 ${
                isActive ? "text-fg" : "text-mute"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  aria-hidden="true"
                  className={`absolute top-0 h-[3px] w-8 rounded-b bg-marquee transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}
                />
                <Icon size={21} strokeWidth={isActive ? 2.3 : 1.8} />
                <span>
                  {label}
                  {to === "/ma-liste" && watchlist.length > 0 && <span className="tabular"> ({watchlist.length})</span>}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
