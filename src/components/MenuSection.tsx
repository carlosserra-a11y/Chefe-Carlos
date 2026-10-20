import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { CATEGORIAS, CRIACOES, foto, miniatura } from '../data/menuData.ts';
import type { CategoriaId, Criacao } from '../types.ts';
import { SUAVE } from './ui/Reveal.tsx';
import { SectionHeading } from './ui/SectionHeading.tsx';

type Filtro = CategoriaId | 'todas';
type Props = { onAbrir: (criacao: Criacao) => void };

export function MenuSection({ onAbrir }: Props) {
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const lista = filtro === 'todas' ? CRIACOES : CRIACOES.filter((c) => c.categoria === filtro);
  const filtros: { id: Filtro; nome: string; total: number }[] = [
    { id: 'todas', nome: 'Todas', total: CRIACOES.length },
    ...CATEGORIAS.map((c) => ({ ...c, total: CRIACOES.filter((x) => x.categoria === c.id).length })),
  ];

  return (
    <section id="catalogo" aria-labelledby="titulo-catalogo" className="relative bg-carrara py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="titulo-catalogo"
            selo="Catálogo de criações técnicas"
            titulo={<>O que o Chef <span className="italic text-ouro-escuro">é capaz de criar</span></>}
            descricao="Fotos reais de eventos assinados pelo Chef Carlos Jr. Cada criação é cotada sob medida: toque em um prato para ver a ficha técnica e negociar pelo WhatsApp."
          />
          <p className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ouro/50 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ouro-escuro lg:self-end">
            <MessageCircle className="size-3.5" aria-hidden="true" /> Sob consulta · sem preços fixos
          </p>
        </div>

        <div role="toolbar" aria-label="Filtrar por categoria" className="sem-barra -mx-5 mt-12 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
          {filtros.map((f) => {
            const ativo = filtro === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={ativo}
                onClick={() => setFiltro(f.id)}
                className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  ativo ? 'text-carrara' : 'text-grafite hover:bg-marmore'
                }`}
              >
                {ativo && <motion.span layoutId="filtro-ativo" className="absolute inset-0 -z-0 rounded-full bg-tinta" />}
                <span className="relative">
                  {f.nome} <span className={ativo ? 'text-ouro' : 'text-pedra'}>{f.total}</span>
                </span>
              </button>
            );
          })}
        </div>

        <motion.ul layout className="mt-10 grid auto-rows-[15rem] grid-cols-2 gap-3 md:auto-rows-[17rem] md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {lista.map((criacao, i) => (
              <motion.li
                layout
                key={criacao.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04, ease: SUAVE }}
                className={i % 7 === 0 ? 'col-span-2 row-span-2' : i % 5 === 3 ? 'row-span-2' : ''}
              >
                <CartaoCriacao criacao={criacao} grande={i % 7 === 0} onAbrir={onAbrir} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

function CartaoCriacao({ criacao, grande, onAbrir }: { criacao: Criacao; grande: boolean; onAbrir: Props['onAbrir'] }) {
  const categoria = CATEGORIAS.find((c) => c.id === criacao.categoria)?.nome;
  return (
    <button
      type="button"
      onClick={() => onAbrir(criacao)}
      className="group relative block size-full overflow-hidden rounded-3xl bg-marmore text-left shadow-[0_20px_40px_-30px_rgb(29_27_24/0.6)]"
      aria-label={`${criacao.nome}: ver ficha técnica`}
    >
      <img
        src={grande ? foto(criacao.fotos[0]) : miniatura(criacao.fotos[0])}
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition duration-[1.2s] ease-out group-hover:scale-110"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-tinta/90 via-tinta/20 to-transparent" aria-hidden="true" />
      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ouro-escuro">
        Sob consulta
      </span>
      <span className="absolute right-3 top-3 grid size-9 translate-y-1 place-items-center rounded-full bg-white/90 text-tinta opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </span>
      <span className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ouro">{categoria}</span>
        <span className={`mt-1 block font-display font-semibold leading-tight text-carrara ${grande ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
          {criacao.nome}
        </span>
        {grande && <span className="mt-2 line-clamp-2 block text-sm text-carrara/80">{criacao.descricao}</span>}
      </span>
    </button>
  );
}
