import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { usingFirebase, useStore } from '../../src/state/Store';
import { colors } from '../../src/theme';
export default function Profile() {
  const { plants, favorites } = useStore();
  return <ScrollView style={styles.page} contentContainerStyle={styles.body}><Text style={styles.logo}>🌷</Text><Text style={styles.title}>Boutique Encantada</Text><Text style={styles.sub}>Flores que encantam, cuidado que floresce.</Text>
    <View style={styles.card}><Text style={styles.label}>STATUS DO CATÁLOGO</Text><Text style={styles.status}>{usingFirebase ? '● Firebase configurado' : '○ Modo demonstração'}</Text><Text style={styles.caption}>{plants.length} produtos no catálogo · {favorites.length} favoritos</Text></View>
    <Text style={styles.section}>Área de gerenciamento</Text><Pressable style={styles.button} onPress={() => router.push('/admin/new')}><Text style={styles.buttonText}>＋  Cadastrar produto</Text></Pressable><Text style={styles.hint}>A tela de cadastro permite criar e editar produtos. Restrinja o acesso administrativo antes de publicar o aplicativo.</Text>
    <View style={styles.card}><Text style={styles.label}>SOBRE A BOUTIQUE</Text><Text style={styles.caption}>Uma boutique dedicada a flores, plantas e pequenos detalhes que deixam a casa mais acolhedora. Aqui você encontra inspirações e orientações básicas para cuidar do seu jardim.</Text></View>
    <View style={styles.card}><Text style={styles.label}>INFORMAÇÃO</Text><Text style={styles.caption}>Este aplicativo é um projeto acadêmico demonstrativo. Preços, disponibilidade e orientações devem ser confirmados pela equipe.</Text></View>
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.cream }, body: { padding: 24, alignItems: 'center' }, logo: { fontSize: 55, marginTop: 15 }, title: { fontSize: 26, fontWeight: '800', color: colors.forest, marginTop: 8, textAlign: 'center' }, sub: { color: colors.muted, marginTop: 5, textAlign: 'center' }, card: { width: '100%', padding: 18, backgroundColor: colors.paper, borderRadius: 18, marginTop: 22 }, label: { fontSize: 10, fontWeight: '800', letterSpacing: 1.3, color: colors.leaf }, status: { fontWeight: '800', color: colors.forest, marginTop: 10 }, caption: { color: colors.muted, lineHeight: 21, marginTop: 8 }, section: { alignSelf: 'flex-start', fontSize: 17, fontWeight: '800', color: colors.ink, marginTop: 25 }, button: { width: '100%', padding: 16, borderRadius: 14, backgroundColor: colors.forest, marginTop: 12, alignItems: 'center' }, buttonText: { color: colors.paper, fontWeight: '800' }, hint: { color: colors.muted, fontSize: 12, alignSelf: 'flex-start', marginTop: 8, lineHeight: 18 } });
