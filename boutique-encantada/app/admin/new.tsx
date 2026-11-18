import { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { router, useLocalSearchParams } from 'expo-router';
import { plantCategories, Plant } from '../../src/data/plants';
import { getPlantImage } from '../../src/data/productImages';
import { useStore } from '../../src/state/Store';
import { useAdmin } from '../../src/services/admin';
import { colors } from '../../src/theme';

const categories = plantCategories.filter(category => category !== 'Todas');
const MAX_IMAGE_LENGTH = 280_000;

export default function NewPlant() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { plants, savePlant } = useStore();
  const { isAdmin, checking } = useAdmin();
  const existing = plants.find(plant => plant.id === id);

  const [name, setName] = useState('');
  const [scientific, setScientific] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [light, setLight] = useState('');
  const [water, setWater] = useState('');
  const [category, setCategory] = useState('Flores');
  const [image, setImage] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!existing) return;

    setName(existing.name);
    setScientific(existing.scientificName);
    setPrice(String(existing.price).replace('.', ','));
    setDescription(existing.description);
    setLight(existing.light);
    setWater(existing.water);
    setCategory(existing.category);
    setImage(existing.imageUrl);
  }, [existing?.id]);

  const locked = busy || imageBusy;
  const preview = image
    ? { uri: image }
    : existing
      ? getPlantImage(existing)
      : undefined;

  async function pickImage() {
    if (!isAdmin || locked) return;

    setError('');
    setImageBusy(true);

    try {
      if (Platform.OS !== 'web') {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          setError('Permita o acesso à galeria para selecionar uma foto.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      if (!asset) {
        throw new Error('Não foi possível abrir a foto.');
      }

      // Reduz a imagem inteira, preservando as proporções.
      const attempts = [
        { maxSize: 1000, compression: 0.65 },
        { maxSize: 720, compression: 0.5 },
        { maxSize: 480, compression: 0.35 },
      ];

      for (const attempt of attempts) {
        const context = ImageManipulator.manipulate(asset.uri);
        const longestSide = Math.max(asset.width, asset.height);
        const targetSize = Math.min(attempt.maxSize, longestSide);

        if (longestSide > targetSize) {
          context.resize(
            asset.width >= asset.height
              ? { width: targetSize }
              : { height: targetSize }
          );
        }

        const rendered = await context.renderAsync();

        const processed = await rendered.saveAsync({
          format: SaveFormat.JPEG,
          compress: attempt.compression,
          base64: true,
        });

        if (!processed.base64) {
          throw new Error('Não foi possível preparar a foto.');
        }

        const dataUrl = `data:image/jpeg;base64,${processed.base64}`;

        if (dataUrl.length <= MAX_IMAGE_LENGTH) {
          setImage(dataUrl);
          return;
        }
      }

      setError('A foto ainda ficou muito grande. Escolha outra imagem.');
    } catch {
      setError(
        'Não foi possível preparar essa imagem. Tente uma foto JPG ou PNG.'
      );
    } finally {
      setImageBusy(false);
    }
  }

  async function submit() {
    if (locked) return;

    setError('');

    if (!isAdmin) {
      setError('Entre com a conta de administrador para salvar.');
      return;
    }

    if (id && !existing) {
      setError('O produto que você está editando não está disponível.');
      return;
    }

    const parsedPrice = Number(price.trim().replace(',', '.'));

    if (name.trim().length < 2) {
      setError('Informe um nome com pelo menos 2 caracteres.');
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError('Informe um preço válido maior que zero.');
      return;
    }

    if (description.trim().length < 10) {
      setError('A descrição precisa ter pelo menos 10 caracteres.');
      return;
    }

    if (!scientific.trim()) {
      setError('Informe o nome científico ou escreva “A confirmar”.');
      return;
    }

    if (!light.trim() || !water.trim()) {
      setError('Preencha as orientações de iluminação e rega.');
      return;
    }

    if (!categories.includes(category)) {
      setError('Selecione uma categoria válida.');
      return;
    }

    if (
      image &&
      !image.startsWith('data:image/jpeg;base64,') &&
      !image.startsWith('https://')
    ) {
      setError('Selecione novamente a foto para poder compartilhá-la.');
      return;
    }

    if (image && image.length > MAX_IMAGE_LENGTH) {
      setError('Selecione novamente a foto para reduzir o tamanho.');
      return;
    }

    setBusy(true);

    try {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const plant: Plant = {
        id: existing?.id || `${slug || 'produto'}-${Date.now()}`,
        name: name.trim(),
        scientificName: scientific.trim(),
        category,
        price: Math.round(parsedPrice * 100) / 100,
        description: description.trim(),
        light: light.trim(),
        water: water.trim(),
        emoji: existing?.emoji || '🌷',
        featured: existing?.featured || false,
        ...(image ? { imageUrl: image } : {}),
      };

      await savePlant(plant);
      router.replace(`/plant/${plant.id}`);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Não foi possível salvar. Verifique a conexão.'
      );
    } finally {
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <View style={[styles.page, styles.body]}>
        <Text style={styles.intro}>Verificando acesso...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={[styles.page, styles.body]}>
        <Text style={styles.intro}>
          Entre na aba Perfil com a conta de administrador para gerenciar
          produtos.
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => router.replace('/(tabs)/profile')}
        >
          <Text style={styles.buttonText}>Ir para o perfil</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.body}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.intro}>
        {existing
          ? 'Atualize as informações do produto.'
          : 'Adicione uma nova flor ou planta ao catálogo.'}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Escolher foto da galeria"
        style={styles.photo}
        onPress={pickImage}
        disabled={locked}
      >
        {preview ? (
          <Image
            source={preview}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.camera}>📷</Text>
            <Text style={styles.photoText}>Escolher foto da galeria</Text>
          </View>
        )}
      </Pressable>

      <Text style={styles.hint}>
        {imageBusy
          ? 'Preparando foto...'
          : 'Toque na imagem para escolher ou trocar a foto.'}
      </Text>

      <Text style={styles.label}>NOME DO PRODUTO *</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Ex.: Orquídea rosa"
        maxLength={100}
        editable={!locked}
      />

      <Text style={styles.label}>NOME CIENTÍFICO *</Text>
      <TextInput
        value={scientific}
        onChangeText={setScientific}
        style={styles.input}
        placeholder="Nome científico ou A confirmar"
        maxLength={150}
        editable={!locked}
      />

      <Text style={styles.label}>PREÇO (R$) *</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="decimal-pad"
        placeholder="89,90"
        maxLength={12}
        editable={!locked}
      />

      <Text style={styles.label}>CATEGORIA *</Text>
      <View style={styles.chips}>
        {categories.map(item => (
          <Pressable
            key={item}
            disabled={locked}
            onPress={() => setCategory(item)}
            style={[
              styles.chip,
              category === item && styles.selected,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                category === item && styles.selectedText,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>DESCRIÇÃO *</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.multiline]}
        multiline
        placeholder="Descreva o produto..."
        maxLength={2000}
        editable={!locked}
      />

      <Text style={styles.label}>ILUMINAÇÃO *</Text>
      <TextInput
        value={light}
        onChangeText={setLight}
        style={styles.input}
        placeholder="Ex.: Luz indireta"
        maxLength={500}
        editable={!locked}
      />

      <Text style={styles.label}>REGA OU CONSERVAÇÃO *</Text>
      <TextInput
        value={water}
        onChangeText={setWater}
        style={styles.input}
        placeholder="Informe os cuidados adequados"
        maxLength={500}
        editable={!locked}
      />

      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}

      <Pressable
        style={[styles.button, locked && styles.disabled]}
        onPress={submit}
        disabled={locked}
      >
        <Text style={styles.buttonText}>
          {imageBusy
            ? 'Preparando foto...'
            : busy
              ? 'Salvando...'
              : existing
                ? 'Salvar alterações'
                : 'Cadastrar produto'}
        </Text>
      </Pressable>

      <Text style={styles.hint}>
        A foto será reduzida e salva com o produto para aparecer nos outros
        aparelhos. Selecionar uma foto é opcional.
      </Text>
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
    paddingBottom: 35,
  },
  intro: {
    color: colors.muted,
    marginBottom: 16,
  },
  photo: {
    height: 240,
    backgroundColor: colors.sage,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  camera: {
    fontSize: 34,
  },
  photoText: {
    color: colors.forest,
    fontWeight: '700',
    marginTop: 6,
  },
  label: {
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '800',
    color: colors.forest,
    marginBottom: 7,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.paper,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.ink,
    fontSize: 14,
  },
  multiline: {
    height: 95,
    textAlignVertical: 'top',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  chip: {
    backgroundColor: colors.paper,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  selected: {
    backgroundColor: colors.forest,
    borderColor: colors.forest,
  },
  chipText: {
    color: colors.ink,
    fontSize: 12,
  },
  selectedText: {
    color: colors.paper,
  },
  error: {
    color: colors.danger,
    marginTop: 12,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.forest,
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginTop: 19,
  },
  buttonText: {
    color: colors.paper,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.6,
  },
  hint: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
    marginBottom: 5,
  },
});