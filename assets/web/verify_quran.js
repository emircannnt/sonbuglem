const fs = require('fs');

try {
    let content = fs.readFileSync('js/quran-data.js', 'utf8');
    // Remove 'window.quranData =' and trailing semicolon to parse as JSON or eval
    // Actually, since it's JS assignment, I can just prepend 'const window = {};' and eval it.

    // Better: extract the array part.
    // content looks like: window.quranData = [...];
    const jsonStart = content.indexOf('[');
    const jsonEnd = content.lastIndexOf(']');

    if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Could not find array brackets.");
    }

    const arrayStr = content.substring(jsonStart, jsonEnd + 1);
    const quranData = JSON.parse(arrayStr); // Assuming it is valid JSON inside

    console.log(`Total Surahs: ${quranData.length}`);

    if (quranData.length !== 114) {
        console.error("ERROR: Surah count is NOT 114!");
    } else {
        console.log("Surah count is correct (114).");
    }

    // Known order check (Sample)
    const surahNames = [
        "Fatiha", "Bakara", "Ali İmran", "Nisa", "Maide",
        // ... I won't list all, but I'll check IDs
    ];

    let orderCorrect = true;
    for (let i = 0; i < quranData.length; i++) {
        if (quranData[i].id !== (i + 1)) {
            console.error(`Mismatch at index ${i}: Expected ID ${i + 1}, found ${quranData[i].id}`);
            orderCorrect = false;
        }
    }

    if (orderCorrect) {
        console.log("Surah IDs are in sequential order (1-114).");
    }

    // Count Total Ayahs
    let totalAyahs = 0;
    quranData.forEach(s => {
        totalAyahs += s.ayahs.length;
    });
    console.log(`Total Ayahs: ${totalAyahs}`);

    // Specific Checks
    console.log(`Surah 1 Name: ${quranData[0].name} (Expected 7 ayahs) -> Actual: ${quranData[0].ayahs.length}`);
    console.log(`Surah 114 Name: ${quranData[113].name} (Expected 6 ayahs) -> Actual: ${quranData[113].ayahs.length}`);

} catch (e) {
    console.error("Verification failed:", e.message);
}
