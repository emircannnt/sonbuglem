const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'js', 'hadith-data.js');

try {
    let content = fs.readFileSync(inputFile, 'utf8');

    // Naive parse: find the array content
    // We expect "const hadithCollection = [" ... "];"
    const start = content.indexOf('[');
    const end = content.lastIndexOf(']');

    if (start === -1 || end === -1) {
        throw new Error("Could not find array in file");
    }

    const arrayStr = content.substring(start, end + 1);

    // Use eval to parse the array string (since it's valid JS object syntax)
    // We wrap in parentheses to ensure expression context
    const rawData = eval(`(${arrayStr})`);

    const refinedHadiths = [];

    rawData.forEach(chunk => {
        const text = chunk.text;
        // Regex to find "Number- Text" pattern
        // We look for: (Start of line or space) (\d+) \s* - \s* (Content)
        // We split by looking ahead for the next number pattern

        // Strategy: Match all occurrences
        // Pattern: (\d+-\s*[\s\S]*?) (?=\d+-\s*|$)
        // But JS regex doesn't support lookbehind well in all envs, lookahead is fine.
        // Also numbers might be "190- Ebu..." 

        // Let's use a simpler split strategy.
        // We'll replace newline followed by number- with a special delimiter

        // Normalize whitespace? No, preserve if possible.

        const pattern = /(\d+)\s*-\s*/g;

        let match;
        const indices = [];

        while ((match = pattern.exec(text)) !== null) {
            indices.push({
                index: match.index,
                number: match[1],
                fullMatch: match[0]
            });
        }

        for (let i = 0; i < indices.length; i++) {
            const startIdx = indices[i].index + indices[i].fullMatch.length; // Start of content
            const endIdx = (i + 1 < indices.length) ? indices[i + 1].index : text.length;

            let hadithText = text.substring(startIdx, endIdx).trim();

            // Clean up titles like "SABIR", "TEVBE" that might be stuck at the end of previous or start of current
            // They usually are in CAPS. But hard to detect perfectly.

            // If text is valid
            if (hadithText.length > 5) {
                refinedHadiths.push({
                    id: refinedHadiths.length + 1,
                    text: hadithText,
                    source: "Hadis-i Şerif" // We can try to extract source from text ending in (...) but many formats exist.
                });
            }
        }
    });

    console.log(`Extracted ${refinedHadiths.length} individual hadiths.`);

    // Generate new JS file
    let newContent = "const hadithCollection = [\n";
    refinedHadiths.forEach(h => {
        // Escape quotes
        const safeText = h.text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\r/g, '');
        newContent += `    { id: ${h.id}, text: "${safeText}", source: "Hadis-i Şerif" },\n`;
    });
    newContent += "];\n\n";
    newContent += "if (typeof window !== 'undefined') { window.hadithCollection = hadithCollection; }\n";

    fs.writeFileSync(inputFile, newContent, 'utf8');
    console.log("Updated js/hadith-data.js");

} catch (e) {
    console.error("Error:", e.message);
}
