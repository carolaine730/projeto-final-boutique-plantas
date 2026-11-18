export type Plant = {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  price: number;
  light: string;
  water: string;
  description: string;
  emoji: string;
  imageUrl?: string;
  featured?: boolean;
};

export const plantCategories = [
  'Todas',
  'Flores',
  'Plantas',
  'Suculentas',
];

type PlantCare = Pick<Plant, 'scientificName' | 'light' | 'water'>;

const cutFlowerCare = {
  light: 'Mantenha em local fresco e iluminado, sem sol direto e longe de fontes de calor.',
  water: 'Use um recipiente limpo, mantenha água fresca e retire folhas que ficariam submersas. Renove a água regularmente.',
};

const orchidCare: PlantCare = {
  scientificName: 'Phalaenopsis — híbridos ornamentais',
  light: 'Prefere bastante luz indireta. Evite sol forte diretamente nas folhas.',
  water: 'Regue quando o substrato estiver próximo de secar e deixe a água escorrer. Não mantenha as raízes submersas nem acumule água no centro das folhas.',
};

const careById: Record<string, PlantCare> = {
  suculenta: {
    scientificName: 'Composição de diferentes suculentas',
    light: 'Prefere ambiente muito iluminado. A exposição ao sol depende das espécies presentes no arranjo.',
    water: 'Confira a umidade antes de regar e deixe o substrato secar entre as regas. Utilize vasos com drenagem e evite água acumulada.',
  },
  'costela-de-adao': {
    scientificName: 'Monstera deliciosa',
    light: 'Prefere luz indireta e ambiente iluminado. Evite sol forte diretamente nas folhas.',
    water: 'Regue quando a camada superficial do substrato estiver seca. Deixe o excesso escorrer e esvazie o pratinho.',
  },
  'comigo-ninguem-pode': {
    scientificName: 'Dieffenbachia spp.',
    light: 'Cultive em ambiente iluminado, com luz indireta.',
    water: 'Deixe a superfície do substrato secar entre as regas. Evite encharcamento e água parada no pratinho.',
  },
  'palmeira-ornamental': {
    scientificName: 'Arecaceae — palmeira ornamental',
    light: 'Mantenha em local com luz indireta abundante. A tolerância ao sol varia conforme a espécie.',
    water: 'Confira a umidade do substrato antes de regar. Mantenha boa drenagem e evite deixar o vaso dentro de água.',
  },
  'orquidea-lilas': orchidCare,
  'orquidea-branca': orchidCare,
  orquidea: orchidCare,
  'lirios-mesclados': {
    scientificName: 'Lilium spp. — flores cortadas',
    ...cutFlowerCare,
  },
  lirio: {
    scientificName: 'Lilium spp.',
    light: 'Cultive em local bem iluminado, com sol ou meia-sombra, protegendo o vaso do calor excessivo.',
    water: 'Mantenha o substrato levemente úmido e bem drenado, sem deixar o vaso encharcado.',
  },
  'copo-de-leite': {
    scientificName: 'Zantedeschia aethiopica — flores cortadas',
    ...cutFlowerCare,
  },
  'anturio-vermelho': {
    scientificName: 'Anthurium — híbridos ornamentais',
    light: 'Prefere luz indireta abundante. Evite sol forte nas folhas.',
    water: 'Regue quando a superfície do substrato começar a secar. Deixe escorrer e evite água acumulada.',
  },
  tulipas: {
    scientificName: 'Tulipa spp. — flores cortadas',
    ...cutFlowerCare,
  },
  'tulipas-laranjas': {
    scientificName: 'Tulipa spp. — flores cortadas',
    ...cutFlowerCare,
  },
  peonias: {
    scientificName: 'Paeonia spp.',
    light: 'Prefere cultivo externo com boa exposição ao sol. A adaptação e a floração dependem da espécie e do clima.',
    water: 'Mantenha o solo com umidade adequada e boa drenagem. Evite tanto o encharcamento quanto o ressecamento prolongado.',
  },
  rosas: {
    scientificName: 'Rosa — híbridos ornamentais',
    light: 'Prefere ambiente externo com boa exposição ao sol e circulação de ar.',
    water: 'Confira a umidade diariamente em períodos quentes. Regue o substrato antes que resseque completamente e deixe o excesso escorrer.',
  },
  girassol: {
    scientificName: 'Helianthus annuus — flores cortadas',
    ...cutFlowerCare,
  },
};

function product(
  id: string,
  name: string,
  category: string,
  price: number,
  description: string,
  featured = false,
): Plant {
  return {
    id,
    name,
    category,
    price,
    description,
    featured,
    ...careById[id],
    emoji: category === 'Flores' ? '🌸' : '🪴',
  };
}

export const demoPlants: Plant[] = [
  product(
    'suculenta',
    'Arranjo de suculentas',
    'Suculentas',
    79.90,
    'Composição de suculentas em vasos, com diferentes cores e formatos.',
    true,
  ),
  product(
    'costela-de-adao',
    'Costela-de-adão',
    'Plantas',
    69.90,
    'Folhagem em vaso para dar um toque verde à decoração.',
    true,
  ),
  product(
    'comigo-ninguem-pode',
    'Comigo-ninguém-pode',
    'Plantas',
    49.90,
    'Planta ornamental com folhas em diferentes tons de verde.',
  ),
  product(
    'palmeira-ornamental',
    'Palmeira ornamental',
    'Plantas',
    129.90,
    'Folhagem em vaso para compor a decoração. Espécie a confirmar.',
  ),
  product(
    'orquidea-lilas',
    'Orquídea lilás',
    'Flores',
    89.90,
    'Orquídea com flores em tons de lilás para decorar ou presentear.',
  ),
  product(
    'orquidea-branca',
    'Orquídea branca',
    'Flores',
    89.90,
    'Orquídea branca em vaso, com uma composição delicada.',
  ),
  product(
    'orquidea',
    'Orquídea rosa',
    'Flores',
    89.90,
    'Orquídea com flores em rosa intenso.',
    true,
  ),
  product(
    'lirios-mesclados',
    'Arranjo de lírios mesclados',
    'Flores',
    89.90,
    'Arranjo de flores cortadas com lírios brancos e rosados.',
  ),
  product(
    'lirio',
    'Lírios brancos',
    'Flores',
    69.90,
    'Composição de lírios brancos em vaso.',
  ),
  product(
    'copo-de-leite',
    'Arranjo de copos-de-leite brancos',
    'Flores',
    79.90,
    'Arranjo de flores cortadas em recipiente de vidro.',
  ),
  product(
    'anturio-vermelho',
    'Antúrio vermelho',
    'Flores',
    59.90,
    'Planta ornamental em vaso com destaque para os tons vermelhos.',
  ),
  product(
    'tulipas',
    'Arranjo de tulipas brancas',
    'Flores',
    79.90,
    'Arranjo de tulipas brancas em vaso decorativo.',
  ),
  product(
    'tulipas-laranjas',
    'Arranjo de tulipas laranjas',
    'Flores',
    79.90,
    'Arranjo de tulipas em tons de laranja.',
  ),
  product(
    'peonias',
    'Peônias rosas',
    'Flores',
    99.90,
    'Flores em tons de rosa, com pétalas volumosas.',
  ),
  product(
    'rosas',
    'Rosas cor-de-rosa',
    'Flores',
    59.90,
    'Roseira em vaso com flores cor-de-rosa.',
  ),
  product(
    'girassol',
    'Arranjo de girassóis',
    'Flores',
    69.90,
    'Arranjo de flores cortadas em vaso decorativo.',
    true,
  ),
];