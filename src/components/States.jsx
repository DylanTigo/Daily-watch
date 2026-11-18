/* eslint-disable react/prop-types */
import { RotateCw } from "lucide-react";

export function ErrorState({ message = "Le chargement a échoué.", onRetry, compact = false }) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-start gap-3 rounded-[5px] border border-dashed border-line ${
        compact ? "px-5 py-6" : "px-6 py-10"
      }`}
    >
      <p className="text-fg">{message}</p>
      <p className="text-sm text-mute">Vérifiez votre connexion, puis réessayez.</p>
      {onRetry && (
        <button type="button" className="btn btn-ghost mt-1 h-9 px-4 text-sm" onClick={() => onRetry()}>
          <RotateCw size={15} /> Réessayer
        </button>
      )}
    </div>
  );
}

export function Spinner({ label = "Chargement" }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-sm text-mute">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-fg/20 border-t-fg" aria-hidden="true" />
      {label}
    </span>
  );
}
