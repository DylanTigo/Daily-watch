import { useEffect, useId, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useDebounced } from "../lib/hooks";
import { hrefFor, img, normalizeList, tmdb, typeLabel } from "../lib/tmdb";

/** Header search with live suggestions and full keyboard support. */
export function SearchBox() {
  const navigate = useNavigate();
  const location = useLocation();
  const listId = useId();
  const root = useRef(null);
  const input = useRef(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const debounced = useDebounced(q.trim(), 220);

  const { data, isFetching } = useQuery({
    queryKey: ["search", debounced, 1],
    queryFn: () => tmdb.search(debounced, 1),
    enabled: debounced.length >= 2,
    staleTime: 60_000,
  });
  const results = debounced.length >= 2 ? normalizeList(data)
          .slice(0, 20)
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 6) : [];

  // Close and reset when the route changes.
  useEffect(() => {
    setOpen(false);
    setActive(-1);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onDown = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "/" && !/input|textarea/i.test(document.activeElement?.tagName)) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (active >= 0 && results[active]) {
      navigate(hrefFor(results[active]));
    } else if (q.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(q.trim())}`);
    }
    input.current?.blur();
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      if (q) setQ("");
      else input.current?.blur();
      setOpen(false);
    }
  };

  const showPanel = open && debounced.length >= 2;

  return (
    <div ref={root} className="relative">
      <form role="search" onSubmit={submit} className="relative">
        <Search size={17} className="pointer-events-none absolute left-3.5 z-10 top-1/2 -translate-y-1/2 text-mute" aria-hidden="true" />
        <input
          ref={input}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Rechercher un film, une série…"
          aria-label="Rechercher un film ou une série"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          spellCheck="false"
          className="h-10 w-[17rem] rounded-[4px] bg-fg/[0.07] pl-10 pr-16 text-[0.9rem] text-fg ring-1 ring-inset ring-fg/[0.12] backdrop-blur-md transition-[background-color,box-shadow] duration-200 placeholder:text-[#8a847b] hover:bg-fg/10 focus:bg-night-2 focus:outline-none focus:ring-fg/30 lg:w-[21rem]"
        />
        {q ? (
          <button
            type="button"
            onClick={() => {
              setQ("");
              input.current?.focus();
            }}
            className="absolute right-2 top-1/2 z-10 grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-mute hover:text-fg"
            aria-label="Effacer la recherche"
          >
            <X size={16} />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-2.5 z-10 top-1/2 -translate-y-1/2 rounded-[3px] border border-line px-1.5 font-mono text-[0.7rem] text-mute">
            /
          </kbd>
        )}
      </form>

      {showPanel && (
        <div
          className="pop-enter absolute right-0 top-[calc(100%+8px)] w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-[6px] bg-night-2/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-line backdrop-blur-xl"
          style={{ "--origin": "top right" }}
        >
          <ul id={listId} role="listbox" aria-label="Suggestions" className="p-1.5">
            {results.length === 0 && (
              <li className="px-3 py-4 text-sm text-mute">
                {isFetching ? "Recherche…" : `Aucun film ni série pour « ${debounced} ».`}
              </li>
            )}
            {results.map((item, i) => (
              <li
                key={`${item.type}-${item.id}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={active === i}
                onPointerEnter={() => setActive(i)}
                onClick={() => navigate(hrefFor(item))}
                className={`flex cursor-pointer items-center gap-3 rounded-[4px] p-2 transition-colors duration-100 ${
                  active === i ? "bg-fg/10" : ""
                }`}
              >
                <div className="relative h-[60px] w-10 shrink-0 overflow-hidden rounded-[3px] bg-night-3">
                  {item.poster && <img src={img(item.poster, "w92")} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[0.92rem] font-medium text-fg">{item.title}</p>
                  <p className="font-mono text-[0.72rem] uppercase tracking-[0.04em] text-mute tabular">
                    {typeLabel(item.type)}
                    {item.year && ` · ${item.year}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {results.length > 0 && (
            <button
              type="button"
              onClick={() => navigate(`/recherche?q=${encodeURIComponent(debounced)}`)}
              className="flex w-full items-center justify-between border-t border-line px-4 py-3 text-left text-[0.85rem] text-mute transition-colors hover:bg-fg/5 hover:text-fg"
            >
              Tous les résultats pour « {debounced} »
              <kbd className="font-mono text-[0.7rem]">Entrée</kbd>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
