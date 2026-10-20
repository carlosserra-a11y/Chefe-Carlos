// Calculadora de convidados: rendimento por pessoa e sugestão de ceia.
import type { CeiaId } from '../types.ts';

export const MIN_CONVIDADOS = 4;
export const MAX_CONVIDADOS = 25;
export const FATIAS_POR_QUICHE = 8;

/** Porção média servida por convidado em uma ceia completa. */
export const PORCAO_POR_PESSOA = {
  chesterKg: 0.35,
  arrozKg: 0.12,
  farofaKg: 0.06,
  saladasKg: 0.18,
  sobremesaKg: 0.12,
} as const;

const CAPACIDADE: Readonly<Record<CeiaId, number>> = {
  'ceia-4': 4,
  'ceia-6-8': 8,
  'ceia-10-12': 12,
};
const MAIOR_CEIA: CeiaId = 'ceia-10-12';

export interface Rendimento {
  convidados: number;
  chesterKg: number;
  arrozKg: number;
  farofaKg: number;
  saladasKg: number;
  sobremesaKg: number;
  quiches: number;
}

export function limitarConvidados(n: number): number {
  if (!Number.isFinite(n)) return MIN_CONVIDADOS;
  return Math.min(MAX_CONVIDADOS, Math.max(MIN_CONVIDADOS, Math.round(n)));
}

const umaCasa = (kg: number): number => Math.round(kg * 10) / 10;

export function calcularRendimento(convidados: number): Rendimento {
  const n = limitarConvidados(convidados);
  return {
    convidados: n,
    chesterKg: umaCasa(n * PORCAO_POR_PESSOA.chesterKg),
    arrozKg: umaCasa(n * PORCAO_POR_PESSOA.arrozKg),
    farofaKg: umaCasa(n * PORCAO_POR_PESSOA.farofaKg),
    saladasKg: umaCasa(n * PORCAO_POR_PESSOA.saladasKg),
    sobremesaKg: umaCasa(n * PORCAO_POR_PESSOA.sobremesaKg),
    quiches: Math.ceil(n / FATIAS_POR_QUICHE),
  };
}

function ceiaParaFaixa(n: number): CeiaId {
  if (n <= CAPACIDADE['ceia-4']) return 'ceia-4';
  if (n <= CAPACIDADE['ceia-6-8']) return 'ceia-6-8';
  return MAIOR_CEIA;
}

/** Menor combinação de ceias que serve todos os convidados (acima de 12, combina). */
export function sugerirCeias(convidados: number): CeiaId[] {
  const n = limitarConvidados(convidados);
  const grandes = Math.floor((n - 1) / CAPACIDADE[MAIOR_CEIA]);
  const restante = n - grandes * CAPACIDADE[MAIOR_CEIA];
  return [...Array<CeiaId>(grandes).fill(MAIOR_CEIA), ceiaParaFaixa(restante)];
}

export function capacidadeTotal(ceias: readonly CeiaId[]): number {
  return ceias.reduce((soma, id) => soma + CAPACIDADE[id], 0);
}
