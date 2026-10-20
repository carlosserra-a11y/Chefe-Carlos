import { ChevronDown, ShoppingBag, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { CEIAS, CRIACOES, EXTRAS, WHATSAPP_NUMERO, miniatura } from '../data/menuData.ts';
import type { AcaoCarrinho } from '../lib/carrinho.ts';
import { formatarBRL } from '../lib/formato.ts';
import {
  linkWhatsApp,
  montarMensagem,
  resumirPedido,
  validarCliente,
  type DadosCliente,
  type ErrosCliente,
} from '../lib/pedido.ts';
import type { ItemCarrinho } from '../types.ts';
import { ExtrasSelector } from './ExtrasSelector.tsx';
import { WhatsAppIcon } from './ui/BrandIcons.tsx';
import { SUAVE } from './ui/Reveal.tsx';

const CATALOGO = { ceias: CEIAS, extras: EXTRAS, criacoes: CRIACOES };
const VAZIO: DadosCliente = { nome: '', dataEvento: '', convidados: '', endereco: '', observacoes: '' };

const hojeLocal = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

type Props = {
  aberto: boolean;
  itens: readonly ItemCarrinho[];
  despachar: (acao: AcaoCarrinho) => void;
  onFechar: () => void;
};

export function OrderDrawer({ aberto, itens, despachar, onFechar }: Props) {
  const fechar = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!aberto) return;
    fechar.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && onFechar();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', tecla);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', tecla);
    };
  }, [aberto, onFechar]);

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="fixed inset-0 z-[75]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" tabIndex={-1} aria-label="Fechar pedido" onClick={onFechar} className="absolute inset-0 bg-tinta/60 backdrop-blur-sm" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-pedido"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: SUAVE }}
            className="rolagem-fina absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-carrara shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-linho bg-carrara/95 px-6 py-5 backdrop-blur">
              <h2 id="titulo-pedido" className="flex items-center gap-2 font-display text-3xl font-semibold text-tinta">
                <ShoppingBag className="size-5 text-ouro-escuro" aria-hidden="true" /> Seu pedido
              </h2>
              <button ref={fechar} type="button" onClick={onFechar} aria-label="Fechar" className="grid size-10 place-items-center rounded-full hover:bg-marmore">
                <X className="size-5" />
              </button>
            </header>
            {itens.length === 0 ? <Vazio onFechar={onFechar} /> : <Conteudo itens={itens} despachar={despachar} />}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Vazio({ onFechar }: { onFechar: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
      <p className="font-script text-5xl text-ouro-escuro">Mesa vazia</p>
      <p className="text-sm text-pedra">Escolha uma das ceias oficiais ou inclua criações do catálogo para montar seu pedido.</p>
      <a href="#ceias" onClick={onFechar} className="mt-2 rounded-full bg-tinta px-6 py-3 text-sm font-semibold text-carrara">
        Ver ceias
      </a>
    </div>
  );
}

function Conteudo({ itens, despachar }: { itens: readonly ItemCarrinho[]; despachar: Props['despachar'] }) {
  const [dados, setDados] = useState<DadosCliente>(VAZIO);
  const [erros, setErros] = useState<ErrosCliente>({});
  const [expandido, setExpandido] = useState<string | null>(null);
  const resumo = resumirPedido(itens, CATALOGO);
  const hoje = hojeLocal();

  const campo = (chave: keyof DadosCliente) => ({
    id: `pedido-${chave}`,
    value: dados[chave],
    'aria-invalid': Boolean(erros[chave]),
    'aria-describedby': erros[chave] ? `erro-${chave}` : undefined,
    onChange: (e: { target: { value: string } }) => setDados((d) => ({ ...d, [chave]: e.target.value })),
  });

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const encontrados = validarCliente(dados, hoje);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    window.open(linkWhatsApp(WHATSAPP_NUMERO, montarMensagem(resumo, dados)), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-1 flex-col">
      <ul className="divide-y divide-linho px-6">
        {itens.map((item) => {
          if (item.tipo === 'criacao') {
            const criacao = CRIACOES.find((c) => c.id === item.criacaoId);
            if (!criacao) return null;
            return (
              <li key={item.uid} className="flex items-center gap-4 py-4">
                <img src={miniatura(criacao.fotos[0])} alt="" className="size-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-tinta">{criacao.nome}</p>
                  <p className="text-xs text-ouro-escuro">Sob consulta · negociação no WhatsApp</p>
                </div>
                <Remover onClick={() => despachar({ tipo: 'remover', uid: item.uid })} nome={criacao.nome} />
              </li>
            );
          }
          const ceia = CEIAS.find((c) => c.id === item.ceiaId);
          if (!ceia) return null;
          const qtdExtras = Object.values(item.extras).reduce((s, q) => s + q, 0);
          const aberto = expandido === item.uid;
          return (
            <li key={item.uid} className="py-4">
              <div className="flex items-start gap-4">
                <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-tinta font-display text-xl font-semibold text-ouro">
                  {ceia.maxPessoas}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-tinta">{ceia.nome}</p>
                  <p className="font-display text-xl font-semibold text-ouro-escuro">{formatarBRL(ceia.preco)}</p>
                  <button
                    type="button"
                    onClick={() => setExpandido(aberto ? null : item.uid)}
                    aria-expanded={aberto}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-grafite hover:text-tinta"
                  >
                    {qtdExtras > 0 ? `${qtdExtras} extra(s)` : 'Adicionar extras'}
                    <ChevronDown className={`size-3.5 transition ${aberto ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                </div>
                <Remover onClick={() => despachar({ tipo: 'remover', uid: item.uid })} nome={ceia.nome} />
              </div>
              <AnimatePresence initial={false}>
                {aberto && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-3 rounded-2xl border border-linho bg-white px-4">
                      <ExtrasSelector
                        extras={EXTRAS}
                        valores={item.extras}
                        onAlterar={(extraId, quantidade) => despachar({ tipo: 'definirExtra', uid: item.uid, extraId, quantidade })}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <div className="mx-6 mt-2 rounded-2xl bg-tinta p-5 text-carrara">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-carrara/70">Total das ceias</p>
          <p className="font-display text-3xl font-semibold text-ouro">{formatarBRL(resumo.totalCeias)}</p>
        </div>
        {resumo.temValorACombinar && <p className="mt-1 text-xs text-carrara/60">Extras e criações do catálogo: valores combinados no WhatsApp.</p>}
      </div>

      <form onSubmit={enviar} noValidate className="space-y-4 px-6 py-6">
        <p className="font-display text-2xl font-semibold text-tinta">Dados do evento</p>
        <Campo rotulo="Seu nome" erro={erros.nome} chave="nome">
          <input {...campo('nome')} autoComplete="name" maxLength={80} className={estiloCampo} />
        </Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Data do evento" erro={erros.dataEvento} chave="dataEvento">
            <input {...campo('dataEvento')} type="date" min={hoje} className={estiloCampo} />
          </Campo>
          <Campo rotulo="Convidados" erro={erros.convidados} chave="convidados">
            <input {...campo('convidados')} type="number" inputMode="numeric" min={1} max={500} className={estiloCampo} />
          </Campo>
        </div>
        <Campo rotulo="Endereço de entrega" erro={erros.endereco} chave="endereco">
          <textarea {...campo('endereco')} autoComplete="street-address" rows={2} maxLength={200} className={estiloCampo} />
        </Campo>
        <Campo rotulo="Observações (opcional)" erro={erros.observacoes} chave="observacoes">
          <textarea {...campo('observacoes')} rows={2} maxLength={500} placeholder="Restrições alimentares, horário de entrega…" className={estiloCampo} />
        </Campo>
        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-sm font-bold text-white transition hover:brightness-110">
          <WhatsAppIcon className="size-5" /> Enviar pedido pelo WhatsApp
        </button>
        <button
          type="button"
          onClick={() => despachar({ tipo: 'limpar' })}
          className="w-full text-center text-xs font-semibold text-pedra underline-offset-4 hover:text-tinta hover:underline"
        >
          Esvaziar pedido
        </button>
      </form>
    </div>
  );
}

const estiloCampo =
  'w-full rounded-xl border border-linho bg-white px-4 py-3 text-sm text-tinta outline-none transition placeholder:text-pedra/60 focus:border-ouro-escuro focus:ring-2 focus:ring-ouro/25 aria-[invalid=true]:border-red-700';

function Campo({ rotulo, erro, chave, children }: { rotulo: string; erro?: string; chave: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={`pedido-${chave}`} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-grafite">
        {rotulo}
      </label>
      {children}
      {erro && (
        <p id={`erro-${chave}`} className="mt-1 text-xs font-medium text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}

function Remover({ onClick, nome }: { onClick: () => void; nome: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={`Remover ${nome}`} className="grid size-9 shrink-0 place-items-center rounded-full text-pedra transition hover:bg-marmore hover:text-red-700">
      <Trash2 className="size-4" />
    </button>
  );
}
