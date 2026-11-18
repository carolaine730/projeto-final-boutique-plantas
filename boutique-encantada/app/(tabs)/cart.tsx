import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useStore, usingFirebase } from '../../src/state/Store';
import { colors } from '../../src/theme';
const money = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
import { getPlantImage } from '../../src/data/productImages';

export default function Cart() {
  const { plants, cart, changeQty, placeOrder } = useStore();
  const [busy, setBusy] = useState(false);
  const items = Object.entries(cart).map(([id, quantity]) => ({ plant: plants.find(item => item.id === id), quantity })).filter(item => item.plant);
  const subtotal = items.reduce((sum, item) => sum + (item.plant?.price || 0) * item.quantity, 0);
  async function checkout() {
    if (!items.length) return;
    if (!usingFirebase) { Alert.alert('Firebase não configurado', 'A sacola funciona neste modo de demonstração, mas o pedido só pode ser enviado depois de configurar o Firestore. Nenhum pedido foi registrado.'); return; }
    setBusy(true);
    try { await placeOrder(); Alert.alert('Pedido registrado!', 'Seu pedido foi salvo no Firestore. A boutique poderá entrar em contato para combinar pagamento e entrega.'); }
    catch (error) { Alert.alert('Não foi possível concluir', error instanceof Error ? error.message : 'Verifique a conexão e as regras do Firebase. A sacola foi preservada.'); }
    finally { setBusy(false); }
  }
  return <ScrollView style={styles.page} contentContainerStyle={styles.body}>
    <Text style={styles.title}>Meu carrinho</Text><Text style={styles.subtitle}>Suas escolhas especiais estão aqui.</Text>
    {items.length ? items.map(({ plant, quantity }) => plant ? <View key={plant.id} style={styles.item}>
      <View style={styles.thumb}>
  {getPlantImage(plant) ? (
    <Image
      source={getPlantImage(plant)}
      style={styles.image}
      resizeMode="cover"
    />
  ) : (
    <Text style={styles.emoji}>{plant.emoji}</Text>
  )}
</View>
      <View style={styles.info}><Text style={styles.name}>{plant.name}</Text><Text style={styles.price}>{money(plant.price)}</Text><View style={styles.qty}><Pressable accessibilityLabel="Diminuir quantidade" onPress={() => changeQty(plant.id, -1)}><Text style={styles.qtyText}>−</Text></Pressable><Text style={styles.qtyNumber}>{quantity}</Text><Pressable accessibilityLabel="Aumentar quantidade" onPress={() => changeQty(plant.id, 1)}><Text style={styles.qtyText}>＋</Text></Pressable></View></View>
      <View style={styles.right}><Text style={styles.lineTotal}>{money(plant.price * quantity)}</Text><Pressable onPress={() => changeQty(plant.id, -quantity)}><Text style={styles.remove}>Remover</Text></Pressable></View>
    </View> : null) : <View style={styles.empty}><Text style={{ fontSize: 42 }}>🛍️</Text><Text style={styles.emptyTitle}>Sua sacola está vazia</Text><Text style={styles.emptyCopy}>Escolha suas flores e plantas favoritas para começar.</Text></View>}
    <View style={styles.summary}><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>{money(subtotal)}</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Entrega</Text><Text style={styles.summaryValue}>A combinar</Text></View><View style={styles.rule}/><View style={styles.summaryRow}><Text style={styles.totalLabel}>Total parcial</Text><Text style={styles.totalValue}>{money(subtotal)}</Text></View></View>
    <Pressable disabled={!items.length || busy} style={[styles.button, (!items.length || busy) && styles.disabled]} onPress={checkout}><Text style={styles.buttonText}>{busy ? 'Registrando pedido...' : 'Finalizar pedido'}</Text></Pressable>
    {!usingFirebase ? <Text style={styles.note}>Modo demonstração: configure o Firebase para gravar pedidos na nuvem.</Text> : <Text style={styles.note}>O valor da entrega será combinado com a boutique.</Text>}
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.cream }, body: { padding: 20, paddingBottom: 35 }, title: { fontSize: 28, color: colors.forest, fontWeight: '800' }, subtitle: { color: colors.muted, marginTop: 5, marginBottom: 22 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.paper, borderRadius: 16, padding: 11, marginBottom: 11 }, thumb: { width: 76, height: 76, borderRadius: 12, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, image: { width: '100%', height: '100%' }, emoji: { fontSize: 34 }, info: { flex: 1 }, name: { color: colors.ink, fontWeight: '800', fontSize: 14 }, price: { color: colors.muted, fontSize: 12, marginTop: 4 }, qty: { flexDirection: 'row', alignItems: 'center', gap: 13, borderWidth: 1, borderColor: colors.line, borderRadius: 18, alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 3, marginTop: 8 }, qtyText: { color: colors.forest, fontSize: 17, fontWeight: '800' }, qtyNumber: { color: colors.ink, fontWeight: '700' }, right: { alignItems: 'flex-end', gap: 12 }, lineTotal: { color: colors.forest, fontWeight: '800' }, remove: { color: colors.danger, fontSize: 11 },
  empty: { alignItems: 'center', paddingVertical: 45 }, emptyTitle: { color: colors.forest, fontSize: 18, fontWeight: '800', marginTop: 12 }, emptyCopy: { color: colors.muted, textAlign: 'center', marginTop: 6, lineHeight: 20 }, summary: { backgroundColor: colors.sage, borderRadius: 17, padding: 16, marginTop: 15 }, summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 }, summaryLabel: { color: colors.ink }, summaryValue: { color: colors.ink, fontWeight: '600' }, rule: { height: 1, backgroundColor: colors.line, marginVertical: 8 }, totalLabel: { color: colors.forest, fontWeight: '800', fontSize: 16 }, totalValue: { color: colors.forest, fontWeight: '900', fontSize: 18 }, button: { backgroundColor: colors.forest, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 18 }, disabled: { opacity: 0.45 }, buttonText: { color: colors.paper, fontWeight: '800', fontSize: 15 }, note: { textAlign: 'center', color: colors.muted, fontSize: 11, marginTop: 12, lineHeight: 17 },
});
