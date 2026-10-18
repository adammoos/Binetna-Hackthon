/* HERwell i18n: English (source), Français, العربية. Translates static text, dynamic text,
   placeholders, toasts and server messages by watching the DOM. No page reload needed. */
(function () {
  const D = [
    // [English, Français, العربية]
    ["Academics", "Études", "الدراسة"],
    ["Study well, rest well", "Étudie bien, repose-toi bien", "ادرسي جيدا وارتاحي جيدا"],
    ["Class timetable", "Emploi du temps", "جدول الحصص"],
    ["My exams", "Mes examens", "امتحاناتي"],
    ["Add class", "Ajouter un cours", "إضافة حصة"],
    ["Add exam", "Ajouter un examen", "إضافة امتحان"],
    ["Create my plan with Folla", "Créer mon plan avec Folla", "أنشئي خطتي مع فولا"],
    ["Your calm study & rest plan", "Ton plan calme d’étude et de repos", "خطتك الهادئة للدراسة والراحة"],
    ["Helpful tips found by Folla", "Conseils utiles trouvés par Folla", "نصائح مفيدة وجدتها فولا"],
    ["Folla’s insight", "L’avis de Folla", "رأي فولا"],
    // navigation & shell
    ["Home", "Accueil", "الرئيسية"],
    ["My journey", "Mon parcours", "رحلتي"],
    ["AI companion", "Compagne IA", "الرفيقة الذكية"],
    ["Community", "Communauté", "المجتمع"],
    ["Self-care", "Prendre soin de soi", "العناية بالنفس"],
    ["Profile", "Profil", "الملف الشخصي"],
    ["Settings", "Paramètres", "الإعدادات"],
    ["Daily bloom", "Éclosion du jour", "إشراقة اليوم"],
    [
      "Small steps are still progress.",
      "Les petits pas sont aussi des progrès.",
      "الخطوات الصغيرة تقدّم أيضًا.",
    ],
    ["Log out", "Se déconnecter", "تسجيل الخروج"],
    ["You", "Toi", "أنتِ"],
    // sign-in
    [
      "A safe, private space. Others only ever see a random alias, never your name.",
      "Un espace sûr et privé. Les autres ne voient qu’un pseudo aléatoire, jamais ton nom.",
      "مساحة آمنة وخاصة. لا يرى الآخرون سوى اسم مستعار عشوائي، ولا يرون اسمك أبدًا.",
    ],
    ["Sign in", "Se connecter", "تسجيل الدخول"],
    ["Create account", "Créer un compte", "إنشاء حساب"],
    ["First name (private, optional)", "Prénom (privé, facultatif)", "الاسم الأول (خاص، اختياري)"],
    ["Username", "Nom d’utilisateur", "اسم المستخدم"],
    ["Password (6+ characters)", "Mot de passe (6 caractères min.)", "كلمة المرور (6 أحرف على الأقل)"],
    // home
    ["✿ Your daily check-in", "✿ Ton check-in du jour", "✿ متابعتك اليومية"],
    ["How is your heart feeling today?", "Comment va ton cœur aujourd’hui ?", "كيف حال قلبك اليوم؟"],
    [
      "There’s no right answer. Just notice what’s here, without judgement.",
      "Il n’y a pas de bonne réponse. Observe simplement ce qui est là, sans jugement.",
      "لا توجد إجابة صحيحة. فقط لاحظي ما تشعرين به دون حكم.",
    ],
    ["Save my check-in ›", "Enregistrer mon check-in ›", "حفظ متابعتي ›"],
    ["Low", "Bas", "منخفض"],
    ["Tender", "Fragile", "رقيق"],
    ["Okay", "Ça va", "عادي"],
    ["Good", "Bien", "جيد"],
    ["Radiant", "Rayonnante", "مشرق"],
    ["Your safe space", "Ton espace sûr", "مساحتك الآمنة"],
    ["Talk to Folla", "Parle à Folla", "تحدّثي مع فولا"],
    ["Always here", "Toujours là", "هنا دائمًا"],
    ["AI companion", "Compagne IA", "رفيقة ذكية"],
    [
      "I’m here with you. What’s been taking up the most space in your mind today?",
      "Je suis là avec toi. Qu’est-ce qui prend le plus de place dans ton esprit aujourd’hui ?",
      "أنا معكِ. ما الذي يشغل أكبر مساحة في بالك اليوم؟",
    ],
    ["I’m feeling overwhelmed", "Je me sens débordée", "أشعر بأنني مُرهَقة بالضغوط"],
    ["I need to clear my mind", "J’ai besoin de vider ma tête", "أحتاج إلى تصفية ذهني"],
    ["Share what’s on your mind…", "Partage ce que tu as en tête…", "شاركيني ما يدور في بالك…"],
    [
      "Your conversations are private and judgement-free.",
      "Tes conversations sont privées et sans jugement.",
      "محادثاتك خاصة وخالية من الأحكام.",
    ],
    ["A moment for you", "Un moment pour toi", "لحظة لأجلك"],
    ["Choose your care", "Choisis ton soin", "اختاري عنايتك"],
    ["View all ›", "Tout voir ›", "عرض الكل ›"],
    ["2-minute reset", "Pause de 2 minutes", "إعادة ضبط في دقيقتين"],
    ["Release the tension", "Relâche la tension", "تخلّصي من التوتر"],
    ["▸ 2 min", "▸ 2 min", "▸ 2 د"],
    ["Morning pages", "Pages du matin", "صفحات الصباح"],
    ["Write without judgement", "Écris sans jugement", "اكتبي دون حكم"],
    ["▸ 5 min", "▸ 5 min", "▸ 5 د"],
    ["Qur’an reading", "Lecture du Coran", "قراءة القرآن"],
    ["Read with presence", "Lis avec présence", "اقرئي بحضور القلب"],
    ["▸ 10 min", "▸ 10 min", "▸ 10 د"],
    ["Her circle", "Son cercle", "دائرتها"],
    ["You don’t have to carry it alone", "Tu n’as pas à porter ça seule", "لستِ مضطرّة لحمل ذلك وحدك"],
    [
      "Share anonymously with women who understand university life, exams and the first job. No name, no photo, no judgement.",
      "Partage anonymement avec des femmes qui comprennent la vie universitaire, les examens et le premier emploi. Pas de nom, pas de photo, pas de jugement.",
      "شاركي بشكل مجهول مع نساء يفهمن الحياة الجامعية والامتحانات والوظيفة الأولى. بلا اسم ولا صورة ولا أحكام.",
    ],
    ["Join the circle", "Rejoindre le cercle", "انضمّي إلى الدائرة"],
    ["Weekly rhythm", "Rythme de la semaine", "إيقاع الأسبوع"],
    ["Your wellbeing", "Ton bien-être", "راحتك النفسية"],
    ["Looking steadier", "Plus stable", "أكثر استقرارًا"],
    ["A softer week", "Une semaine plus douce", "أسبوع أهدأ"],
    ["Your gentle insight", "Ton éclairage doux", "ملاحظة لطيفة لك"],
    ["Today’s reflection", "Réflexion du jour", "تأمّل اليوم"],
    [
      "What do you need a little less of today?",
      "De quoi as-tu besoin d’un peu moins aujourd’hui ?",
      "ما الذي تحتاجين إلى القليل منه اليوم؟",
    ],
    ["Open journal ›", "Ouvrir le journal ›", "فتح الدفتر ›"],
    // journey
    ["Your mood & your cycle", "Ton humeur et ton cycle", "مزاجك ودورتك"],
    ["Be proud of you", "Sois fière de toi", "افخري بنفسك"],
    ["Your latest achievements", "Tes dernières réussites", "آخر إنجازاتك"],
    [
      "Add a win, big or small.",
      "Ajoute une victoire, grande ou petite.",
      "أضيفي إنجازًا، كبيرًا كان أو صغيرًا.",
    ],
    ["What are you proud of today?", "De quoi es-tu fière aujourd’hui ?", "بماذا تفخرين اليوم؟"],
    [
      "I finished my chapter… I said no when I needed to… I got out of bed on a hard day…",
      "J’ai fini mon chapitre… J’ai dit non quand il le fallait… Je me suis levée un jour difficile…",
      "أنهيتُ فصلي… قلتُ لا حين احتجتُ… نهضتُ من فراشي في يوم صعب…",
    ],
    ["Save achievement ✦", "Enregistrer la réussite ✦", "حفظ الإنجاز ✦"],
    ["Mood this fortnight", "Humeur ces 2 semaines", "المزاج خلال أسبوعين"],
    ["Cycle settings", "Réglages du cycle", "إعدادات الدورة"],
    ["Used only on this device.", "Utilisé uniquement sur cet appareil.", "يُستخدم على هذا الجهاز فقط."],
    ["Last period began", "Début des dernières règles", "بداية آخر دورة"],
    ["Cycle length (days)", "Durée du cycle (jours)", "طول الدورة (أيام)"],
    ["Period length (days)", "Durée des règles (jours)", "مدة الدورة (أيام)"],
    ["Menstrual", "Menstruelle", "الحيض"],
    ["Follicular", "Folliculaire", "الجريبية"],
    ["Ovulation", "Ovulation", "الإباضة"],
    ["Luteal", "Lutéale", "الأصفرية"],
    ["Advice for today", "Conseils du jour", "نصائح اليوم"],
    ["Rest & restore", "Repos et récupération", "راحة واستعادة"],
    ["Energy is low", "L’énergie est basse", "الطاقة منخفضة"],
    ["Rising energy", "Énergie en hausse", "طاقة متصاعدة"],
    ["Energy is building", "L’énergie monte", "الطاقة تتزايد"],
    ["Peak confidence", "Confiance au sommet", "ذروة الثقة"],
    ["Energy is high", "L’énergie est haute", "الطاقة مرتفعة"],
    ["Slow down & structure", "Ralentis et structure", "تمهّلي ونظّمي"],
    ["Energy is winding down", "L’énergie redescend", "الطاقة تتراجع"],
    ["Food", "Alimentation", "الغذاء"],
    ["Movement", "Mouvement", "الحركة"],
    ["Study", "Études", "الدراسة"],
    ["Care", "Soin", "العناية"],
    [
      "Iron-rich meals (lentils, spinach, dates) and warm drinks.",
      "Repas riches en fer (lentilles, épinards, dattes) et boissons chaudes.",
      "وجبات غنية بالحديد (عدس، سبانخ، تمر) ومشروبات دافئة.",
    ],
    [
      "Gentle yoga or a slow walk. Skip intense workouts if cramping.",
      "Yoga doux ou marche lente. Évite l’effort intense en cas de crampes.",
      "يوغا لطيفة أو مشي بطيء. تجنّبي التمارين الشاقة عند وجود تقلّصات.",
    ],
    [
      "Lighter days: review and reading, postpone heavy new topics.",
      "Journées plus légères : révision et lecture, reporte les nouveaux sujets lourds.",
      "أيام أخفّ: مراجعة وقراءة، وأجّلي المواضيع الجديدة الثقيلة.",
    ],
    [
      "Heat pad, early bedtime and permission to say no.",
      "Bouillotte, coucher tôt et le droit de dire non.",
      "كمّادة دافئة، نوم مبكر، وإذن لنفسك بقول لا.",
    ],
    [
      "Fresh veg, eggs, fish and plenty of protein.",
      "Légumes frais, œufs, poisson et beaucoup de protéines.",
      "خضار طازجة وبيض وسمك وبروتين وفير.",
    ],
    [
      "Great for cardio, strength or a new class.",
      "Idéal pour le cardio, la force ou un nouveau cours.",
      "رائعة للكارديو أو القوة أو حصة جديدة.",
    ],
    [
      "Best phase to learn new topics and start projects.",
      "Meilleure phase pour apprendre de nouveaux sujets et lancer des projets.",
      "أفضل مرحلة لتعلّم مواضيع جديدة وبدء المشاريع.",
    ],
    [
      "Social plans feel easier. Book what you’ve been avoiding.",
      "Les sorties semblent plus faciles. Prends rendez-vous pour ce que tu évitais.",
      "اللقاءات أسهل. احجزي ما كنتِ تتجنّبينه.",
    ],
    [
      "Hydrate; colorful veg and healthy fats like olive oil.",
      "Hydrate-toi ; légumes colorés et bonnes graisses comme l’huile d’olive.",
      "اشربي الماء؛ خضار ملوّنة ودهون صحية كزيت الزيتون.",
    ],
    [
      "Go for an intense workout. Warm up well.",
      "Fais une séance intense. Échauffe-toi bien.",
      "مارسي تمرينًا مكثّفًا مع إحماء جيد.",
    ],
    [
      "Ideal for presentations, interviews and teamwork.",
      "Idéal pour les présentations, entretiens et le travail d’équipe.",
      "مثالية للعروض والمقابلات والعمل الجماعي.",
    ],
    [
      "Use this energy to network and ask for what you need.",
      "Utilise cette énergie pour réseauter et demander ce dont tu as besoin.",
      "استثمري هذه الطاقة في التواصل وطلب ما تحتاجينه.",
    ],
    [
      "Magnesium (nuts, dark chocolate), less caffeine and salt.",
      "Magnésium (noix, chocolat noir), moins de caféine et de sel.",
      "مغنيسيوم (مكسّرات، شوكولاتة داكنة) وقلّلي الكافيين والملح.",
    ],
    [
      "Pilates, swimming or walks. Moderate is enough.",
      "Pilates, natation ou marche. Modéré suffit.",
      "بيلاتس أو سباحة أو مشي. الاعتدال يكفي.",
    ],
    [
      "Revise and organize rather than learn new material.",
      "Révise et organise plutôt que d’apprendre du nouveau.",
      "راجعي ونظّمي بدل تعلّم مادة جديدة.",
    ],
    [
      "Protect your sleep. PMS mood dips are common and temporary.",
      "Protège ton sommeil. Les baisses de moral prémenstruelles sont fréquentes et passagères.",
      "احمي نومك. تقلّبات المزاج قبل الدورة شائعة ومؤقتة.",
    ],
    [
      "Your last mood was low. Lower the bar today, eat something warm and message someone you trust.",
      "Ton dernier moral était bas. Baisse la barre aujourd’hui, mange quelque chose de chaud et écris à quelqu’un de confiance.",
      "كان مزاجك الأخير منخفضًا. خفّفي توقعاتك اليوم، وتناولي شيئًا دافئًا، وراسلي من تثقين به.",
    ],
    ["Talk to Folla", "Parle à Folla", "تحدّثي مع فولا"],
    [
      "You logged a good mood. Ride the wave and tackle one postponed thing.",
      "Tu as noté une bonne humeur. Profites-en pour t’attaquer à une chose reportée.",
      "سجّلتِ مزاجًا جيدًا. استثمريه وأنجزي أمرًا مؤجّلًا.",
    ],
    [
      "Wellbeing guidance only, not medical advice. See a doctor for severe pain or very irregular cycles.",
      "Conseils de bien-être uniquement, pas un avis médical. Consulte un médecin en cas de douleur sévère ou de cycles très irréguliers.",
      "إرشادات للراحة النفسية فقط وليست نصيحة طبية. راجعي الطبيب عند الألم الشديد أو اضطراب الدورة.",
    ],
    ["First check-in", "Premier check-in", "أول متابعة"],
    ["3-day streak", "3 jours d’affilée", "3 أيام متتالية"],
    ["7 check-ins", "7 check-ins", "7 متابعات"],
    ["First morning page", "Première page du matin", "أول صفحة صباحية"],
    ["Shared in the circle", "Partagé dans le cercle", "شاركتِ في الدائرة"],
    ["First achievement", "Première réussite", "أول إنجاز"],
    [
      "Every step counts. Write down your first win today, even a tiny one.",
      "Chaque pas compte. Note ta première victoire aujourd’hui, même minuscule.",
      "كل خطوة لها قيمة. اكتبي أول إنجاز لك اليوم ولو كان صغيرًا.",
    ],
    ["Your wins will shine here ✨", "Tes victoires brilleront ici ✨", "ستُضيء إنجازاتك هنا ✨"],
    [
      "Passed an exam? Asked for help? Got out of bed on a hard day? It all counts.",
      "Réussi un examen ? Demandé de l’aide ? Levée un jour difficile ? Tout compte.",
      "نجحتِ في امتحان؟ طلبتِ المساعدة؟ نهضتِ في يوم صعب؟ كل ذلك يُحسب.",
    ],
    [
      "Save your first check-in and your mood story will start here 🌸",
      "Enregistre ton premier check-in et l’histoire de ton humeur commencera ici 🌸",
      "احفظي أول متابعة لتبدأ قصة مزاجك هنا 🌸",
    ],
    // companion
    ["Talk with Folla", "Discute avec Folla", "تحدّثي مع فولا"],
    [
      "Type how you feel… English, Français or Derja",
      "Écris ce que tu ressens… English, Français ou Derja",
      "اكتبي ما تشعرين به… بالعربية أو الفرنسية أو الدارجة",
    ],
    ["I’m stressed about my exams", "Je suis stressée par mes examens", "أنا متوترة بسبب امتحاناتي"],
    [
      "I feel anxious about job hunting",
      "Je suis anxieuse à cause de la recherche d’emploi",
      "أشعر بالقلق من البحث عن عمل",
    ],
    [
      "Cramps and I can’t focus",
      "J’ai des crampes et je n’arrive pas à me concentrer",
      "لديّ تقلّصات ولا أستطيع التركيز",
    ],
    ["Help me plan a calm day", "Aide-moi à planifier une journée calme", "ساعديني في تخطيط يوم هادئ"],
    [
      "Non-diagnostic support. In an emergency call SAMU 190 or reach a trusted person.",
      "Soutien non diagnostique. En cas d’urgence, appelle le SAMU 190 ou une personne de confiance.",
      "دعم غير تشخيصي. في الطوارئ اتصلي بالسامو 190 أو بشخص تثقين به.",
    ],
    // community
    [
      "Anonymous by design: random alias, no photos, no profiles.",
      "Anonyme par conception : pseudo aléatoire, pas de photos, pas de profils.",
      "مجهولة بالتصميم: اسم مستعار عشوائي، بلا صور ولا ملفات.",
    ],
    ["Your alias", "Ton pseudo", "اسمك المستعار"],
    ["New alias", "Nouveau pseudo", "اسم جديد"],
    [
      "What kind of replies would help you most?",
      "Quel type de réponses t’aiderait le plus ?",
      "أي نوع من الردود سيفيدك أكثر؟",
    ],
    ["🧭 I’m seeking help", "🧭 Je cherche de l’aide", "🧭 أبحث عن مساعدة"],
    ["Advice and answers, please", "Des conseils et des réponses, s’il vous plaît", "نصائح وإجابات من فضلكم"],
    ["🤍 I just want to chat", "🤍 Je veux juste discuter", "🤍 أريد فقط أن أتحدّث"],
    [
      "Feel heard, no fixing needed",
      "Être écoutée, sans solution à trouver",
      "أن يُسمَع صوتي دون حاجة إلى حلول",
    ],
    [
      "Share a worry, a win or a question…",
      "Partage une inquiétude, une victoire ou une question…",
      "شاركي همًّا أو إنجازًا أو سؤالًا…",
    ],
    [
      "Ask your question or describe what you need help with…",
      "Pose ta question ou décris ce pour quoi tu as besoin d’aide…",
      "اطرحي سؤالك أو صفي ما تحتاجين مساعدة فيه…",
    ],
    [
      "Share what’s on your heart. Nobody will try to fix it…",
      "Partage ce que tu as sur le cœur. Personne n’essaiera de le réparer…",
      "شاركي ما في قلبك. لن يحاول أحد إصلاحه…",
    ],
    ["Support", "Soutien", "دعم"],
    ["Win", "Victoire", "إنجاز"],
    ["Question", "Question", "سؤال"],
    ["Post anonymously", "Publier anonymement", "نشر بشكل مجهول"],
    ["Delete", "Supprimer", "حذف"],
    ["You are not alone.", "Tu n’es pas seule.", "لستِ وحدك."],
    [
      "Please reach a trusted person or a doctor now. If you may be in danger, call SAMU 190.",
      "Contacte maintenant une personne de confiance ou un médecin. Si tu es en danger, appelle le SAMU 190.",
      "تواصلي الآن مع شخص تثقين به أو مع طبيب. وإن كنتِ في خطر فاتصلي بالسامو 190.",
    ],
    ["🧭 Seeking help", "🧭 Cherche de l’aide", "🧭 تبحث عن مساعدة"],
    ["🤍 Just chatting", "🤍 Discute simplement", "🤍 تتحدّث فقط"],
    ["💡 Answer", "💡 Réponse", "💡 إجابة"],
    ["🤍 Kind words", "🤍 Mots doux", "🤍 كلمات طيبة"],
    ["Share advice or an answer…", "Partage un conseil ou une réponse…", "شاركي نصيحة أو إجابة…"],
    ["Send some kind words…", "Envoie quelques mots doux…", "أرسلي بعض الكلمات الطيبة…"],
    [
      "Nothing here yet. Be the first to share 💜",
      "Rien ici pour l’instant. Sois la première à partager 💜",
      "لا شيء هنا بعد. كوني أول من يشارك 💜",
    ],
    ["Stories of strength", "Histoires de force", "قصص القوة"],
    [
      "Composite stories inspired by real student experiences.",
      "Histoires composites inspirées d’expériences étudiantes réelles.",
      "قصص مركّبة مستوحاة من تجارب طالبات حقيقية.",
    ],
    ["🤗 Hug", "🤗 Câlin", "🤗 عناق"],
    ["🙋 Same here", "🙋 Moi aussi", "🙋 وأنا مثلك"],
    ["✨ Proud", "✨ Fière", "✨ فخورة"],
    [
      "PFE defense in 9 days and I haven’t slept properly all week. Anyone else feeling behind even when they’re not?",
      "Soutenance de PFE dans 9 jours et je n’ai pas bien dormi de la semaine. Quelqu’un d’autre se sent en retard même quand ce n’est pas le cas ?",
      "مناقشة مشروع التخرج بعد 9 أيام ولم أنم جيدًا طوال الأسبوع. هل تشعر أخريات بالتأخر حتى حين لا يكنّ متأخرات؟",
    ],
    [
      "I finally booked an appointment with the campus counselor. Terrified, but I did it. 💜",
      "J’ai enfin pris rendez-vous avec la conseillère du campus. Terrifiée, mais je l’ai fait. 💜",
      "حجزتُ أخيرًا موعدًا مع مرشدة الجامعة. كنتُ خائفة لكنني فعلتها. 💜",
    ],
    [
      "How do you study when cramps hit hard on exam week?",
      "Comment réviser quand les crampes frappent fort en semaine d’examens ?",
      "كيف تدرسين حين تشتدّ التقلّصات في أسبوع الامتحانات؟",
    ],
    [
      "I have a job interview on Monday and my mind goes blank when I get nervous. Any tips that worked for you?",
      "J’ai un entretien d’embauche lundi et mon esprit se vide quand je stresse. Des astuces qui ont marché pour toi ?",
      "لدي مقابلة عمل يوم الإثنين وأنسى كل شيء عند التوتر. هل من نصائح نفعتكنّ؟",
    ],
    [
      "Write 3 likely questions the night before and say the answers out loud once. It also helped me to pause and breathe before answering. You’ve got this.",
      "Écris 3 questions probables la veille et dis les réponses à voix haute une fois. Ça m’a aussi aidée de faire une pause et de respirer avant de répondre. Tu vas y arriver.",
      "اكتبي 3 أسئلة متوقعة في الليلة السابقة وانطقي إجاباتها بصوت عالٍ مرة. ساعدني أيضًا أن أتوقف وأتنفس قبل الإجابة. ستنجحين.",
    ],
    ["Exam season", "Saison d’examens", "موسم الامتحانات"],
    ["First job", "Premier emploi", "الوظيفة الأولى"],
    ["Burnout recovery", "Se relever d’un burn-out", "التعافي من الإنهاك"],
    ["Sara · Engineering student", "Sara · Étudiante en ingénierie", "سارة · طالبة هندسة"],
    [
      "Mariem · Junior developer, Sousse",
      "Mariem · Développeuse junior, Sousse",
      "مريم · مطوّرة مبتدئة، سوسة",
    ],
    ["Yasmine · Master’s student", "Yasmine · Étudiante en master", "ياسمين · طالبة ماستر"],
    [
      "I failed my first exam and nearly dropped out. I noticed my worst study days were the first two of my period, so I rearranged revision around my cycle. My next results rose by five points.",
      "J’ai raté mon premier examen et failli abandonner. J’ai remarqué que mes pires jours d’étude étaient les deux premiers de mes règles, alors j’ai organisé mes révisions autour de mon cycle. Mes résultats suivants ont gagné cinq points.",
      "رسبتُ في أول امتحان وكدتُ أترك الدراسة. لاحظتُ أن أسوأ أيام مراجعتي هي أول يومين من الدورة، فأعدتُ تنظيم المراجعة حول دورتي. ارتفعت نتائجي التالية خمس نقاط.",
    ],
    [
      "After 60 applications I stopped believing in myself. An anonymous woman shared her 90-day story. I practiced interviews during my energy peak and signed my first contract.",
      "Après 60 candidatures, j’ai cessé de croire en moi. Une femme anonyme a partagé son histoire de 90 jours. Je me suis entraînée aux entretiens pendant mon pic d’énergie et j’ai signé mon premier contrat.",
      "بعد 60 طلب توظيف توقفتُ عن الإيمان بنفسي. شاركتني امرأة مجهولة قصتها خلال 90 يومًا. تدرّبتُ على المقابلات في ذروة طاقتي ووقّعتُ أول عقد.",
    ],
    [
      "I worked until 2 a.m. for my thesis and hit a wall. Sleep rules, 40-minute study blocks and talking openly, anonymously at first, brought me back.",
      "J’ai travaillé jusqu’à 2 h du matin pour ma thèse et je me suis heurtée à un mur. Des règles de sommeil, des blocs d’étude de 40 minutes et parler ouvertement, anonymement au début, m’ont ramenée.",
      "عملتُ حتى الثانية صباحًا على رسالتي واصطدمتُ بجدار. قواعد النوم وجلسات دراسة من 40 دقيقة والحديث بصراحة، مجهولةً في البداية، أعادتني.",
    ],
    [
      "“Rest was part of the plan, not the opposite of it.”",
      "« Le repos faisait partie du plan, pas son contraire. »",
      "«كانت الراحة جزءًا من الخطة، لا نقيضًا لها.»",
    ],
    [
      "“One no is not the story of my future.”",
      "« Un refus n’est pas l’histoire de mon avenir. »",
      "«رفضٌ واحد ليس قصة مستقبلي.»",
    ],
    [
      "“Talking anonymously made talking out loud possible.”",
      "« Parler anonymement a rendu possible le fait de parler à voix haute. »",
      "«الحديث المجهول جعل الحديث بصوت عالٍ ممكنًا.»",
    ],
    // self-care (classic)
    ["Small steps, still progress", "Petits pas, vrais progrès", "خطوات صغيرة، وتقدّم حقيقي"],
    ["In 4 · hold 4 · out 6", "Inspire 4 · retiens 4 · expire 6", "شهيق 4 · احبسي 4 · زفير 6"],
    ["Ready", "Prête", "جاهزة"],
    ["Begin", "Commencer", "ابدئي"],
    ["Stop", "Arrêter", "إيقاف"],
    ["Breathe in", "Inspire", "شهيق"],
    ["Hold", "Retiens", "احبسي"],
    ["Breathe out", "Expire", "زفير"],
    ["Bismillah", "Bismillah", "بسم الله"],
    ["SubhanAllah", "SubhanAllah", "سبحان الله"],
    ["Alhamdulillah", "Alhamdulillah", "الحمد لله"],
    ["Write without judgement. Prompt:", "Écris sans jugement. Piste :", "اكتبي دون حكم. فكرة:"],
    ["Save page", "Enregistrer la page", "حفظ الصفحة"],
    // toasts & server messages
    [
      "Check-in saved. Thank you for showing up for yourself 💜",
      "Check-in enregistré. Merci d’être là pour toi 💜",
      "تم حفظ المتابعة. شكرًا لأنكِ حاضرة من أجل نفسك 💜",
    ],
    [
      "Achievement saved. You should be proud 💜",
      "Réussite enregistrée. Tu peux être fière 💜",
      "تم حفظ الإنجاز. يحق لكِ أن تفخري 💜",
    ],
    [
      "Page saved to your private profile",
      "Page enregistrée dans ton profil privé",
      "تم حفظ الصفحة في ملفك الخاص",
    ],
    ["Please sign in", "Connecte-toi s’il te plaît", "يرجى تسجيل الدخول"],
    [
      "Too many attempts, try again soon",
      "Trop de tentatives, réessaie bientôt",
      "محاولات كثيرة، أعيدي المحاولة قريبًا",
    ],
    [
      "Username: 3-30 letters or numbers. Password: 6+ characters.",
      "Nom d’utilisateur : 3 à 30 lettres ou chiffres. Mot de passe : 6 caractères min.",
      "اسم المستخدم: 3 إلى 30 حرفًا أو رقمًا. كلمة المرور: 6 أحرف على الأقل.",
    ],
    ["That username is taken", "Ce nom d’utilisateur est pris", "اسم المستخدم مأخوذ"],
    [
      "Wrong username or password",
      "Nom d’utilisateur ou mot de passe incorrect",
      "اسم المستخدم أو كلمة المرور غير صحيحة",
    ],
    ["Write something first", "Écris d’abord quelque chose", "اكتبي شيئًا أولًا"],
    ["Say something first", "Dis d’abord quelque chose", "قولي شيئًا أولًا"],
    ["Slow down a little 💜", "Ralentis un peu 💜", "تمهّلي قليلًا 💜"],
    ["Something went wrong", "Un problème est survenu", "حدث خطأ ما"],
    ["Mood must be 1-5", "L’humeur doit être entre 1 et 5", "يجب أن يكون المزاج بين 1 و5"],
    ["Post not found", "Publication introuvable", "المنشور غير موجود"],
    ["just now", "à l’instant", "الآن"],
    // settings / profile / faith (strings used by faith.js)
    ["Language", "Langue", "اللغة"],
    ["Appearance", "Apparence", "المظهر"],
    ["Light", "Clair", "فاتح"],
    ["Dark", "Sombre", "داكن"],
    ["Prayer location", "Lieu pour les prières", "موقع أوقات الصلاة"],
    ["Sousse, Tunisia", "Sousse, Tunisie", "سوسة، تونس"],
    ["Use my location", "Utiliser ma position", "استخدام موقعي"],
    ["☀ Light", "☀ Clair", "☀ فاتح"],
    ["☾ Dark", "☾ Sombre", "☾ داكن"],
    ["Go softly today.", "Vas-y doucement aujourd’hui.", "كوني لطيفة مع نفسك اليوم."],
    [
      "Structure helps more than pushing.",
      "La structure aide plus que de forcer.",
      "التنظيم أنفع من الإجهاد.",
    ],
    ["Good moment to use your energy.", "Bon moment pour utiliser ton énergie.", "وقت جيد لاستعمال طاقتك."],
    ["Close", "Fermer", "إغلاق"],
    ["Location updated", "Position mise à jour", "تم تحديث الموقع"],
    [
      "Location unavailable. Using Sousse.",
      "Position indisponible. Sousse utilisée.",
      "تعذّر تحديد الموقع. سيتم استخدام سوسة.",
    ],
    ["My profile", "Mon profil", "ملفي الشخصي"],
    [
      "Manage your account and keep it secure.",
      "Gère ton compte et garde-le en sécurité.",
      "أدِيري حسابك وحافظي على أمانه.",
    ],
    ["Display name (private)", "Nom affiché (privé)", "الاسم المعروض (خاص)"],
    ["Your anonymous alias", "Ton pseudo anonyme", "اسمك المستعار المجهول"],
    ["Save name", "Enregistrer le nom", "حفظ الاسم"],
    ["Name saved", "Nom enregistré", "تم حفظ الاسم"],
    ["Change password", "Changer le mot de passe", "تغيير كلمة المرور"],
    ["Current password", "Mot de passe actuel", "كلمة المرور الحالية"],
    [
      "New password (6+ characters)",
      "Nouveau mot de passe (6 caractères min.)",
      "كلمة المرور الجديدة (6 أحرف على الأقل)",
    ],
    ["Confirm new password", "Confirmer le nouveau mot de passe", "تأكيد كلمة المرور الجديدة"],
    ["Update password", "Mettre à jour", "تحديث كلمة المرور"],
    ["Passwords don’t match", "Les mots de passe ne correspondent pas", "كلمتا المرور غير متطابقتين"],
    [
      "Password updated. Other devices were signed out.",
      "Mot de passe mis à jour. Les autres appareils ont été déconnectés.",
      "تم تحديث كلمة المرور وتسجيل الخروج من الأجهزة الأخرى.",
    ],
    [
      "Current password is incorrect",
      "Le mot de passe actuel est incorrect",
      "كلمة المرور الحالية غير صحيحة",
    ],
    ["Password: 6+ characters.", "Mot de passe : 6 caractères min.", "كلمة المرور: 6 أحرف على الأقل."],
    [
      "Your password is stored encrypted. Changing it signs out your other devices.",
      "Ton mot de passe est stocké chiffré. Le changer déconnecte tes autres appareils.",
      "كلمة مرورك مخزّنة مشفّرة. تغييرها يُسجّل خروجك من أجهزتك الأخرى.",
    ],
    [
      "A gentle space for your heart, your prayers and your time with the Qur’an.",
      "Un espace doux pour ton cœur, tes prières et ton temps avec le Coran.",
      "مساحة هادئة لقلبك وصلواتك ووقتك مع القرآن.",
    ],
    ["Qur’an · for how you feel", "Coran · selon ce que tu ressens", "القرآن · بحسب شعورك"],
    ["Verse of the day", "Verset du jour", "آية اليوم"],
    ["Another verse", "Un autre verset", "آية أخرى"],
    [
      "Translation of the meaning, not the Qur’an itself.",
      "Traduction du sens, et non le Coran lui-même.",
      "ترجمة للمعنى وليست القرآن نفسه.",
    ],
    ["Prayer times", "Heures de prière", "أوقات الصلاة"],
    [
      "Tick each prayer once you have prayed.",
      "Coche chaque prière une fois accomplie.",
      "علّمي كل صلاة بعد أدائها.",
    ],
    ["Fajr", "Fajr", "الفجر"],
    ["Dhuhr", "Dhohr", "الظهر"],
    ["Asr", "Asr", "العصر"],
    ["Maghrib", "Maghrib", "المغرب"],
    ["Isha", "Isha", "العشاء"],
    ["This week", "Cette semaine", "هذا الأسبوع"],
    [
      "Times are calculated for your location and can differ by a minute or two from your local mosque.",
      "Horaires calculés pour ta position, ils peuvent différer d’une ou deux minutes de ta mosquée.",
      "الأوقات محسوبة لموقعك وقد تختلف دقيقة أو دقيقتين عن مسجدك.",
    ],
    ["Qur’an reading time", "Temps de lecture du Coran", "وقت قراءة القرآن"],
    [
      "10 quiet minutes with the Book of Allah. Phone away, heart present.",
      "10 minutes de calme avec le Livre d’Allah. Téléphone de côté, cœur présent.",
      "10 دقائق هادئة مع كتاب الله. الهاتف جانبًا والقلب حاضر.",
    ],
    ["Bismillah, begin", "Bismillah, commencer", "بسم الله، ابدئي"],
    ["Pause", "Pause", "إيقاف مؤقت"],
    ["Resume", "Reprendre", "استئناف"],
    ["Reset", "Réinitialiser", "إعادة"],
    [
      "Begin with “Bismillah” and set your intention: reading for Allah, for peace, for guidance.",
      "Commence par « Bismillah » et pose ton intention : lire pour Allah, pour la paix, pour la guidance.",
      "ابدئي بـ«بسم الله» وانوي: القراءة لله، وللطمأنينة، وللهداية.",
    ],
    [
      "Read slowly, with tartil. Let each verse reach your heart.",
      "Lis lentement, avec tartîl. Laisse chaque verset atteindre ton cœur.",
      "اقرئي ببطء وترتيل. دعي كل آية تصل إلى قلبك.",
    ],
    [
      "A hard day? Even one page is a victory.",
      "Une journée difficile ? Même une page est une victoire.",
      "يوم صعب؟ حتى صفحة واحدة انتصار.",
    ],
    [
      "Pause where a verse touches you, and read it again.",
      "Arrête-toi là où un verset te touche et relis-le.",
      "قِفي عند الآية التي تمسّك واقرئيها مرة أخرى.",
    ],
    [
      "You’re doing it. Stay with the Qur’an a little longer.",
      "Tu y arrives. Reste encore un peu avec le Coran.",
      "أنتِ تفعلينها. ابقي مع القرآن قليلًا بعد.",
    ],
    [
      "May Allah accept your reading 🤍 Take a real break and drink some water.",
      "Qu’Allah accepte ta lecture 🤍 Fais une vraie pause et bois de l’eau.",
      "تقبّل الله قراءتك 🤍 خذي استراحة حقيقية واشربي الماء.",
    ],
    ["What touched you today?", "Qu’est-ce qui t’a touchée aujourd’hui ?", "ما الذي لمس قلبك اليوم؟"],
    [
      "The verse or page I read, and what it said to my heart…",
      "Le verset ou la page que j’ai lus, et ce qu’ils ont dit à mon cœur…",
      "الآية أو الصفحة التي قرأتُها وما قالته لقلبي…",
    ],
    ["Save reading note", "Enregistrer la note de lecture", "حفظ ملاحظة القراءة"],
    ["Reading note saved 🤍", "Note de lecture enregistrée 🤍", "تم حفظ ملاحظة القراءة 🤍"],
    ["Your recent reading notes", "Tes dernières notes de lecture", "ملاحظات قراءتك الأخيرة"],
    ["Words of the Prophet ﷺ", "Paroles du Prophète ﷺ", "من هدي النبي ﷺ"],
    [
      "A saying to carry with you today",
      "Une parole à garder avec toi aujourd’hui",
      "حديث تحملينه معك اليوم",
    ],
    ["Another saying", "Une autre parole", "حديث آخر"],
  ];
  const IDX = new Map(D.map((r) => [r[0], r])),
    LANGS = {
      en: ["English", "ltr", "en"],
      fr: ["Français", "ltr", "fr"],
      ar: ["العربية", "rtl", "ar-u-nu-latn"],
    };
  const li = () => ({ fr: 1, ar: 2 })[window.HWLANG] || 0,
    tr = (s) => {
      const r = IDX.get(s);
      return r && li() ? r[li()] : s;
    };
  const PH = {
    en: ["menstrual", "follicular", "ovulation", "luteal"],
    fr: ["menstruelle", "folliculaire", "d’ovulation", "lutéale"],
    ar: ["الحيض", "الجريبية", "الإباضة", "الأصفرية"],
  };
  const phn = (n) => {
    const i = PH.en.indexOf(n.toLowerCase());
    return i < 0 ? n : PH[window.HWLANG][i];
  };
  const plural = (n, fr, ar, one) => (n == 1 ? one : ""); // helper kept tiny
  const PAT = [
    // dynamic sentences: [regex, fr(m), ar(m)]
    [
      /^You showed up for yourself (\d+) days? in a row\.$/,
      (m) => `Tu as été là pour toi ${m[1]} jour${m[1] == 1 ? "" : "s"} de suite.`,
      (m) => `كنتِ حاضرة من أجل نفسك ${m[1]} ${m[1] == 1 ? "يومًا" : "أيام"} متتالية.`,
    ],
    [
      /^Your mood is (\d+)% (more balanced|lower) than last week\.$/,
      (m) =>
        `Ton humeur est ${m[1]} % ${m[2] == "lower" ? "plus basse" : "plus équilibrée"} que la semaine dernière.`,
      (m) => `مزاجك ${m[2] == "lower" ? "أقل" : "أكثر توازنًا"} بنسبة ${m[1]}% من الأسبوع الماضي.`,
    ],
    [
      /^You’re in your (\w+) phase\. (.*)$/,
      (m) => `Tu es en phase ${phn(m[1])}. ${tr(m[2])}`,
      (m) => `أنتِ في المرحلة ${phn(m[1])}. ${tr(m[2])}`,
    ],
    [/^Day (\d+) of (\d+)$/, (m) => `Jour ${m[1]} sur ${m[2]}`, (m) => `اليوم ${m[1]} من ${m[2]}`],
    [
      /^· next period in about (\d+) days$/,
      (m) => `· prochaines règles dans environ ${m[1]} jours`,
      (m) => `· الدورة القادمة بعد حوالي ${m[1]} أيام`,
    ],
    [
      /^(\d+) words · (\d+) pages saved$/,
      (m) => `${m[1]} mots · ${m[2]} pages enregistrées`,
      (m) => `${m[1]} كلمة · ${m[2]} صفحات محفوظة`,
    ],
    [/^(\d+) of (\d+) milestones$/, (m) => `${m[1]} étapes sur ${m[2]}`, (m) => `${m[1]} من ${m[2]} إنجازات`],
    [/^(\d+) saved$/, (m) => `${m[1]} enregistrée(s)`, (m) => `${m[1]} محفوظة`],
    [
      /^You’ve celebrated (\d+) wins?\. Look how far you’ve come 💜$/,
      (m) => `Tu as célébré ${m[1]} victoire(s). Regarde le chemin parcouru 💜`,
      (m) => `احتفلتِ بـ${m[1]} من الإنجازات. انظري كم قطعتِ من الطريق 💜`,
    ],
    [/^(\d+)m ago$/, (m) => `il y a ${m[1]} min`, (m) => `منذ ${m[1]} د`],
    [/^(\d+)h ago$/, (m) => `il y a ${m[1]} h`, (m) => `منذ ${m[1]} س`],
    [/^(\d+)d ago$/, (m) => `il y a ${m[1]} j`, (m) => `منذ ${m[1]} يوم`],
    [/^All · (\d+)$/, (m) => `Tout · ${m[1]}`, (m) => `الكل · ${m[1]}`],
    [
      /^🧭 Seeking help & answers · (\d+)$/,
      (m) => `🧭 Aide et réponses · ${m[1]}`,
      (m) => `🧭 مساعدة وإجابات · ${m[1]}`,
    ],
    [
      /^🤍 Chat & feeling heard · (\d+)$/,
      (m) => `🤍 Discuter et être écoutée · ${m[1]}`,
      (m) => `🤍 حديث وإنصات · ${m[1]}`,
    ],
    [/^(🤗 Hug|🙋 Same here|✨ Proud) (\d+)$/, (m) => `${tr(m[1])} ${m[2]}`, (m) => `${tr(m[1])} ${m[2]}`],
    [/^@(.+) · private$/, (m) => `@${m[1]} · privé`, (m) => `@${m[1]} · خاص`],
    [
      /^New anonymous alias: (.+)$/,
      (m) => `Nouveau pseudo anonyme : ${m[1]}`,
      (m) => `اسم مستعار جديد: ${m[1]}`,
    ],
    [
      /^You’ve got (\d+) of 5 prayers today$/,
      (m) => `${m[1]} prières sur 5 aujourd’hui`,
      (m) => `${m[1]} من 5 صلوات اليوم`,
    ],
    [
      /^Next: (\w+) in (.+)$/,
      (m) => `Prochaine : ${tr(m[1])} dans ${m[2].replace("h", " h").replace("m", " min")}`,
      (m) => `التالية: ${tr(m[1])} بعد ${m[2].replace("h", " س ").replace("m", " د")}`,
    ],
  ];
  const SK = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT"]);
  function xl(s) {
    // translate one trimmed English string
    const t = s.trim();
    if (!t) return s;
    const lead = s.match(/^\s*/)[0],
      tail = s.match(/\s*$/)[0];
    let out = IDX.has(t) ? tr(t) : null;
    if (out === null && li())
      for (const p of PAT) {
        const m = t.match(p[0]);
        if (m) {
          out = p[li()](m);
          break;
        }
      }
    return out === null || out === t ? s : lead + out + tail;
  }
  function node(n) {
    if (n.nodeType === 3) {
      if (SK.has(n.parentNode && n.parentNode.nodeName)) return;
      const h = n.__hw;
      if (h && n.nodeValue === h.out) {
        const o = xl(h.src);
        h.out = o;
        if (o !== n.nodeValue) n.nodeValue = o;
        return;
      }
      const src = n.nodeValue,
        o = xl(src);
      n.__hw = { src, out: o };
      if (o !== src) n.nodeValue = o;
    } else if (n.nodeType === 1 && n.nodeName !== "SCRIPT" && n.nodeName !== "STYLE") {
      for (const a of ["placeholder", "aria-label", "title"])
        if (n.hasAttribute(a)) {
          const k = "__" + a,
            v = n.getAttribute(a);
          if (n[k] && v === n[k].out) {
            const o = xl(n[k].src);
            n[k].out = o;
            if (o !== v) n.setAttribute(a, o);
          } else {
            const o = xl(v);
            n[k] = { src: v, out: o };
            if (o !== v) n.setAttribute(a, o);
          }
        }
      if (!SK.has(n.nodeName)) n.childNodes.forEach(node);
    }
  }
  let busy = false;
  const mo = new MutationObserver((ms) => {
    if (busy) return;
    busy = true;
    try {
      ms.forEach((m) => {
        if (m.type === "childList") m.addedNodes.forEach(node);
        else if (m.type === "characterData") node(m.target);
        else node(m.target);
      });
    } finally {
      busy = false;
      mo.takeRecords();
    }
  });
  const run = () => {
    busy = true;
    try {
      node(document.body);
      document.title = xl("HERwell");
    } finally {
      busy = false;
      mo.takeRecords();
    }
  };
  mo.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["placeholder", "aria-label", "title"],
  });

  // dates follow the chosen language
  const _tl = Date.prototype.toLocaleDateString;
  Date.prototype.toLocaleDateString = function (l, o) {
    return _tl.call(this, l || LANGS[window.HWLANG || "en"][2], o);
  };

  // language chips on the sign-in screen
  function chips(host) {
    host.innerHTML = Object.keys(LANGS)
      .map(
        (k) =>
          `<button class="ch${window.HWLANG === k ? " on" : ""}" data-lang="${k}" lang="${k}">${LANGS[k][0]}</button>`,
      )
      .join("");
  }
  const au = document.getElementById("au");
  if (au) {
    const d = document.createElement("div");
    d.className = "chs hwl";
    d.style.cssText = "position:absolute;top:10px;inset-inline-end:14px;margin:0";
    au.appendChild(d);
  }

  window.hwSetLang = function (k) {
    if (!LANGS[k]) k = "en";
    window.HWLANG = k;
    try {
      localStorage.setItem("hw_lang", k);
    } catch (e) {}
    const h = document.documentElement;
    h.lang = LANGS[k][2].split("-")[0];
    h.dir = LANGS[k][1];
    document.querySelectorAll("[data-lang]").forEach((b) => b.classList.toggle("on", b.dataset.lang === k));
    run();
    dispatchEvent(new Event("hw:lang"));
  };
  window.hwTr = xl;
  window.hwLangs = LANGS;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lang]");
    if (b) hwSetLang(b.dataset.lang);
  });
  document.querySelectorAll(".hwl").forEach(chips);
  let saved = "en";
  try {
    saved = localStorage.getItem("hw_lang") || "en";
  } catch (e) {}
  window.HWLANG = saved;
  hwSetLang(saved);
})();
