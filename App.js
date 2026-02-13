import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const PRAYER_CONFIG = {
  Sabah: {
    key: 'Fajr',
    message: 'Namaz uykudan daha hayırlıdır!',
  },
  'Öğle': {
    key: 'Dhuhr',
    message:
      'Bir kimse öğle namazının farzından önce dört, farzından sonra da dört rekat sünneti devamlı olarak kılarsa, Allah Teâlâ onu cehenneme haram kılar.',
  },
  'İkindi': {
    key: 'Asr',
    message: 'Güneş doğmadan ve batmadan önce namaz kılan bir kimse cehenneme girmeyecektir.',
  },
  'Akşam': {
    key: 'Maghrib',
    message: 'Ümmetim akşam namazını yıldız doğmadan önce kıldıkları sürece fıtrat üzere yaşamaya devam ederler.',
  },
  'Yatsı': {
    key: 'Isha',
    message: 'Yatsı namazını cemaatle kılan kimse, gece yarısına kadar namaz kılmış gibidir.',
  },
};

const normalizeHm = (value) => {
  const match = String(value || '').match(/(\d{1,2}:\d{2})/);
  if (!match) return null;
  const [h, m] = match[1].split(':');
  return `${String(h).padStart(2, '0')}:${m}`;
};

const toDateForToday = (hm) => {
  if (!hm) return null;
  const [h, m] = hm.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date;
};

export default function App() {
  const [city, setCity] = useState('Istanbul');
  const [district, setDistrict] = useState('Kadikoy');
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState('unknown');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [lastSync, setLastSync] = useState('');
  const [lastSyncDateKey, setLastSyncDateKey] = useState('');
  const [status, setStatus] = useState('Konum girip vakitleri yükleyin.');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'local');

  const appStateRef = useRef(AppState.currentState);
  const hasShownPermissionAlertRef = useRef(false);
  const isSchedulingRef = useRef(false);

  const requestNotificationPermission = useCallback(async () => {
    const settings = await Notifications.getPermissionsAsync();
    let current = settings.status;

    if (current !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      current = req.status;
    }

    setPermission(current);

    if (current !== 'granted' && !hasShownPermissionAlertRef.current) {
      hasShownPermissionAlertRef.current = true;
      Alert.alert('Bildirim Kapalı', 'Namaz hatırlatmaları için bildirim izni vermeniz gerekir.');
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('prayer-reminders', {
        name: 'Namaz Hatırlatmaları',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 200, 150, 200],
        sound: 'default',
      });
    }

    return current;
  }, []);

  const fetchPrayerTimes = useCallback(async () => {
    if (!city.trim() || !district.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen il ve ilçe bilgisi girin.');
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const address = `${district.trim()},${city.trim()},Turkey`;
      const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
      const url = `https://api.aladhan.com/v1/timingsByAddress/${date}?address=${encodeURIComponent(address)}&method=13`;

      const res = await fetch(url);
      const data = await res.json();

      if (data?.code !== 200) {
        throw new Error('Vakit bilgisi alınamadı.');
      }

      const timings = data?.data?.timings || {};
      const requiredKeys = Object.values(PRAYER_CONFIG).map((item) => item.key);
      const missing = requiredKeys.filter((key) => !normalizeHm(timings[key]));
      if (missing.length > 0) {
        throw new Error(`Eksik vakit verisi: ${missing.join(', ')}`);
      }

      setPrayerTimes(timings);
      const nowLocal = new Date();
      setLastSync(nowLocal.toLocaleString('tr-TR'));
      setLastSyncDateKey(nowLocal.toDateString());
      setStatus('Vakitler alındı. Bildirimler planlanıyor...');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Vakitler alınamadı.';
      setStatus(`Vakitler alınamadı: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [city, district]);

  const schedulePrayerNotifications = useCallback(async () => {
    if (!prayerTimes || isSchedulingRef.current) return;

    isSchedulingRef.current = true;
    try {
      const perm = await requestNotificationPermission();
      if (perm !== 'granted') return;

      await Notifications.cancelAllScheduledNotificationsAsync();

      const now = new Date();
      let scheduledCount = 0;

      for (const [name, config] of Object.entries(PRAYER_CONFIG)) {
        const raw = prayerTimes[config.key];
        const hm = normalizeHm(raw);
        const prayerDate = toDateForToday(hm);
        if (!prayerDate) continue;

        const preDate = new Date(prayerDate.getTime() - 5 * 60 * 1000);

        if (preDate > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${name} Namazı Yaklaşıyor`,
              body: '5 dakika sonra namaz vakti girecek.',
              sound: 'default',
            },
            trigger: {
              date: preDate,
              channelId: 'prayer-reminders',
            },
          });
          scheduledCount += 1;
        }

        if (prayerDate > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${name} Namazı Vakti 🕌`,
              body: config.message,
              sound: 'default',
            },
            trigger: {
              date: prayerDate,
              channelId: 'prayer-reminders',
            },
          });
          scheduledCount += 1;
        }
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Günün Hadisi 🌙',
          body: 'Günün hadisini okumayı unutmayın.',
          sound: 'default',
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
          channelId: 'prayer-reminders',
        },
      });
      scheduledCount += 1;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Günün Ayeti 🌿',
          body: 'Günün ayetini tefekkür etmeyi unutmayın.',
          sound: 'default',
        },
        trigger: {
          hour: 18,
          minute: 0,
          repeats: true,
          channelId: 'prayer-reminders',
        },
      });
      scheduledCount += 1;

      setStatus(`Bildirimler planlandı: ${scheduledCount} adet (5 vakit + 09:00 hadis + 18:00 ayet).`);
    } finally {
      isSchedulingRef.current = false;
    }
  }, [prayerTimes, requestNotificationPermission]);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  useEffect(() => {
    schedulePrayerNotifications();
  }, [schedulePrayerNotifications]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async (next) => {
      const wasBackground = /inactive|background/.test(appStateRef.current);
      appStateRef.current = next;
      if (wasBackground && next === 'active') {
        const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'local';
        if (currentTz !== timezone) {
          setTimezone(currentTz);
          setStatus('Saat dilimi değişti, bildirimler yeniden planlandı.');
          await schedulePrayerNotifications();
          return;
        }

        const today = new Date().toDateString();
        if (lastSyncDateKey !== today) {
          await fetchPrayerTimes();
        }
      }
    });

    return () => sub.remove();
  }, [fetchPrayerTimes, lastSyncDateKey, schedulePrayerNotifications, timezone]);

  const prayerRows = useMemo(() => {
    if (!prayerTimes) return [];
    return Object.entries(PRAYER_CONFIG).map(([label, cfg]) => ({
      label,
      time: normalizeHm(prayerTimes[cfg.key]) || '--:--',
    }));
  }, [prayerTimes]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Buğlem Mobil - Namaz Bildirimleri</Text>
        <Text style={styles.subtitle}>Web değil, mobil yerel bildirim akışı (Expo Notifications).</Text>

        <TextInput value={city} onChangeText={setCity} placeholder="İl (örn: Istanbul)" style={styles.input} />
        <TextInput value={district} onChangeText={setDistrict} placeholder="İlçe (örn: Kadikoy)" style={styles.input} />

        {loading ? <ActivityIndicator /> : <Button title="Vakitleri Yükle ve Bildirimleri Planla" onPress={fetchPrayerTimes} />}

        <View style={styles.card}>
          <Text style={styles.meta}>Bildirim izni: {permission}</Text>
          <Text style={styles.meta}>Saat dilimi: {timezone}</Text>
          <Text style={styles.meta}>Son senkron: {lastSync || '-'}</Text>
          <Text style={styles.status}>{status}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Bugünkü Vakitler</Text>
          {prayerRows.length === 0 ? (
            <Text style={styles.meta}>Henüz vakit yüklenmedi.</Text>
          ) : (
            prayerRows.map((row) => (
              <Text key={row.label} style={styles.row}>{`${row.label}: ${row.time}`}</Text>
            ))
          )}
        </View>

        <Text style={styles.note}>
          Not: DND / OS enerji politikaları bazı cihazlarda bildirimi geciktirebilir; uygulama açıldığında vakitler yeniden
          hesaplanıp bildirimler tekrar planlanır.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#10131a' },
  container: { padding: 18, gap: 12 },
  title: { color: '#f5d07f', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#d0d5e5', marginBottom: 8 },
  input: {
    backgroundColor: '#1b2030',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2c3552',
  },
  card: {
    backgroundColor: '#151b29',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#27314b',
  },
  meta: { color: '#c6cee3', marginBottom: 4 },
  section: { color: '#fff', fontWeight: '700', marginBottom: 8 },
  row: { color: '#f5f7ff', marginBottom: 4 },
  status: { color: '#9ee6a7', marginTop: 8 },
  note: { color: '#a5afc9', fontSize: 12, lineHeight: 18, marginTop: 4 },
});
