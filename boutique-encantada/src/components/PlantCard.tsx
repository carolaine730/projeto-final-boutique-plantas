import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Plant } from '../data/plants';
import { colors } from '../theme';
import { getPlantImage } from '../data/productImages';

function money(value: number) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

type PlantCardProps = {
  plant: Plant;
  favorite: boolean;
  onPress: () => void;
  onFavorite: () => void;
  fullWidth?: boolean;
};

export function PlantCard({
  plant,
  favorite,
  onPress,
  onFavorite,
  fullWidth = false,
}: PlantCardProps) {
  const imageSource = getPlantImage(plant);

  return (
    <View style={[styles.card, fullWidth && styles.fullWidth]}>
      <View style={styles.photo}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ver ${plant.name}`}
          onPress={onPress}
          style={styles.photoButton}
        >
          {imageSource ? (
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.emoji}>{plant.emoji || '🪴'}</Text>
          )}
        </Pressable>

        {plant.featured ? (
          <View style={styles.tag} pointerEvents="none">
            <Text style={styles.tagText}>Destaque</Text>
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
          }
          accessibilityState={{ selected: favorite }}
          hitSlop={8}
          onPress={onFavorite}
          style={styles.heart}
        >
          <Text style={[styles.heartText, favorite && styles.heartActive]}>
            {favorite ? '♥' : '♡'}
          </Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes de ${plant.name}`}
        onPress={onPress}
      >
        <Text numberOfLines={1} style={styles.name}>
          {plant.name}
        </Text>
        <Text style={styles.category}>{plant.category}</Text>
        <Text style={styles.price}>{money(plant.price)}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: 18,
  },
  fullWidth: {
    width: '100%',
  },
  photo: {
    aspectRatio: 2 / 3,
    backgroundColor: colors.cream,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emoji: {
    fontSize: 64,
  },
  heart: {
    position: 'absolute',
    right: 9,
    top: 9,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartText: {
    fontSize: 20,
    color: colors.forest,
  },
  heartActive: {
    color: colors.danger,
  },
  tag: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: colors.paper,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    color: colors.forest,
    fontWeight: '700',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 9,
  },
  category: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 3,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.forest,
    marginTop: 6,
  },
});