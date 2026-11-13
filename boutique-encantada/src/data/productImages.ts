import type { ImageSourcePropType } from 'react-native';
import type { Plant } from './plants';

const productImages: Record<string, ImageSourcePropType | undefined> = {
  suculenta: require('../../assets/images/products/suculentas.png'),
  'costela-de-adao': require('../../assets/images/products/costela-de-adao.png'),
  'comigo-ninguem-pode': require('../../assets/images/products/comigo-ninguem-pode.png'),
  'palmeira-ornamental': require('../../assets/images/products/palmeira-ornamental.png'),
  'orquidea-lilas': require('../../assets/images/products/orquidea-lilas.png'),
  'orquidea-branca': require('../../assets/images/products/orquidea-branca.png'),
  orquidea: require('../../assets/images/products/orquidea-rosa.png'),
  'lirios-mesclados': require('../../assets/images/products/lirios-mesclados.png'),
  lirio: require('../../assets/images/products/lirios-brancos.png'),
  'copo-de-leite': require('../../assets/images/products/copo-de-leite-branco.png'),
  'anturio-vermelho': require('../../assets/images/products/anturio-vermelho.png'),
  tulipas: require('../../assets/images/products/tulipas-brancas.png'),
  'tulipas-laranjas': require('../../assets/images/products/tulipas-laranjas.png'),
  peonias: require('../../assets/images/products/peonias-rosas.png'),
  rosas: require('../../assets/images/products/rosas.png'),
  girassol: require('../../assets/images/products/girassol.png'),
};

export function getPlantImage(plant: Plant): ImageSourcePropType | undefined {
  return plant.imageUrl
    ? { uri: plant.imageUrl }
    : productImages[plant.id];
}