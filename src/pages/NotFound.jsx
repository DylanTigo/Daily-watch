import { Link, useRouteError } from "react-router-dom";
import { Board, BoardText } from "../components/Board";
import { useDocumentTitle } from "../lib/hooks";

export default function NotFound() {
  useDocumentTitle("Page introuvable");
  return (
    <div className="page-enter mx-auto flex min-h-[80svh] max-w-page flex-col items-start justify-center px-4 pt-24 md:px-10">
      <Board className="w-fit max-w-full" innerClassName="px-5 py-4 md:px-7 md:py-5">
        <BoardText text="Bobine introuvable" className="text-[clamp(2.6rem,8vw,6rem)] [--slot:1.04em]" />
      </Board>
      <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-mute">
        Cette page n&apos;est pas au programme. Le lien est peut-être ancien, ou le titre a quitté l&apos;affiche.
      </p>
      <div className="mt-6 flex flex-wrap gap-2.5">
        <Link to="/" className="btn btn-primary">Retour à l&apos;affiche</Link>
        <Link to="/recherche" className="btn btn-ghost">Chercher un titre</Link>
      </div>
    </div>
  );
}

export function RouteError() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="mx-auto flex min-h-[100svh] max-w-page flex-col items-start justify-center px-4 md:px-10">
      <Board className="w-fit max-w-full" innerClassName="px-5 py-4 md:px-7 md:py-5">
        <BoardText text="Coupure de courant" animate={false} className="text-[clamp(2.6rem,8vw,6rem)] [--slot:1.04em]" />
      </Board>
      <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-mute">
        Un incident a interrompu la séance. Rechargez la page pour reprendre.
      </p>
      <div className="mt-6 flex gap-2.5">
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
          Recharger
        </button>
        <a href="/" className="btn btn-ghost">Accueil</a>
      </div>
    </div>
  );
}
