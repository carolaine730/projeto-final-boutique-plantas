import type { ImageSourcePropType } from 'react-native';
import type { Plant } from './plants';

const productImages: Record<string, ImageSourcePropType | undefined> = {
  suculenta: require('../../assets/images/products/suculenta-rosa.png'),
};

export function getPlantImage(plant: Plant) {
  return plant.imageUrl
    ? { uri: plant.imageUrl }
    : productImages[plant.id];
}