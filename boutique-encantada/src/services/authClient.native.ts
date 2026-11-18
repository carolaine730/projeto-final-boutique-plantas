import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';

type NativeAuthModule = typeof FirebaseAuth & {
  getReactNativePersistence: (
    storage: typeof AsyncStorage
  ) => FirebaseAuth.Persistence;
};

const nativeAuth = FirebaseAuth as NativeAuthModule;

export function createAuthClient(app: FirebaseApp) {
  if (typeof nativeAuth.getReactNativePersistence !== 'function') {
    throw new Error(
      'A persistência do Firebase não está disponível nesta plataforma.'
    );
  }

  try {
    return FirebaseAuth.initializeAuth(app, {
      persistence: nativeAuth.getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'auth/already-initialized'
    ) {
      return FirebaseAuth.getAuth(app);
    }

    throw error;
  }
}