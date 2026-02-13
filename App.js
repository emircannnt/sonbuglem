import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function configureNativeNotifications() {
  const current = await Notifications.getPermissionsAsync();
  let status = current.status;

  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Genel Bildirimler',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200, 100, 200],
      lightColor: '#d4af37',
    });
  }

  return status === 'granted';
}

export default function App() {
  useEffect(() => {
    configureNativeNotifications().catch((err) => {
      console.warn('Bildirim yapılandırma hatası:', err);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>BUĞLEM</Text>
        <Text style={styles.subtitle}>Mobil sürüm başlatıldı (Android / iOS).</Text>
        <Text style={styles.body}>
          Uygulama artık WebView bağımlılığı olmadan native giriş ile çalışır.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0b0b0f',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#0b0b0f',
  },
  title: {
    color: '#d4af37',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  subtitle: {
    color: '#f5f5f5',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  body: {
    color: '#a0a0a0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
