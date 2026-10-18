/* HERwell faith & profile layer: Qur'an verse by mood, prayer times with check boxes, Qur'an reading timer,
   words of the Prophet ﷺ, profile page (name + password) and the Settings modal (language, theme, location). */
(function () {
  const lang = () => window.HWLANG || "en",
    L = () => ({ fr: "fr", ar: "ar" })[lang()] || "en",
    esc = (s) => E(s);
  const mood = () => {
    const l = S.log && S.log[S.log.length - 1];
    return l && iso(l.ts) === iso(Date.now()) ? Math.round(l.m) - 1 : M - 1;
  };
  const doy = () => Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / DAY);

  // ---------- verses (Arabic text + my own paraphrased meaning; not a published translation) ----------
  // [moods, arabic, reference, surah (en), surah (ar), meaning en, meaning fr]
  const V = [
    [
      0,
      "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      "94:5-6",
      "Ash-Sharh",
      "الشرح",
      "Indeed, with hardship comes ease. Indeed, with hardship comes ease.",
      "Certes, avec la difficulté vient la facilité. Certes, avec la difficulté vient la facilité.",
    ],
    [
      0,
      "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      "2:286",
      "Al-Baqarah",
      "البقرة",
      "Allah does not burden a soul beyond what it can bear.",
      "Allah n’impose à aucune âme plus que ce qu’elle peut supporter.",
    ],
    [
      0,
      "إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ",
      "12:86",
      "Yusuf",
      "يوسف",
      "I only bring my pain and my sorrow to Allah.",
      "Je ne confie ma peine et ma tristesse qu’à Allah.",
    ],
    [
      0,
      "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
      "21:87",
      "Al-Anbiya",
      "الأنبياء",
      "There is no god but You, glory be to You. I have indeed wronged myself. (The prayer of Yunus in his darkest moment.)",
      "Il n’y a de dieu que Toi, gloire à Toi. J’ai certes été injuste envers moi-même. (L’invocation de Yunus dans son moment le plus sombre.)",
    ],
    [
      0,
      "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
      "93:3",
      "Ad-Duha",
      "الضحى",
      "Your Lord has not left you, nor is He displeased with you.",
      "Ton Seigneur ne t’a pas abandonnée et ne t’a pas prise en aversion.",
    ],
    [
      0,
      "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
      "39:53",
      "Az-Zumar",
      "الزمر",
      "Do not despair of the mercy of Allah.",
      "Ne désespérez pas de la miséricorde d’Allah.",
    ],
    [
      1,
      "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      "13:28",
      "Ar-Ra’d",
      "الرعد",
      "In the remembrance of Allah, hearts find rest.",
      "C’est par le rappel d’Allah que les cœurs s’apaisent.",
    ],
    [
      1,
      "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
      "3:139",
      "Ali ‘Imran",
      "آل عمران",
      "Do not weaken and do not grieve, for you are the higher if you are believers.",
      "Ne vous affaiblissez pas et ne vous attristez pas : vous serez les plus élevés si vous êtes croyants.",
    ],
    [
      1,
      "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ",
      "12:87",
      "Yusuf",
      "يوسف",
      "Never lose hope in Allah’s relief.",
      "Ne perdez jamais l’espoir du soulagement d’Allah.",
    ],
    [
      1,
      "فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
      "2:186",
      "Al-Baqarah",
      "البقرة",
      "I am near. I answer the call of the one who calls on Me.",
      "Je suis proche. Je réponds à l’appel de celui qui M’invoque.",
    ],
    [
      1,
      "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
      "94:1",
      "Ash-Sharh",
      "الشرح",
      "Did We not open your heart for you?",
      "Ne t’avons-Nous pas ouvert la poitrine ?",
    ],
    [
      1,
      "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",
      "7:156",
      "Al-A‘raf",
      "الأعراف",
      "My mercy encompasses all things.",
      "Ma miséricorde embrasse toute chose.",
    ],
    [
      2,
      "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
      "2:153",
      "Al-Baqarah",
      "البقرة",
      "Seek help through patience and prayer. Allah is with the patient.",
      "Cherchez de l’aide dans la patience et la prière. Allah est avec les patients.",
    ],
    [
      2,
      "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
      "65:2",
      "At-Talaq",
      "الطلاق",
      "Whoever is mindful of Allah, He makes a way out for them.",
      "Quiconque craint Allah, Il lui donne une issue.",
    ],
    [
      2,
      "رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي",
      "20:25-26",
      "Ta-Ha",
      "طه",
      "My Lord, open my heart and make my task easy for me. (A beautiful dua before an exam.)",
      "Mon Seigneur, ouvre-moi la poitrine et facilite-moi ma tâche. (Une belle invocation avant un examen.)",
    ],
    [
      2,
      "وَقُل رَّبِّ زِدْنِي عِلْمًا",
      "20:114",
      "Ta-Ha",
      "طه",
      "Say: My Lord, increase me in knowledge.",
      "Dis : Mon Seigneur, accrois mes connaissances.",
    ],
    [
      2,
      "فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ",
      "3:159",
      "Ali ‘Imran",
      "آل عمران",
      "Once you have decided, put your trust in Allah.",
      "Une fois ta décision prise, place ta confiance en Allah.",
    ],
    [
      2,
      "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
      "65:3",
      "At-Talaq",
      "الطلاق",
      "Whoever relies on Allah, He is enough for them.",
      "Quiconque place sa confiance en Allah, Il lui suffit.",
    ],
    [
      3,
      "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
      "14:7",
      "Ibrahim",
      "إبراهيم",
      "If you are grateful, I will surely give you more.",
      "Si vous êtes reconnaissants, Je vous donnerai davantage.",
    ],
    [
      3,
      "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
      "93:5",
      "Ad-Duha",
      "الضحى",
      "Your Lord will give you, and you will be pleased.",
      "Ton Seigneur te donnera bientôt de quoi te satisfaire.",
    ],
    [
      3,
      "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي",
      "2:152",
      "Al-Baqarah",
      "البقرة",
      "Remember Me and I will remember you, and be grateful to Me.",
      "Souvenez-vous de Moi, Je me souviendrai de vous, et remerciez-Moi.",
    ],
    [
      3,
      "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
      "55:13",
      "Ar-Rahman",
      "الرحمن",
      "So which of your Lord’s blessings will you deny?",
      "Lequel des bienfaits de votre Seigneur nierez-vous ?",
    ],
    [
      3,
      "وَأَحْسِنُوا ۛ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ",
      "2:195",
      "Al-Baqarah",
      "البقرة",
      "Do good. Allah loves those who do good.",
      "Faites le bien. Allah aime les bienfaisants.",
    ],
    [
      4,
      "فَإِذَا فَرَغْتَ فَانصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَب",
      "94:7-8",
      "Ash-Sharh",
      "الشرح",
      "When you finish one task, begin the next, and turn your longing to your Lord.",
      "Quand tu as terminé, applique-toi à autre chose, et tourne ton désir vers ton Seigneur.",
    ],
    [
      4,
      "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
      "54:17",
      "Al-Qamar",
      "القمر",
      "We have made the Qur’an easy to remember. Will you take heed?",
      "Nous avons rendu le Coran facile à retenir. Y a-t-il quelqu’un pour s’en souvenir ?",
    ],
    [
      4,
      "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ",
      "11:88",
      "Hud",
      "هود",
      "My success is only through Allah.",
      "Ma réussite ne dépend que d’Allah.",
    ],
    [
      4,
      "ادْعُونِي أَسْتَجِبْ لَكُمْ",
      "40:60",
      "Ghafir",
      "غافر",
      "Call on Me and I will answer you.",
      "Invoquez-Moi, Je vous répondrai.",
    ],
    [
      4,
      "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
      "3:173",
      "Ali ‘Imran",
      "آل عمران",
      "Allah is enough for us, and the best protector.",
      "Allah nous suffit, et quel excellent garant.",
    ],
  ];
  const VF = [
    // verses about reading, for the Qur'an focus card
    [
      "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
      "73:4",
      "Al-Muzzammil",
      "المزمل",
      "Recite the Qur’an slowly and beautifully.",
      "Récite le Coran lentement et avec beauté.",
    ],
    [
      "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ",
      "17:82",
      "Al-Isra",
      "الإسراء",
      "We send down of the Qur’an what is healing and mercy for the believers.",
      "Nous faisons descendre du Coran ce qui est guérison et miséricorde pour les croyants.",
    ],
    [
      "أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ",
      "47:24",
      "Muhammad",
      "محمد",
      "Do they not reflect on the Qur’an?",
      "Ne méditent-ils donc pas sur le Coran ?",
    ],
    [
      "فَاقْرَءُوا مَا تَيَسَّرَ مِنَ الْقُرْآنِ",
      "73:20",
      "Al-Muzzammil",
      "المزمل",
      "Recite what is easy for you of the Qur’an.",
      "Récitez ce qui vous est facile du Coran.",
    ],
    [
      "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
      "54:17",
      "Al-Qamar",
      "القمر",
      "We have made the Qur’an easy to remember. Will you take heed?",
      "Nous avons rendu le Coran facile à retenir. Y a-t-il quelqu’un pour s’en souvenir ?",
    ],
  ];
  // [arabic, source (en), source (ar), meaning en, meaning fr]
  const H = [
    [
      "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
      "Bukhari & Muslim",
      "متفق عليه",
      "Actions are judged by intentions.",
      "Les actes ne valent que par les intentions.",
    ],
    [
      "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
      "Bukhari & Muslim",
      "متفق عليه",
      "The deeds most loved by Allah are the consistent ones, even if small.",
      "Les actes les plus aimés d’Allah sont les plus réguliers, même s’ils sont petits.",
    ],
    [
      "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
      "Bukhari",
      "البخاري",
      "The best of you are those who learn the Qur’an and teach it.",
      "Les meilleurs d’entre vous sont ceux qui apprennent le Coran et l’enseignent.",
    ],
    [
      "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
      "Tirmidhi",
      "الترمذي",
      "Your smile for another person is a charity.",
      "Ton sourire à l’autre est une aumône.",
    ],
    [
      "إِنَّ لِجَسَدِكَ عَلَيْكَ حَقًّا",
      "Bukhari",
      "البخاري",
      "Your body has a right over you. Rest, eat well, and take care of it.",
      "Ton corps a un droit sur toi. Repose-toi, mange bien, prends-en soin.",
    ],
    [
      "إِنَّ الدِّينَ يُسْرٌ",
      "Bukhari",
      "البخاري",
      "Truly, the religion is ease.",
      "En vérité, la religion est facilité.",
    ],
    [
      "عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ…",
      "Muslim",
      "مسلم",
      "How wonderful is the believer’s situation: if ease comes, they are grateful, and if hardship comes, they are patient. Both are good for them.",
      "Comme la situation du croyant est merveilleuse : dans l’aisance il remercie, dans l’épreuve il patiente. Les deux sont un bien pour lui.",
    ],
    [
      "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
      "Muslim",
      "مسلم",
      "Whoever walks a path seeking knowledge, Allah makes easy for them a path to Paradise.",
      "Celui qui suit un chemin pour chercher la science, Allah lui facilite par là un chemin vers le Paradis.",
    ],
    [
      "يَسِّرُوا وَلَا تُعَسِّرُوا وَبَشِّرُوا وَلَا تُنَفِّرُوا",
      "Bukhari & Muslim",
      "متفق عليه",
      "Make things easy, not hard. Give good news, do not push people away.",
      "Facilitez, ne compliquez pas. Annoncez de bonnes nouvelles, ne repoussez pas.",
    ],
    [
      "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
      "Muslim",
      "مسلم",
      "Allah does not look at your appearance or wealth, but at your hearts and your deeds.",
      "Allah ne regarde ni vos apparences ni vos richesses, mais vos cœurs et vos actes.",
    ],
    [
      "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
      "Bukhari & Muslim",
      "متفق عليه",
      "None of you truly believes until you love for others what you love for yourself.",
      "Aucun de vous ne croit vraiment tant qu’il n’aime pas pour les autres ce qu’il aime pour lui-même.",
    ],
    [
      "مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلَا وَصَبٍ وَلَا هَمٍّ وَلَا حُزْنٍ وَلَا أَذًى وَلَا غَمٍّ حَتَّى الشَّوْكَةِ يُشَاكُهَا إِلَّا كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ",
      "Bukhari & Muslim",
      "متفق عليه",
      "No fatigue, illness, worry, sadness, harm or distress touches a believer, even a thorn’s prick, except that Allah wipes away some of their sins through it.",
      "Aucune fatigue, maladie, souci, tristesse, mal ou détresse n’atteint le croyant, même une épine, sans qu’Allah n’efface par cela une part de ses fautes.",
    ],
  ];
  const AR = (t, ref, s, sa) => `<div class="ar-q" lang="ar" dir="rtl">${t}</div>`;
  const surah = (en, ar, ref) => (lang() === "ar" ? `سورة ${ar} · ${ref}` : `Surah ${en} · ${ref}`);
  const meaning = (r) => (lang() === "ar" ? "" : `<p class="vm">${esc(lang() === "fr" ? r.fr : r.en)}</p>`);

  // ---------- verse of the day, by mood ----------
  let vOff = 0,
    vMood = null;
  function verseUI() {
    const el = $("#vd");
    if (!el) return;
    const m = vMood === null ? mood() : vMood,
      list = V.filter((v) => v[0] === m),
      v = list[(doy() + vOff) % list.length];
    el.innerHTML = `<p class="ey">Qur’an · for how you feel</p><div class="sh" style="margin-bottom:14px"><h2>Verse of the day</h2><button class="ch" id="vn">Another verse</button></div>
      <div class="chs" id="vc">${MN.map((n, i) => `<button class="ch${i === m ? " on" : ""}" data-vm="${i}">${n}</button>`).join("")}</div>
      <div class="vbox"><div class="ar-q va" lang="ar" dir="rtl">${v[1]}</div>${meaning({ en: v[5], fr: v[6] })}<small class="mu vr">${esc(surah(v[3], v[4], v[2]))}</small></div>
      <p class="mu" style="font-size:11.5px;margin:14px 0 0">Translation of the meaning, not the Qur’an itself.</p>`;
  }
  // ---------- hadith ----------
  let hOff = 0;
  function hadithUI() {
    const el = $("#hd");
    if (!el) return;
    const h = H[(doy() + hOff) % H.length];
    el.innerHTML = `<p class="ey">Words of the Prophet ﷺ</p><div class="sh" style="margin-bottom:14px"><h2>A saying to carry with you today</h2><button class="ch" id="hn">Another saying</button></div>
      <div class="vbox hb"><div class="ar-q va" lang="ar" dir="rtl">${h[0]}</div>${meaning({ en: h[3], fr: h[4] })}<small class="mu vr">${esc(lang() === "ar" ? h[2] : h[1])}</small></div>`;
  }

  // ---------- prayer times (astronomical calculation, Fajr/Isha 18°, standard Asr) ----------
  const SOUSSE = { lat: 35.8256, lng: 10.6084, tz: "Africa/Tunis", def: true };
  let LOC = SOUSSE;
  try {
    const s = JSON.parse(localStorage.getItem("hw_loc"));
    if (s && s.lat) LOC = s;
  } catch (e) {}
  const rd = Math.PI / 180,
    sn = (d) => Math.sin(d * rd),
    cs = (d) => Math.cos(d * rd),
    tn = (d) => Math.tan(d * rd),
    fx = (a, m) => a - m * Math.floor(a / m);
  function prayerTimes(y, mo, d) {
    const jd = Date.UTC(y, mo, d, 12) / 864e5 + 2440587.5,
      D = jd - 2451545,
      g = fx(357.529 + 0.98560028 * D, 360),
      q = fx(280.459 + 0.98564736 * D, 360),
      Lg = fx(q + 1.915 * sn(g) + 0.02 * sn(2 * g), 360),
      e = 23.439 - 3.6e-7 * D;
    const RA = fx(Math.atan2(cs(e) * sn(Lg), cs(Lg)) / rd, 360) / 15,
      eq = q / 15 - RA,
      dec = Math.asin(sn(e) * sn(Lg)) / rd,
      noon = fx(12 - LOC.lng / 15 - eq, 24);
    const ha = (a) => Math.acos((-sn(a) - sn(dec) * sn(LOC.lat)) / (cs(dec) * cs(LOC.lat))) / rd / 15,
      ac = -Math.atan(1 / (1 + tn(Math.abs(LOC.lat - dec)))) / rd,
      asr = Math.acos((sn(ac) - sn(dec) * sn(LOC.lat)) / (cs(dec) * cs(LOC.lat))) / rd / 15;
    const t0 = Date.UTC(y, mo, d),
      at = (h) => new Date(t0 + h * 36e5);
    return [
      at(noon - ha(18)),
      at(noon + 0.02),
      at(noon + asr),
      at(noon + ha(0.833) + 0.02),
      at(noon + ha(18)),
    ]; // Fajr, Dhuhr, Asr, Maghrib, Isha
  }
  const PRN = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const fmt = (t) =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: LOC.tz,
    }).format(t);
  const tzDate = (off = 0) => {
    const p = new Intl.DateTimeFormat("en-CA", { timeZone: LOC.tz })
      .format(Date.now() + off * DAY)
      .split("-")
      .map(Number);
    return p;
  };
  const dkey = (off = 0) =>
    tzDate(off)
      .join("-")
      .replace(/-(\d)(?=-|$)/g, "-0$1");
  const todayDone = () => (S.prayers && S.prayers[dkey()]) || [0, 0, 0, 0, 0];
  function nextPrayer() {
    const p = tzDate(),
      t = prayerTimes(p[0], p[1] - 1, p[2]),
      now = Date.now(),
      i = t.findIndex((x) => x > now);
    if (i >= 0) return [PRN[i], t[i] - now];
    const q = tzDate(1),
      n = prayerTimes(q[0], q[1] - 1, q[2]);
    return ["Fajr", n[0] - now];
  }
  const dur = (ms) => {
    const m = Math.max(1, Math.round(ms / 6e4));
    return (m >= 60 ? ((m / 60) | 0) + "h " : "") + (m % 60) + "m";
  };
  function prayerUI() {
    const el = $("#pr");
    if (!el) return;
    const p = tzDate(),
      t = prayerTimes(p[0], p[1] - 1, p[2]),
      done = todayDone(),
      nx = nextPrayer(),
      n = done.filter(Boolean).length;
    const wk = [6, 5, 4, 3, 2, 1, 0]
      .map((o) => {
        const a = (S.prayers && S.prayers[dkey(-o)]) || [],
          c = a.filter(Boolean).length,
          day = new Date(Date.now() - o * DAY).toLocaleDateString(undefined, { weekday: "narrow" });
        return `<div class="pw"><i style="height:${(c / 5) * 100}%"></i><span>${day}</span></div>`;
      })
      .join("");
    el.innerHTML = `<div class="sh" style="margin-bottom:6px"><div><p class="ey">Prayer times</p><h2>${esc(LOC.def ? hwTr("Sousse, Tunisia") : "📍")}</h2></div><span class="pl">Next: ${nx[0]} in ${dur(nx[1])}</span></div>
      <p class="mu" style="margin:0 0 12px">Tick each prayer once you have prayed.</p>
      ${PRN.map((r, i) => `<label class="pry${nx[0] === r ? " nx" : ""}${done[i] ? " dn" : ""}"><input type="checkbox" data-pr="${i}"${done[i] ? " checked" : ""}><span class="bx"></span><b>${r}</b><em>${fmt(t[i])}</em></label>`).join("")}
      <p class="mu" style="margin:14px 0 4px;font-weight:600;color:var(--mv)">You’ve got ${n} of 5 prayers today</p>
      <div class="pwk" aria-label="This week">${wk}</div>
      <p class="mu" style="font-size:11.5px;margin:10px 0 0">Times are calculated for your location and can differ by a minute or two from your local mosque.</p>`;
  }
  document.addEventListener("change", async (e) => {
    const c = e.target.closest("[data-pr]");
    if (!c) return;
    const k = dkey(),
      a = todayDone().slice();
    a[+c.dataset.pr] = c.checked ? 1 : 0;
    S.prayers = S.prayers || {};
    S.prayers[k] = a;
    prayerUI();
    try {
      await API.f("/prayers", { m: "PUT", b: { date: k, done: a } });
    } catch (x) {
      toast(x.message);
    }
  });

  // ---------- Qur'an reading time (10 minutes) ----------
  const MSG = [
    "Begin with “Bismillah” and set your intention: reading for Allah, for peace, for guidance.",
    "Read slowly, with tartil. Let each verse reach your heart.",
    "A hard day? Even one page is a victory.",
    "Pause where a verse touches you, and read it again.",
    "You’re doing it. Stay with the Qur’an a little longer.",
  ];
  let T = 600,
    ti = null;
  function qrUI() {
    const f = VF[doy() % VF.length];
    $("#qv").innerHTML = f[0];
    $("#qvt").textContent =
      (lang() === "ar" ? "" : (lang() === "fr" ? f[5] : f[4]) + " · ") +
      (lang() === "ar" ? "سورة " + f[3] : "Surah " + f[2]) +
      " " +
      f[1];
    $("#tm").textContent = String((T / 60) | 0).padStart(2, "0") + ":" + String(T % 60).padStart(2, "0");
    $("#qbar").style.width = (600 - T) / 6 + "%";
    $("#qm").textContent = MSG[Math.min(4, ((600 - T) / 120) | 0)];
    qList();
  }
  function qList() {
    const el = $("#ql");
    if (!el) return;
    const q = (S.quran || []).slice(-3).reverse();
    el.innerHTML = q.length
      ? '<p class="ey" style="margin-top:20px">Your recent reading notes</p>' +
        q
          .map(
            (n) =>
              '<div class="pad"><b>' +
              new Date(n.ts).toLocaleDateString(undefined, { day: "numeric", month: "short" }) +
              ' <button class="ch" data-nd="' +
              n.id +
              '" style="float:right;padding:1px 8px">✕</button></b><span>' +
              esc(n.x.slice(0, 140)) +
              (n.x.length > 140 ? "…" : "") +
              "</span></div>",
          )
          .join("")
      : "";
  }
  window.hwQuranList = qList;
  $("#ts").onclick = () => {
    if (ti) {
      clearInterval(ti);
      ti = null;
      $("#ts").textContent = hwTr("Resume");
      return;
    }
    $("#ts").textContent = hwTr("Pause");
    ti = setInterval(() => {
      T--;
      qrUI();
      if (T <= 0) {
        clearInterval(ti);
        ti = null;
        T = 600;
        qrUI();
        $("#ts").textContent = hwTr("Bismillah, begin");
        toast("May Allah accept your reading 🤍 Take a real break and drink some water.");
        if (window.hwCelebrate) hwCelebrate();
      }
    }, 1000);
  };
  $("#tr").onclick = () => {
    clearInterval(ti);
    ti = null;
    T = 600;
    $("#ts").textContent = hwTr("Bismillah, begin");
    qrUI();
  };
  $("#qsv").onclick = async () => {
    const x = $("#qn").value.trim();
    if (!x) return;
    try {
      (S.quran = S.quran || []).push(await API.f("/notes", { m: "POST", b: { text: x, kind: "quran" } }));
      $("#qn").value = "";
      qList();
      toast("Reading note saved 🤍");
    } catch (e) {
      toast(e.message);
    }
  };

  // ---------- profile ----------
  function profileUI() {
    if (!window.ME) return;
    $("#pfn").value = ME.name || "";
    $("#pfu").textContent = "@" + ME.username;
    $("#pfa").textContent = ME.alias || S.alias;
  }
  $("#pfs").onclick = async () => {
    try {
      const m = await API.f("/me/name", { m: "PUT", b: { name: $("#pfn").value } });
      ME.name = m.name;
      $(".us b").textContent = m.name || "You";
      $(".us .av").textContent = (m.name || m.username)[0].toUpperCase();
      toast("Name saved");
    } catch (e) {
      toast(e.message);
    }
  };
  $("#pwb").onclick = async () => {
    const a = $("#pw0").value,
      b = $("#pw1").value,
      c = $("#pw2").value;
    $("#pwe").textContent = "";
    if (b !== c) return void ($("#pwe").textContent = hwTr("Passwords don’t match"));
    try {
      await API.f("/me/password", { m: "POST", b: { current: a, next: b } });
      ["#pw0", "#pw1", "#pw2"].forEach((i) => ($(i).value = ""));
      toast("Password updated. Other devices were signed out.");
    } catch (e) {
      $("#pwe").textContent = hwTr(e.message);
    }
  };
  $("#pwo").onclick = () => logout();
  const us = document.querySelector(".us");
  if (us) {
    us.style.cursor = "pointer";
    us.addEventListener("click", (e) => {
      if (!e.target.closest("#lo")) go(5);
    });
  }

  // ---------- settings modal ----------
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="stm" hidden><div class="c stc" role="dialog" aria-modal="true"><div class="sh" style="margin-bottom:6px"><h2>Settings</h2><button class="ch" id="stx">Close</button></div>
    <p class="ey" style="margin-top:18px">Language</p><div class="chs" id="stl"></div>
    <p class="ey" style="margin-top:18px">Appearance</p><div class="chs"><button class="ch" data-th="light">☀ Light</button><button class="ch" data-th="dark">☾ Dark</button></div>
    <p class="ey" style="margin-top:18px">Prayer location</p><div class="chs"><button class="ch" id="lc0">Sousse, Tunisia</button><button class="ch" id="lc1">Use my location</button></div></div></div>`,
  );
  $("#stl").innerHTML = Object.keys(hwLangs)
    .map(
      (k) =>
        `<button class="ch${lang() === k ? " on" : ""}" data-lang="${k}" lang="${k}">${hwLangs[k][0]}</button>`,
    )
    .join("");
  const open = (v) => {
      $("#stm").hidden = !v;
    },
    sync = () => {
      const d = document.documentElement.dataset.theme || "light";
      $$("[data-th]").forEach((b) => b.classList.toggle("on", b.dataset.th === d));
      $("#lc0").classList.toggle("on", !!LOC.def);
      $("#lc1").classList.toggle("on", !LOC.def);
    };
  window.hwSettings = () => {
    sync();
    open(true);
  };
  $("#th").onclick = hwSettings;
  $("#stx").onclick = () => open(false);
  $("#stm").onclick = (e) => {
    if (e.target.id === "stm") open(false);
  };
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") open(false);
  });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-th]");
    if (!b) return;
    document.documentElement.dataset.theme = b.dataset.th;
    try {
      localStorage.setItem("hw4t", b.dataset.th);
    } catch (x) {}
    sync();
  });
  const setLoc = (l) => {
    LOC = l;
    try {
      localStorage.setItem("hw_loc", JSON.stringify(l));
    } catch (e) {}
    sync();
    prayerUI();
  };
  $("#lc0").onclick = () => setLoc(SOUSSE);
  $("#lc1").onclick = () =>
    navigator.geolocation
      ? navigator.geolocation.getCurrentPosition(
          (p) => {
            setLoc({
              lat: p.coords.latitude,
              lng: p.coords.longitude,
              tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });
            toast("Location updated");
          },
          () => toast("Location unavailable. Using Sousse."),
          { timeout: 8000 },
        )
      : toast("Location unavailable. Using Sousse.");

  // ---------- wiring ----------
  document.addEventListener("click", (e) => {
    if (e.target.closest("#vn")) {
      vOff++;
      verseUI();
    } else if (e.target.closest("#hn")) {
      hOff++;
      hadithUI();
    }
    const c = e.target.closest("[data-vm]");
    if (c) {
      vMood = +c.dataset.vm;
      vOff = 0;
      verseUI();
    }
  });
  const all = () => {
    verseUI();
    hadithUI();
    prayerUI();
    qrUI();
    profileUI();
  };
  const _r = render;
  render = function () {
    _r();
    if (vMood === null) verseUI();
  };
  window.hwAfterBoot = () => {
    vMood = null;
    all();
  };
  addEventListener("hw:lang", all);
  setInterval(() => {
    if ($("#s4").classList.contains("on")) prayerUI();
  }, 30000);
  all();
})();
