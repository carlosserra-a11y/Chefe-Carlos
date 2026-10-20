// Conteúdo oficial do site: contatos, ceias (valores), extras, catálogo e eventos.
// As fotos ficam em public/assets/fotos/<nome>.webp (+ <nome>-thumb.webp).
import type { CategoriaId, Ceia, Criacao, Evento, Extra } from '../types.ts';

/** WhatsApp oficial do Chef: +55 48 9683-5439 (formato internacional, só dígitos). */
export const WHATSAPP_NUMERO = '554896835439';
export const WHATSAPP_EXIBICAO = '+55 48 9683-5439';
export const INSTAGRAM_URL = 'https://www.instagram.com/chefcarlosjr_gastronomia/';
export const INSTAGRAM_USUARIO = '@chefcarlosjr_gastronomia';

const base = import.meta.env.BASE_URL;
export const foto = (nome: string): string => `${base}assets/fotos/${nome}.webp`;
export const miniatura = (nome: string): string => `${base}assets/fotos/${nome}-thumb.webp`;
export const TEXTURA_MARMORE = `${base}assets/textura-marmore.webp`;

export const CEIAS: Ceia[] = [
  {
    id: 'ceia-4',
    nome: 'Ceia até 4 pessoas',
    pessoas: 'até 4 pessoas',
    maxPessoas: 4,
    preco: 599.9,
    resumo: 'A ceia íntima: o essencial do Natal, com o acabamento de alta gastronomia do Chef.',
    itens: [
      'Chester fatiado ao mel e ervas',
      'Arroz festivo',
      'Farofa de castanhas',
      'Salpicão defumado',
      'Pudim artesanal',
    ],
    composicao: { 'chester-fatiado': 1, arroz: 1, farofa: 1, salpicao: 1, pudim: 1 },
    fotos: ['IMG_6346', 'IMG_7067', 'IMG_6763'],
  },
  {
    id: 'ceia-6-8',
    nome: 'Ceia de 6 a 8 pessoas',
    pessoas: '6 a 8 pessoas',
    maxPessoas: 8,
    preco: 999.99,
    destaque: 'Mais pedida',
    resumo: 'Chester inteiro laqueado como centro de mesa, com quiche francesa e saladas clássicas.',
    itens: [
      'Chester inteiro laqueado',
      'Quiche francesa de brie e alho-poró',
      'Salada Waldorf',
      'Salpicão',
      'Pudim artesanal',
    ],
    composicao: { 'chester-inteiro': 1, quiche: 1, waldorf: 1, salpicao: 1, pudim: 1 },
    fotos: ['IMG_2288', 'IMG_7063', 'IMG_6346'],
  },
  {
    id: 'ceia-10-12',
    nome: 'Ceia de 10 a 12 pessoas',
    pessoas: '10 a 12 pessoas',
    maxPessoas: 12,
    preco: 1399,
    destaque: 'Mesa completa',
    resumo: 'O banquete completo: dois Chesters inteiros, quiches, todas as saladas e três sobremesas.',
    itens: [
      '2 Chesters inteiros',
      'Mesa completa com quiches',
      'Todas as saladas (salpicão e Waldorf)',
      'Pavê de chocolate belga',
      'Cheesecake de frutas vermelhas',
      'Pudim artesanal',
    ],
    composicao: { 'chester-inteiro': 2, quiche: 2, salpicao: 1, waldorf: 1, pave: 1, cheesecake: 1, pudim: 1 },
    fotos: ['IMG_7326', 'IMG_2288', 'IMG_2292'],
  },
];

/** Porções adicionais do personalizador. Sem `preco`, o valor é combinado no WhatsApp. */
export const EXTRAS: Extra[] = [
  { id: 'chester', nome: 'Chester inteiro extra', porcao: '1 unidade laqueada' },
  { id: 'chester-fatiado', nome: 'Chester fatiado ao mel e ervas', porcao: 'porção extra' },
  { id: 'farofa', nome: 'Farofa de castanhas', porcao: 'porção extra' },
  { id: 'arroz', nome: 'Arroz festivo', porcao: 'porção extra' },
  { id: 'salpicao', nome: 'Salpicão defumado', porcao: 'porção extra' },
  { id: 'waldorf', nome: 'Salada Waldorf', porcao: 'porção extra' },
  { id: 'quiche', nome: 'Quiche de brie e alho-poró', porcao: '1 quiche inteira' },
  { id: 'pudim', nome: 'Pudim artesanal', porcao: '1 unidade' },
  { id: 'pave', nome: 'Pavê de chocolate belga', porcao: '1 travessa' },
  { id: 'cheesecake', nome: 'Cheesecake de frutas vermelhas', porcao: '1 unidade' },
];

export const CATEGORIAS: { id: CategoriaId; nome: string }[] = [
  { id: 'mesas', nome: 'Mesas & Estações' },
  { id: 'entradas', nome: 'Entradas & Antepastos' },
  { id: 'quentes', nome: 'Pratos Quentes' },
  { id: 'paes', nome: 'Pães & Brunch' },
  { id: 'doces', nome: 'Confeitaria' },
];

export const CRIACOES: Criacao[] = [
  {
    id: 'grazing-table',
    nome: 'Grazing Table de Frios Nobres',
    categoria: 'mesas',
    descricao: 'Queijos maturados, embutidos, frutas frescas e pães de fermentação natural montados sobre troncos rústicos.',
    fotos: ['IMG_7328', 'IMG_2300', 'IMG_6244', 'IMG_7331', 'IMG_6734', 'IMG_2297'],
    ficha: {
      apresentacao: 'Montagem no local sobre tábuas e troncos de madeira, com alturas diferentes e flores naturais. Pepperoni em rosas, queijos em cunhas e frutas da estação.',
      embalagem: 'Insumos transportados refrigerados em caixas térmicas higienizadas; a montagem é feita pela equipe no próprio evento.',
      segredos: 'Os queijos saem da refrigeração 40 minutos antes do serviço para liberar aroma e textura; cada corte é feito no dia.',
      harmonizacao: 'Espumante brut nature da Serra Gaúcha ou um Pinot Noir leve, levemente resfriado.',
    },
  },
  {
    id: 'favo-de-mel',
    nome: 'Estação Favo de Mel & Frutas',
    categoria: 'mesas',
    descricao: 'Favo de mel puro em moldura de madeira, servido com frutas cortadas na hora e queijos frescos.',
    fotos: ['IMG_FAVO', 'IMG_2289', 'IMG_6250', 'IMG_6236', 'IMG_6347'],
    ficha: {
      apresentacao: 'Quadro de favo de mel em pé, como peça cenográfica, sobre bandeja de frutas coloridas em fileiras.',
      embalagem: 'Favo protegido em caixa própria; frutas higienizadas e cortadas no local para manter o frescor.',
      segredos: 'O favo é servido na temperatura ambiente, para o mel escorrer naturalmente sobre queijos e frutas.',
      harmonizacao: 'Moscatel espumante ou um vinho branco de colheita tardia.',
    },
  },
  {
    id: 'varal-parma',
    nome: 'Varal de Presunto Cru',
    categoria: 'mesas',
    descricao: 'Fatias finíssimas de presunto cru penduradas em estrutura de madeira, prontas para servir.',
    fotos: ['IMG_7324', 'IMG_7323'],
    ficha: {
      apresentacao: 'Estrutura vertical de madeira com fatias suspensas, ao lado de carpaccio, queijos e frutas secas.',
      embalagem: 'Fatiado no dia, intercalado com papel manteiga e mantido refrigerado até a montagem.',
      segredos: 'Fatias cortadas no ponto exato de translucidez, para derreterem na boca.',
      harmonizacao: 'Lambrusco seco ou Prosecco DOC.',
    },
  },
  {
    id: 'burrata',
    nome: 'Burrata com Tomates Confit',
    categoria: 'entradas',
    descricao: 'Burrata cremosa sobre tomates-cereja confitados no azeite com tomilho fresco.',
    fotos: ['IMG_2301', 'IMG_6243'],
    ficha: {
      apresentacao: 'Travessa rasa de madeira, burrata ao centro, tomates em volta e fio de azeite extravirgem.',
      embalagem: 'Burrata e tomates transportados separados e unidos só na hora de servir.',
      segredos: 'Tomates confitados lentamente em baixa temperatura, com alho e ervas, até ficarem adocicados.',
      harmonizacao: 'Rosé seco provençal ou Sauvignon Blanc.',
    },
  },
  {
    id: 'terrine-azeitonas',
    nome: 'Terrine de Queijo com Azeitonas',
    categoria: 'entradas',
    descricao: 'Terrine cremosa de queijos coberta com azeitonas verdes, microverdes e crackers crocantes.',
    fotos: ['IMG_6743'],
    ficha: {
      apresentacao: 'Servida inteira em travessa oval, cercada de torradas e crackers artesanais.',
      embalagem: 'Moldada e refrigerada em fôrma própria, desenformada no local.',
      segredos: 'Descanso de 12 horas na geladeira para firmar e concentrar os sabores.',
      harmonizacao: 'Vinho verde português ou Chardonnay sem madeira.',
    },
  },
  {
    id: 'tabua-queijos',
    nome: 'Tábua de Queijos Azuis & Frutas',
    categoria: 'entradas',
    descricao: 'Gorgonzola, queijos curados, maçã em leque e pepperoni, em tábua de madeira nobre.',
    fotos: ['IMG_6945', 'IMG_6435', 'IMG_6438', 'IMG_6436'],
    ficha: {
      apresentacao: 'Tábua individual ou para compartilhar, com frutas frescas e pães de fermentação natural.',
      embalagem: 'Montada em tábua com tampa protetora; maçãs cortadas na hora para não oxidar.',
      segredos: 'Contraste de sal, gordura e acidez: cada queijo tem uma fruta como par.',
      harmonizacao: 'Vinho do Porto Tawny ou Sauternes com os queijos azuis.',
    },
  },
  {
    id: 'brie-folhado',
    nome: 'Brie Folhado com Frutas Vermelhas',
    categoria: 'entradas',
    descricao: 'Brie inteiro assado em massa folhada, coberto com geleia, frutas vermelhas e castanhas.',
    fotos: ['IMG_7336'],
    ficha: {
      apresentacao: 'Servido inteiro e quente, para ser aberto à mesa; o queijo escorre ao primeiro corte.',
      embalagem: 'Entregue em embalagem térmica pronta para forno; finalização de 10 minutos no local.',
      segredos: 'Massa pincelada com gema e manteiga clarificada para dourar sem queimar a geleia.',
      harmonizacao: 'Espumante rosé ou Pinot Noir.',
    },
  },
  {
    id: 'risoto-buffet',
    nome: 'Buffet de Risotos Gourmet',
    categoria: 'quentes',
    descricao: 'Risotos cremosos finalizados no rechaud: funghi, parmesão, frango com crosta e mais.',
    fotos: ['IMG_7217', 'IMG_7218', 'IMG_7219', 'IMG_7220', 'IMG_7221', 'IMG_7067'],
    ficha: {
      apresentacao: 'Cubas de inox em rechauds aquecidos, finalizados com microverdes e queijo ralado na hora.',
      embalagem: 'Base pré-cozida e finalizada no local, para chegar al dente ao convidado.',
      segredos: 'Caldo caseiro mantido em fervura branda e mantecatura com manteiga gelada.',
      harmonizacao: 'Chardonnay com passagem por barrica ou Nebbiolo jovem.',
    },
  },
  {
    id: 'risoto-carne',
    nome: 'Risoto de Carne em Cumbuca',
    categoria: 'quentes',
    descricao: 'Arroz de carne com legumes servido em cumbucas individuais de porcelana.',
    fotos: ['IMG_6763'],
    ficha: {
      apresentacao: 'Porções individuais em ramequins, finalizadas com broto fresco.',
      embalagem: 'Transportado em caixas térmicas e porcionado na hora do serviço.',
      segredos: 'Carne selada em fogo alto antes de entrar no arroz, para manter a suculência.',
      harmonizacao: 'Merlot da Campanha Gaúcha ou Malbec.',
    },
  },
  {
    id: 'gratinado',
    nome: 'Gratinado Cremoso Brûlée',
    categoria: 'quentes',
    descricao: 'Creme gratinado em ramequim com crosta dourada e brotos frescos.',
    fotos: ['IMG_6939', 'IMG_6929'],
    ficha: {
      apresentacao: 'Ramequins individuais com alça, servidos quentes com a crosta ainda crocante.',
      embalagem: 'Levado ao forno no local; a crosta é feita com maçarico no momento do serviço.',
      segredos: 'Queijo gratinado em duas etapas: forno para o cozimento e maçarico para a crosta.',
      harmonizacao: 'Chardonnay amanteigado ou Viognier.',
    },
  },
  {
    id: 'risoni',
    nome: 'Risoni Cremoso',
    categoria: 'quentes',
    descricao: 'Massa risoni em creme leve de queijos, empratada com microverdes.',
    fotos: ['IMG_6937'],
    ficha: {
      apresentacao: 'Empratado em prato raso de porcelana branca para jantares servidos à francesa.',
      embalagem: 'Finalizado na cozinha do evento para manter a cremosidade.',
      segredos: 'A massa termina o cozimento no próprio creme, absorvendo o sabor dos queijos.',
      harmonizacao: 'Pinot Grigio ou Soave.',
    },
  },
  {
    id: 'capeletti',
    nome: 'Capeletti in Brodo',
    categoria: 'quentes',
    descricao: 'Capeletti artesanal em caldo dourado de longa cocção, servido bem quente.',
    fotos: ['IMG_6444'],
    ficha: {
      apresentacao: 'Panela de ferro no buffet ou cumbucas individuais.',
      embalagem: 'Caldo e massa separados até o momento de servir.',
      segredos: 'Caldo de galinha caipira cozido por 6 horas e clarificado.',
      harmonizacao: 'Lambrusco ou Barbera.',
    },
  },
  {
    id: 'saladas',
    nome: 'Saladas de Folhas Nobres',
    categoria: 'entradas',
    descricao: 'Mix de folhas, morangos, manga, tomates e croutons, com vinagrete da casa.',
    fotos: ['IMG_7216', 'IMG_7063', 'IMG_6980'],
    ficha: {
      apresentacao: 'Saladeiras grandes no buffet ou empratadas individualmente.',
      embalagem: 'Folhas higienizadas e secas, transportadas resfriadas; molho à parte.',
      segredos: 'O vinagrete só entra no prato na hora, para as folhas continuarem crocantes.',
      harmonizacao: 'Sauvignon Blanc chileno ou rosé.',
    },
  },
  {
    id: 'quiche',
    nome: 'Quiche Francesa Artesanal',
    categoria: 'paes',
    descricao: 'Massa brisée amanteigada e recheio cremoso gratinado, assada em fôrma alta.',
    fotos: ['IMG_2288'],
    ficha: {
      apresentacao: 'Inteira sobre tábua, para ser fatiada à mesa, decorada com ervas frescas.',
      embalagem: 'Caixa rígida com base antiderrapante; pode ser servida morna ou em temperatura ambiente.',
      segredos: 'Massa pré-assada às cegas para a base ficar crocante sob o recheio.',
      harmonizacao: 'Chablis ou Chardonnay sem madeira.',
    },
  },
  {
    id: 'focaccia',
    nome: 'Focaccia de Tomate & Alecrim',
    categoria: 'paes',
    descricao: 'Focaccia de longa fermentação com tomates-cereja assados, alecrim e flor de sal.',
    fotos: ['IMG_2302', 'IMG_2303', 'IMG_2295'],
    ficha: {
      apresentacao: 'Cortada em quadrados generosos sobre tábua de madeira.',
      embalagem: 'Assada no dia e embalada em papel kraft respirável para manter a casca.',
      segredos: 'Massa com alta hidratação e fermentação de 24 horas na geladeira.',
      harmonizacao: 'Chianti ou Sangiovese.',
    },
  },
  {
    id: 'cestas-paes',
    nome: 'Cestas de Croissants & Pão de Queijo',
    categoria: 'paes',
    descricao: 'Croissants folhados, pão de queijo mineiro e mini pizzas para coffee breaks e brunches.',
    fotos: ['IMG_6349', 'IMG_6352', 'IMG_6242'],
    ficha: {
      apresentacao: 'Cestas de vime forradas com guardanapos de linho e reposição contínua.',
      embalagem: 'Assados no local ou entregues mornos em embalagem térmica.',
      segredos: 'Pão de queijo com polvilho azedo e queijo canastra meia-cura.',
      harmonizacao: 'Café coado na hora, sucos naturais ou espumante para brunch.',
    },
  },
  {
    id: 'bolo-pudim',
    nome: 'Bolo-Pudim de Chocolate',
    categoria: 'doces',
    descricao: 'Pudim de leite cremoso sobre bolo de chocolate úmido, com calda de caramelo.',
    fotos: ['IMG_6346'],
    ficha: {
      apresentacao: 'Inteiro sobre boleira de madeira, com a calda escorrendo pelas laterais.',
      embalagem: 'Caixa alta refrigerada; desenformado no próprio prato de serviço.',
      segredos: 'Banho-maria em forno baixo para o pudim ficar liso, sem furinhos.',
      harmonizacao: 'Vinho do Porto Ruby ou licor de café.',
    },
  },
  {
    id: 'bolos-festa',
    nome: 'Bolos de Festa & Cheesecake',
    categoria: 'doces',
    descricao: 'Bolo chiffon de chocolate com doce de leite, cheesecake e bolo caramelo rendado.',
    fotos: ['IMG_6950', 'IMG_2292', 'IMG_6239', 'IMG_6241'],
    ficha: {
      apresentacao: 'Boleiras em diferentes alturas para compor a mesa de sobremesas.',
      embalagem: 'Caixas próprias refrigeradas e transporte nivelado.',
      segredos: 'Massas leves com claras em neve e coberturas feitas no dia.',
      harmonizacao: 'Espumante demi-sec ou Moscatel.',
    },
  },
  {
    id: 'verrines',
    nome: 'Verrines de Frutas Vermelhas',
    categoria: 'doces',
    descricao: 'Taças de creme, morangos frescos e calda de frutas vermelhas, com hortelã.',
    fotos: ['IMG_6983', 'IMG_7052', 'IMG_7053', 'IMG_7055', 'IMG_7056'],
    ficha: {
      apresentacao: 'Taças individuais em bandejas de madeira, alinhadas no buffet.',
      embalagem: 'Montadas em taças de vidro e transportadas refrigeradas em suportes.',
      segredos: 'Camadas montadas em sequência fria para não misturar o creme com a calda.',
      harmonizacao: 'Espumante rosé demi-sec.',
    },
  },
  {
    id: 'tortinhas-limao',
    nome: 'Tortinhas de Limão Siciliano',
    categoria: 'doces',
    descricao: 'Massa sablée crocante, creme de limão e merengue suave, em tamanho de uma mordida.',
    fotos: ['IMG_7337', 'IMG_7332'],
    ficha: {
      apresentacao: 'Em torre ou bandeja de madeira, decoradas com microverdes.',
      embalagem: 'Bandejas com berços individuais para não amassar o merengue.',
      segredos: 'Creme de limão cozido em banho-maria e massa sablée com manteiga gelada.',
      harmonizacao: 'Riesling meio-seco ou limoncello gelado.',
    },
  },
  {
    id: 'cuca',
    nome: 'Cuca Artesanal com Farofa',
    categoria: 'doces',
    descricao: 'Cuca macia com chocolate e farofa amanteigada, cortada em fatias generosas.',
    fotos: ['IMG_6351'],
    ficha: {
      apresentacao: 'Fatias organizadas em tábua longa para coffee breaks.',
      embalagem: 'Assada no dia e embalada inteira para manter a umidade.',
      segredos: 'Farofa feita com manteiga gelada para ficar em grumos crocantes.',
      harmonizacao: 'Café especial ou chá preto.',
    },
  },
];

export const EVENTOS: Evento[] = [
  {
    id: 'casamentos',
    titulo: 'Casamentos & Celebrações',
    descricao: 'Mesas cenográficas com favo de mel, varal de parma, frutas e confeitaria autoral.',
    fotos: ['IMG_7326', 'IMG_7323', 'IMG_7325', 'IMG_7324', 'IMG_7331', 'IMG_7328', 'IMG_7332', 'IMG_FAVO'],
  },
  {
    id: 'corporativo',
    titulo: 'Buffets Corporativos',
    descricao: 'Almoços completos com rechauds, saladas, risotos e sobremesas em taça.',
    fotos: ['IMG_7039', 'IMG_7064', 'IMG_7046', 'IMG_7040', 'IMG_7216', 'IMG_7063', 'IMG_7052', 'IMG_7221'],
  },
  {
    id: 'brunch',
    titulo: 'Brunch em Residência',
    descricao: 'Mesas fartas montadas na cozinha do cliente, do favo de mel à confeitaria.',
    fotos: ['IMG_6247', 'IMG_6238', 'IMG_6237', 'IMG_6239', 'IMG_6242', 'IMG_6243', 'IMG_6244', 'IMG_6241'],
  },
  {
    id: 'coffee',
    titulo: 'Coffee Breaks & Recepções',
    descricao: 'Pães, cucas, tábuas de queijos e antepastos para receber com elegância.',
    fotos: ['IMG_7005', 'IMG_6736', 'IMG_6438', 'IMG_6349', 'IMG_6351', 'IMG_6352', 'IMG_6734', 'IMG_6743'],
  },
  {
    id: 'jantares',
    titulo: 'Jantares Empratados',
    descricao: 'Serviço à francesa com risotos, gratinados, saladas e sobremesas individuais.',
    fotos: ['IMG_6977', 'IMG_6939', 'IMG_6937', 'IMG_6980', 'IMG_6983', 'IMG_6929', 'IMG_6950', 'IMG_6945'],
  },
  {
    id: 'cafe-manha',
    titulo: 'Cafés da Manhã Especiais',
    descricao: 'Focaccias, panquecas, burrata, quiches e grazing tables para começar o dia.',
    fotos: ['IMG_2300', 'IMG_2306', 'IMG_2297', 'IMG_2288', 'IMG_2302', 'IMG_2309', 'IMG_2295', 'IMG_2301'],
  },
];

/** Faixa de fotos que corre no topo, logo abaixo do hero. */
export const FAIXA_FOTOS = [
  'IMG_7336', 'IMG_2288', 'IMG_6983', 'IMG_7337', 'IMG_2301', 'IMG_6950',
  'IMG_6939', 'IMG_2302', 'IMG_6346', 'IMG_6243', 'IMG_7052', 'IMG_6435',
];
