import { useState } from 'react';
import { router } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { usingFirebase, useStore } from '../../src/state/Store';
import { auth } from '../../src/services/firebase';
import { ADMIN_UID, useAdmin } from '../../src/services/admin';
import { colors } from '../../src/theme';

export default function Profile() {
  const { plants, favorites } = useStore();
  const { isAdmin, checking } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function login() {
    if (!auth || busy) return;

    setMessage('');

    if (!email.trim() || !password) {
      setMessage('Preencha o e-mail e a senha.');
      return;
    }

    setBusy(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      setPassword('');

      if (credential.user.uid !== ADMIN_UID) {
        await signOut(auth);
        setMessage('Esta conta não tem acesso administrativo.');
      }
    } catch {
      setMessage('Não foi possível entrar. Confira os dados e a conexão.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    if (!auth || busy) return;

    setBusy(true);
    setMessage('');

    try {
      await signOut(auth);
      setPassword('');
    } catch {
      setMessage('Não foi possível sair. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.body}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.logo}>🌷</Text>
      <Text style={styles.title}>Boutique Encantada</Text>
      <Text style={styles.sub}>
        Flores que encantam, cuidado que floresce.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>STATUS DO CATÁLOGO</Text>
        <Text style={styles.status}>
          {usingFirebase ? 'Firebase configurado' : 'Modo demonstração'}
        </Text>
        <Text style={styles.caption}>
          {plants.length} produtos no catálogo · {favorites.length} favoritos
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>ÁREA ADMINISTRATIVA</Text>

        {checking ? (
          <Text style={styles.caption}>Verificando acesso...</Text>
        ) : isAdmin ? (
          <View>
            <Text style={styles.status}>Administrador conectado</Text>

            <Pressable
              style={styles.button}
              onPress={() => router.push('/admin/new')}
            >
              <Text style={styles.buttonText}>＋ Cadastrar produto</Text>
            </Pressable>

            <Text style={styles.caption}>
              Para editar ou remover, abra os detalhes de um produto.
            </Text>

            <Pressable
              style={styles.secondary}
              onPress={logout}
              disabled={busy}
            >
              <Text style={styles.secondaryText}>
                {busy ? 'Saindo...' : 'Sair da conta'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <Text style={styles.caption}>
              Entre com a conta autorizada para gerenciar o catálogo.
            </Text>

            <TextInput
              accessibilityLabel="E-mail do administrador"
              placeholder="E-mail"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="email"
              style={styles.input}
              editable={!busy && usingFirebase}
            />

            <TextInput
              accessibilityLabel="Senha do administrador"
              placeholder="Senha"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              style={styles.input}
              editable={!busy && usingFirebase}
              onSubmitEditing={login}
            />

            <Pressable
              style={[
                styles.button,
                (busy || !usingFirebase) && styles.disabled,
              ]}
              onPress={login}
              disabled={busy || !usingFirebase}
            >
              <Text style={styles.buttonText}>
                {busy ? 'Entrando...' : 'Entrar como administrador'}
              </Text>
            </Pressable>
          </View>
        )}

        {message ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {message}
          </Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>SOBRE A BOUTIQUE</Text>
        <Text style={styles.caption}>
          Uma boutique dedicada a flores, plantas e pequenos detalhes que
          deixam a casa mais acolhedora. Aqui você encontra inspirações e
          orientações básicas para cuidar do seu jardim.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>INFORMAÇÃO</Text>
        <Text style={styles.caption}>
          Este aplicativo é um projeto acadêmico demonstrativo. Preços,
          disponibilidade e orientações devem ser confirmados pela equipe.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  body: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logo: {
    fontSize: 55,
    marginTop: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.forest,
    marginTop: 8,
    textAlign: 'center',
  },
  sub: {
    color: colors.muted,
    marginTop: 5,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    padding: 18,
    backgroundColor: colors.paper,
    borderRadius: 18,
    marginTop: 22,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: colors.leaf,
  },
  status: {
    fontWeight: '800',
    color: colors.forest,
    marginTop: 10,
  },
  caption: {
    color: colors.muted,
    lineHeight: 21,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 12,
    color: colors.ink,
    backgroundColor: colors.cream,
    fontSize: 14,
  },
  button: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.forest,
    marginTop: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.paper,
    fontWeight: '800',
  },
  secondary: {
    padding: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  secondaryText: {
    color: colors.forest,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    color: colors.danger,
    marginTop: 12,
    lineHeight: 20,
  },
});