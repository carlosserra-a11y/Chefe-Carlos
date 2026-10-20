import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  MAX_CONVIDADOS,
  MIN_CONVIDADOS,
  calcularRendimento,
  capacidadeTotal,
  limitarConvidados,
  sugerirCeias,
} from '../src/lib/porcoes.ts';

test('limita convidados à faixa do slider (4 a 25) e arredonda', () => {
  assert.equal(limitarConvidados(1), MIN_CONVIDADOS);
  assert.equal(limitarConvidados(99), MAX_CONVIDADOS);
  assert.equal(limitarConvidados(7.6), 8);
  assert.equal(limitarConvidados(Number.NaN), MIN_CONVIDADOS);
});

test('calcula o rendimento proporcional ao número de convidados', () => {
  const r = calcularRendimento(10);
  assert.equal(r.convidados, 10);
  assert.equal(r.chesterKg, 3.5);
  assert.equal(r.arrozKg, 1.2);
  assert.equal(r.farofaKg, 0.6);
  assert.equal(r.saladasKg, 1.8);
  assert.equal(r.sobremesaKg, 1.2);
  assert.equal(r.quiches, 2);
});

test('arredonda quiches para cima (8 fatias cada)', () => {
  assert.equal(calcularRendimento(8).quiches, 1);
  assert.equal(calcularRendimento(9).quiches, 2);
  assert.equal(calcularRendimento(25).quiches, 4);
});

test('sugere a ceia ideal para cada faixa', () => {
  assert.deepEqual(sugerirCeias(4), ['ceia-4']);
  assert.deepEqual(sugerirCeias(5), ['ceia-6-8']);
  assert.deepEqual(sugerirCeias(8), ['ceia-6-8']);
  assert.deepEqual(sugerirCeias(9), ['ceia-10-12']);
  assert.deepEqual(sugerirCeias(12), ['ceia-10-12']);
});

test('combina ceias para grupos acima de 12 pessoas cobrindo todos', () => {
  assert.deepEqual(sugerirCeias(13), ['ceia-10-12', 'ceia-4']);
  assert.deepEqual(sugerirCeias(20), ['ceia-10-12', 'ceia-6-8']);
  assert.deepEqual(sugerirCeias(25), ['ceia-10-12', 'ceia-10-12', 'ceia-4']);
  for (let n = MIN_CONVIDADOS; n <= MAX_CONVIDADOS; n++) {
    assert.ok(capacidadeTotal(sugerirCeias(n)) >= n, `cobre ${n} convidados`);
  }
});
