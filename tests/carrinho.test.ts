import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MAX_EXTRA, carrinhoReducer, sanitizarCarrinho } from '../src/lib/carrinho.ts';
import type { ItemCarrinho } from '../src/types.ts';

const vazio: ItemCarrinho[] = [];

test('adiciona ceia com extras sem alterar o estado anterior', () => {
  const novo = carrinhoReducer(vazio, { tipo: 'adicionarCeia', uid: 'a', ceiaId: 'ceia-4', extras: { farofa: 2 } });
  assert.equal(vazio.length, 0);
  assert.deepEqual(novo, [{ tipo: 'ceia', uid: 'a', ceiaId: 'ceia-4', extras: { farofa: 2 } }]);
});

test('não duplica a mesma criação do catálogo', () => {
  const um = carrinhoReducer(vazio, { tipo: 'adicionarCriacao', uid: 'x', criacaoId: 'brie' });
  const dois = carrinhoReducer(um, { tipo: 'adicionarCriacao', uid: 'y', criacaoId: 'brie' });
  assert.equal(dois.length, 1);
});

test('define quantidade de extra com limites e remove quando zera', () => {
  const base = carrinhoReducer(vazio, { tipo: 'adicionarCeia', uid: 'a', ceiaId: 'ceia-4', extras: {} });
  const muitos = carrinhoReducer(base, { tipo: 'definirExtra', uid: 'a', extraId: 'pudim', quantidade: 99 });
  assert.deepEqual((muitos[0] as { extras: Record<string, number> }).extras, { pudim: MAX_EXTRA });
  const zerado = carrinhoReducer(muitos, { tipo: 'definirExtra', uid: 'a', extraId: 'pudim', quantidade: 0 });
  assert.deepEqual((zerado[0] as { extras: Record<string, number> }).extras, {});
  assert.deepEqual((base[0] as { extras: Record<string, number> }).extras, {});
});

test('remove item e limpa carrinho', () => {
  const um = carrinhoReducer(vazio, { tipo: 'adicionarCriacao', uid: 'x', criacaoId: 'brie' });
  assert.deepEqual(carrinhoReducer(um, { tipo: 'remover', uid: 'x' }), []);
  assert.deepEqual(carrinhoReducer(um, { tipo: 'limpar' }), []);
});

test('sanitiza carrinho salvo no navegador descartando dados inválidos', () => {
  const ids = { ceias: ['ceia-4'], criacoes: ['brie'], extras: ['farofa'] };
  const bruto: unknown = [
    { tipo: 'ceia', uid: 'a', ceiaId: 'ceia-4', extras: { farofa: 3, hack: 5, pudim: 'x' } },
    { tipo: 'ceia', uid: 'b', ceiaId: 'ceia-999', extras: {} },
    { tipo: 'criacao', uid: 'c', criacaoId: 'brie' },
    { tipo: 'criacao', uid: 'd', criacaoId: '<script>' },
    'lixo',
    null,
  ];
  assert.deepEqual(sanitizarCarrinho(bruto, ids), [
    { tipo: 'ceia', uid: 'a', ceiaId: 'ceia-4', extras: { farofa: 3 } },
    { tipo: 'criacao', uid: 'c', criacaoId: 'brie' },
  ]);
  assert.deepEqual(sanitizarCarrinho('{}', ids), []);
});
