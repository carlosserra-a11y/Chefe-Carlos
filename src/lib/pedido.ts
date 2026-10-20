// Pedido: resumo do carrinho, validação do formulário e mensagem para o WhatsApp.
import type { Ceia, Criacao, Extra, ItemCarrinho } from '../types.ts';
import { formatarBRL } from './formato.ts';

export interface LinhaExtra {
  nome: string;
  porcao: string;
  quantidade: number;
  preco?: number;
}

export interface LinhaCeia {
  uid: string;
  nome: string;
  preco: number;
  extras: LinhaExtra[];
}

export interface ResumoPedido {
  ceias: LinhaCeia[];
  criacoes: string[];
  totalCeias: number;
  temValorACombinar: boolean;
}

export interface Catalogo {
  ceias: readonly Ceia[];
  extras: readonly Extra[];
  criacoes: readonly Criacao[];
}

const centavos = (v: number): number => Math.round(v * 100) / 100;

export function resumirPedido(itens: readonly ItemCarrinho[], catalogo: Catalogo): ResumoPedido {
  const ceias = itens.flatMap((item): LinhaCeia[] => {
    if (item.tipo !== 'ceia') return [];
    const ceia = catalogo.ceias.find((c) => c.id === item.ceiaId);
    if (!ceia) return [];
    const extras = Object.entries(item.extras).flatMap(([id, quantidade]): LinhaExtra[] => {
      const extra = catalogo.extras.find((e) => e.id === id);
      return extra ? [{ nome: extra.nome, porcao: extra.porcao, quantidade, preco: extra.preco }] : [];
    });
    return [{ uid: item.uid, nome: ceia.nome, preco: ceia.preco, extras }];
  });
  const criacoes = itens.flatMap((item) => {
    if (item.tipo !== 'criacao') return [];
    const criacao = catalogo.criacoes.find((c) => c.id === item.criacaoId);
    return criacao ? [criacao.nome] : [];
  });
  const totalCeias = centavos(
    ceias.reduce(
      (soma, c) => soma + c.preco + c.extras.reduce((s, e) => s + (e.preco ?? 0) * e.quantidade, 0),
      0,
    ),
  );
  const temValorACombinar = criacoes.length > 0 || ceias.some((c) => c.extras.some((e) => e.preco === undefined));
  return { ceias, criacoes, totalCeias, temValorACombinar };
}

export interface DadosCliente {
  nome: string;
  dataEvento: string;
  convidados: string;
  endereco: string;
  observacoes: string;
}

export type ErrosCliente = Partial<Record<keyof DadosCliente, string>>;

const DATA_ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

function dataValida(iso: string): boolean {
  const m = DATA_ISO.exec(iso);
  if (!m) return false;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toISOString().slice(0, 10) === iso;
}

/** `hojeIso` no formato aaaa-mm-dd (data local do visitante). */
export function validarCliente(dados: DadosCliente, hojeIso: string): ErrosCliente {
  const erros: ErrosCliente = {};
  const nome = dados.nome.trim();
  if (nome.length < 2 || nome.length > 80) erros.nome = 'Informe seu nome (2 a 80 caracteres).';
  if (!dataValida(dados.dataEvento)) erros.dataEvento = 'Escolha a data do evento.';
  else if (dados.dataEvento < hojeIso) erros.dataEvento = 'A data do evento já passou.';
  const convidados = Number(dados.convidados);
  if (!Number.isInteger(convidados) || convidados < 1 || convidados > 500) {
    erros.convidados = 'Informe de 1 a 500 convidados.';
  }
  const endereco = dados.endereco.trim();
  if (endereco.length < 5 || endereco.length > 200) erros.endereco = 'Informe o endereço de entrega.';
  if (dados.observacoes.length > 500) erros.observacoes = 'Use até 500 caracteres.';
  return erros;
}

export function formatarDataBR(iso: string): string {
  const m = DATA_ISO.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

const linhaExtra = (e: LinhaExtra): string =>
  `   + ${e.quantidade}x ${e.nome} (${e.porcao}) — ${
    e.preco === undefined ? 'valor a combinar' : formatarBRL(e.preco * e.quantidade)
  }`;

export function montarMensagem(resumo: ResumoPedido, cliente: DadosCliente): string {
  const linhas = [
    'Olá, Chef Carlos! Quero fazer uma encomenda pelo site.',
    '',
    `*Cliente:* ${cliente.nome.trim()}`,
    `*Data do evento:* ${formatarDataBR(cliente.dataEvento)}`,
    `*Convidados:* ${cliente.convidados}`,
    `*Endereço:* ${cliente.endereco.trim()}`,
  ];
  if (resumo.ceias.length > 0) {
    linhas.push('', '*Ceias*');
    resumo.ceias.forEach((c) => {
      linhas.push(`• ${c.nome} — ${formatarBRL(c.preco)}`, ...c.extras.map(linhaExtra));
    });
  }
  if (resumo.criacoes.length > 0) {
    linhas.push('', '*Criações do catálogo (sob consulta)*', ...resumo.criacoes.map((n) => `• ${n}`));
  }
  if (resumo.ceias.length > 0) linhas.push('', `*Total das ceias:* ${formatarBRL(resumo.totalCeias)}`);
  if (resumo.temValorACombinar) linhas.push('_Extras e criações sob consulta: valores a combinar por aqui._');
  const obs = cliente.observacoes.trim();
  if (obs) linhas.push('', `*Observações:* ${obs}`);
  return linhas.join('\n');
}

export function linkWhatsApp(numero: string, texto?: string): string {
  const base = `https://wa.me/${numero}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}
