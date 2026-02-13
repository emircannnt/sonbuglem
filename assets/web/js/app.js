const state = {
    user: { name: '', registered: false },
    settings: { sound: true, vibration: true, notifications: true },
    location: { city: '', district: '', type: 'manual' },
    prayerTimes: { fajr: '--', dhuhr: '--', asr: '--', maghrib: '--', isha: '--' },
    zikir: { count: 0, current: 'subhanallah', mode: 'infinite', target: 0 },
    daily: { date: '' },
    sadaka: { remaining: 3, totalGiven: 0, todayGiven: 0, selectedFoundation: 'tsk' },
    stats: { totalZikir: 0, streak: 1 },
    zikirStats: {} // Map zikirId -> totalCount
};

// --- INIT ---
window.onload = function () {
    loadState();

    // Global Elements
    window.locationModal = document.getElementById('locationModal');
    window.zikirSelectModal = document.getElementById('zikirSelectionModal');
    window.zikirOverlay = document.getElementById('zikirModalOverlay');

    try { populateCities(); } catch (e) { console.error("City init error:", e); }
    try { initZikirOptions(); } catch (e) { console.error("Zikir init error:", e); }

    if (state.user.registered) {
        showApp();
        try { checkDailyContent(); } catch (e) { console.error("Daily content error:", e); }

        if (state.location.city) fetchPrayerTimes();
        else openLocationModal();

        // Load Quran if needed (lazy load when tab clicked is better, but init here ok)
        if (window.quranReader) {
            try { window.quranReader.init(); } catch (e) { console.error("Quran init error:", e); }
        }

        startNotificationScheduler();
    }
};

// --- NAVIGATION ---
function navigateTo(pageId, btn) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Show target
    document.getElementById(`page-${pageId}`).classList.add('active');

    // Update Nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // Special Init
    if (pageId === 'zikir') initTasbihBeads();
    if (pageId === 'sadaka') initSadakaPage();
}

function navigateToLibrary(section) {
    document.getElementById('page-library').classList.remove('active');
    if (section === 'quran') {
        document.getElementById('page-quran-reader').classList.add('active');
        if (!window.quranReader.quranXml) window.quranReader.init().then(() => window.quranReader.render('quran-container'));
        else window.quranReader.render('quran-container');
    } else if (section === 'stories') {
        document.getElementById('page-stories').classList.add('active');
        renderStoriesList();
    } else if (section === 'prayers') {
        document.getElementById('page-prayers').classList.add('active');
        renderPrayersList();
    }
}

// --- PRAYERS ---
function renderPrayersList() {
    const container = document.getElementById('prayers-list-container');
    container.innerHTML = '';

    if (window.prayersList) {
        window.prayersList.forEach(prayer => {
            const el = document.createElement('div');
            el.className = 'story-item'; // Reuse story-item style for consistency
            el.onclick = () => showPrayerDetail(prayer);
            el.innerHTML = `
                <div class="story-title" style="font-size: 14px;">${prayer.title}</div>
                <div class="story-arrow">→</div>
            `;
            container.appendChild(el);
        });
    }
}

function showPrayerDetail(prayer) {
    document.getElementById('page-prayers').classList.remove('active');
    const detailPage = document.getElementById('page-prayer-detail');
    detailPage.classList.add('active');

    document.getElementById('prayer-detail-title').textContent = prayer.title;
    document.getElementById('prayer-arabic').textContent = prayer.arabic;
    document.getElementById('prayer-latin').textContent = prayer.latin;
    document.getElementById('prayer-translation').textContent = prayer.translation;
    document.getElementById('prayer-source').textContent = `Kaynak: ${prayer.source || '-'}`;
}

function closePrayerDetail() {
    document.getElementById('page-prayer-detail').classList.remove('active');
    document.getElementById('page-prayers').classList.add('active');
}

function copyPrayer() {
    const arabic = document.getElementById('prayer-arabic').textContent;
    const translation = document.getElementById('prayer-translation').textContent;
    navigator.clipboard.writeText(`${arabic}\n\n${translation}`);
    showToast("Dua Kopyalandı!");
}

function backToLibrary() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-library').classList.add('active');
}

// --- STATE MANAGEMENT ---
function saveState() {
    localStorage.setItem('buglemData', JSON.stringify(state));
}
function loadState() {
    const d = localStorage.getItem('buglemData');
    if (d) Object.assign(state, JSON.parse(d));
}

// --- ONBOARDING ---
function completeOnboarding() {
    const nameInput = document.getElementById('userNameInput');
    const name = nameInput.value.trim();
    if (!name) { showToast('Lütfen adınızı girin'); return; }

    state.user.name = name;
    state.user.registered = true;
    saveState();

    document.getElementById('permissionModal').classList.add('active');
}

function requestPermissions() {
    document.getElementById('permissionModal').classList.remove('active');
    // Request Notification permission
    if ('Notification' in window) {
        Notification.requestPermission().then(p => {
            state.settings.notifications = (p === 'granted');
            showApp();
            openLocationModal();
        });
    } else {
        showApp();
        openLocationModal();
    }
}

function showApp() {
    document.getElementById('onboarding').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    document.getElementById('profileName').textContent = state.user.name;
    // document.getElementById('profileAvatar').textContent = state.user.name.charAt(0).toUpperCase();
    updateStats();
}

// --- LOCATION & PRAYER ---
function populateCities() {
    const select = document.getElementById('citySelect');
    select.innerHTML = '<option value="">İl Seçiniz</option>';
    Object.keys(turkeyLocations).sort().forEach(city => {
        const opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city;
        select.appendChild(opt);
    });
}

function populateDistricts() {
    const city = document.getElementById('citySelect').value;
    const select = document.getElementById('districtSelect');
    select.innerHTML = '<option value="">İlçe Seçiniz</option>';
    select.disabled = true;
    if (city && turkeyLocations[city]) {
        select.disabled = false;
        turkeyLocations[city].forEach(d => {
            const opt = document.createElement('option');
            opt.value = d;
            opt.textContent = d;
            select.appendChild(opt);
        });
    }
}

function openLocationModal() {
    window.locationModal.classList.add('active');
}

function saveManualLocation() {
    const city = document.getElementById('citySelect').value;
    const district = document.getElementById('districtSelect').value;
    if (!city || !district) { showToast("Lütfen İl ve İlçe seçiniz."); return; }

    state.location.city = city;
    state.location.district = district;
    saveState();

    window.locationModal.classList.remove('active');

    // START APP FOR NEW USER
    showApp();
    checkDailyContent();
    fetchPrayerTimes();
    startNotificationScheduler();

    // Also init Quran if needed
    if (window.quranReader) {
        try { window.quranReader.init(); } catch (e) { console.error("Quran init error:", e); }
    }
}

async function fetchPrayerTimes() {
    const date = new Date();
    const address = `${state.location.district},${state.location.city},Turkey`;
    // Using Aladhan API
    const url = `https://api.aladhan.com/v1/timingsByAddress/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?address=${encodeURIComponent(address)}&method=13`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.code === 200) {
            const t = data.data.timings;
            state.prayerTimes = { fajr: t.Fajr, dhuhr: t.Dhuhr, asr: t.Asr, maghrib: t.Maghrib, isha: t.Isha };
            saveState();
            renderPrayerTimes();
        }
    } catch (e) { console.error(e); showToast("Vakitler alınamadı."); }
}

function renderPrayerTimes() {
    const t = state.prayerTimes;
    document.getElementById('prayerTimesList').innerHTML = `
        <div class="prayer-item-mini"><div class="prayer-icon-mini">🌙</div><div class="prayer-name-mini">İmsak</div><div class="prayer-time-mini">${t.fajr}</div></div>
        <div class="prayer-item-mini"><div class="prayer-icon-mini">☀️</div><div class="prayer-name-mini">Öğle</div><div class="prayer-time-mini">${t.dhuhr}</div></div>
        <div class="prayer-item-mini"><div class="prayer-icon-mini">🌤</div><div class="prayer-name-mini">İkindi</div><div class="prayer-time-mini">${t.asr}</div></div>
        <div class="prayer-item-mini"><div class="prayer-icon-mini">🌅</div><div class="prayer-name-mini">Akşam</div><div class="prayer-time-mini">${t.maghrib}</div></div>
        <div class="prayer-item-mini"><div class="prayer-icon-mini">🌃</div><div class="prayer-name-mini">Yatsı</div><div class="prayer-time-mini">${t.isha}</div></div>
    `;
    document.getElementById('locationName').textContent = state.location.district || "Konum Seç";
}

// --- DAILY CONTENT & MOOD ---

function getAdjustedDate() {
    const now = new Date();
    // Refresh at 03:00 AM
    if (now.getHours() < 3) {
        now.setDate(now.getDate() - 1);
    }
    return now.toDateString();
}

function checkDailyContent() {
    const today = getAdjustedDate();

    if (!window.dailyContentDB) {
        console.error("Daily content DB missing");
        const el = document.getElementById('dailyAyahTurkish');
        if (el) el.textContent = "Veri yüklenemedi. Lütfen sayfayı yenileyin.";
        return;
    }

    // Check if we need to rotate content
    // Also force rotate if content is missing or "Yükleniyor..."
    const currentAyahText = document.getElementById('dailyAyahTurkish').textContent;
    const forceUpdate = currentAyahText === "Yükleniyor..." || !state.daily.ayah || !state.daily.hadith;

    if (state.daily.date !== today || forceUpdate) {
        state.daily.date = today;

        // Random Ayah
        if (dailyContentDB.ayahs && dailyContentDB.ayahs.length > 0) {
            state.daily.ayah = dailyContentDB.ayahs[Math.floor(Math.random() * dailyContentDB.ayahs.length)];
        }

        // Random Hadith
        if (window.hadithCollection && window.hadithCollection.length > 0) {
            const h = window.hadithCollection[Math.floor(Math.random() * window.hadithCollection.length)];
            state.daily.hadith = { text: h.text, source: h.source || "Hadis-i Şerif" };
        } else if (dailyContentDB.hadiths && dailyContentDB.hadiths.length > 0) {
            // Fallback to small DB
            state.daily.hadith = dailyContentDB.hadiths[Math.floor(Math.random() * dailyContentDB.hadiths.length)];
        }

        saveState();
    }

    // Render
    const a = state.daily.ayah || (dailyContentDB.ayahs ? dailyContentDB.ayahs[0] : { text: "Ayet bulunamadı", ref: "" });
    const h = state.daily.hadith || (dailyContentDB.hadiths ? dailyContentDB.hadiths[0] : { text: "Hadis bulunamadı", source: "" });

    document.getElementById('dailyAyahTurkish').textContent = a.text;
    document.getElementById('dailyAyahRef').textContent = a.ref;
    document.getElementById('dailyHadithText').textContent = h.text;
    document.getElementById('dailyHadithSource').textContent = h.source;
}

function selectMood(mood, btn) {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const ayahs = moodAyahs[mood];
    const randomAyah = ayahs[Math.floor(Math.random() * ayahs.length)];

    document.getElementById('moodAyah').textContent = randomAyah.text;
    document.getElementById('moodRef').textContent = randomAyah.ref;
    const res = document.getElementById('moodResult');
    res.classList.add('show');
    res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// --- ZIKIRMATIK ---
// Global bead positions state
let beadPositions = [];

function initTasbihBeads() {
    const chain = document.getElementById('tasbihChain');
    chain.innerHTML = '<div class="tasbih-string"></div>';

    // Initialize positions: -60, 0, 60, 120, 180
    beadPositions = [-60, 0, 60, 120, 180];

    for (let i = 0; i < 5; i++) {
        const bead = document.createElement('div');
        bead.className = 'tasbih-bead';
        bead.id = `bead-${i}`;
        if (i === 2) bead.classList.add('active'); // Center one
        bead.style.top = `${beadPositions[i]}px`;
        chain.appendChild(bead);
    }
    updateZikirDisplay();
    updateZikirSettingsUI();
}

function updateZikirDisplay() {
    document.getElementById('tasbihCount').textContent = state.zikir.count;

    // Safety check for zikirList
    let currentZikir = window.zikirList ? window.zikirList.find(z => z.id === state.zikir.current) : null;

    // Fallback if not found (e.g. data changed or load error)
    if (!currentZikir && window.zikirList && window.zikirList.length > 0) {
        currentZikir = window.zikirList[0];
        state.zikir.current = currentZikir.id;
        saveState();
    }

    document.getElementById('currentTasbihName').textContent = currentZikir ? currentZikir.name : 'Sübhanallah';

    // Update Specific Stats List
    const listContainer = document.getElementById('zikirStatsList');
    if (listContainer) {
        listContainer.innerHTML = '';
        if (state.zikirStats && Object.keys(state.zikirStats).length > 0) {
            Object.entries(state.zikirStats).forEach(([id, count]) => {
                if (count > 0) {
                    const z = window.zikirList ? window.zikirList.find(x => x.id === id) : null;
                    const name = z ? z.name : id;

                    const card = document.createElement('div');
                    card.className = 'zikir-stat-card';
                    card.innerHTML = `
                        <div class="zikir-stat-name">${name}</div>
                        <div class="zikir-stat-count">${count}</div>
                    `;
                    listContainer.appendChild(card);
                }
            });
        }
    }

    // Mode Active Class
    document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.remove('active');
        if (b.dataset.mode === state.zikir.mode) b.classList.add('active');
    });
}

function setZikirMode(mode) {
    state.zikir.mode = mode;
    state.zikir.count = 0; // Reset on mode change
    if (mode === '33') state.zikir.target = 33;
    else if (mode === '99') state.zikir.target = 99;
    else state.zikir.target = 0;

    updateZikirDisplay();
    saveState();
}

function pullBead() {
    // Check target
    if (state.zikir.mode !== 'infinite' && state.zikir.count >= state.zikir.target) {
        if (state.settings.vibration) navigator.vibrate([200, 100, 200]);
        showToast("Zikir Hedefi Tamamlandı");
        state.zikir.count = 0;
        updateZikirDisplay();
        saveState();
        return;
    }

    state.zikir.count++;
    state.stats.totalZikir++;

    // Track specific zikir count
    const currentId = state.zikir.current;
    if (!state.zikirStats) state.zikirStats = {};
    if (!state.zikirStats[currentId]) state.zikirStats[currentId] = 0;
    state.zikirStats[currentId]++;

    updateZikirDisplay();
    updateStats(); // Refresh profile stats
    saveState();

    // Animation Logic
    // Shift all down by 60
    beadPositions = beadPositions.map(p => p + 60);

    const beads = document.querySelectorAll('.tasbih-bead');
    beads.forEach((b, i) => {
        // Use transform instead of top for better performance, but top is fine for now if simple.
        // Let's stick to top as CSS is set up for it.
        b.style.transition = 'top 0.1s linear';
        b.style.top = `${beadPositions[i]}px`;
    });

    // Reset loop
    setTimeout(() => {
        beadPositions = beadPositions.map(p => {
            return p >= 240 ? -60 : p;
        });

        beads.forEach((b, i) => {
            if (parseInt(b.style.top) >= 240) {
                b.style.transition = 'none';
                b.style.top = `${beadPositions[i]}px`;
            }
            // Sync all just in case
            if (parseInt(b.style.top) !== beadPositions[i]) {
                b.style.transition = 'none';
                b.style.top = `${beadPositions[i]}px`;
            }
        });
    }, 100);

    if (state.settings.sound) playWoodClick();
    if (state.settings.vibration) navigator.vibrate(15);
}

function resetTasbih() {
    if (confirm("Sıfırlamak istiyor musunuz?")) {
        state.zikir.count = 0;
        updateZikirDisplay();
        saveState();
    }
}

// Simple Click Sound
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playWoodClick() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.05);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    osc.start(t);
    osc.stop(t + 0.05);
}

// --- STORIES ---
function renderStoriesList() {
    const container = document.getElementById('stories-list-container');
    container.innerHTML = '';

    window.storiesList.forEach(story => {
        const el = document.createElement('div');
        el.className = 'story-item';
        el.onclick = () => showStoryDetail(story);
        el.innerHTML = `
            <div class="story-title">${story.title}</div>
            <div class="story-arrow">→</div>
        `;
        container.appendChild(el);
    });
}

function showStoryDetail(story) {
    document.getElementById('page-stories').classList.remove('active');
    const detailPage = document.getElementById('page-story-detail');
    detailPage.classList.add('active');

    document.getElementById('detail-title').textContent = story.title;
    document.getElementById('detail-text').textContent = story.summary;
}

function closeStoryDetail() {
    document.getElementById('page-story-detail').classList.remove('active');
    document.getElementById('page-stories').classList.add('active');
}

// --- UTILS ---
function showToast(msg) {
    // Simple toast or alert
    const m = document.getElementById('notificationModal');
    document.getElementById('notifText').textContent = msg;
    document.getElementById('notifTitle').textContent = "Bilgi";
    m.classList.add('active');
    setTimeout(() => m.classList.remove('active'), 2000);
}

function closeNotification() {
    document.getElementById('notificationModal').classList.remove('active');
}

// Zikir Options
function initZikirOptions() {
    const container = document.getElementById('zikirOptions');
    window.zikirList.forEach(z => {
        const div = document.createElement('div');
        div.className = 'zikir-option';
        div.onclick = () => selectZikir(z.id);
        div.innerHTML = `<div><div class="zikir-option-name">${z.name}</div><div style="color: var(--text-muted); font-size: 12px;">${z.meaning}</div></div><div class="zikir-option-arabic">${z.arabic}</div>`;
        container.appendChild(div);
    });
}
function showZikirSelector() { window.zikirOverlay.classList.add('active'); window.zikirSelectModal.classList.add('active'); }
function closeZikirSelector() { window.zikirOverlay.classList.remove('active'); window.zikirSelectModal.classList.remove('active'); }
function selectZikir(id) {
    state.zikir.current = id;
    state.zikir.count = 0; // Reset? User choice. Let's keep it 0 for new zikir.
    updateZikirDisplay();
    closeZikirSelector();
    saveState();
}

function updateStats() {
    document.getElementById('totalZikir').textContent = state.stats.totalZikir || 0;
}

function copyContent(type) {
    const text = type === 'ayah' ? document.getElementById('dailyAyahTurkish').textContent : document.getElementById('dailyHadithText').textContent;
    navigator.clipboard.writeText(text);
    showToast("Kopyalandı!");
}

function toggleNotifications() {
    state.settings.notifications = !state.settings.notifications;
    const btn = document.getElementById('notifToggle');
    if (btn) btn.classList.toggle('active', state.settings.notifications);
    saveState();
}

function toggleSound() {
    state.settings.sound = !state.settings.sound;
    updateZikirSettingsUI();
    saveState();
}

function toggleVibration() {
    state.settings.vibration = !state.settings.vibration;
    updateZikirSettingsUI();
    saveState();
}

function updateZikirSettingsUI() {
    const sBtn = document.getElementById('soundToggle');
    const vBtn = document.getElementById('vibrationToggle');

    // Sound
    if (sBtn) {
        const isSoundOn = state.settings.sound;
        sBtn.classList.toggle('active', isSoundOn);
        sBtn.textContent = isSoundOn ? '🔊' : '🔇';
    }

    // Vibration
    if (vBtn) {
        const isVibOn = state.settings.vibration;
        vBtn.classList.toggle('active', isVibOn);
        vBtn.textContent = isVibOn ? '📳' : '🔕';
    }
}
function resetData() { if (confirm("Veriler sıfırlanacak?")) { localStorage.removeItem('buglemData'); location.reload(); } }

// --- NOTIFICATIONS & SHARING ---

function requestNotificationPermission() {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showToast("Bildirimler açıldı ✨");
            }
        });
    }
}

function startNotificationScheduler() {
    requestNotificationPermission();
    // Check every minute
    setInterval(checkNotifications, 60000);
    // Check immediately on load too
    checkNotifications();
}

function checkNotifications() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const dateStr = now.toDateString();

    // Check Verse (09:00)
    if (hour === 9 && minute >= 0 && minute < 5) { // 5 min window
        const last = localStorage.getItem('lastVerseNotif');
        if (last !== dateStr) {
            const verseEl = document.getElementById('dailyAyahTurkish');
            const verse = (state.daily.ayah && state.daily.ayah.text) || (verseEl ? verseEl.textContent : "Günün Ayeti");
            sendNotification('Günün Ayeti 🌿', verse);
            localStorage.setItem('lastVerseNotif', dateStr);
        }
    }

    // Check Hadith (18:00)
    if (hour === 18 && minute >= 0 && minute < 5) {
        const last = localStorage.getItem('lastHadithNotif');
        if (last !== dateStr) {
            const hadithEl = document.getElementById('dailyHadithText');
            const hadith = (state.daily.hadith && state.daily.hadith.text) || (hadithEl ? hadithEl.textContent : "Günün Hadisi");
            sendNotification('Akşamın Hadisi 🌙', hadith);
            localStorage.setItem('lastHadithNotif', dateStr);
        }
    }

    // Check Prayer Times
    if (state.prayerTimes) {
        const currentHm = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const prayers = {
            'Sabah': state.prayerTimes.fajr,
            'Öğle': state.prayerTimes.dhuhr,
            'İkindi': state.prayerTimes.asr,
            'Akşam': state.prayerTimes.maghrib,
            'Yatsı': state.prayerTimes.isha
        };

        // Unique key for THIS prayer time today
        const lastPrayerKey = `lastPrayerNotif_${dateStr}_${currentHm}`;

        // Only check if we haven't sent ANY prayer notification this minute to avoid duplicates if loop runs fast
        // But loop runs generally once a minute. We need to check if we already notified for THIS time.

        for (const [name, time] of Object.entries(prayers)) {
            if (time === currentHm) {
                if (!localStorage.getItem(lastPrayerKey)) {
                    sendNotification(`${name} Vakti Girdi 🕌`, "Haydi felaha! Namaz vakti girdi.");
                    localStorage.setItem(lastPrayerKey, 'sent');
                }
            }
        }
    }
}

function sendNotification(title, body) {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(title, {
                body: body,
                icon: 'logo.png',
                vibrate: [200, 100, 200],
                badge: 'logo.png',
                data: { url: window.location.href }
            });
        });
    } else {
        new Notification(title, {
            body: body,
            icon: 'logo.png'
        });
    }
}

// --- SHARING ---
let currentShareContent = '';
let currentShareUrl = '';

function shareContent(type) {
    const modal = document.getElementById('shareModal');
    const titleEl = document.getElementById('shareTitle');
    const iconEl = document.getElementById('shareIcon');
    const bodyEl = document.getElementById('shareBody');
    const shareBody = document.getElementById('shareBody');

    // Reset styles just in case
    shareBody.innerHTML = 'Loading...';

    if (type === 'ayah') {
        titleEl.textContent = 'GÜNÜN AYETİ';
        iconEl.textContent = '🌿';
        const text = document.getElementById('dailyAyahTurkish').textContent;
        const ref = document.getElementById('dailyAyahRef').textContent;

        bodyEl.innerHTML = `"${text}"<br><br><span style="font-size:14px; color:var(--gold-primary)">${ref}</span>`;

        currentShareContent = `${titleEl.textContent}\n\n"${text}"\n${ref}`;
        currentShareUrl = window.location.href; // Could be a deep link if supported
    } else if (type === 'hadith') {
        titleEl.textContent = 'AKŞAMIN HADİSİ'; // Changed title as per request "Akşamın Hadisi" for notification, but card says "Günün Hadisi". Let's stick to consistent UI title. UI says "Günün Hadisi". Notification says "Akşamın Hadisi". Let's use UI title here.
        // Actually user prompt said: Notification Title: 'Akşamın Hadisi'. But for share card, let's keep it 'GÜNÜN HADİSİ' or 'AKŞAMIN HADİSİ' per context. User sees 'GÜNÜN HADİSİ' in the card. Let's use 'GÜNÜN HADİSİ' for share card title to match UI.
        titleEl.textContent = 'GÜNÜN HADİSİ';
        iconEl.textContent = '🌙';
        const text = document.getElementById('dailyHadithText').textContent;
        const source = document.getElementById('dailyHadithSource').textContent;

        bodyEl.innerHTML = `"${text}"<br><br><span style="font-size:14px; color:var(--gold-primary)">${source}</span>`;

        currentShareContent = `${titleEl.textContent}\n\n"${text}"\n${source}`;
        currentShareUrl = window.location.href;
    }

    modal.classList.add('active'); // active class needs to be defined for modal visibility in CSS? 
    // Wait, I defined .share-card-container styles but I didn't verify if .modal-overlay has .active functionality in style.css.
    // Usually modal-overlay has display:none and .active makes it flex/block.
    // existing settings logic uses .active. Let's assume standard modal logic exists.
    document.getElementById('shareModal').style.display = 'flex';
}

function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
    document.getElementById('shareModal').classList.remove('active');
}

function performShare() {
    const card = document.getElementById('shareCardContent');
    const btn = document.querySelector('#shareModal .btn-primary');
    const logoImg = document.querySelector('.share-logo img');
    const originalText = btn.innerText;

    // Use embedded base64 logo to avoid Tainted Canvas error on file:// protocol
    if (typeof LOGO_BASE64 !== 'undefined' && logoImg) {
        logoImg.src = LOGO_BASE64;
    }

    btn.innerText = 'Fotoğraf Oluşturuluyor...';
    btn.disabled = true;

    // Wait a bit for images/fonts 
    setTimeout(() => {
        html2canvas(card, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null
        }).then(canvas => {
            canvas.toBlob(blob => {
                if (!blob) {
                    throw new Error('Canvas conversion failed');
                }
                const file = new File([blob], 'buglem_share.png', { type: 'image/png' });
                const shareData = {
                    files: [file],
                    title: 'BUĞLEM',
                    text: 'BUĞLEM Uygulaması'
                };

                if (navigator.canShare && navigator.canShare(shareData)) {
                    navigator.share(shareData)
                        .then(() => {
                            showToast('Başarıyla Paylaşıldı ✨');
                            closeShareModal();
                        })
                        .catch((error) => {
                            console.log('Error sharing', error);
                            fallbackDownload(canvas);
                        });
                } else {
                    fallbackDownload(canvas);
                }

                btn.innerText = originalText;
                btn.disabled = false;
            }, 'image/png');
        }).catch(err => {
            console.error(err);
            btn.innerText = originalText;
            btn.disabled = false;
            showToast('Hata: Görsel oluşturulamadı. Lütfen tekrar dene.');
        });
    }, 500);
}

function fallbackDownload(canvas) {
    const link = document.createElement('a');
    link.download = 'buglem_paylas.png';
    link.href = canvas.toDataURL();
    link.click();
    showToast('Görsel indirildi 📥 Hikayende paylaşabilirsin!');
    closeShareModal();
}
