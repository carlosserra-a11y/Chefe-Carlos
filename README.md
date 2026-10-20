# Chef Carlos Jr Gastronomia

Site oficial de ceias, banquetes e eventos do Chef Carlos Jr.
Publicado em **https://carlosserra-a11y.github.io/Chefe-Carlos/**.

React 19 · Vite 8 · Tailwind CSS 4 · Motion · TypeScript.

## O que tem no site

- **Hero com parallax**: retrato do Chef, fundo translúcido da cozinha com mármore Carrara, links de Instagram e WhatsApp.
- **As três ceias oficiais** com valores (R$ 599,90 · R$ 999,99 · R$ 1.399,00), ilustração da composição de cada mesa e **personalizador de extras** em tempo real.
- **Calculadora de convidados** (4 a 25 pessoas): rendimento de Chester, arroz, farofa, saladas, quiches e sobremesas, e sugestão automática da ceia ideal.
- **Catálogo de criações** sem preços fixos (selo "Sob Consulta · Negociação Pessoal no WhatsApp"), com ficha técnica: apresentação, embalagem, segredos de preparo e harmonização de vinhos.
- **Portfólio de eventos** com as 69 fotos reais do Drive do Chef, em galeria com ampliação.
- **Carrinho lateral** com extras editáveis e formulário (nome, data, convidados, endereço) que monta a mensagem e abre o WhatsApp oficial.
- Barra de progresso de rolagem, animações de entrada e respeito à opção "reduzir movimento" do sistema.

## Estrutura

```
├── index.html                 # Entrada, tipografia e metatags
├── public/
│   ├── favicon.svg
│   └── assets/
│       ├── textura-marmore.webp   # Mármore Carrara (gerado)
│       └── fotos/                 # Fotos do Drive em WebP (+ miniaturas)
├── src/
│   ├── main.tsx
│   ├── App.tsx                    # Estado global: carrinho, ceia selecionada, modal
│   ├── index.css                  # Tema Tailwind (cores, fontes) e estilos
│   ├── types.ts
│   ├── data/menuData.ts           # Ceias (valores), extras, catálogo, eventos e WhatsApp
│   ├── lib/                       # Lógica pura e testada
│   │   ├── porcoes.ts             # Calculadora e sugestão de ceia
│   │   ├── carrinho.ts            # Reducer do carrinho + validação do localStorage
│   │   ├── pedido.ts              # Resumo, validação do formulário e mensagem do WhatsApp
│   │   └── formato.ts             # R$ e kg
│   ├── hooks/useParallax.ts
│   └── components/                # Navbar, Hero, CeiasShowcase, CateringCalculator,
│                                  # MenuSection, DishDetailModal, EventGallery,
│                                  # ChefPhilosophy, OrderDrawer, Footer…
└── tests/                         # node --test
```

## Como alterar conteúdo

Tudo fica em `src/data/menuData.ts`:

- **WhatsApp**: `WHATSAPP_NUMERO` (só dígitos, com 55 + DDD).
- **Valores das ceias**: campo `preco` de cada item em `CEIAS`.
- **Preço dos extras**: hoje os extras vão como "valor a combinar". Para somar no total, preencha `preco` no item de `EXTRAS` (ex.: `preco: 89.9`).
- **Catálogo**: adicione ou edite itens em `CRIACOES`. As fotos ficam em `public/assets/fotos/`, com o nome sem extensão.

## Rodar localmente

```bash
npm install
npm run dev
```

Verificações: `npm run lint` (tipos), `npm test` (lógica) e `npm run build`.

## Publicação

Cada push na `main` roda `.github/workflows/deploy-pages.yml`: auditoria de dependências, tipos, testes, build e deploy no GitHub Pages.
