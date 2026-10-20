// Carrinho: reducer imutável + sanitização do que vem do localStorage.
import type { CeiaId, ItemCarrinho } from '../types.ts';

export const MAX_EXTRA = 10;

export type AcaoCarrinho =
  | { tipo: 'adicionarCeia'; uid: string; ceiaId: CeiaId; extras: Readonly<Record<string, number>> }
  | { tipo: 'adicionarCriacao'; uid: string; criacaoId: string }
  | { tipo: 'remover'; uid: string }
  | { tipo: 'definirExtra'; uid: string; extraId: string; quantidade: number }
  | { tipo: 'limpar' }
  | { tipo: 'restaurar'; itens: ItemCarrinho[] };

const limitarExtra = (q: number): number =>
  Number.isFinite(q) ? Math.min(MAX_EXTRA, Math.max(0, Math.round(q))) : 0;

function comExtra(extras: Readonly<Record<string, number>>, id: string, qtd: number): Record<string, number> {
  const { [id]: _anterior, ...resto } = extras;
  const q = limitarExtra(qtd);
  return q > 0 ? { ...resto, [id]: q } : resto;
}

export function carrinhoReducer(estado: readonly ItemCarrinho[], acao: AcaoCarrinho): ItemCarrinho[] {
  switch (acao.tipo) {
    case 'adicionarCeia':
      return [...estado, { tipo: 'ceia', uid: acao.uid, ceiaId: acao.ceiaId, extras: { ...acao.extras } }];
    case 'adicionarCriacao':
      if (estado.some((i) => i.tipo === 'criacao' && i.criacaoId === acao.criacaoId)) return [...estado];
      return [...estado, { tipo: 'criacao', uid: acao.uid, criacaoId: acao.criacaoId }];
    case 'remover':
      return estado.filter((i) => i.uid !== acao.uid);
    case 'definirExtra':
      return estado.map((i) =>
        i.tipo === 'ceia' && i.uid === acao.uid ? { ...i, extras: comExtra(i.extras, acao.extraId, acao.quantidade) } : i,
      );
    case 'limpar':
      return [];
    case 'restaurar':
      return [...acao.itens];
  }
}

export interface IdsValidos {
  ceias: readonly string[];
  criacoes: readonly string[];
  extras: readonly string[];
}

const ehObjeto = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

/** Aceita só itens com ids conhecidos: o localStorage é dado externo e não confiável. */
export function sanitizarCarrinho(bruto: unknown, ids: IdsValidos): ItemCarrinho[] {
  if (!Array.isArray(bruto)) return [];
  return bruto.flatMap((item): ItemCarrinho[] => {
    if (!ehObjeto(item) || typeof item.uid !== 'string') return [];
    if (item.tipo === 'ceia' && typeof item.ceiaId === 'string' && ids.ceias.includes(item.ceiaId)) {
      const extrasBrutos = ehObjeto(item.extras) ? item.extras : {};
      const extras = Object.entries(extrasBrutos).reduce<Record<string, number>>(
        (acc, [id, q]) => (ids.extras.includes(id) && typeof q === 'number' ? comExtra(acc, id, q) : acc),
        {},
      );
      return [{ tipo: 'ceia', uid: item.uid, ceiaId: item.ceiaId as CeiaId, extras }];
    }
    if (item.tipo === 'criacao' && typeof item.criacaoId === 'string' && ids.criacoes.includes(item.criacaoId)) {
      return [{ tipo: 'criacao', uid: item.uid, criacaoId: item.criacaoId }];
    }
    return [];
  });
}
