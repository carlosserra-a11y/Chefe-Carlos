import { Check, ShoppingBag } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { CEIAS, EXTRAS, WHATSAPP_NUMERO, miniatura } from '../data/menuData.ts';
import { formatarBRL } from '../lib/formato.ts';
import { linkWhatsApp } from '../lib/pedido.ts';
import type { Ceia, CeiaId } from '../types.ts';
import { CeiaIllustration } from './CeiaIllustration.tsx';
import { ExtrasSelector } from './ExtrasSelector.tsx';
import { WhatsAppIcon } from './ui/BrandIcons.tsx';
import { Reveal, SUAVE } from './ui/Reveal.tsx';
import { SectionHeading } from './ui/SectionHeading.tsx';

type Props = {
  selecionada: CeiaId;
  onSelecionar: (id: CeiaId) => void;
  onAdicionar: (id: CeiaId, extras: Record<string, number>) => void;
};

export function CeiasShowcase({ selecionada, onSelecionar, onAdicionar }: Props) {
  const ceia = CEIAS.find((c) => c.id === selecionada) ?? CEIAS[0];
  return (
    <section id="ceias" aria-labelledby="titulo-ceias" className="relative overflow-hidden bg-tinta py-24 text-carrara md:py-32">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-ouro/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          id="titulo-ceias"
          escuro
          selo="Natal 2026 · valores oficiais"
          titulo={<>As três ceias <span className="italic text-ouro">do Chef</span></>}
          descricao="Escolha o tamanho da sua mesa, acrescente porções extras e envie o pedido completo direto para o WhatsApp do Chef."
        />

        <div role="tablist" aria-label="Tamanho da ceia" className="mt-14 grid gap-4 md:grid-cols-3">
          {CEIAS.map((c, i) => (
            <Reveal key={c.id} atraso={i * 0.1}>
              <CartaoCeia ceia={c} ativa={c.id === selecionada} onClick={() => onSelecionar(c.id)} />
            </Reveal>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={ceia.id}
            id={`painel-${ceia.id}`}
            role="tabpanel"
            aria-label={ceia.nome}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: SUAVE }}
            className="mt-8"
          >
            <PainelCeia ceia={ceia} onAdicionar={onAdicionar} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function CartaoCeia({ ceia, ativa, onClick }: { ceia: Ceia; ativa: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={ativa}
      aria-controls={`painel-${ceia.id}`}
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-3xl border p-6 text-left transition duration-300 ${
        ativa ? 'border-ouro bg-white/[0.07]' : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05]'
      }`}
    >
      {ativa && <motion.span layoutId="ceia-ativa" className="absolute inset-x-0 top-0 h-1 bg-ouro" />}
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-carrara/60">{ceia.pessoas}</p>
        {ceia.destaque && (
          <span className="rounded-full bg-ouro px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-tinta">
            {ceia.destaque}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-3xl font-semibold leading-tight">{ceia.nome}</p>
      <p className="mt-3 font-display text-4xl font-semibold text-ouro">{formatarBRL(ceia.preco)}</p>
      <p className="mt-3 text-sm leading-relaxed text-carrara/65">{ceia.resumo}</p>
    </button>
  );
}

function PainelCeia({ ceia, onAdicionar }: { ceia: Ceia; onAdicionar: Props['onAdicionar'] }) {
  const [extras, setExtras] = useState<Record<string, number>>({});
  const totalExtras = Object.values(extras).reduce((s, q) => s + q, 0);
  const alterar = (id: string, q: number) =>
    setExtras((atual) => {
      const { [id]: _anterior, ...resto } = atual;
      return q > 0 ? { ...resto, [id]: q } : resto;
    });
  const adicionar = () => {
    onAdicionar(ceia.id, extras);
    setExtras({});
  };
  const mensagem = `Olá, Chef Carlos! Tenho interesse na ${ceia.nome} (${formatarBRL(ceia.preco)}). Pode me passar as datas disponíveis?`;

  return (
    <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 md:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10 lg:p-10 [&>*]:min-w-0">
      <div>
        <div className="overflow-hidden rounded-3xl bg-carrara p-2 shadow-2xl">
          <CeiaIllustration ceia={ceia} />
        </div>
        <p className="mt-3 text-xs text-carrara/55">
          Ilustração da mesa vista de cima: cada peça corresponde a um item da ceia, na quantidade e proporção servidas.
        </p>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-ouro">Na bancada do Chef</p>
        <ul className="mt-3 grid grid-cols-3 gap-3">
          {ceia.fotos.map((f) => (
            <li key={f} className="overflow-hidden rounded-2xl">
              <img
                src={miniatura(f)}
                alt="Preparação real do Chef Carlos Jr"
                width={480}
                height={640}
                loading="lazy"
                className="aspect-square w-full object-cover transition duration-700 hover:scale-110"
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-carrara/55">{ceia.pessoas}</p>
        <h3 className="mt-2 font-display text-4xl font-semibold md:text-5xl">{ceia.nome}</h3>
        <ul className="mt-6 space-y-3">
          {ceia.itens.map((item) => (
            <li key={item} className="flex items-start gap-3 text-carrara/85">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ouro/20 text-ouro">
                <Check className="size-3" aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-2xl font-semibold">Personalize com extras</p>
            <p className="text-xs text-carrara/55">{totalExtras > 0 ? `${totalExtras} selecionado(s)` : 'opcional'}</p>
          </div>
          <div className="rolagem-fina mt-2 max-h-64 overflow-y-auto pr-2">
            <ExtrasSelector extras={EXTRAS} valores={extras} onAlterar={alterar} escuro />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-carrara/55">Valor da ceia</p>
            <p className="font-display text-5xl font-semibold text-ouro">{formatarBRL(ceia.preco)}</p>
            {totalExtras > 0 && <p className="mt-1 text-xs text-carrara/60">+ extras com valor combinado no WhatsApp</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={linkWhatsApp(WHATSAPP_NUMERO, mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-sm font-semibold transition hover:border-whatsapp hover:text-[#4fd389]"
            >
              <WhatsAppIcon className="size-4" /> Tirar dúvidas
            </a>
            <button
              type="button"
              onClick={adicionar}
              className="inline-flex items-center gap-2 rounded-full bg-ouro px-6 py-3.5 text-sm font-bold text-tinta transition hover:-translate-y-0.5 hover:bg-[#c7a46c] active:translate-y-0"
            >
              <ShoppingBag className="size-4" aria-hidden="true" /> Encomendar ceia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
