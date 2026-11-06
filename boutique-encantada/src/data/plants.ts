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

// Catálogo inicial de demonstração. Os preços são fictícios e devem ser
// confirmados pela equipe antes da apresentação/entrega.
export const demoPlants: Plant[] = [
  { id: 'suculenta', name: 'Suculenta', scientificName: 'Echeveria spp. (exemplo)', category: 'Suculentas', price: 19.90, light: 'Muita claridade e algumas horas de sol suave', water: 'Regue somente quando o substrato estiver seco', description: 'Pequena, charmosa e ótima para decorar mesas, prateleiras e pequenos espaços.', emoji: '🌵', featured: true },
  { id: 'pomo-de-adao', name: 'Pomo de adão', scientificName: 'Espécie a confirmar', category: 'Plantas', price: 69.90, light: 'Luz indireta e ambiente bem iluminado', water: 'Ajustar conforme a espécie identificada', description: 'Item solicitado para o catálogo. A espécie botânica precisa ser confirmada pela equipe antes da publicação.', emoji: '🌿' },
  { id: 'orquidea', name: 'Orquídea', scientificName: 'Phalaenopsis spp. (exemplo)', category: 'Flores', price: 89.90, light: 'Luz indireta e ambiente ventilado', water: 'Regue quando o substrato estiver quase seco; evite encharcar', description: 'Flores delicadas e elegantes que trazem cor e sofisticação para o ambiente.', emoji: '🌸', featured: true },
  { id: 'lirio', name: 'Lírio', scientificName: 'Lilium spp.', category: 'Flores', price: 49.90, light: 'Local claro, evitando sol forte nas horas quentes', water: 'Mantenha o substrato levemente úmido', description: 'Flor marcante e perfumada, ideal para composições delicadas.', emoji: '🤍' },
  { id: 'copo-de-leite', name: 'Copo-de-leite', scientificName: 'Zantedeschia aethiopica', category: 'Flores', price: 59.90, light: 'Luz abundante indireta ou sol ameno', water: 'Mantenha o solo úmido, sem deixar água acumulada', description: 'Uma flor de linhas elegantes, perfeita para arranjos e decoração.', emoji: '🤍' },
  { id: 'tulipas', name: 'Tulipas', scientificName: 'Tulipa gesneriana (híbridos)', category: 'Flores', price: 59.90, light: 'Ambiente claro e fresco', water: 'Mantenha o substrato levemente úmido', description: 'Flores de formato clássico e cores encantadoras para presentear.', emoji: '🌷', featured: true },
  { id: 'costela-de-adao', name: 'Costela-de-adão', scientificName: 'Monstera deliciosa', category: 'Plantas', price: 69.90, light: 'Luz indireta brilhante', water: 'Regue quando a camada superficial do solo secar', description: 'Folhas grandes e recortadas que dão personalidade e um toque tropical à decoração.', emoji: '🌿', featured: true },
  { id: 'trepadeira', name: 'Trepadeira', scientificName: 'Espécie a escolher', category: 'Pendentes', price: 44.90, light: 'Depende da espécie; em geral, luz indireta', water: 'Ajustar conforme a espécie e o substrato', description: 'Uma opção versátil para jardins verticais, suportes e vasos suspensos. A variedade será definida pela boutique.', emoji: '🍃' },
  { id: 'peonias', name: 'Peônias', scientificName: 'Paeonia spp.', category: 'Flores', price: 99.90, light: 'Boa luminosidade; preferência por clima ameno', water: 'Mantenha o solo úmido, sem encharcar', description: 'Flores volumosas e românticas, conhecidas por suas pétalas abundantes.', emoji: '🌺', featured: true },
  { id: 'girassol', name: 'Girassol', scientificName: 'Helianthus annuus', category: 'Flores', price: 29.90, light: 'Sol direto por várias horas ao dia', water: 'Regue regularmente, sem encharcar', description: 'Uma flor alegre e luminosa que deixa qualquer espaço mais acolhedor.', emoji: '🌻', featured: true },
];

export const plantCategories = [
  'Todas',
  'Flores',
  'Plantas',
  'Suculentas',
  'Pendentes',
  'Acessórios',
];
