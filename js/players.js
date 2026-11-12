/* بيانات اللاعبين: عدّل هنا فقط وسيتحدث الموقع تلقائياً.
   born: YYYY-MM-DD     img: اسم الملف داخل مجلد players/
   xi: ترتيب اللاعب في التشكيلة الأساسية (0 حارس، 1-4 دفاع، 5-7 وسط، 8-10 هجوم). من ليس له xi يكون بديلاً. */
const SQUAD = [
    // خط الهجوم
    { line: "attack", name: "أحمد العرسان", pos: "جناح أيسر", club: "الفيصلي", born: "1995-09-28", img: "alersan.jpg" },
    { line: "attack", name: "علي علوان", pos: "مهاجم صريح", club: "السيلية القطري", born: "2000-03-26", img: "olwan.jpg", xi: 8 },
    { line: "attack", name: "عودة الفاخوري", pos: "جناح أيسر", club: "بيراميدز المصري", born: "2005-11-22", img: "alfakhory.jpg" },
    { line: "attack", name: "محمد أبو زريق \"شرارة\"", pos: "جناح أيمن", club: "الرجاء البيضاوي", born: "1997-12-30", img: "shrara.jpg" },
    { line: "attack", name: "موسى التعمري", pos: "جناح أيمن", club: "مونبلييه الفرنسي", born: "1997-06-10", img: "altamari.jpg", xi: 10 },
    { line: "attack", name: "يزن النعيمات", pos: "مهاجم صريح", club: "العربي القطري", born: "1999-06-04", img: "almamat.jpg", xi: 9 },

    // خط الوسط
    { line: "mid", name: "رجائي عايد", pos: "وسط محور", club: "الحسين إربد", born: "1993-07-25", img: "aaed.jpg" },
    { line: "mid", name: "عامر جاموس", pos: "وسط محور", club: "الزوراء العراقي", born: "2002-07-03", img: "jamus.jpg", xi: 7 },
    { line: "mid", name: "نزار الرشدان", pos: "وسط محور (ارتكاز)", club: "الفيصلي", born: "1999-03-23", img: "rashdan.jpg", xi: 6 },
    { line: "mid", name: "نور الروابدة", pos: "صانع ألعاب متأخر", club: "سيلانغور الماليزي", born: "1997-02-24", img: "alrawabdh.jpg" },
    { line: "mid", name: "مهند أبو طه", pos: "ظهير أيسر هجومي", club: "القوة الجوية", born: "2003-02-02", img: "abo-taha.jpg", xi: 1 },
    { line: "mid", name: "محمود مرضي", pos: "وسط هجومي", club: "الحسين إربد", born: "1993-10-06", img: "marde.jpg", xi: 5 },

    // خط الدفاع
    { line: "def", name: "أدهم القريشي", pos: "ظهير أيمن", club: "الحسين إربد", born: "1995-03-07", img: "alquraish.jpg" },
    { line: "def", name: "إحسان حداد", pos: "ظهير أيمن", club: "الحسين إربد", born: "1994-02-05", img: "haddad.jpg", xi: 4, captain: true },
    { line: "def", name: "حسام أبو الذهب", pos: "قلب دفاع", club: "الفيصلي", born: "2000-05-13", img: "abo-dahab.jpg" },
    { line: "def", name: "عصام السميري", pos: "ظهير أيمن", club: "السلط", born: "1999-05-30", img: "smeeri.jpg" },
    { line: "def", name: "عبدالله نصيب", pos: "قلب دفاع", club: "الزوراء العراقي", born: "1994-02-25", img: "naseb.jpg", xi: 2 },
    { line: "def", name: "محمد أبو حشيش", pos: "ظهير أيسر", club: "الكرمة العراقي", born: "1995-05-09", img: "abo-hashish.jpg" },
    { line: "def", name: "يزن العرب", pos: "قلب دفاع", club: "سيول الكوري", born: "1996-01-31", img: "alarab.jpg", xi: 3 },

    // حراسة المرمى
    { line: "gk", name: "نور بني عطية", pos: "حارس مرمى", club: "الفيصلي", born: "1993-01-25", img: "bani-atiah.jpg" },
    { line: "gk", name: "يزيد أبو ليلى", pos: "حارس مرمى", club: "الحسين إربد", born: "1993-01-08", img: "abo-lila.jpg", xi: 0 }
];

/* الجهاز الفني */
const STAFF = [
    {
        name: "جمال السلامي", tag: "المدرب السابق", nation: "المغربية، الأردنية",
        born: "1970-10-06", period: "يونيو 2024 - يوليو 2026",
        quote: "المجد يُنتزع ولا يُعطى", img: "img/leader.jpg",
        en: { name: "Jamal Sellami", tag: "Former coach", nation: "Moroccan, Jordanian", period: "June 2024 - July 2026", quote: "Glory is seized, never given" }
    }
];

/* التشكيلات: موضع كل لاعب [يمين-يسار %، أعلى-أسفل %] بترتيب xi من 0 إلى 10 */
const FORMATIONS = {
    "4-3-3": {
        players: ["abo-lila.jpg", "abo-taha.jpg", "naseb.jpg", "alarab.jpg", "haddad.jpg",
                  "marde.jpg", "rashdan.jpg", "jamus.jpg",
                  "olwan.jpg", "almamat.jpg", "altamari.jpg"],
        coords: [[50,89],[12,70],[37,72],[63,72],[88,70],[24,43],[50,48],[76,43],[20,18],[50,14],[80,18]]
    },
    "4-4-2": {
        players: ["abo-lila.jpg", "abo-taha.jpg", "naseb.jpg", "alarab.jpg", "haddad.jpg",
                  "alersan.jpg", "rashdan.jpg", "jamus.jpg", "altamari.jpg",
                  "olwan.jpg", "almamat.jpg"],
        coords: [[50,89],[12,70],[37,72],[63,72],[88,70],[14,45],[38,48],[62,48],[86,45],[36,18],[64,18]]
    },
    "3-4-3": {
        players: ["abo-lila.jpg", "naseb.jpg", "abo-dahab.jpg", "alarab.jpg",
                  "abo-taha.jpg", "rashdan.jpg", "jamus.jpg", "haddad.jpg",
                  "olwan.jpg", "almamat.jpg", "altamari.jpg"],
        coords: [[50,89],[24,70],[50,72],[76,70],[10,46],[37,47],[63,47],[90,46],[20,18],[50,14],[80,18]]
    }
};

/* النسخة الإنجليزية: [الاسم، المركز، النادي] (راجع الأسماء والأندية) */
const EN = {
    "alersan.jpg": ["Ahmad Ersan", "Left winger", "Al-Faisaly"],
    "olwan.jpg": ["Ali Olwan", "Striker", "Al-Sailiya (Qatar)"],
    "alfakhory.jpg": ["Odeh Al-Fakhouri", "Left winger", "Pyramids (Egypt)"],
    "shrara.jpg": ["Mohammad Abu Zrayq \"Shrara\"", "Right winger", "Raja Casablanca"],
    "altamari.jpg": ["Mousa Al-Tamari", "Right winger", "Montpellier (France)"],
    "almamat.jpg": ["Yazan Al-Naimat", "Striker", "Al-Arabi (Qatar)"],
    "aaed.jpg": ["Rajaei Ayed", "Central midfielder", "Al-Hussein (Irbid)"],
    "jamus.jpg": ["Amer Jamous", "Central midfielder", "Al-Zawraa (Iraq)"],
    "rashdan.jpg": ["Nizar Al-Rashdan", "Defensive midfielder", "Al-Faisaly"],
    "alrawabdh.jpg": ["Noor Al-Rawabdeh", "Deep-lying playmaker", "Selangor (Malaysia)"],
    "abo-taha.jpg": ["Mohannad Abu Taha", "Attacking full-back", "Al-Quwa Al-Jawiya"],
    "marde.jpg": ["Mahmoud Al-Mardi", "Attacking midfielder", "Al-Hussein (Irbid)"],
    "alquraish.jpg": ["Adham Al-Quraishi", "Right back", "Al-Hussein (Irbid)"],
    "haddad.jpg": ["Ihsan Haddad", "Right back", "Al-Hussein (Irbid)"],
    "abo-dahab.jpg": ["Husam Abu Al-Dahab", "Centre-back", "Al-Faisaly"],
    "smeeri.jpg": ["Issam Al-Smeiri", "Right back", "Al-Salt"],
    "naseb.jpg": ["Abdallah Nasib", "Centre-back", "Al-Zawraa (Iraq)"],
    "abo-hashish.jpg": ["Mohammad Abu Hashish", "Left back", "Al-Karma (Iraq)"],
    "alarab.jpg": ["Yazan Al-Arab", "Centre-back", "FC Seoul (Korea)"],
    "bani-atiah.jpg": ["Noor Bani Attiah", "Goalkeeper", "Al-Faisaly"],
    "abo-lila.jpg": ["Yazeed Abu Laila", "Goalkeeper", "Al-Hussein (Irbid)"]
};
