import { FAIXA_FOTOS, miniatura } from '../data/menuData.ts';

/** Faixa contínua de fotos reais (decorativa); pausa ao passar o mouse. */
export function PhotoMarquee() {
  const fotos = [...FAIXA_FOTOS, ...FAIXA_FOTOS];
  return (
    <div className="relative overflow-hidden border-y border-linho bg-carrara py-5" aria-hidden="true">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-carrara to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-carrara to-transparent" />
      <ul className="flex w-max animate-faixa gap-4 hover:[animation-play-state:paused]">
        {fotos.map((nome, i) => (
          <li key={`${nome}-${i}`} className="shrink-0">
            <img
              src={miniatura(nome)}
              alt=""
              width={480}
              height={640}
              loading="lazy"
              className={`h-36 w-28 rounded-xl object-cover shadow-md md:h-44 md:w-36 ${i % 2 ? 'translate-y-2' : '-translate-y-1'}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
