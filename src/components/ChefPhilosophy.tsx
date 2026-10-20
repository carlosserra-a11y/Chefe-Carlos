import { Gem, Leaf, ShieldCheck, Utensils, type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef } from 'react';
import { foto } from '../data/menuData.ts';
import { useParallax } from '../hooks/useParallax.ts';
import { Reveal } from './ui/Reveal.tsx';

const PRINCIPIOS: { titulo: string; texto: string; Icone: LucideIcon }[] = [
  { titulo: 'Ingredientes do dia', texto: 'Compras frescas para cada evento, sem conservantes e com fornecedores selecionados.', Icone: Leaf },
  { titulo: 'Bancada impecável', texto: 'Mármore, inox e utensílios higienizados: a cozinha limpa é o primeiro ingrediente.', Icone: ShieldCheck },
  { titulo: 'Técnica clássica', texto: 'Base francesa e italiana aplicada a sabores brasileiros que todo mundo reconhece.', Icone: Utensils },
  { titulo: 'Apresentação de alto padrão', texto: 'Mesas cenográficas, flores naturais e montagem feita pela própria equipe.', Icone: Gem },
];

export function ChefPhilosophy() {
  const secao = useRef<HTMLElement>(null);
  const yGrande = useParallax(secao, 50);
  const yPequena = useParallax(secao, -90);

  return (
    <section ref={secao} id="filosofia" aria-labelledby="titulo-filosofia" className="fundo-marmore relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 md:px-8 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-lg pb-16 lg:pb-0">
          <motion.div style={{ y: yGrande }} className="overflow-hidden rounded-[2.4rem] border-[10px] border-white shadow-[0_40px_80px_-40px_rgb(29_27_24/0.6)]">
            <img
              src={foto('IMG_2309')}
              alt="Chef finalizando a montagem do buffet na bancada"
              width={1200}
              height={1600}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </motion.div>
          <motion.div
            style={{ y: yPequena }}
            className="absolute -bottom-4 -right-4 w-44 overflow-hidden rounded-3xl border-[6px] border-white shadow-2xl md:-right-10 md:w-56"
          >
            <img src={foto('IMG_6983')} alt="Verrines de morango finalizadas pela equipe" width={1200} height={1600} loading="lazy" className="aspect-square w-full object-cover" />
          </motion.div>
          <p className="vidro absolute -left-3 top-8 -rotate-6 rounded-full px-5 py-1 font-script text-4xl text-ouro-escuro shadow-lg md:-left-8" aria-hidden="true">
            cozinha limpa
          </p>
        </div>

        <div>
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-ouro-escuro">Filosofia</span>
            <h2 id="titulo-filosofia" className="mt-5 font-display text-[clamp(2.4rem,1.5rem+3.4vw,4.4rem)] font-semibold leading-[0.98] text-tinta">
              Cozinha limpa, <span className="italic text-ouro-escuro">sabor verdadeiro</span>
            </h2>
            <div className="filete mt-5 w-28" aria-hidden="true" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-grafite">
              Cada prato sai da bancada do Chef Carlos Jr com o mesmo cuidado de uma refeição em família: matéria-prima
              fresca, processos limpos e técnica precisa para que o sabor seja o protagonista.
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {PRINCIPIOS.map(({ titulo, texto, Icone }, i) => (
              <Reveal key={titulo} atraso={i * 0.08}>
                <li className="h-full rounded-3xl border border-white/80 bg-white/65 p-5 backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
                  <Icone className="size-6 text-ouro-escuro" aria-hidden="true" />
                  <p className="mt-4 font-display text-2xl font-semibold text-tinta">{titulo}</p>
                  <p className="mt-2 text-sm leading-relaxed text-grafite">{texto}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
