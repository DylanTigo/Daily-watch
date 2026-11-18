import { Link } from "react-router-dom";
import { useToast } from "../lib/toast";
import logo from "../assets/logoblanc.png";

export function Toaster() {
  const current = useToast();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[80] flex justify-center px-4 md:bottom-8"
    >
      {current && (
        <div
          key={current.id}
          className="modal-enter rounded-[5px] bg-board px-4 py-3 text-[0.9rem] font-medium text-board-ink shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)]"
        >
          {current.message}
        </div>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line pb-28 pt-12 md:pb-14">
      <div className="mx-auto grid max-w-page gap-10 px-4 md:grid-cols-[1fr_auto] md:px-10">
        <div className="max-w-md">
          <img src={logo} alt="Daily Watch" className="h-9 w-auto opacity-90" width="90" height="36" />
          <p className="mt-4 text-sm leading-relaxed text-mute">
            Ce soir, quoi regarder ? Les films et séries du moment, leurs bandes-annonces et les plateformes où
            les voir légalement. Sans compte : votre liste reste dans votre navigateur.
          </p>
        </div>
        <nav aria-label="Pied de page" className="grid grid-cols-2 gap-x-10 gap-y-2.5 text-sm">
          <Link className="text-fg/80 hover:text-fg" to="/films">Films</Link>
          <Link className="text-fg/80 hover:text-fg" to="/films?tri=top">Films les mieux notés</Link>
          <Link className="text-fg/80 hover:text-fg" to="/series">Séries</Link>
          <Link className="text-fg/80 hover:text-fg" to="/series?tri=top">Séries les mieux notées</Link>
          <Link className="text-fg/80 hover:text-fg" to="/ma-liste">Ma liste</Link>
          <Link className="text-fg/80 hover:text-fg" to="/recherche">Recherche</Link>
        </nav>
      </div>
      <div className="mx-auto mt-10 max-w-page px-4 md:px-10">
        <p className="border-t border-line pt-6 text-xs leading-relaxed text-mute">
          Données et images fournies par{" "}
          <a className="underline decoration-fg/30 underline-offset-4 hover:text-fg" href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
            TMDB
          </a>
          . Ce produit utilise l&apos;API TMDB mais n&apos;est ni approuvé ni certifié par TMDB. Offres de streaming fournies par{" "}
          <a className="underline decoration-fg/30 underline-offset-4 hover:text-fg" href="https://www.justwatch.com/fr" target="_blank" rel="noreferrer">
            JustWatch
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
