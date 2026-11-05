import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>Boutique Encantada</Text>
        <Text style={styles.subtitle}>
          Plantas que encantam, cuidados que transformam.
        </Text>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>
          Seu cantinho com mais vida.
        </Text>

        <Text style={styles.bannerDescription}>
          Encontre plantas para o seu espaço e aprenda a cuidar
          de cada uma delas.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Nosso jardim está nascendo 🌿</Text>

      <Text style={styles.description}>
        Em breve, você poderá explorar nossas plantas, conhecer
        seus cuidados e escolher suas favoritas.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 28,
  },
  brand: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.muted,
  },
  banner: {
    backgroundColor: COLORS.secondary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  bannerDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.muted,
  },
});