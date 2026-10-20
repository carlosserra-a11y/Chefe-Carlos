import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatarBRL } from '../src/lib/formato.ts';
import {
  formatarDataBR,
  linkWhatsApp,
  montarMensagem,
  resumirPedido,
  validarCliente,
  type DadosCliente,
} from '../src/lib/pedido.ts';
import type { Ceia, Criacao, Extra, ItemCarrinho } from '../src/types.ts';

const ceias = [
  { id: 'ceia-4', nome: 'Ceia até 4 pessoas', pessoas: 'até 4 pessoas', maxPessoas: 4, preco: 599.9 },
  { id: 'ceia-6-8', nome: 'Ceia de 6 a 8 pessoas', pessoas: '6 a 8 pessoas', maxPessoas: 8, preco: 999.99 },
] as Ceia[];
const extras: Extra[] = [
  { id: 'farofa', nome: 'Farofa de castanhas', porcao: '500 g' },
  { id: 'chester', nome: 'Chester inteiro extra', porcao: '1 unidade', preco: 200 },
];
const criacoes = [{ id: 'brie', nome: 'Brie Folhado' }] as Criacao[];

const itens: ItemCarrinho[] = [
  { tipo: 'ceia', uid: 'a', ceiaId: 'ceia-6-8', extras: { farofa: 2, chester: 1 } },
  { tipo: 'criacao', uid: 'b', criacaoId: 'brie' },
  { tipo: 'criacao', uid: 'c', criacaoId: 'nao-existe' },
];

const cliente: DadosCliente = {
  nome: '  Maria Silva ',
  dataEvento: '2026-12-24',
  convidados: '8',
  endereco: 'Rua das Flores, 100 - Florianópolis',
  observacoes: 'Sem lactose na sobremesa',
};

test('formata valores em reais', () => {
  assert.equal(formatarBRL(1399).replace(/\s/g, ' '), 'R$ 1.399,00');
  assert.equal(formatarBRL(599.9).replace(/\s/g, ' '), 'R$ 599,90');
});

test('resume o pedido somando ceias e extras com preço', () => {
  const r = resumirPedido(itens, { ceias, extras, criacoes });
  assert.equal(r.ceias.length, 1);
  assert.equal(r.ceias[0].extras.length, 2);
  assert.deepEqual(r.criacoes, ['Brie Folhado']);
  assert.equal(r.totalCeias, 1199.99);
  assert.equal(r.temValorACombinar, true);
});

test('valida dados do cliente', () => {
  assert.deepEqual(validarCliente(cliente, '2026-10-20'), {});
  const erros = validarCliente(
    { nome: 'A', dataEvento: '2026-01-01', convidados: '0', endereco: 'x', observacoes: '' },
    '2026-10-20',
  );
  assert.ok(erros.nome && erros.dataEvento && erros.convidados && erros.endereco);
  assert.ok(validarCliente({ ...cliente, dataEvento: '2026-13-45' }, '2026-10-20').dataEvento);
});

test('formata data ISO para o padrão brasileiro', () => {
  assert.equal(formatarDataBR('2026-12-24'), '24/12/2026');
});

test('monta mensagem completa para o WhatsApp', () => {
  const msg = montarMensagem(resumirPedido(itens, { ceias, extras, criacoes }), cliente);
  assert.match(msg, /\*Cliente:\* Maria Silva/);
  assert.match(msg, /\*Data do evento:\* 24\/12\/2026/);
  assert.match(msg, /\*Convidados:\* 8/);
  assert.match(msg, /Ceia de 6 a 8 pessoas — R\$\s999,99/);
  assert.match(msg, /\+ 2x Farofa de castanhas \(500 g\) — valor a combinar/);
  assert.match(msg, /\+ 1x Chester inteiro extra \(1 unidade\) — R\$\s200,00/);
  assert.match(msg, /• Brie Folhado/);
  assert.match(msg, /\*Total das ceias:\* R\$\s1\.199,99/);
  assert.match(msg, /Sem lactose/);
});

test('gera link do WhatsApp com texto codificado', () => {
  const url = linkWhatsApp('554896835439', 'Olá & até já');
  assert.equal(url, 'https://wa.me/554896835439?text=Ol%C3%A1%20%26%20at%C3%A9%20j%C3%A1');
  assert.equal(linkWhatsApp('554896835439'), 'https://wa.me/554896835439');
});
