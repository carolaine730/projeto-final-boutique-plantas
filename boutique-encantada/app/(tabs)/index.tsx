import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { PlantCard } from '../../src/components/PlantCard';
import { plantCategories } from '../../src/data/plants';
import { useStore } from '../../src/state/Store';
import { colors } from '../../src/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home() {
  const { plants, favorites, toggleFavorite } = useStore();
  const [category, setCategory] = useState('Todas');
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => plants.filter(plant => (category === 'Todas' || plant.category === category) && `${plant.name} ${plant.category} ${plant.scientificName}`.toLowerCase().includes(search.trim().toLowerCase())), [plants, category, search]);
  const featured = plants.filter(plant => plant.featured);
  const insets = useSafeAreaInsets();

  return <ScrollView style={styles.page} contentContainerStyle={[
  styles.content,
  { paddingTop: insets.top + 19 },
]} keyboardShouldPersistTaps="handled">
    <View style={styles.top}><View><Text style={styles.kicker}>UM JARDIM DE AFETO</Text><Text style={styles.brand}>Boutique Encantada</Text></View><Pressable accessibilityLabel="Abrir perfil" style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}><Text style={{ fontSize: 22 }}>🌷</Text></Pressable></View>
    <Text style={styles.welcome}>Olá, seja bem-vinda!</Text>
    <View style={styles.searchWrap}><Text style={styles.searchIcon}>⌕</Text><TextInput value={search} onChangeText={setSearch} placeholder="O que você procura?" placeholderTextColor={colors.muted} style={styles.search} returnKeyType="search" /></View>
    <View style={styles.hero}><Text style={styles.heroKicker}>FLORES PARA ENCANTAR</Text><Text style={styles.heroTitle}>Um jardim cheio de beleza para chamar de seu.</Text><Text style={styles.heroCopy}>Encontre flores e plantas escolhidas com carinho.</Text><Pressable style={styles.heroButton} onPress={() => { setCategory('Todas'); setSearch(''); }}><Text style={styles.heroButtonText}>Explorar catálogo  →</Text></Pressable></View>
    <Text style={styles.heading}>Explore por categoria</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{plantCategories.map(item => <Pressable key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.chipOn]}><Text style={[styles.chipText, category === item && styles.chipTextOn]}>{item}</Text></Pressable>)}</ScrollView>
    {featured.length > 0 && category === 'Todas' && !search ? <><View style={styles.sectionRow}><Text style={styles.heading}>Destaques da boutique</Text><Text style={styles.count}>{featured.length} produtos</Text></View><View style={styles.grid}>{featured.slice(0, 4).map(plant => <PlantCard key={plant.id} plant={plant} favorite={favorites.includes(plant.id)} onPress={() => router.push(`/plant/${plant.id}`)} onFavorite={() => toggleFavorite(plant.id)} />)}</View></> : null}
    <View style={styles.sectionRow}><Text style={styles.heading}>Nosso jardim</Text><Text style={styles.count}>{filtered.length} opções</Text></View>
    {filtered.length ? <View style={styles.grid}>{filtered.map(plant => <PlantCard key={plant.id} plant={plant} favorite={favorites.includes(plant.id)} onPress={() => router.push(`/plant/${plant.id}`)} onFavorite={() => toggleFavorite(plant.id)} />)}</View> : <Text style={styles.empty}>Não encontramos plantas com essa busca. Tente outro nome ou categoria.</Text>}
  </ScrollView>;
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream }, content: { padding: 19, paddingBottom: 32 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 17 },
  kicker: { fontSize: 10, letterSpacing: 2, color: colors.leaf, fontWeight: '800' }, brand: { fontSize: 23, color: colors.forest, fontWeight: '800', marginTop: 4 },
  avatar: { width: 43, height: 43, borderRadius: 22, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  welcome: { fontSize: 22, color: colors.forest, fontWeight: '800', marginBottom: 15 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: 15, paddingHorizontal: 13, marginBottom: 17 }, searchIcon: { fontSize: 25, color: colors.muted }, search: { flex: 1, paddingVertical: 13, paddingHorizontal: 8, color: colors.ink, fontSize: 14 },
  hero: { backgroundColor: colors.forest, borderRadius: 22, padding: 21, marginBottom: 23 }, heroKicker: { color: '#EAD8E7', fontSize: 10, letterSpacing: 1.8, fontWeight: '800' }, heroTitle: { color: colors.paper, fontSize: 25, lineHeight: 31, fontWeight: '800', marginTop: 9, maxWidth: 300 }, heroCopy: { color: '#F4EAF1', fontSize: 13, lineHeight: 19, marginTop: 8 }, heroButton: { alignSelf: 'flex-start', marginTop: 16, backgroundColor: colors.sage, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20 }, heroButtonText: { color: colors.forest, fontWeight: '800', fontSize: 12 },
  heading: { fontSize: 18, color: colors.forest, fontWeight: '800', marginBottom: 12 }, chips: { gap: 8, paddingBottom: 18 }, chip: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20 }, chipOn: { backgroundColor: colors.forest, borderColor: colors.forest }, chipText: { color: colors.ink, fontSize: 12, fontWeight: '600' }, chipTextOn: { color: colors.paper },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, count: { color: colors.muted, fontSize: 12, marginBottom: 12 }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, empty: { textAlign: 'center', color: colors.muted, paddingVertical: 35, lineHeight: 21 },
});
