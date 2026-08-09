import { AmalItem } from '../types';

export const BISMILLAH_ARABIC = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
export const BISMILLAH_TRANSLITERATION = 'Bismillahir-Rahmanir-Rahim';
export const BISMILLAH_ENGLISH = 'In the name of Allah, the Most Gracious, the Most Merciful';

export const AMAL_ITEMS: AmalItem[] = [
  {
    id: 'durood',
    number: '01',
    title: 'Durood-e-Pak',
    arabicTitle: 'الصَّلَاةُ عَلَى النَّبِيِّ',
    category: 'core',
    targetCount: 3,
    arabicText: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammadin kama sallayta 'ala Ibrahima wa 'ala ali Ibrahima innaka Hamidun Majid.",
    meaningUrduRoman: 'Awwal aur Aakhir kam se kam 3 bar Durood-e-Pak zaroor padhein.',
    meaningEnglish: 'O Allah, send blessings upon Muhammad and upon the family of Muhammad. Read at least 3 times at the start and end of Amal.',
    notes: 'Awwal 3 bar Durood-e-Pak padhna',
    audioUrl: '/audio/durood.mp3'
  },
  {
    id: 'fatiha',
    number: '02',
    title: 'Surah Al-Fātiḥah',
    arabicTitle: 'سُورَةُ الفَاتِحَةِ',
    category: 'core',
    targetCount: 7,
    quranRef: 'Surah 1 (7 Ayahs)',
    arabicText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ۝١ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَالَمِينَ ۝٢ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ۝٣ مَالِكِ يَوْمِ ٱلدِّينِ ۝٤ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝٥ ٱهْدِنَا ٱلصِّرَاطَ ٱلْمُسْتَقِيمَ ۝٦ صِرَاطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّالِّينَ ۝٧',
    transliteration: "Alhamdu lillahi Rabbil 'alamin. Ar-Rahmanir-Rahim. Maliki Yawmid-Din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal-mustaqim. Siratalladhina an'amta 'alayhim ghayril-maghdubi 'alayhim wa lad-dallin.",
    meaningUrduRoman: '7 Bar Surah Fatiha padhein (Thodi aawaz se).',
    meaningEnglish: '[All] praise is due to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path.',
    notes: '7 Times - Recite with audible, gentle voice',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3'
  },
  {
    id: 'ayatul_kursi',
    number: '03',
    title: 'Āyat al-Kursī',
    arabicTitle: 'آيَةُ الكُرْسِيِّ',
    category: 'core',
    targetCount: 7,
    quranRef: 'Surah Al-Baqarah (2:255)',
    arabicText: 'ٱللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ٱلْحَيُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِي ٱلسَّمَاوَاتِ وَمَا فِي ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِي يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَاوَاتِ وَٱلْأَرْضَ ۖ وَلَا يَـَٔوُدُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِيُّ ٱلْعَظِيمُ',
    transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnihi. Ya'lamu ma bayna aydihim wa ma khalfahum wa la yuhituna bi-shay'im-min 'ilmihi illa bima sha'a. Wasi'a kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifzuhuma, wa Huwal-'Aliyyul-'Azim.",
    meaningUrduRoman: '7 Bar Ayatul Kursi padhein.',
    meaningEnglish: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.',
    notes: '7 Times - Divine Protection',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3'
  },
  {
    id: 'kafirun',
    number: '04',
    title: 'Surah Al-Kāfirūn',
    arabicTitle: 'سُورَةُ الكَافِرُونَ',
    category: 'core',
    targetCount: 7,
    quranRef: 'Surah 109 (6 Ayahs)',
    arabicText: 'قُلْ يَٰٓأَيُّهَا ٱلْكَٰفِرُونَ ۝١ لَآ أَعْبُدُ مَا تَعْبُدُونَ ۝٢ وَلَآ أَنتُمْ عَٰبِدُونَ مَآ أَعْبُدُ ۝٣ وَلَآ أَنَا۠ عَابِدٌ مَّا عَبَدتُّمْ ۝٤ وَلَآ أَنتُمْ عَٰبِدُونَ مَآ أَعْبُدُ ۝٥ لَكُمْ دِينُكُمْ وَلِيَ دِينِ ۝٦',
    transliteration: "Qul ya ayyuhal-kafirun. La a'budu ma ta'budun. Wa la antum 'abiduna ma a'bud. Wa la ana 'abidum ma 'abattum. Wa la antum 'abiduna ma a'bud. Lakum dinukum wa liya din.",
    meaningUrduRoman: '7 Bar Sureh Kafiroon padhein.',
    meaningEnglish: 'Say, "O disbelievers, I do not worship what you worship. Nor are you worshippers of what I worship... To you be your religion, and to me my religion."',
    notes: '7 Times',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/109.mp3'
  },
  {
    id: 'ikhlas',
    number: '05',
    title: 'Surah Al-Ikhlāṣ',
    arabicTitle: 'سُورَةُ الإِخْلَاصِ',
    category: 'core',
    targetCount: 7,
    quranRef: 'Surah 112 (4 Ayahs)',
    arabicText: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝١ ٱللَّهُ ٱلصَّمَدُ ۝٢ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝٣ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ ۝٤',
    transliteration: "Qul Huwallahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakul-lahu kufuwan ahad.",
    meaningUrduRoman: '7 Bar Surah Ikhlas padhein.',
    meaningEnglish: 'Say, "He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent."',
    notes: '7 Times - Absolute Sincerity & Oneness',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3'
  },
  {
    id: 'falaq',
    number: '06',
    title: 'Surah Al-Falaq',
    arabicTitle: 'سُورَةُ الفَلَقِ',
    category: 'core',
    targetCount: 7,
    quranRef: 'Surah 113 (5 Ayahs)',
    arabicText: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ ۝١ مِن شَرِّ مَا خَلَقَ ۝٢ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝٣ وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلْعُقَدِ ۝٤ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ۝٥',
    transliteration: "Qul a'udhu bi-Rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.",
    meaningUrduRoman: '7 Bar Surah Falaq padhein.',
    meaningEnglish: 'Say, "I seek refuge in the Lord of daybreak from the evil of that which He created and from the evil of darkness when it settles and from the evil of the blowers in knots..."',
    notes: '7 Times - Seeking Refuge from External Evils',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/113.mp3'
  },
  {
    id: 'nas',
    number: '07',
    title: 'Surah An-Nās',
    arabicTitle: 'سُورَةُ النَّاسِ',
    category: 'core',
    targetCount: 7,
    quranRef: 'Surah 114 (6 Ayahs)',
    arabicText: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ ۝١ مَلِكِ ٱلنَّاسِ ۝٢ إِلَٰهِ ٱلنَّاسِ ۝٣ مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ ۝٤ ٱلَّذِي يُوَسْوِسُ فِي صُدُورِ ٱلنَّاسِ ۝٥ مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ ۝٦',
    transliteration: "Qul a'udhu bi-Rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",
    meaningUrduRoman: '7 Bar Surah Naas padhein.',
    meaningEnglish: 'Say, "I seek refuge in the Lord of mankind, The Sovereign of mankind. The God of mankind, From the evil of the retreating whisperer - Who whispers into the breasts of mankind..."',
    notes: '7 Times - Protection from Internal Whispers',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/114.mp3'
  },
  {
    id: 'tawbah',
    number: '08',
    title: 'Surah At-Tawbah (Last 2 Ayahs)',
    arabicTitle: 'سُورَةُ التَّوْبَةِ (آخِرُ آيَتَيْنِ)',
    category: 'special_tawbah',
    targetCount: 21,
    quranRef: 'Surah 9:128–129',
    arabicText: 'لَقَدْ جَآءَكُمْ رَسُولٌ مِّنْ أَنفُسِكُمْ عَزِيزٌ عَلَيْهِ مَا عَنِتُّمْ حَرِيصٌ عَلَيْكُم بِٱلْمُؤْمِنِينَ رَءُوفٌ رَّحِيمٌ ۝١٢٨ فَإِن تَوَلَّوْا۟ فَقُلْ حَسْبِيَ ٱللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ ٱلْعَرْشِ ٱلْعَظِيمِ ۝١٢٩',
    transliteration: "Laqad ja'akum rasulum min anfusikum 'azizun 'alayhi ma 'anittum harisun 'alaykum bil-mu'minina ra'ufur-rahim. Fa-in tawallaw faqul hasbiyallahu la ilaha illa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Azim.",
    meaningUrduRoman: 'Din me 1 bar ya 2 bar ya hosake to 3 bar 21 martaba Sureh Touba k last k 2 aayath zaroor padna.',
    meaningEnglish: 'There has certainly come to you a Messenger from among yourselves. Grievous to him is what you suffer; [he is] concerned over you and to the believers is kind and merciful. But if they turn away, say, "Sufficient for me is Allah; there is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne."',
    notes: '21 Times (1 to 3 times daily) - Special Spiritual Relief',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1363.mp3'
  },
  {
    id: 'quraish',
    number: '09',
    title: 'Surah Quraish (Khuresh 113×)',
    arabicTitle: 'سُورَةُ قُرَيْشٍ',
    category: 'special_113',
    targetCount: 113,
    quranRef: 'Surah 106 (4 Ayahs)',
    arabicText: 'لِإِيلَٰفِ قُرَيْشٍ ۝١ إِيلَٰفِهِمْ رِحْلَةَ ٱلشِّتَآءِ وَٱلصَّيْفِ ۝٢ فَلْيَعْبُدُوا۟ رَبَّ هَٰذَا ٱلْبَيْتِ ۝٣ ٱلَّذِيٓ أَطْعَمَهُم مِّن جُوعٍ وَءَامَنَهُم مِّنْ خَوْفٍۭ ۝٤',
    transliteration: "Li-ilafi Quraish. Ilafihim rihlata ash-shitai wash-shaif. Fal-ya'budu Rabba hazal-bait. Allazi at'amahum min ju'in wa-amanahum min khawf.",
    meaningUrduRoman: 'Aur Din me 1 bar ya 2 bar Khuresh 113 martaba a amal zaroor karna.',
    meaningEnglish: 'For the accustomed security of the Quraish - Their accustomed security [in] the caravan of winter and summer - Let them worship the Lord of this House, Who has fed them against hunger and made them safe from fear.',
    notes: '113 Times Counter - Protection from Hunger, Fear & Hardship',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/106.mp3'
  }
];

export const INSTRUCTIONS_SUMMARY = [
  {
    title: '⏰ Daily Schedule',
    urduText: 'SUBO AIK BAR A AMAL, DOPAHER ME AIK BAR AUR SHAAM ME AIK BAR',
    englishText: 'Perform this Amal once in the Morning (Subah), once in the Afternoon (Dopaher), and once in the Evening (Shaam).'
  },
  {
    title: '🔊 Voice & Recitation',
    urduText: 'THODI AAWAZ SE PADNA',
    englishText: 'Recite with a clear, audible, and gentle voice so your own ears can hear it clearly.'
  },
  {
    title: '📿 Core 7× Series Order',
    urduText: 'Awwal 3 Darood, 7x Fatiha, 7x Ayatul Kursi, 7x Kafirun, 7x Ikhlas, 7x Falaq, 7x Naas, Aakhir 3 Darood.',
    englishText: 'Start with 3× Durood Shareef, then recite 7× each of the 6 Surahs & Ayatul Kursi, finishing with 3× Durood Shareef.'
  },
  {
    title: '📖 Surah At-Tawbah (21×)',
    urduText: 'Din 1 bar ya 2 bar ya hosake to 3 bar 21 martaba Sureh Touba k last k 2 aayath zaroor padna.',
    englishText: 'Recite the last 2 verses of Surah At-Tawbah (9:128-129) 21 times at least once, twice, or thrice daily.'
  },
  {
    title: '✨ Surah Quraish (113×)',
    urduText: 'Aur Din me 1 bar ya 2 bar Khuresh 113 martaba pehle b bolko the na a amal zaroor karna.',
    englishText: 'Recite Surah Quraish 113 times once or twice daily as recommended.'
  }
];
