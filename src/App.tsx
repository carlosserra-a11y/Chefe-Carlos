import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { CateringCalculator } from './components/CateringCalculator.tsx';
import { CeiasShowcase } from './components/CeiasShowcase.tsx';
import { ChefPhilosophy } from './components/ChefPhilosophy.tsx';
import { DishDetailModal } from './components/DishDetailModal.tsx';
import { EventGallery } from './components/EventGallery.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { Footer } from './components/Footer.tsx';
import { Hero } from './components/Hero.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { Navbar } from './components/Navbar.tsx';
import { OrderDrawer } from './components/OrderDrawer.tsx';
import { PhotoMarquee } from './components/PhotoMarquee.tsx';
import { ScrollProgress } from './components/ScrollProgress.tsx';
import { CEIAS, CRIACOES, EXTRAS } from './data/menuData.ts';
import { carrinhoReducer, sanitizarCarrinho } from './lib/carrinho.ts';
import type { CeiaId, Criacao, ItemCarrinho } from './types.ts';

const CHAVE_CARRINHO = 'chef-carlos:pedido';
const IDS_VALIDOS = {
  ceias: CEIAS.map((c) => c.id),
  criacoes: CRIACOES.map((c) => c.id),
  extras: EXTRAS.map((e) => e.id),
};

function carregarCarrinho(): ItemCarrinho[] {
  try {
    const salvo = window.localStorage.getItem(CHAVE_CARRINHO);
    return salvo ? sanitizarCarrinho(JSON.parse(salvo), IDS_VALIDOS) : [];
  } catch {
    return [];
  }
}

const novoId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function App() {
  const [itens, despachar] = useReducer(carrinhoReducer, undefined, carregarCarrinho);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [ceiaSelecionada, setCeiaSelecionada] = useState<CeiaId>('ceia-6-8');
  const [criacaoAberta, setCriacaoAberta] = useState<Criacao | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
    } catch {
      // Navegação privada ou armazenamento bloqueado: o pedido segue só na memória.
    }
  }, [itens]);

  useEffect(() => {
    if (!aviso) return;
    const id = window.setTimeout(() => setAviso(null), 3800);
    return () => window.clearTimeout(id);
  }, [aviso]);

  const abrirCarrinho = useCallback(() => setCarrinhoAberto(true), []);
  const fecharCarrinho = useCallback(() => setCarrinhoAberto(false), []);
  const fecharCriacao = useCallback(() => setCriacaoAberta(null), []);

  const adicionarCeia = (ceiaId: CeiaId, extras: Record<string, number>) => {
    despachar({ tipo: 'adicionarCeia', uid: novoId(), ceiaId, extras });
    setAviso(`${CEIAS.find((c) => c.id === ceiaId)?.nome ?? 'Ceia'} adicionada ao pedido`);
  };

  const adicionarCriacao = (criacaoId: string) => {
    despachar({ tipo: 'adicionarCriacao', uid: novoId(), criacaoId });
    setAviso(`${CRIACOES.find((c) => c.id === criacaoId)?.nome ?? 'Criação'} incluída no pedido`);
  };

  const escolherCeia = (id: CeiaId) => {
    setCeiaSelecionada(id);
    document.getElementById('ceias')?.scrollIntoView({ behavior: 'smooth' });
  };

  const noPedido = criacaoAberta !== null && itens.some((i) => i.tipo === 'criacao' && i.criacaoId === criacaoAberta.id);

  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-tinta focus:px-4 focus:py-2 focus:text-carrara">
        Pular para o conteúdo
      </a>
      <ScrollProgress />
      <Navbar quantidade={itens.length} onAbrirCarrinho={abrirCarrinho} />
      <main id="conteudo">
        <Hero />
        <PhotoMarquee />
        <CeiasShowcase selecionada={ceiaSelecionada} onSelecionar={setCeiaSelecionada} onAdicionar={adicionarCeia} />
        <CateringCalculator onEscolherCeia={escolherCeia} />
        <MenuSection onAbrir={setCriacaoAberta} />
        <EventGallery />
        <ChefPhilosophy />
      </main>
      <Footer />
      {!carrinhoAberto && <FloatingWhatsApp />}

      <DishDetailModal criacao={criacaoAberta} noPedido={noPedido} onFechar={fecharCriacao} onAdicionar={adicionarCriacao} />
      <OrderDrawer aberto={carrinhoAberto} itens={itens} despachar={despachar} onFechar={fecharCarrinho} />

      <AnimatePresence>
        {aviso && (
          <motion.div
            role="status"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-5 left-1/2 z-[85] flex w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 items-center justify-between gap-4 rounded-2xl bg-tinta px-5 py-4 text-sm text-carrara shadow-2xl"
          >
            <span>{aviso}</span>
            <button
              type="button"
              onClick={() => {
                setAviso(null);
                setCriacaoAberta(null);
                abrirCarrinho();
              }}
              className="shrink-0 font-semibold text-ouro hover:underline"
            >
              Ver pedido
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
