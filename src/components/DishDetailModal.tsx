import { Check, ChefHat, Package, Plus, Sparkles, Wine, X, type LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { CATEGORIAS, WHATSAPP_NUMERO, foto, miniatura } from '../data/menuData.ts';
import { linkWhatsApp } from '../lib/pedido.ts';
import type { Criacao, FichaTecnica } from '../types.ts';
import { WhatsAppIcon } from './ui/BrandIcons.tsx';
import { SUAVE } from './ui/Reveal.tsx';

const BLOCOS: { chave: keyof FichaTecnica; titulo: string; Icone: LucideIcon }[] = [
  { chave: 'apresentacao', titulo: 'Modo de apresentação', Icone: Sparkles },
  { chave: 'embalagem', titulo: 'Embalagem & transporte', Icone: Package },
  { chave: 'segredos', titulo: 'Segredos de preparo', Icone: ChefHat },
  { chave: 'harmonizacao', titulo: 'Harmonização de vinhos', Icone: Wine },
];

type Props = {
  criacao: Criacao | null;
  noPedido: boolean;
  onFechar: () => void;
  onAdicionar: (criacaoId: string) => void;
};

export function DishDetailModal({ criacao, noPedido, onFechar, onAdicionar }: Props) {
  return (
    <AnimatePresence>
      {criacao && <Conteudo key={criacao.id} criacao={criacao} noPedido={noPedido} onFechar={onFechar} onAdicionar={onAdicionar} />}
    </AnimatePresence>
  );
}

function Conteudo({ criacao, noPedido, onFechar, onAdicionar }: Props & { criacao: Criacao }) {
  const [fotoAtiva, setFotoAtiva] = useState(criacao.fotos[0]);
  const fechar = useRef<HTMLButtonElement>(null);
  const categoria = CATEGORIAS.find((c) => c.id === criacao.categoria)?.nome;
  const mensagem = `Olá, Chef Carlos! Vi no catálogo a criação "${criacao.nome}" e gostaria de negociar para o meu evento.`;

  useEffect(() => {
    fechar.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && onFechar();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', tecla);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', tecla);
    };
  }, [onFechar]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center p-0 md:items-center md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button type="button" aria-label="Fechar ficha técnica" className="absolute inset-0 bg-tinta/70 backdrop-blur-sm" onClick={onFechar} tabIndex={-1} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-ficha"
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.5, ease: SUAVE }}
        className="rolagem-fina relative max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-[2rem] bg-carrara md:rounded-[2rem]"
      >
        <button
          ref={fechar}
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="vidro absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full text-tinta transition hover:rotate-90"
        >
          <X className="size-5" />
        </button>
        <div className="grid md:grid-cols-[1.05fr_1fr]">
          <div className="bg-tinta p-3 md:p-4">
            <AnimatePresence mode="wait">
              <motion.img
                key={fotoAtiva}
                src={foto(fotoAtiva)}
                alt={`${criacao.nome}, preparado pelo Chef Carlos Jr`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="aspect-[4/5] w-full rounded-[1.4rem] object-cover"
              />
            </AnimatePresence>
            {criacao.fotos.length > 1 && (
              <ul className="sem-barra mt-3 flex gap-2 overflow-x-auto">
                {criacao.fotos.map((f) => (
                  <li key={f} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setFotoAtiva(f)}
                      aria-label="Ver outra foto"
                      aria-pressed={f === fotoAtiva}
                      className={`overflow-hidden rounded-xl border-2 transition ${f === fotoAtiva ? 'border-ouro' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={miniatura(f)} alt="" className="size-16 object-cover" loading="lazy" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col p-6 md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ouro-escuro">{categoria}</p>
            <h3 id="titulo-ficha" className="mt-2 pr-10 font-display text-4xl font-semibold leading-tight text-tinta">
              {criacao.nome}
            </h3>
            <p className="mt-3 leading-relaxed text-grafite">{criacao.descricao}</p>
            <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-tinta px-4 py-2 text-xs font-semibold text-carrara">
              <span className="size-1.5 rounded-full bg-ouro" aria-hidden="true" /> Sob Consulta · Negociação Pessoal no WhatsApp
            </p>

            <dl className="mt-7 grid gap-5">
              {BLOCOS.map(({ chave, titulo, Icone }) => (
                <div key={chave} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-linho bg-white text-ouro-escuro">
                    <Icone className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-sm font-bold text-tinta">{titulo}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-grafite">{criacao.ficha[chave]}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3 border-t border-linho pt-6">
              <a
                href={linkWhatsApp(WHATSAPP_NUMERO, mensagem)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <WhatsAppIcon className="size-4" /> Negociar no WhatsApp
              </a>
              <button
                type="button"
                onClick={() => onAdicionar(criacao.id)}
                disabled={noPedido}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-tinta px-5 py-3.5 text-sm font-semibold text-tinta transition hover:bg-tinta hover:text-carrara disabled:border-oliva disabled:bg-oliva disabled:text-white"
              >
                {noPedido ? <Check className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
                {noPedido ? 'Já está no pedido' : 'Incluir no pedido'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
