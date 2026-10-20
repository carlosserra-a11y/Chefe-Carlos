import { CakeSlice, Drumstick, Egg, Nut, Salad, Users, Wheat, type LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useId, useState } from 'react';
import { CEIAS, WHATSAPP_NUMERO } from '../data/menuData.ts';
import { formatarBRL, formatarKg } from '../lib/formato.ts';
import { linkWhatsApp } from '../lib/pedido.ts';
import {
  MAX_CONVIDADOS,
  MIN_CONVIDADOS,
  calcularRendimento,
  limitarConvidados,
  sugerirCeias,
  type Rendimento,
} from '../lib/porcoes.ts';
import type { CeiaId } from '../types.ts';
import { WhatsAppIcon } from './ui/BrandIcons.tsx';
import { Reveal } from './ui/Reveal.tsx';
import { SectionHeading } from './ui/SectionHeading.tsx';

type Indicador = { chave: keyof Omit<Rendimento, 'convidados'>; rotulo: string; Icone: LucideIcon; unidade: 'kg' | 'un' };

const INDICADORES: Indicador[] = [
  { chave: 'chesterKg', rotulo: 'Chester', Icone: Drumstick, unidade: 'kg' },
  { chave: 'arrozKg', rotulo: 'Arroz festivo', Icone: Wheat, unidade: 'kg' },
  { chave: 'farofaKg', rotulo: 'Farofa crocante', Icone: Nut, unidade: 'kg' },
  { chave: 'saladasKg', rotulo: 'Saladas nobres', Icone: Salad, unidade: 'kg' },
  { chave: 'quiches', rotulo: 'Quiches inteiras', Icone: Egg, unidade: 'un' },
  { chave: 'sobremesaKg', rotulo: 'Sobremesas', Icone: CakeSlice, unidade: 'kg' },
];

const MAXIMO = calcularRendimento(MAX_CONVIDADOS);

type Props = { onEscolherCeia: (id: CeiaId) => void };

export function CateringCalculator({ onEscolherCeia }: Props) {
  const idSlider = useId();
  const [convidados, setConvidados] = useState(8);
  const rendimento = calcularRendimento(convidados);
  const sugestao = sugerirCeias(convidados);
  const contagem = sugestao.reduce<Partial<Record<CeiaId, number>>>(
    (acc, id) => ({ ...acc, [id]: (acc[id] ?? 0) + 1 }),
    {},
  );
  const linhasSugestao = Object.entries(contagem).map(([id, qtd]) => {
    const ceia = CEIAS.find((c) => c.id === id);
    return { id: id as CeiaId, qtd: qtd ?? 1, nome: ceia?.nome ?? id, preco: ceia?.preco ?? 0, itens: ceia?.itens ?? [] };
  });
  const totalSugerido = linhasSugestao.reduce((s, l) => s + l.preco * l.qtd, 0);
  const preenchido = ((convidados - MIN_CONVIDADOS) / (MAX_CONVIDADOS - MIN_CONVIDADOS)) * 100;
  const mensagem = `Olá, Chef Carlos! Tenho um evento para ${convidados} pessoas e gostaria de uma consultoria sobre a ceia ideal.`;

  return (
    <section id="calculadora" aria-labelledby="titulo-calculadora" className="fundo-marmore relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          id="titulo-calculadora"
          selo="Calculadora de convidados"
          titulo={<>Quanto servir para <span className="italic text-ouro-escuro">cada convidado</span></>}
          descricao="Arraste para o número de pessoas e veja o rendimento recomendado de cada preparação e a ceia ideal para a sua mesa."
        />

        <Reveal className="mt-14 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div className="vidro rounded-[2rem] p-6 shadow-[0_30px_60px_-40px_rgb(29_27_24/0.5)] md:p-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <label htmlFor={idSlider} className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-pedra">
                <Users className="size-4" aria-hidden="true" /> Convidados
              </label>
              <p className="font-display text-7xl font-semibold leading-none text-tinta md:text-8xl" aria-live="polite">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={convidados}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    className="inline-block tabular-nums"
                  >
                    {convidados}
                  </motion.span>
                </AnimatePresence>
                <span className="ml-2 text-2xl text-pedra">pessoas</span>
              </p>
            </div>
            <input
              id={idSlider}
              type="range"
              min={MIN_CONVIDADOS}
              max={MAX_CONVIDADOS}
              step={1}
              value={convidados}
              onChange={(e) => setConvidados(limitarConvidados(Number(e.target.value)))}
              className="faixa-convidados mt-8 w-full"
              style={{ ['--preenchido' as string]: `${preenchido}%` }}
              aria-valuetext={`${convidados} convidados`}
            />
            <div className="mt-2 flex justify-between text-xs font-medium text-pedra">
              <span>{MIN_CONVIDADOS}</span>
              <span>{MAX_CONVIDADOS}</span>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {INDICADORES.map(({ chave, rotulo, Icone, unidade }) => {
                const valor = rendimento[chave];
                const proporcao = (valor / MAXIMO[chave]) * 100;
                return (
                  <div key={chave} className="rounded-2xl border border-linho bg-white/70 p-4">
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-pedra">
                      <Icone className="size-4 text-ouro-escuro" aria-hidden="true" /> {rotulo}
                    </dt>
                    <dd className="mt-2 font-display text-3xl font-semibold tabular-nums text-tinta">
                      {unidade === 'kg' ? formatarKg(valor) : `${valor} un.`}
                    </dd>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-linho" aria-hidden="true">
                      <motion.div
                        className="h-full rounded-full bg-ouro"
                        initial={false}
                        animate={{ width: `${proporcao}%` }}
                        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
                      />
                    </div>
                  </div>
                );
              })}
            </dl>
            <p className="mt-5 text-xs text-pedra">
              Estimativa média por convidado em ceia completa. O Chef ajusta quantidades e cardápio ao perfil do seu evento.
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-[2rem] bg-tinta p-6 text-carrara md:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ouro">Ceia ideal para {convidados} pessoas</p>
              <ul className="mt-5 space-y-3">
                {linhasSugestao.map((l) => (
                  <li key={l.id} className="border-b border-white/10 pb-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-2xl font-semibold leading-tight md:text-3xl">
                        {l.qtd > 1 && <span className="text-ouro">{l.qtd}× </span>}
                        {l.nome}
                      </span>
                      <span className="shrink-0 text-sm text-carrara/70">{formatarBRL(l.preco)}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-carrara/60">{l.itens.join(' · ')}</p>
                  </li>
                ))}
              </ul>
              {linhasSugestao.length > 1 && (
                <p className="mt-4 text-sm text-carrara/70">
                  Para grupos acima de 12 pessoas, combinamos ceias. Total estimado:{' '}
                  <strong className="text-ouro">{formatarBRL(totalSugerido)}</strong>
                </p>
              )}
            </div>
            <div className="mt-10 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onEscolherCeia(sugestao[sugestao.length - 1])}
                className="rounded-full bg-ouro px-6 py-4 text-sm font-bold text-tinta transition hover:-translate-y-0.5 hover:bg-[#c7a46c]"
              >
                Ver e encomendar esta ceia
              </button>
              <a
                href={linkWhatsApp(WHATSAPP_NUMERO, mensagem)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-4 text-sm font-semibold transition hover:border-whatsapp hover:text-[#4fd389]"
              >
                <WhatsAppIcon className="size-4" /> Consultoria direta no WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
