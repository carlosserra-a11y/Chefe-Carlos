// Tipos compartilhados entre os dados do cardápio, a lógica (src/lib) e os componentes.

export type CeiaId = 'ceia-4' | 'ceia-6-8' | 'ceia-10-12';

/** Peças desenhadas na ilustração de composição de cada ceia. */
export type PecaIlustracao =
  | 'chester-fatiado'
  | 'chester-inteiro'
  | 'arroz'
  | 'farofa'
  | 'salpicao'
  | 'quiche'
  | 'waldorf'
  | 'pudim'
  | 'pave'
  | 'cheesecake';

export interface Ceia {
  id: CeiaId;
  nome: string;
  pessoas: string;
  maxPessoas: number;
  preco: number;
  destaque?: string;
  resumo: string;
  itens: string[];
  /** Quantidade de cada peça na mesa, usada pela ilustração (composição e porção). */
  composicao: Partial<Record<PecaIlustracao, number>>;
  /** Fotos reais do Chef com preparações da mesma família. */
  fotos: string[];
}

export interface Extra {
  id: string;
  nome: string;
  porcao: string;
  /** Sem preço definido o extra entra no pedido como "valor a combinar". */
  preco?: number;
}

export type CategoriaId = 'mesas' | 'entradas' | 'quentes' | 'paes' | 'doces';

export interface FichaTecnica {
  apresentacao: string;
  embalagem: string;
  segredos: string;
  harmonizacao: string;
}

export interface Criacao {
  id: string;
  nome: string;
  categoria: CategoriaId;
  descricao: string;
  fotos: string[];
  ficha: FichaTecnica;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  fotos: string[];
}

export interface ItemCeia {
  tipo: 'ceia';
  uid: string;
  ceiaId: CeiaId;
  extras: Readonly<Record<string, number>>;
}

export interface ItemCriacao {
  tipo: 'criacao';
  uid: string;
  criacaoId: string;
}

export type ItemCarrinho = ItemCeia | ItemCriacao;
