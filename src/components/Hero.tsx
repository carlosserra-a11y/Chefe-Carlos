import { ArrowDown, Sparkles } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { CEIAS, CRIACOES, INSTAGRAM_URL, INSTAGRAM_USUARIO, WHATSAPP_NUMERO, foto } from '../data/menuData.ts';
import { linkWhatsApp } from '../lib/pedido.ts';
import { InstagramIcon, WhatsAppIcon } from './ui/BrandIcons.tsx';
import { SUAVE } from './ui/Reveal.tsx';

const MENSAGEM_HERO = 'Olá, Chef Carlos! Vim pelo site e gostaria de conversar sobre um evento.';

export function Hero() {
  const secao = useRef<HTMLElement>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: secao, offset: ['start start', 'end start'] });
  const mover = (px: number) => (reduzir ? [0, 0] : [0, px]);
  const yFundo = useTransform(scrollYProgress, [0, 1], mover(220));
  const yTexto = useTransform(scrollYProgress, [0, 1], mover(-60));
  const yRetrato = useTransform(scrollYProgress, [0, 1], mover(-120));
  const yCartao = useTransform(scrollYProgress, [0, 1], mover(-240));
  const ySelo = useTransform(scrollYProgress, [0, 1], mover(-170));
  const opacidade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  const entrada = (atraso: number) => ({
    initial: reduzir ? false : { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay: atraso, ease: SUAVE },
  });

  return (
    <section ref={secao} id="inicio" aria-labelledby="titulo-hero" className="relative isolate min-h-[100svh] overflow-hidden">
      {/* Fundo translúcido: cozinha real do Chef + mármore Carrara */}
      <motion.div style={{ y: yFundo }} className="absolute inset-0 -z-20 scale-110" aria-hidden="true">
        <img
          src={foto('IMG_6247')}
          alt=""
          width={1600}
          height={1200}
          fetchPriority="high"
          className="size-full object-cover opacity-45 blur-[1.5px] saturate-[0.85]"
        />
      </motion.div>
      <div className="fundo-marmore absolute inset-0 -z-10 opacity-[0.86]" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,transparent_0%,rgb(248_246_242/0.6)_55%,rgb(248_246_242)_100%)]"
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-12 px-5 pb-20 pt-32 md:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-28">
        <motion.div style={{ y: yTexto, opacity: opacidade }} className="lg:col-span-7">
          <motion.p {...entrada(0.1)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-ouro/40 bg-white/60 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ouro-escuro sm:text-xs sm:tracking-[0.28em]">
            <Sparkles className="size-3.5" aria-hidden="true" /> Alta gastronomia · Grande Florianópolis
          </motion.p>
          <motion.h1
            {...entrada(0.25)}
            id="titulo-hero"
            className="font-display text-[clamp(2.9rem,1.4rem+5.6vw,6.4rem)] font-semibold leading-[0.92] tracking-[-0.01em] text-tinta"
          >
            Maestria Culinária <span className="italic text-ouro-escuro">&amp;</span> Banquetes Exclusivos
            <span className="mt-3 block font-script text-[0.72em] font-normal leading-[1.1] text-grafite">
              pelo Chef Carlos Jr
            </span>
          </motion.h1>
          <motion.p {...entrada(0.4)} className="mt-7 max-w-xl text-base leading-relaxed text-grafite md:text-lg">
            Ceias de Natal, banquetes e eventos com a assinatura de uma cozinha limpa: ingredientes frescos, técnica
            clássica e apresentação de alto padrão, do primeiro corte ao último detalhe da mesa.
          </motion.p>
          <motion.div {...entrada(0.55)} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#ceias"
              className="inline-flex items-center gap-2 rounded-full bg-tinta px-7 py-4 text-sm font-semibold text-carrara shadow-[0_18px_40px_-18px_rgb(29_27_24/0.8)] transition hover:-translate-y-0.5 hover:bg-grafite active:translate-y-0"
            >
              Ver ceias e valores
            </a>
            <a
              href={linkWhatsApp(WHATSAPP_NUMERO, MENSAGEM_HERO)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110"
            >
              <WhatsAppIcon /> Falar no WhatsApp
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-4 py-4 text-sm font-semibold text-grafite underline-offset-4 transition hover:text-tinta hover:underline"
            >
              <InstagramIcon /> {INSTAGRAM_USUARIO}
            </a>
          </motion.div>
          <motion.dl {...entrada(0.7)} className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-linho pt-6">
            {[
              [String(CEIAS.length), 'ceias oficiais'],
              [String(CRIACOES.length), 'criações no catálogo'],
              ['4–25', 'convidados na calculadora'],
            ].map(([numero, rotulo]) => (
              <div key={rotulo}>
                <dt className="sr-only">{rotulo}</dt>
                <dd className="font-display text-4xl font-semibold text-tinta">{numero}</dd>
                <dd className="mt-1 text-xs uppercase tracking-[0.18em] text-pedra">{rotulo}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Composição visual: retrato do Chef + cartões flutuantes em camadas */}
        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <motion.figure style={{ y: yRetrato }} {...entrada(0.35)} className="relative">
            <div className="overflow-hidden rounded-[2.2rem] border-[10px] border-white shadow-[0_40px_80px_-30px_rgb(29_27_24/0.55)]">
              <img
                src={foto('IMG_6977')}
                alt="Chef Carlos Jr de dólmã ao lado da equipe, diante de uma mesa de frios e frutas"
                width={1600}
                height={1200}
                fetchPriority="high"
                className="aspect-[4/5] w-full object-cover object-[52%_30%]"
              />
            </div>
            <figcaption className="vidro absolute -bottom-5 left-1/2 w-max -translate-x-1/2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-grafite">
              Chef Carlos Jr &amp; equipe
            </figcaption>
          </motion.figure>

          <motion.div
            style={{ y: yCartao }}
            {...entrada(0.7)}
            className="absolute -left-6 bottom-16 w-36 rotate-[-6deg] overflow-hidden rounded-2xl border-[6px] border-white shadow-2xl sm:-left-14 sm:w-44"
            aria-hidden="true"
          >
            <img src={foto('IMG_7336')} alt="" width={1200} height={1600} className="aspect-[4/5] w-full object-cover" />
          </motion.div>

          <motion.div
            style={{ y: ySelo }}
            {...entrada(0.85)}
            className="vidro absolute -right-3 top-8 max-w-[12rem] rounded-2xl p-4 shadow-xl sm:-right-8"
          >
            <p className="font-script text-3xl leading-none text-ouro-escuro">Natal 2026</p>
            <p className="mt-1 text-sm font-semibold text-tinta">Encomendas de ceias abertas</p>
            <p className="mt-1 text-xs text-pedra">A partir de R$ 599,90</p>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#ceias"
        aria-label="Rolar para as ceias"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-pedra md:flex"
        animate={reduzir ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        Role para descobrir <ArrowDown className="size-4" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
