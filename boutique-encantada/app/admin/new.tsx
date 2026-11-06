import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { plantCategories, Plant } from '../../src/data/plants';
import { useStore } from '../../src/state/Store';
import { colors } from '../../src/theme';
const categories = plantCategories.filter(category => category !== 'Todas');
export default function NewPlant() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { plants, savePlant } = useStore();
  const existing = plants.find(plant => plant.id === id);
  const [name, setName] = useState(''); const [scientific, setScientific] = useState(''); const [price, setPrice] = useState('');
  const [description, setDescription] = useState(''); const [light, setLight] = useState(''); const [water, setWater] = useState('');
  const [category, setCategory] = useState('Flores'); const [image, setImage] = useState<string>();
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  useEffect(() => { if (existing) { setName(existing.name); setScientific(existing.scientificName); setPrice(String(existing.price).replace('.', ',')); setDescription(existing.description); setLight(existing.light); setWater(existing.water); setCategory(existing.category); setImage(existing.imageUrl); } }, [id, existing?.id]);
  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert('Permissão necessária', 'Permita o acesso à galeria para selecionar uma foto.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.75 });
    if (!result.canceled) setImage(result.assets[0].uri);
  }
  async function submit() {
    setError('');
    const parsedPrice = Number(price.trim().replace(',', '.'));
    if (name.trim().length < 2) return setError('Informe o nome da planta com pelo menos 2 caracteres.');
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) return setError('Informe um preço válido maior que zero.');
    if (description.trim().length < 10) return setError('A descrição precisa ter pelo menos 10 caracteres.');
    if (!scientific.trim()) return setError('Informe o nome científico ou escreva “A confirmar”.');
    if (!light.trim() || !water.trim()) return setError('Preencha as orientações de iluminação e rega.');
    setBusy(true);
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const plant: Plant = { id: existing?.id || `${slug}-${Date.now()}`, name: name.trim(), scientificName: scientific.trim(), category, price: parsedPrice, description: description.trim(), light: light.trim(), water: water.trim(), emoji: '🌷', imageUrl: image };
    try { await savePlant(plant); Alert.alert('Produto salvo', existing ? 'As alterações foram atualizadas.' : 'O produto foi adicionado ao catálogo.'); router.back(); }
    catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'Não foi possível salvar. Verifique a conexão e as regras do Firebase.'); }
    finally { setBusy(false); }
  }
  return <ScrollView style={styles.page} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
    <Text style={styles.intro}>{existing ? 'Atualize as informações do produto.' : 'Adicione uma nova flor ou planta ao catálogo.'}</Text>
    <Pressable style={styles.photo} onPress={pickImage}>{image ? <Image source={{ uri: image }} style={styles.image} /> : <><Text style={{ fontSize: 34 }}>📷</Text><Text style={styles.photoText}>Escolher foto da galeria</Text></>}</Pressable>
    <Text style={styles.label}>NOME DO PRODUTO *</Text><TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Ex.: Orquídea rosa" />
    <Text style={styles.label}>NOME CIENTÍFICO *</Text><TextInput value={scientific} onChangeText={setScientific} style={styles.input} placeholder="Ex.: Phalaenopsis spp. ou A confirmar" />
    <Text style={styles.label}>PREÇO (R$) *</Text><TextInput value={price} onChangeText={setPrice} style={styles.input} keyboardType="decimal-pad" placeholder="89,90" />
    <Text style={styles.label}>CATEGORIA *</Text><View style={styles.chips}>{categories.map(item => <Pressable key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.selected]}><Text style={{ color: category === item ? colors.paper : colors.ink, fontSize: 12 }}>{item}</Text></Pressable>)}</View>
    <Text style={styles.label}>DESCRIÇÃO *</Text><TextInput value={description} onChangeText={setDescription} style={[styles.input, styles.multiline]} multiline placeholder="Conte o que torna essa planta especial..." />
    <Text style={styles.label}>ILUMINAÇÃO *</Text><TextInput value={light} onChangeText={setLight} style={styles.input} placeholder="Ex.: Luz indireta" />
    <Text style={styles.label}>REGA *</Text><TextInput value={water} onChangeText={setWater} style={styles.input} placeholder="Ex.: Regar quando o solo secar" />
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    <Pressable style={[styles.button, busy && { opacity: 0.6 }]} onPress={submit} disabled={busy}><Text style={styles.buttonText}>{busy ? 'Salvando...' : existing ? 'Salvar alterações' : 'Cadastrar produto'}</Text></Pressable>
    <Text style={styles.hint}>Observação: a foto escolhida fica no dispositivo nesta versão. Para compartilhar a imagem entre aparelhos, configure o Firebase Storage e salve a URL pública/segura no produto.</Text>
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.cream }, body: { padding: 20, paddingBottom: 35 }, intro: { color: colors.muted, marginBottom: 16 }, photo: { height: 160, backgroundColor: colors.sage, borderRadius: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 18 }, image: { width: '100%', height: '100%' }, photoText: { color: colors.forest, fontWeight: '700', marginTop: 6 }, label: { fontSize: 10, letterSpacing: 1.2, fontWeight: '800', color: colors.forest, marginBottom: 7, marginTop: 11 }, input: { backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: colors.ink, fontSize: 14 }, multiline: { height: 95, textAlignVertical: 'top' }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, chip: { backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: 16, paddingHorizontal: 11, paddingVertical: 8 }, selected: { backgroundColor: colors.forest, borderColor: colors.forest }, error: { color: colors.danger, marginTop: 12, lineHeight: 20 }, button: { backgroundColor: colors.forest, alignItems: 'center', padding: 16, borderRadius: 14, marginTop: 19 }, buttonText: { color: colors.paper, fontWeight: '800' }, hint: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 13 } });
