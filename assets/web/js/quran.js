const turkishSurahNames = [
    "Fatiha", "Bakara", "Ali İmran", "Nisa", "Maide", "En'am", "A'raf", "Enfal", "Tevbe", "Yunus",
    "Hud", "Yusuf", "Ra'd", "İbrahim", "Hicr", "Nahl", "İsra", "Kehf", "Meryem", "Taha",
    "Enbiya", "Hac", "Mü'minun", "Nur", "Furkan", "Şuara", "Neml", "Kasas", "Ankebut", "Rum",
    "Lokman", "Secde", "Ahzab", "Sebe", "Fatır", "Yasin", "Saffat", "Sad", "Zümer", "Mü'min",
    "Fussilet", "Şura", "Zuhruf", "Duhan", "Casiye", "Ahkaf", "Muhammed", "Fetih", "Hucurat", "Kaf",
    "Zariyat", "Tur", "Necm", "Kamer", "Rahman", "Vakıa", "Hadid", "Mücadele", "Haşr", "Mümtehine", "Saf",
    "Cuma", "Münafikun", "Teğabun", "Talak", "Tahrim", "Mülk", "Kalem", "Hakka", "Mearic", "Nuh",
    "Cin", "Müzzemmil", "Müddessir", "Kıyamet", "İnsan", "Mürselat", "Nebe", "Naziat", "Abese", "Tekvir",
    "İnfitar", "Mutaffifin", "İnşikak", "Buruç", "Tarık", "A'la", "Gaşiye", "Fecr", "Beled", "Şems",
    "Leyl", "Duha", "İnşirah", "Tin", "Alak", "Kadir", "Beyyine", "Zilzal", "Adiyat", "Karia",
    "Tekasür", "Asr", "Hümeze", "Fil", "Kureyş", "Maun", "Kevser", "Kafirun", "Nasr", "Tebbet",
    "İhlas", "Felak", "Nas"
];

class QuranReader {
    constructor() {
        this.currentSurah = 1;
        this.currentAyah = 1;
        this.surahList = [];
    }

    async init() {
        // Data is loaded via script tag in index.html as window.quranData
        if (typeof window.quranData !== 'undefined') {
            console.log("Quran data loaded from JS file.");
            this.parseSurahList();
            return true;
        } else {
            console.error("Quran data not found. Make sure quran-data.js is loaded.");
            return false;
        }
    }

    // kept for compatibility if called, but does nothing
    async loadXML(filename, type) { }

    parseSurahList() {
        if (!window.quranData) return;
        this.surahList = window.quranData.map((s, i) => ({
            index: s.id,
            name: s.name,
            nameTr: turkishSurahNames[i] || s.name, // Add Turkish name
            ayas: s.ayahs.length
        }));
    }

    getAyah(surahIndex, ayahIndex) {
        if (!window.quranData) return null;

        const surah = window.quranData.find(s => s.id == surahIndex);
        if (!surah) return null;

        const ayah = surah.ayahs.find(a => a.i == ayahIndex);
        if (!ayah) return null;

        return {
            surah: surahIndex,
            ayah: ayahIndex,
            arabic: ayah.a,
            translation: ayah.t
        };
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        if (!window.quranData) {
            container.innerHTML = `
                <div style="text-align:center; padding:20px; color:var(--text-muted);">
                    <div style="font-size:40px; margin-bottom:10px;">⚠️</div>
                    <div>Kuran verisi yüklenemedi.</div>
                    <div style="font-size:12px; margin-top:10px;">Veri dosyası (js/quran-data.js) yüklenemedi.</div>
                    <button class="btn-premium" style="margin-top:20px; width:auto; padding:10px 20px;" onclick="location.reload()">Tekrar Dene</button>
                </div>`;
            return;
        }

        // Header with Select
        const header = document.createElement('div');
        header.className = 'quran-header';

        const surahSelect = document.createElement('select');
        surahSelect.className = 'premium-select quran-select';
        surahSelect.style.fontFamily = "'Inter', sans-serif"; // Ensure font for Turkish
        surahSelect.onchange = (e) => this.loadSurah(e.target.value);

        this.surahList.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.index;
            // Display: "1. Fatiha (الفاتحة)"
            opt.textContent = `${s.index}. ${s.nameTr} (${s.name})`;
            if (s.index == this.currentSurah) opt.selected = true;
            surahSelect.appendChild(opt);
        });

        header.appendChild(surahSelect);
        container.appendChild(header);

        const content = document.createElement('div');
        content.className = 'quran-content';
        content.id = 'quran-display';

        // Add padding for bottom nav
        content.style.paddingBottom = "80px";

        container.appendChild(content);

        this.displaySurah(this.currentSurah);
    }

    loadSurah(index) {
        this.currentSurah = parseInt(index);
        this.displaySurah(this.currentSurah);
    }

    displaySurah(index) {
        const display = document.getElementById('quran-display');
        if (!display) return;

        display.innerHTML = '<div class="loading">Yükleniyor...</div>';

        // Find surah data safely
        const surahData = this.surahList.find(s => s.index == index);
        if (!surahData) {
            display.innerHTML = '<div style="padding:20px; text-align:center;">Sure bulunamadı.</div>';
            return;
        }

        const transList = (window.quranTransliteration && window.quranTransliteration[index - 1])
            ? window.quranTransliteration[index - 1]
            : [];

        setTimeout(() => {
            display.innerHTML = '';

            // Bismillah for specific surahs (usually all except Tawbah, index 9)
            if (index !== 1 && index !== 9) {
                const bismillahDiv = document.createElement('div');
                bismillahDiv.className = 'ayah-card';
                bismillahDiv.style.textAlign = 'center';
                bismillahDiv.style.fontFamily = "'Amiri', serif";
                bismillahDiv.style.fontSize = "24px";
                bismillahDiv.style.color = "var(--gold-primary)";
                bismillahDiv.innerHTML = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";
                display.appendChild(bismillahDiv);
            }

            const fragment = document.createDocumentFragment();
            // Get actual ayahs from data
            const fullSurahData = window.quranData.find(s => s.id == index);

            if (fullSurahData && fullSurahData.ayahs) {
                fullSurahData.ayahs.forEach(ayah => {
                    const ayahEl = document.createElement('div');
                    ayahEl.className = 'ayah-card';

                    const ayahTrans = transList[ayah.i - 1] || "";

                    ayahEl.innerHTML = `
                        <div class="ayah-number">${index}:${ayah.i}</div>
                        <div class="ayah-arabic">${ayah.a}</div>
                        <div class="ayah-translation">${ayah.t}</div>
                        ${ayahTrans ? `<div class="ayah-transliteration" style="font-size:14px; color:var(--text-secondary); font-style:italic; margin-top:10px; opacity:0.8;">(${ayahTrans})</div>` : ''}
                    `;
                    fragment.appendChild(ayahEl);
                });
            }
            display.appendChild(fragment);
        }, 10);
    }
}

// Global instance
window.quranReader = new QuranReader();
