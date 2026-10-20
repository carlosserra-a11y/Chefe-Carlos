import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { EVENTOS, foto, miniatura } from '../data/menuData.ts';
import { SUAVE } from './ui/Reveal.tsx';
import { SectionHeading } from './ui/SectionHeading.tsx';

export function EventGallery() {
  const [eventoId, setEventoId] = useState(EVENTOS[0].id);
  const [aberta, setAberta] = useState<number | null>(null);
  const evento = EVENTOS.find((e) => e.id === eventoId) ?? EVENTOS[0];
  const fechar = useCallback(() => setAberta(null), []);

  return (
    <section id="eventos" aria-labelledby="titulo-eventos" className="relative overflow-hidden bg-[#141311] py-24 text-carrara md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          id="titulo-eventos"
          escuro
          selo="Portfólio de eventos"
          titulo={<>Mesas que <span className="italic text-ouro">contam histórias</span></>}
          descricao="Casamentos, buffets corporativos, brunches e jantares: registros reais do trabalho do Chef e da equipe."
        />

        <div role="tablist" aria-label="Tipo de evento" className="sem-barra -mx-5 mt-12 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
          {EVENTOS.map((e) => {
            const ativo = e.id === eventoId;
            return (
              <button
                key={e.id}
                type="button"
                role="tab"
                aria-selected={ativo}
                onClick={() => setEventoId(e.id)}
                className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                  ativo ? 'border-ouro bg-ouro text-tinta' : 'border-white/15 text-carrara/75 hover:border-white/40 hover:text-carrara'
                }`}
              >
                {e.titulo}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={evento.id}
            role="tabpanel"
            aria-label={evento.titulo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="mt-6 max-w-2xl text-carrara/70">{evento.descricao}</p>
            <ul className="mt-8 columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
              {evento.fotos.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: SUAVE }}
                  className="mb-3 break-inside-avoid md:mb-4"
                >
                  <button
                    type="button"
                    onClick={() => setAberta(i)}
                    className="group relative block w-full overflow-hidden rounded-2xl"
                    aria-label={`Ampliar foto ${i + 1} de ${evento.titulo}`}
                  >
                    <img
                      src={miniatura(f)}
                      alt=""
                      loading="lazy"
                      className="w-full object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-110"
                    />
                    <span className="absolute inset-0 grid place-items-center bg-tinta/0 opacity-0 transition group-hover:bg-tinta/30 group-hover:opacity-100">
                      <Expand className="size-6" aria-hidden="true" />
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <Lightbox fotos={evento.fotos} indice={aberta} titulo={evento.titulo} onIndice={setAberta} onFechar={fechar} />
    </section>
  );
}

type LightboxProps = {
  fotos: string[];
  indice: number | null;
  titulo: string;
  onIndice: (i: number) => void;
  onFechar: () => void;
};

function Lightbox({ fotos, indice, titulo, onIndice, onFechar }: LightboxProps) {
  const total = fotos.length;
  useEffect(() => {
    if (indice === null) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
      if (e.key === 'ArrowRight') onIndice((indice + 1) % total);
      if (e.key === 'ArrowLeft') onIndice((indice - 1 + total) % total);
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [indice, total, onIndice, onFechar]);

  return (
    <AnimatePresence>
      {indice !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${titulo}: foto ${indice + 1} de ${total}`}
          className="fixed inset-0 z-[80] grid place-items-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onFechar}
        >
          <motion.img
            key={fotos[indice]}
            src={foto(fotos[indice])}
            alt={`${titulo}, foto ${indice + 1}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[86svh] max-w-full rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {indice + 1} / {total}
          </p>
          {[
            { rotulo: 'Foto anterior', Icone: ChevronLeft, lado: 'left-3 md:left-6', alvo: (indice - 1 + total) % total },
            { rotulo: 'Próxima foto', Icone: ChevronRight, lado: 'right-3 md:right-6', alvo: (indice + 1) % total },
          ].map(({ rotulo, Icone, lado, alvo }) => (
            <button
              key={rotulo}
              type="button"
              aria-label={rotulo}
              onClick={(e) => {
                e.stopPropagation();
                onIndice(alvo);
              }}
              className={`absolute top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25 ${lado}`}
            >
              <Icone className="size-6" />
            </button>
          ))}
          <button
            type="button"
            aria-label="Fechar"
            onClick={onFechar}
            autoFocus
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
          >
            <X className="size-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
