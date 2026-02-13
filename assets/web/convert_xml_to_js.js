const fs = require('fs');
const path = require('path');

const xmlPath = 'tr.transliteration.xml';
const outputPath = 'js/transliteration-data.js';

try {
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');

    // Initialize array for 114 surahs (0-indexed, so size 114, index 0 is Surah 1)
    // Actually simpler to just push.
    const transData = [];

    // Helper to find all matches
    const surahRegex = /<sura index="(\d+)" name="[^"]*">([\s\S]*?)<\/sura>/g;
    const ayahRegex = /<aya index="(\d+)" text="([^"]+)"\/>/g;

    let surahMatch;
    while ((surahMatch = surahRegex.exec(xmlContent)) !== null) {
        const surahIndex = parseInt(surahMatch[1]);
        const surahContent = surahMatch[2];

        const ayahs = [];
        let ayahMatch;
        while ((ayahMatch = ayahRegex.exec(surahContent)) !== null) {
            const ayahIndex = parseInt(ayahMatch[1]);
            const text = ayahMatch[2];
            ayahs.push(text);
        }

        // Ensure we place it in the correct index (surahIndex - 1)
        transData[surahIndex - 1] = ayahs;
    }

    // Validation
    console.log(`Parsed ${transData.length} surahs.`);
    if (transData.length !== 114) {
        console.warn("Warning: Expected 114 surahs!");
    }

    // Check missing
    for (let i = 0; i < 114; i++) {
        if (!transData[i]) {
            console.error(`Missing Surah ${i + 1}`);
            transData[i] = []; // Empty fallback
        }
    }

    const outputContent = `window.quranTransliteration = ${JSON.stringify(transData)};`;
    fs.writeFileSync(outputPath, outputContent);
    console.log(`Successfully wrote to ${outputPath}`);

} catch (err) {
    console.error("Error:", err);
}
