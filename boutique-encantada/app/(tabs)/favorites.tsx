import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PlantCard } from '../../src/components/PlantCard';
import { useStore } from '../../src/state/Store';
import { colors } from '../../src/theme';
export default function Favorites() {
  const { plants, favorites, toggleFavorite } = useStore();
  const list = plants.filter(plant => favorites.includes(plant.id));
  return <ScrollView style={styles.page} contentContainerStyle={styles.body}><Text style={styles.title}>Seus favoritos</Text><Text style={styles.sub}>Um cantinho para as plantas que você amou.</Text>{list.length ? <View style={styles.grid}>{list.map(plant => <PlantCard key={plant.id} plant={plant} favorite onPress={() => router.push(`/plant/${plant.id}`)} onFavorite={() => toggleFavorite(plant.id)} />)}</View> : <Text style={styles.empty}>Ainda não há favoritas. Toque no coração de uma planta para guardá-la aqui. ♡</Text>}</ScrollView>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.cream }, body: { padding: 20 }, title: { fontSize: 27, fontWeight: '800', color: colors.forest }, sub: { color: colors.muted, marginTop: 6, marginBottom: 22 }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, empty: { marginTop: 48, textAlign: 'center', color: colors.muted, lineHeight: 22 } });
