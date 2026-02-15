import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

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

let notificationsModulePromise;
const getNotificationsModule = async () => {
  if (!notificationsModulePromise) {
    notificationsModulePromise = import('expo-notifications');
  }
  return notificationsModulePromise;
};

async function setupNotificationHandlerAndChannel(Notifications) {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (error) {
    console.error('Notification handler setup failed:', error);
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('prayer-reminders', {
      name: 'Namaz Hatırlatmaları',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200, 150, 200],
      sound: 'default',
    });
  }
}

async function requestPermission(Notifications) {
  try {
    const current = await Notifications.getPermissionsAsync();
    let status = current.status;
    if (status !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      status = req.status;
    }
    return status;
  } catch (error) {
    console.error('Permission flow failed:', error);
    return 'denied';
  }
}

async function scheduleNotificationSafe(Notifications, input) {
  try {
    await Notifications.scheduleNotificationAsync(input);
    return true;
  } catch (error) {
    console.error('Schedule failed:', error);
    return false;
  }
}

export default function App() {
  const [city, setCity] = useState('Istanbul');
  const [district, setDistrict] = useState('Kadikoy');
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState('unknown');
  const [status, setStatus] = useState('Hazır. Vakitleri yüklemek için butona basın.');
  const [prayerTimes, setPrayerTimes] = useState(null);

  const scheduleAllNotifications = useCallback(async (timings) => {
    const Notifications = await getNotificationsModule();

    await setupNotificationHandlerAndChannel(Notifications);

    const perm = await requestPermission(Notifications);
    setPermission(perm);
    if (perm !== 'granted') {
      Alert.alert('Bildirim Kapalı', 'Lütfen bildirim izni verin.');
      return 0;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    let count = 0;

    for (const [name, config] of Object.entries(PRAYER_CONFIG)) {
      const hm = normalizeHm(timings[config.key]);
      const prayerDate = toDateForToday(hm);
      if (!prayerDate) continue;

      const preDate = new Date(prayerDate.getTime() - 5 * 60 * 1000);

      if (preDate > now) {
        const ok = await scheduleNotificationSafe(Notifications, {
          content: {
            title: `${name} Namazı Yaklaşıyor`,
            body: '5 dakika sonra namaz vakti girecek.',
            sound: 'default',
            channelId: 'prayer-reminders',
          },
          trigger: preDate,
        });
        if (ok) count += 1;
      }

      if (prayerDate > now) {
        const ok = await scheduleNotificationSafe(Notifications, {
          content: {
            title: `${name} Namazı Vakti 🕌`,
            body: config.message,
            sound: 'default',
            channelId: 'prayer-reminders',
          },
          trigger: prayerDate,
        });
        if (ok) count += 1;
      }
    }

    const hadithOk = await scheduleNotificationSafe(Notifications, {
      content: {
        title: 'Günün Hadisi 🌙',
        body: 'Günün hadisini okumayı unutmayın.',
        sound: 'default',
        channelId: 'prayer-reminders',
      },
      trigger: { hour: 9, minute: 0, repeats: true },
    });
    if (hadithOk) count += 1;

    const ayahOk = await scheduleNotificationSafe(Notifications, {
      content: {
        title: 'Günün Ayeti 🌿',
        body: 'Günün ayetini tefekkür etmeyi unutmayın.',
        sound: 'default',
        channelId: 'prayer-reminders',
      },
      trigger: { hour: 18, minute: 0, repeats: true },
    });
    if (ayahOk) count += 1;

    return count;
  }, []);

  const fetchPrayerTimesAndSchedule = useCallback(async () => {
    if (!city.trim() || !district.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen il ve ilçe bilgisi girin.');
      return;
    }

    setLoading(true);
    setStatus('Vakitler alınıyor...');

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
      const required = Object.values(PRAYER_CONFIG).map((item) => item.key);
      const missing = required.filter((key) => !normalizeHm(timings[key]));
      if (missing.length > 0) {
        throw new Error(`Eksik vakit verisi: ${missing.join(', ')}`);
      }

      setPrayerTimes(timings);
      setStatus('Bildirimler planlanıyor...');

      const scheduled = await scheduleAllNotifications(timings);
      setStatus(`Tamamlandı. Planlanan bildirim sayısı: ${scheduled}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setStatus(`Hata: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [city, district, scheduleAllNotifications]);

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
        <Text style={styles.title}>Buğlem - Mobil Namaz Bildirimleri</Text>
        <Text style={styles.subtitle}>Stabil sürüm: açılışta ağır native çağrı yok.</Text>

        <TextInput value={city} onChangeText={setCity} placeholder="İl (örn: Istanbul)" style={styles.input} />
        <TextInput value={district} onChangeText={setDistrict} placeholder="İlçe (örn: Kadikoy)" style={styles.input} />

        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Vakitleri Yükle ve Bildirimleri Kur" onPress={fetchPrayerTimesAndSchedule} />
        )}

        <View style={styles.card}>
          <Text style={styles.meta}>Bildirim izni: {permission}</Text>
          <Text style={styles.status}>{status}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Bugünkü Vakitler</Text>
          {prayerRows.length === 0 ? (
            <Text style={styles.meta}>Henüz yüklenmedi.</Text>
          ) : (
            prayerRows.map((row) => (
              <Text key={row.label} style={styles.row}>{`${row.label}: ${row.time}`}</Text>
            ))
          )}
        </View>
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
});
