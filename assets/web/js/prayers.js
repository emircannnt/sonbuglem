const prayersList = [
    {
        "id": 1,
        "title": "Uyumadan Önce Okunacak Dua",
        "arabic": "بِاسْمِكَ اللَّهُمَّ أَمُوْتُ وَأَحْيَا",
        "latin": "Bismikellâhümme emûtü ve ahyâ",
        "translation": "Senin isminle ölür ve dirilirim Allah'ım.",
        "source": "Buhari"
    },
    {
        "id": 2,
        "title": "Uyanınca Okunacak Dua",
        "arabic": "الحَمْدُ للهِ الَّذِي أَحْيَانَا بعْدَ مَا أماتَنَا وإِلَيْهِ النُّشُورُ",
        "latin": "Elhamdülillâhillezî ahyânâ ba'de mâ emâtenâ ve ileyhin-nüşûr",
        "translation": "Bizi öldürdükten sonra dirilten Allah'a hamdolsun. Dönüş ancak O'nadır.",
        "source": "Buhari"
    },
    {
        "id": 3,
        "title": "Tuvalete Girerken Okunacak Dua",
        "arabic": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        "latin": "Allâhümme innî eûzü bike minel-hubsi vel-habâis",
        "translation": "Allah'ım! Pislikten ve pis şeylerden (erkek ve dişi şeytanlardan) sana sığınırım.",
        "source": "Buhari ve Müslim"
    },
    {
        "id": 4,
        "title": "Tuvaletten Çıkarken Okunacak Dua",
        "arabic": "غُفْرَانَكَ",
        "latin": "Gufrâneke",
        "translation": "(Allah'ım!) Senin mağfiretini dilerim.",
        "source": "Tirmizi"
    },
    {
        "id": 5,
        "title": "Yemeğe Başlarken Okunacak Dua",
        "arabic": "بِسْمِ اللَّهِ",
        "latin": "Bismillah",
        "translation": "Allah'ın adıyla.",
        "source": "Buhari",
        "note": "Eğer başta unutulursa: 'Bismillâhi evvelehû ve âhirehû' (evvelinde ve ahirinde Allah'ın adıyla) denilir."
    },
    {
        "id": 6,
        "title": "Yemekten Sonra Okunacak Dua",
        "arabic": "الْحَمْدُ لِلَّهِ الَّذِى أَطْعَمَنِى هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّى وَلاَ قُوَّةٍ",
        "latin": "Elhamdülillâhillezî at'amenî hâzâ ve razeqanîhi min gayri havlin minnî velâ kuvveh",
        "translation": "Bana bu yiyeceği yediren ve tarafımdan hiçbir güç ve kuvvet olmadan bunu bana rızık kılan Allah'a hamdolsun.",
        "source": "Tirmizi"
    },
    {
        "id": 7,
        "title": "Evden Çıkarken Okunacak Dua",
        "arabic": "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        "latin": "Bismillâhi tevekkeltü alallâh, lâ havle velâ kuvvete illâ billâh",
        "translation": "Allah'ın adıyla. Allah'a tevekkül ettim. Güç ve kuvvet ancak Allah'tandır.",
        "source": "Ebu Davud ve Tirmizi"
    },
    {
        "id": 8,
        "title": "Eve Girerken Okunacak Dua",
        "arabic": "اَلسَّلَامُ عَلَيْكُمْ",
        "latin": "Es-selâmü aleyküm",
        "translation": "Allah'ın selamı üzerinize olsun.",
        "source": "-"
    },
    {
        "id": 9,
        "title": "Camiye Girerken Okunacak Dua",
        "arabic": "اَللَّهُمَّ افْتَحْ لِيْ أَبْوَابَ رَحْمَتِكَ",
        "latin": "Allâhümmefteh lî ebvâbe rahmetik",
        "translation": "Allah'ım! Bana rahmet kapılarını aç.",
        "source": "Müslim"
    },
    {
        "id": 10,
        "title": "Camiden Çıkarken Okunacak Dua",
        "arabic": "اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ مِنْ فَضْلِكَ",
        "latin": "Allâhümme innî es'elüke min fadlik",
        "translation": "Allah'ım! Senin lütfundan isterim.",
        "source": "Müslim"
    },
    {
        "id": 11,
        "title": "Ezandan Sonra Okunacak Dua",
        "arabic": "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
        "latin": "Allâhümme Rabbe hâzihid-da'vetit-tâmmeh, ves-salâtil-kâimeh, âti Muhammedanil-vesîlete vel-fadîleh, veb'ashü makâmen mahmûdenillezî vaadteh",
        "translation": "Ey bu tam davetin ve kılınacak namazın Rabbi olan Allah'ım! Muhammed'e (s.a.v.) vesileyi ve fazileti ver. Onu, kendisine vaad ettiğin Makam-ı Mahmud'a ulaştır.",
        "source": "Buhari"
    },
    {
        "id": 12,
        "title": "Seyyidül İstiğfar Duası",
        "arabic": "اَللَّهُمَّ أَنْتَ رَبِّيْ ، لَا إِلٰـهَ إِلاَّ أَنْتَ خَلَقْتَنِيْ وَأَنَا عَبْدُكَ ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ ، أَبُوْءُ لَكَ بِنِعْمتِكَ عَلَيَّ ، وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ ، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
        "latin": "Allâhümme ente Rabbî lâ ilâhe illâ ente halaktenî ve ene abdüke ve ene alâ ahdike ve va'dike mesteta'tü eûzü bike min şerri mâ sana'tü ebûü leke bi-ni'metike aleyye ve ebûü bi-zenbî fağfir lî fe-innehû lâ yağfirü'z-zünûbe illâ ente",
        "translation": "Allah'ım! Sen benim Rabbimsin. Senden başka ilah yoktur. Beni Sen yarattın ve ben Senin kulunum. Gücüm yettiğince Sana verdiğim söz ve vaad üzereyim. Yaptıklarımın şerrinden Sana sığınırım. Bana olan nimetini ve günahımı itiraf ederim. Beni bağışla. Çünkü günahları ancak Sen bağışlarsın.",
        "source": "Buhari"
    },
    {
        "id": 13,
        "title": "Sıkıntı ve Üzüntü Anında Dua",
        "arabic": "اَللّٰهُمَّ إِنِّى أَعُوْذُبِكَ مِنَ الْهَمِّ وَالْحَزْنِ وَأَعُوْذُبِكَ مِنَ الْعَجْزِ وَالْكَسَلِ وَأَعُوْذُبِكَ مِنَ الْجُبْنِ وَالْبُخْلِ وَأَعُوْذُبِكَ مِنْ غَلَبَتِ الدَّيْنِ وَقَهْرِ الرجال",
        "latin": "Allâhümme innî eûzü bike minel-hemmi vel-hazen ve eûzü bike minel-aczi vel-kesel ve eûzü bike minel-cübni vel-buhl ve eûzü bike min galebetid-deyni ve kahrir-ricâl",
        "translation": "Allah'ım! Keder ve üzüntüden, acizlik ve tembellikten, korkaklık ve cimrilikten, borç baskısından ve insanların kahrından Sana sığınırım.",
        "source": "Ebu Davud"
    },
    {
        "id": 14,
        "title": "Yolculuk Duası",
        "arabic": "سُبْحَانَ الَّذِى سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        "latin": "Sübhânellezî sehhara lenâ hâzâ ve mâ künnâ lehû mukrinîn ve innâ ilâ Rabbinâ le-münkalibûn",
        "translation": "Bunu (bineği/aracı) bizim hizmetimize veren Allah'ı tesbih ederiz, yoksa buna bizim gücümüz yetmezdi. Biz şüphesiz Rabbimize döneceğiz.",
        "source": "Zuhruf Suresi"
    },
    {
        "id": 15,
        "title": "Hapşırınca Okunacak Dua",
        "arabic": "الحَمْدُ للهِ",
        "latin": "Elhamdülillâh",
        "translation": "Allah'a hamdolsun.",
        "source": "Buhari"
    },
    {
        "id": 16,
        "title": "Abdestten Sonra Okunacak Dua",
        "arabic": "أشْهَدُ أنْ لا إله إِلاَّ اللَّهُ وَحْدَهُ لا شَرِيك لَهُ ، وأشْهَدُ أنَّ مُحَمَّداً عَبْدُهُ وَرَسُولُهُ",
        "latin": "Eşhedü en lâ ilâhe illallâhü vahdehû lâ şerîke leh, ve eşhedü enne Muhammeden abdühû ve rasûlüh",
        "translation": "Şehadet ederim ki Allah'tan başka ilah yoktur, O tektir ve ortağı yoktur. Ve şehadet ederim ki Muhammed O'nun kulu ve elçisidir.",
        "source": "Müslim"
    },
    {
        "id": 17,
        "title": "Elbise Giyerken Okunacak Dua",
        "arabic": "الْحَمْدُ لِلَّهِ الَّذِى كَسَانِى هَذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّى وَلاَ قُوَّةٍ",
        "latin": "Elhamdülillâhillezî kesânî hâzâs-sevbe ve razeqanîhi min gayri havlin minnî velâ kuvveh",
        "translation": "Bana bu elbiseyi giydiren ve tarafımdan hiçbir güç ve kuvvet olmadan onu bana nasip eden Allah'a hamdolsun.",
        "source": "Sünen-i Ebu Davud"
    },
    {
        "id": 18,
        "title": "Yağmur Yağarken Okunacak Dua",
        "arabic": "اللَّهُمَّ صَيِّبًا نَافِعًا",
        "latin": "Allâhümme sayyiben nâfiâ",
        "translation": "Allah'ım! Bunu faydalı bir yağmur kıl.",
        "source": "Buhari"
    },
    {
        "id": 19,
        "title": "Ana Baba İçin Dua",
        "arabic": "رَبَّنَا ٱغْفِرْ لِى وَلِوَٰلِدَىَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ ٱلْحِسَابُ",
        "latin": "Rabbenağfirlî ve li-vâlideyye ve lil-mü'minîne yevme yekûmü'l-hisâb",
        "translation": "Rabbimiz! Hesap görülecek günde beni, ana-babamı ve inananları bağışla.",
        "source": "İbrahim Suresi 41. Ayet"
    },
    {
        "id": 20,
        "title": "Nazardan Korunma Duası",
        "arabic": "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لاَمَّةٍ",
        "latin": "Eûzü bi-kelimâtillâhit-tâmmeti min külli şeytânin ve hâmmetin ve min külli aynin lâmmeh",
        "translation": "Her türlü şeytandan, zararlı haşarattan ve kem gözlerden Allah'ın tam kelimelerine sığınırım.",
        "source": "Buhari"
    }
];

if (typeof window !== 'undefined') {
    window.prayersList = prayersList;
}
