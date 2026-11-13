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

// Preços fictícios para demonstração acadêmica.
// Identificação botânica e cuidados serão revisados pela equipe.
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
    scientificName: 'Identificação botânica em revisão',
    light: 'Orientação de iluminação em revisão.',
    water: 'Orientação de conservação e rega em revisão.',
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