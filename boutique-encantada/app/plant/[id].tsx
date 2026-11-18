import { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useStore } from '../../src/state/Store';
import { colors } from '../../src/theme';
import { getPlantImage } from '../../src/data/productImages';
import { useAdmin } from '../../src/services/admin';

const money = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;

export default function PlantDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { plants, addToCart, favorites, toggleFavorite, removePlant } =
    useStore();
  const { isAdmin } = useAdmin();
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState('');

  const plant = plants.find(item => item.id === id);

  if (!plant) {
    return (
      <View style={styles.page}>
        <Text style={styles.notFound}>
          Não encontramos essa planta no catálogo.
        </Text>
      </View>
    );
  }

  const favorite = favorites.includes(plant.id);
  const imageSource = getPlantImage(plant);

  async function deleteProduct() {
    if (!plant || !isAdmin || removing) return;

    setRemoving(true);
    setError('');

    try {
      await removePlant(plant.id);
      router.replace('/(tabs)');
    } catch {
      setError('Não foi possível remover o produto. Tente novamente.');
    } finally {
      setRemoving(false);
    }
  }

  function confirmRemoval() {
    if (!plant || !isAdmin || removing) return;

    const message = `Deseja remover ${plant.name} do catálogo?`;

    if (Platform.OS === 'web') {
      if (window.confirm(message)) {
        void deleteProduct();
      }
      return;
    }

    Alert.alert('Remover produto', message, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          void deleteProduct();
        },
      },
    ]);
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.body}
    >
      <View style={styles.photo}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.emoji}>{plant.emoji || '🪴'}</Text>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
          }
          accessibilityState={{ selected: favorite }}
          style={styles.heart}
          onPress={() => toggleFavorite(plant.id)}
        >
          <Text
            style={[
              styles.heartText,
              favorite && styles.heartActive,
            ]}
          >
            {favorite ? '♥' : '♡'}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.category}>
        {plant.category.toUpperCase()}
      </Text>
      <Text style={styles.title}>{plant.name}</Text>
      <Text style={styles.scientific}>{plant.scientificName}</Text>
      <Text style={styles.price}>{money(plant.price)}</Text>
      <Text style={styles.desc}>{plant.description}</Text>

      <View style={styles.care}>
        <Text style={styles.careTitle}>☀️ Iluminação</Text>
        <Text style={styles.careText}>{plant.light}</Text>

        <View style={styles.divider} />

        <Text style={styles.careTitle}>💧 Rega</Text>
        <Text style={styles.careText}>{plant.water}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        style={styles.buy}
        onPress={() => {
          addToCart(plant.id);
          router.push('/(tabs)/cart');
        }}
      >
        <Text style={styles.buyText}>＋ Adicionar à sacola</Text>
      </Pressable>

      {isAdmin ? (
        <View>
          <Pressable
            accessibilityRole="button"
            disabled={removing}
            onPress={() =>
              router.push({
                pathname: '/admin/new',
                params: { id: plant.id },
              })
            }
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>Editar produto</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={removing}
            onPress={confirmRemoval}
            style={[styles.delete, removing && styles.disabled]}
          >
            <Text style={styles.deleteText}>
              {removing ? 'Removendo...' : 'Remover produto'}
            </Text>
          </Pressable>
        </View>
      ) : null}

      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  body: {
    padding: 20,
    paddingBottom: 42,
  },
  photo: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 23,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emoji: {
    fontSize: 110,
  },
  heart: {
    position: 'absolute',
    right: 13,
    top: 13,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartText: {
    color: colors.forest,
    fontSize: 24,
  },
  heartActive: {
    color: colors.danger,
  },
  category: {
    color: colors.leaf,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginTop: 21,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.forest,
    marginTop: 5,
  },
  scientific: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.muted,
    marginTop: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.forest,
    marginTop: 17,
  },
  desc: {
    fontSize: 15,
    color: colors.ink,
    lineHeight: 23,
    marginTop: 12,
  },
  care: {
    padding: 17,
    backgroundColor: colors.paper,
    borderRadius: 17,
    marginTop: 21,
  },
  careTitle: {
    fontWeight: '800',
    fontSize: 14,
    color: colors.forest,
  },
  careText: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 5,
    marginBottom: 12,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 10,
  },
  buy: {
    backgroundColor: colors.forest,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buyText: {
    color: colors.paper,
    fontSize: 15,
    fontWeight: '800',
  },
  secondary: {
    padding: 14,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.forest,
    fontWeight: '700',
  },
  delete: {
    padding: 12,
    alignItems: 'center',
  },
  deleteText: {
    color: colors.danger,
    fontSize: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  notFound: {
    color: colors.ink,
    padding: 24,
  },
});