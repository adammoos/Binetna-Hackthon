require("dotenv").config();
const express = require("express"),
  fs = require("fs"),
  path = require("path"),
  crypto = require("crypto");
// AI settings: accepts AI_PROVIDER / AI_API_KEY / AI_MODEL, or the simpler GEMINI_API_KEY / GEMINI_MODEL
const PROVIDER = (process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY ? "gemini" : "local")).toLowerCase();
const AI_KEY = process.env.AI_API_KEY || (PROVIDER === "gemini" ? process.env.GEMINI_API_KEY : "");
const AI_MODEL = process.env.AI_MODEL || (PROVIDER === "gemini" ? process.env.GEMINI_MODEL : "");
const app = express(),
  PORT = process.env.PORT || 3000,
  DAY = 864e5;
const IS_VERCEL = process.env.VERCEL === "1";
const DBF = IS_VERCEL ? path.join("/tmp", "binetna", "db.json") : path.join(__dirname, "data", "db.json");
fs.mkdirSync(path.dirname(DBF), { recursive: true });

// ---------- tiny JSON database (swap for SQLite/Postgres in production) ----------
let db = { users: {}, sessions: {}, posts: [], notes: [], logs: [] };
try {
  db = Object.assign(db, JSON.parse(fs.readFileSync(DBF, "utf8")));
} catch {}
let tm;
const saveDb = () => {
  if (IS_VERCEL) {
    fs.writeFileSync(DBF + ".tmp", JSON.stringify(db));
    fs.renameSync(DBF + ".tmp", DBF);
    return;
  }
  clearTimeout(tm);
  tm = setTimeout(() => {
    fs.writeFileSync(DBF + ".tmp", JSON.stringify(db));
    fs.renameSync(DBF + ".tmp", DBF);
  }, 150);
};
const id = () => crypto.randomBytes(8).toString("hex"),
  iso = (d) => new Date(d).toISOString().slice(0, 10);
const hits = new Map(),
  limited = (k, max, ms) => {
    const n = Date.now(),
      a = (hits.get(k) || []).filter((t) => n - t < ms);
    a.push(n);
    hits.set(k, a);
    return a.length > max;
  };

// ---------- helpers ----------
const A1 = ["Moonlit", "Brave", "Gentle", "Sunny", "Quiet", "Bright", "Calm", "Kind"],
  A2 = ["Jasmine", "Olive", "Dune", "Lotus", "Comet", "Falcon", "Orchid", "Wave"];
const pick = (a) => a[crypto.randomInt(a.length)],
  newAlias = () => pick(A1) + pick(A2) + crypto.randomInt(10, 99);
const hash = (pw, salt = crypto.randomBytes(16).toString("hex")) =>
  salt + ":" + crypto.scryptSync(pw, salt, 64).toString("hex");
const check = (pw, h) => {
  const x = hash(pw, h.split(":")[0]);
  return x.length === h.length && crypto.timingSafeEqual(Buffer.from(x), Buffer.from(h));
};
const PN = ["Menstrual", "Follicular", "Ovulation", "Luteal"];
function phase(c, d = Date.now()) {
  const n = Math.floor((new Date(iso(d)) - new Date(c.start)) / DAY),
    x = (((n % c.len) + c.len) % c.len) + 1,
    ov = c.len - 14;
  return { d: x, k: x <= c.per ? 0 : x < ov - 1 ? 1 : x <= ov + 1 ? 2 : 3 };
}
const CRISIS = [
  "suicid",
  "kill myself",
  "want to die",
  "hurt myself",
  "end my life",
  "envie de mourir",
  "nmout",
];
const norm = (t) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
const LEX = {
  stress: ["stress", "pressure", "deadline", "overwhelm", "panic", "mstres", "mdhaya9", "exam", "pfe"],
  anxiety: ["anxi", "worr", "scared", "afraid", "nervous", "peur", "angoiss", "khayef", "5ayf"],
  sadness: ["sad", "cry", "lonely", "alone", "empty", "triste", "seule", "7zin", "hazin"],
  fatigue: ["tired", "exhaust", "burnout", "fatigu", "epuis", "na3es", "nna3es", "t3ib"],
  joy: [
    "happy",
    "good",
    "better",
    "glad",
    "great",
    "joy",
    "excited",
    "relieved",
    "hopeful",
    "proud",
    "grateful",
    "calm",
    "content",
    "mabsou",
    "mabsout",
    "farhan",
    "behi",
    "far7an",
    "far7ana",
  ],
};
function emo(t) {
  const n = norm(t).replace(/[^a-z0-9\s\u0600-\u06ff]/g, " "),
    cues = [];
  for (const [emotion, words] of Object.entries(LEX))
    for (const word of words) {
      let at = n.lastIndexOf(word);
      while (at >= 0) {
        const before = n.slice(Math.max(0, at - 24), at);
        if (
          !/(?:\bnot|\bno|\bnever|\bdont|\bdoesnt|\bdidnt|\bisnt|\barent|\bpas|\bjamais|\bnon|\bموش|\bmouch)\s+(?:\w+\s+){0,3}$/.test(
            before,
          )
        ) {
          cues.push({ emotion, at });
          break;
        }
        at = n.lastIndexOf(word, at - 1);
      }
    }
  cues.sort((a, b) => b.at - a.at);
  return {
    top: cues[0]?.emotion || "neutral",
    crisis: CRISIS.some((w) => n.includes(w)),
    cramps: /cramp|douleur|ventre|bitn/.test(n),
  };
}
const CRISIS_FR =
    "Tu comptes, et tu n’as pas à traverser ça seule. Contacte une personne de confiance ou un médecin maintenant. Si tu es en danger, appelle le SAMU 190.",
  CRISIS_AR =
    "أنتِ مهمّة، ولستِ مضطرّة لمواجهة هذا وحدك. تواصلي الآن مع شخص تثقين به أو مع طبيب. وإن كنتِ في خطر فاتصلي بالسامو 190.";
const CRISIS_MSG =
  "You matter, and you don’t have to face this alone. Please contact a trusted person or a doctor now. If you may be in danger, call SAMU 190.";

if (!db.posts.length)
  db.posts = [
    [
      "BraveOlive27",
      "Support",
      "heard",
      "PFE defense in 9 days and I haven’t slept properly all week. Anyone else feeling behind even when they’re not?",
      [12, 31, 3],
    ],
    [
      "SunnyLotus54",
      "Win",
      "heard",
      "I finally booked an appointment with the campus counselor. Terrified, but I did it. 💜",
      [48, 9, 22],
    ],
    ["QuietComet81", "Question", "help", "How do you study when cramps hit hard on exam week?", [7, 26, 5]],
    [
      "GentleOrchid63",
      "Question",
      "help",
      "I have a job interview on Monday and my mind goes blank when I get nervous. Any tips that worked for you?",
      [4, 18, 2],
    ],
  ].map((p, i) => ({
    id: id(),
    uid: "seed",
    alias: p[0],
    cat: p[1],
    mode: p[2],
    text: p[3],
    ts: Date.now() - (i + 1) * 7 * 36e5,
    reacts: p[4].map((n) => Array(n).fill("seed")),
    comments:
      i === 3
        ? [
            {
              id: id(),
              uid: "seed",
              alias: "CalmWave36",
              text: "Write 3 likely questions the night before and say the answers out loud once. It also helped me to pause and breathe before answering. You’ve got this.",
              ts: Date.now() - 36e5,
            },
          ]
        : [],
  }));

// ---------- middleware ----------
app.use(express.json({ limit: "50kb" }));
app.use(express.static(path.join(__dirname, "public")));
const auth = (q, r, n) => {
  const t = (q.headers.authorization || "").replace("Bearer ", ""),
    s = db.sessions[t];
  if (!s || Date.now() - s.ts > 30 * DAY || !db.users[s.uid])
    return r.status(401).json({ error: "Please sign in" });
  q.user = db.users[s.uid];
  q.token = t;
  n();
};
const me = (u) => ({ name: u.name, username: u.username, alias: u.alias, cycle: u.cycle });
const startSession = (u) => {
  const t = crypto.randomBytes(32).toString("hex");
  db.sessions[t] = { uid: u.id, ts: Date.now() };
  saveDb();
  return { token: t, me: me(u) };
};
const modeOf = (p) =>
  p.mode === "help" || p.mode === "heard" ? p.mode : p.cat === "Question" ? "help" : "heard";
const ser = (p, u) => ({
  id: p.id,
  a: p.alias,
  t: p.cat,
  m: modeOf(p),
  x: p.text,
  ts: p.ts,
  own: p.uid === u.id,
  r: p.reacts.map((a) => a.length),
  mine: p.reacts.map((a) => a.includes(u.id)),
  c: p.comments.map((c) => ({ id: c.id, a: c.alias, x: c.text, ts: c.ts })),
});
const clean = (v, n) =>
  String(v || "")
    .trim()
    .slice(0, n);

// ---------- auth & profile ----------
app.post("/api/auth/register", (q, r) => {
  if (limited("a" + q.ip, 15, 6e4)) return r.status(429).json({ error: "Too many attempts, try again soon" });
  const u = clean(q.body.username, 30).toLowerCase(),
    p = String(q.body.password || "");
  if (!/^[a-z0-9_.]{3,30}$/.test(u) || p.length < 6)
    return r.status(400).json({ error: "Username: 3-30 letters or numbers. Password: 6+ characters." });
  if (Object.values(db.users).some((x) => x.username === u))
    return r.status(409).json({ error: "That username is taken" });
  const user = {
    id: id(),
    username: u,
    name: clean(q.body.name, 40),
    pw: hash(p),
    alias: newAlias(),
    cycle: { start: iso(Date.now() - 9 * DAY), len: 28, per: 5 },
    created: Date.now(),
  };
  db.users[user.id] = user;
  r.json(startSession(user));
});
app.post("/api/auth/login", (q, r) => {
  if (limited("a" + q.ip, 15, 6e4)) return r.status(429).json({ error: "Too many attempts, try again soon" });
  const u = Object.values(db.users).find((x) => x.username === clean(q.body.username, 30).toLowerCase());
  if (!u || !check(String(q.body.password || ""), u.pw))
    return r.status(401).json({ error: "Wrong username or password" });
  r.json(startSession(u));
});
app.post("/api/auth/logout", auth, (q, r) => {
  delete db.sessions[q.token];
  saveDb();
  r.json({ ok: true });
});
app.get("/api/bootstrap", auth, (q, r) =>
  r.json({
    me: me(q.user),
    logs: db.logs
      .filter((l) => l.uid === q.user.id)
      .slice(-90)
      .map((l) => ({ ts: l.ts, m: l.m, k: l.k })),
    notes: db.notes
      .filter((n) => n.uid === q.user.id)
      .map((n) => ({
        id: n.id,
        ts: n.ts,
        x: n.text,
        k: ["win", "quran"].includes(n.kind) ? n.kind : "page",
      })),
    prayers: q.user.prayers || {},
    posts: db.posts.slice(0, 100).map((p) => ser(p, q.user)),
    boost: q.user.boost || {},
    academics: {
      classes: (q.user.acad || {}).classes || [],
      exams: (q.user.acad || {}).exams || [],
      plan: q.user.plan || null,
    },
  }),
);
app.put("/api/me", auth, (q, r) => {
  const c = q.body.cycle || {},
    s = /^\d{4}-\d{2}-\d{2}$/.test(c.start) ? c.start : q.user.cycle.start;
  q.user.cycle = {
    start: s,
    len: Math.min(45, Math.max(21, +c.len || 28)),
    per: Math.min(10, Math.max(2, +c.per || 5)),
  };
  saveDb();
  r.json(me(q.user));
});
app.put("/api/me/name", auth, (q, r) => {
  q.user.name = clean(q.body.name, 40);
  saveDb();
  r.json(me(q.user));
});
app.post("/api/me/password", auth, (q, r) => {
  if (limited("w" + q.user.id, 8, 6e4))
    return r.status(429).json({ error: "Too many attempts, try again soon" });
  const cur = String(q.body.current || ""),
    nw = String(q.body.next || "");
  if (!check(cur, q.user.pw)) return r.status(401).json({ error: "Current password is incorrect" });
  if (nw.length < 6) return r.status(400).json({ error: "Password: 6+ characters." });
  q.user.pw = hash(nw);
  for (const t in db.sessions) if (db.sessions[t].uid === q.user.id && t !== q.token) delete db.sessions[t]; // sign out other devices
  saveDb();
  r.json({ ok: true });
});
app.put("/api/prayers", auth, (q, r) => {
  const d = String(q.body.date || ""),
    a = q.body.done;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || !Array.isArray(a) || a.length !== 5)
    return r.status(400).json({ error: "Bad request" });
  const P = (q.user.prayers = q.user.prayers || {});
  P[d] = a.map(Boolean);
  Object.keys(P)
    .sort()
    .slice(0, -30)
    .forEach((k) => delete P[k]);
  saveDb();
  r.json({ ok: true });
});
app.post("/api/me/alias", auth, (q, r) => {
  q.user.alias = newAlias();
  saveDb();
  r.json(me(q.user));
});

// ---------- mood logs & notes (private to the user) ----------
app.post("/api/logs", auth, (q, r) => {
  const m = Math.round(+q.body.m);
  if (!(m >= 1 && m <= 5)) return r.status(400).json({ error: "Mood must be 1-5" });
  const l = { id: id(), uid: q.user.id, ts: Date.now(), m, k: phase(q.user.cycle).k };
  db.logs.push(l);
  saveDb();
  r.json({ ts: l.ts, m, k: l.k });
});
app.post("/api/notes", auth, (q, r) => {
  const x = clean(q.body.text, 5000);
  if (!x) return r.status(400).json({ error: "Write something first" });
  const k = ["win", "quran"].includes(q.body.kind) ? q.body.kind : "page",
    n = { id: id(), uid: q.user.id, ts: Date.now(), text: x, kind: k };
  db.notes.push(n);
  saveDb();
  r.json({ id: n.id, ts: n.ts, x, k });
});
app.delete("/api/notes/:id", auth, (q, r) => {
  db.notes = db.notes.filter((n) => !(n.id === q.params.id && n.uid === q.user.id));
  saveDb();
  r.json({ ok: true });
});

// ---------- anonymous community: posts, comments, reactions ----------
app.get("/api/posts", auth, (q, r) => r.json(db.posts.slice(0, 100).map((p) => ser(p, q.user))));
app.post("/api/posts", auth, (q, r) => {
  if (limited("p" + q.user.id, 10, 6e4)) return r.status(429).json({ error: "Slow down a little 💜" });
  const x = clean(q.body.text, 800),
    cat = ["Support", "Win", "Question"].includes(q.body.cat) ? q.body.cat : "Support",
    mode = q.body.mode === "help" ? "help" : "heard";
  if (!x) return r.status(400).json({ error: "Write something first" });
  const p = {
    id: id(),
    uid: q.user.id,
    alias: q.user.alias,
    cat,
    mode,
    text: x,
    ts: Date.now(),
    reacts: [[], [], []],
    comments: [],
  };
  db.posts.unshift(p);
  saveDb();
  r.json({ post: ser(p, q.user), crisis: emo(x).crisis });
});
const findPost = (q, r) => {
  const p = db.posts.find((x) => x.id === q.params.id);
  if (!p) r.status(404).json({ error: "Post not found" });
  return p;
};
app.post("/api/posts/:id/comments", auth, (q, r) => {
  const p = findPost(q, r);
  if (!p) return;
  const x = clean(q.body.text, 400);
  if (!x) return r.status(400).json({ error: "Write something first" });
  p.comments.push({ id: id(), uid: q.user.id, alias: q.user.alias, text: x, ts: Date.now() });
  saveDb();
  r.json(ser(p, q.user));
});
app.post("/api/posts/:id/react", auth, (q, r) => {
  const p = findPost(q, r);
  if (!p) return;
  const k = +q.body.kind;
  if (![0, 1, 2].includes(k)) return r.status(400).json({ error: "Bad reaction" });
  const a = p.reacts[k],
    i = a.indexOf(q.user.id);
  i < 0 ? a.push(q.user.id) : a.splice(i, 1);
  saveDb();
  r.json(ser(p, q.user));
});
app.delete("/api/posts/:id", auth, (q, r) => {
  db.posts = db.posts.filter((p) => !(p.id === q.params.id && p.uid === q.user.id));
  saveDb();
  r.json({ ok: true });
});

// ---------- AI companion ----------
async function llm(system, msgs) {
  const P = PROVIDER,
    K = AI_KEY,
    M = AI_MODEL;
  if (P === "local" || !K) return null;
  const ctl = new AbortController(),
    t = setTimeout(() => ctl.abort(), 45000);
  try {
    let url,
      headers = { "Content-Type": "application/json" },
      body,
      out;
    if (P === "gemini") {
      url = `https://generativelanguage.googleapis.com/v1beta/models/${M || "gemini-2.0-flash"}:generateContent`;
      headers["x-goog-api-key"] = K;
      body = {
        systemInstruction: { parts: [{ text: system }] },
        contents: msgs.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
      };
      out = (j) => j.candidates?.[0]?.content?.parts?.map((p) => p.text).join("");
    } else if (P === "anthropic") {
      url = "https://api.anthropic.com/v1/messages";
      headers["x-api-key"] = K;
      headers["anthropic-version"] = "2023-06-01";
      body = { model: M || "claude-sonnet-5-5", max_tokens: 300, system, messages: msgs };
      out = (j) => j.content?.map((c) => c.text || "").join("");
    } else {
      const U = {
        groq: "https://api.groq.com/openai/v1/chat/completions",
        openrouter: "https://openrouter.ai/api/v1/chat/completions",
        openai: "https://api.openai.com/v1/chat/completions",
      };
      const D = {
        groq: "llama-3.3-70b-versatile",
        openrouter: "meta-llama/llama-3.3-70b-instruct:free",
        openai: "gpt-4o-mini",
      };
      if (!U[P]) throw new Error("Unknown AI_PROVIDER: " + P);
      url = U[P];
      headers.Authorization = "Bearer " + K;
      body = {
        model: M || D[P],
        max_tokens: 300,
        temperature: 0.7,
        messages: [{ role: "system", content: system }, ...msgs],
      };
      out = (j) => j.choices?.[0]?.message?.content;
    }
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: ctl.signal });
    if (!res.ok) throw new Error(P + " " + res.status + " " + (await res.text()).slice(0, 200));
    return (out(await res.json()) || "").trim() || null;
  } finally {
    clearTimeout(t);
  }
}
const LN = { en: "English", fr: "French", ar: "Arabic" };
const sysPrompt = (avg, top, lg) =>
  `Reply in the user's language. If the user writes in Tunisian Derja, including mixed Darja and French or Arabizi, answer in natural Tunisian Derja; match the user's script (Latin/Arabizi or Arabic) when clear. This rule overrides the selected interface language. Do not switch to English, Modern Standard Arabic, or French just because of a few borrowed words. You are Folla, Binetna's warm, emotionally present, concise, non-diagnostic wellbeing companion. You can understand English, French, Tunisian Derja/Arabizi, and Arabic. Listen closely to the user's words and conversation history; respond to the specific thing they shared with empathy and natural language. Your default role is to hear and understand: do not give advice, instructions, recommendations, coping exercises, plans, or lists, even when the user describes a problem. Do not mention menstrual-cycle phases or suggest they caused an emotion. Do not label or diagnose the user; emotion signals are private, tentative reflections only. A gentle, relevant open question is okay, but do not ask one mechanically. If the user mentions self-harm or immediate danger, respond warmly and encourage contacting a trusted person or emergency support (SAMU 190 in Tunisia). Recent private mood average: ${avg}/5; tentative keyword signal: ${top}. Never state these analytics unless the user asks.`;
const CHAT_MOOD = { sadness: 1, fatigue: 1, stress: 2, anxiety: 2, joy: 5 };
function recordChatMood(uid, emotion) {
  const mood = CHAT_MOOD[emotion];
  if (!mood) return null;
  const today = iso(Date.now()),
    existing = db.logs.findLast
      ? db.logs.findLast((l) => l.uid === uid && iso(l.ts) === today)
      : [...db.logs].reverse().find((l) => l.uid === uid && iso(l.ts) === today);
  if (existing) {
    existing.m = mood;
    existing.k = phase(db.users[uid].cycle).k;
    existing.ts = Date.now();
  } else db.logs.push({ id: id(), uid, ts: Date.now(), m: mood, k: phase(db.users[uid].cycle).k });
  saveDb();
  return { ts: existing ? existing.ts : Date.now(), m: mood, k: phase(db.users[uid].cycle).k };
}
app.post("/api/chat", auth, async (q, r) => {
  if (limited("c" + q.user.id, 20, 6e4)) return r.status(429).json({ error: "Slow down a little 💜" });
  const msg = clean(q.body.message, 1000);
  if (!msg) return r.status(400).json({ error: "Say something first" });
  const lg = ["en", "fr", "ar"].includes(q.body.lang) ? q.body.lang : "en",
    e = emo(msg);
  const moodLog = recordChatMood(q.user.id, e.top);
  if (e.crisis)
    return r.json({
      reply: { fr: CRISIS_FR, ar: CRISIS_AR }[lg] || CRISIS_MSG,
      crisis: true,
      emotion: e.top,
      moodLog,
    });
  const logs = db.logs.filter((l) => l.uid === q.user.id).slice(-5),
    avg = logs.length ? (logs.reduce((s, l) => s + l.m, 0) / logs.length).toFixed(1) : "unknown";
  const hist = (Array.isArray(q.body.history) ? q.body.history : [])
    .slice(-8)
    .map((h) => ({ role: h.role === "assistant" ? "assistant" : "user", content: clean(h.content, 800) }))
    .filter((h) => h.content);
  hist.push({ role: "user", content: msg });
  while (hist[0]?.role === "assistant") hist.shift();
  try {
    const reply = await llm(sysPrompt(avg, e.top, lg), hist);
    if (!reply)
      return r
        .status(503)
        .json({ error: "I’m here with you, but the AI service is unavailable right now.", moodLog });
    return r.json({ reply, source: PROVIDER, emotion: e.top, moodLog });
  } catch (x) {
    console.error("AI error:", x.message);
    return r
      .status(503)
      .json({ error: "I’m here with you, but the AI service is unavailable right now.", moodLog });
  }
});
// ---------- academics: timetable, exams, AI study & rest planner, community tips ----------
const acad = (u) => u.acad || { classes: [], exams: [] },
  LGS = ["en", "fr", "ar"];
app.put("/api/academics", auth, (q, r) => {
  const okT = (s) => /^\d{2}:\d{2}$/.test(s);
  const classes = (Array.isArray(q.body.classes) ? q.body.classes : [])
    .slice(0, 60)
    .filter((c) => okT(c.start) && okT(c.end) && c.day >= 0 && c.day <= 6)
    .map((c) => ({
      id: clean(c.id, 20) || id(),
      day: +c.day,
      start: c.start,
      end: c.end,
      subj: clean(c.subj, 50),
    }));
  const exams = (Array.isArray(q.body.exams) ? q.body.exams : [])
    .slice(0, 30)
    .filter((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date))
    .map((e) => ({
      id: clean(e.id, 20) || id(),
      subj: clean(e.subj, 50),
      date: e.date,
      diff: Math.min(3, Math.max(1, +e.diff || 2)),
    }));
  q.user.acad = { classes, exams };
  saveDb();
  r.json({ ok: true });
});
// The AI reads community comments and keeps the ones that give real time-organisation advice.
const TIPKW = [
  "schedule",
  "planning",
  "organi",
  "timetable",
  "pomodoro",
  "break",
  "prioriti",
  "routine",
  "sleep",
  "revis",
  "agenda",
  "time",
  "planifi",
  "horaire",
  "emploi du temps",
  "pause",
  "wa9t",
  "tnadhem",
];
const tipScore = (t) => {
  const n = norm(t);
  return TIPKW.filter((w) => n.includes(w)).length + (/\d+\s?(min|h|’)/.test(n) ? 1 : 0);
};
const tips = () =>
  db.posts
    .flatMap((p) => p.comments)
    .map((c) => ({ a: c.alias, x: c.text, s: tipScore(c.text) }))
    .filter((c) => c.s >= 2)
    .sort((a, b) => b.s - a.s)
    .slice(0, 4);
if (!db.posts.some((p) => p.comments.some((c) => c.alias === "CalmLotus12")))
  (db.posts.unshift({
    id: id(),
    uid: "seed",
    alias: "GentleKite44",
    cat: "Question",
    mode: "help",
    text: "How do you organise your revision during exam week without burning out?",
    ts: Date.now() - 6 * 36e5,
    reacts: [Array(9).fill("seed"), Array(14).fill("seed"), []],
    comments: [],
  }),
    db.posts[0].comments.push(
      ...[
        [
          "CalmLotus12",
          "I split revision into 40-minute blocks with a 10-minute break, and I plan tomorrow’s 3 priorities before sleeping. My stress dropped a lot.",
        ],
        [
          "WiseOrchid38",
          "Make a timetable per subject, start with the hardest one in the morning and keep Sunday afternoon free. Sleep before midnight beats late-night revision.",
        ],
        [
          "SunnyDune61",
          "Pomodoro changed my exam week: 25 min focus, 5 min break, and a real lunch break away from the screen.",
        ],
      ].map((c, i) => ({ id: id(), uid: "seed", alias: c[0], text: c[1], ts: Date.now() - (i + 2) * 36e5 })),
    ));
app.get("/api/tips", auth, (q, r) => r.json(tips()));
const mins = (s) => +s.slice(0, 2) * 60 + +s.slice(3),
  hhmm = (m) => String((m / 60) | 0).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
function buildPlan(u) {
  const A = acad(u),
    today = iso(Date.now()),
    ex = A.exams.filter((e) => e.date >= today);
  const logs = db.logs.filter((l) => l.uid === u.id).slice(-5),
    avg = logs.length ? logs.reduce((s, l) => s + l.m, 0) / logs.length : 3;
  const mood = Math.min(5, avg + ((u.boost || {})[today] || 0)),
    ph = phase(u.cycle).k,
    load = mood <= 2.5 || ph === 0 ? 0.7 : mood >= 4 ? 1.1 : 1,
    used = {},
    days = [];
  for (let i = 0; i < 7; i++) {
    const dt = new Date(Date.now() + i * DAY),
      date = iso(dt),
      dow = (dt.getDay() + 6) % 7,
      items = [];
    const cls = A.classes.filter((c) => c.day === dow);
    cls.forEach((c) => items.push({ t: c.start, k: "class", x: c.subj + " (until " + c.end + ")" }));
    const exToday = ex.filter((e) => e.date === date),
      up = ex.filter((e) => e.date > date),
      eve = up.some((e) => iso(new Date(new Date(e.date).getTime() - DAY)) === date);
    exToday.forEach((e) =>
      items.push({ t: "09:00", k: "exam", x: "Exam: " + e.subj + ". You’ve prepared, breathe." }),
    );
    const cap =
      !up.length || exToday.length ? 0 : eve ? 1 : dow === 6 ? 2 : Math.round((cls.length ? 4 : 6) * load);
    const busy = cls.map((c) => [mins(c.start), mins(c.end)]),
      starts = (dow === 6 ? [540, 600] : [540, 600, 660, 870, 930, 990, 1170]).filter(
        (s) => !busy.some((b) => s < b[1] && s + 50 > b[0]),
      );
    starts.slice(0, cap).forEach((s) => {
      const best = up
        .map((e) => ({
          e,
          w:
            (e.diff || 2) / Math.max(1, Math.round((new Date(e.date) - dt) / DAY)) -
            (used[e.subj] || 0) * 0.12,
        }))
        .sort((a, b) => b.w - a.w)[0].e;
      used[best.subj] = (used[best.subj] || 0) + 1;
      items.push(
        { t: hhmm(s), k: "study", x: "Focus 40’: " + best.subj },
        { t: hhmm(s + 40), k: "rest", x: "Break 10’: water and stretch" },
      );
    });
    if (exToday.length || up.length) {
      if (!busy.some((b) => b[0] <= 780 && b[1] > 780))
        items.push({ t: "13:00", k: "rest", x: "Lunch away from screens" });
      items.push({ t: "18:15", k: "rest", x: eve ? "Light walk, pack your bag" : "Walk 20’ outside" });
      if (load < 1) items.push({ t: "17:30", k: "rest", x: "Gentle self-care: warm drink, 15’ stretch" });
      if (dow === 6) items.push({ t: "14:30", k: "rest", x: "Protected rest afternoon" });
      items.push({ t: "22:30", k: "rest", x: eve ? "Early night, sleep by 22:30" : "Phone away, wind down" });
    }
    items.sort((a, b) => a.t.localeCompare(b.t));
    days.push({ date, items });
  }
  return { days, load, mood: +mood.toFixed(1), phase: PN[ph] };
}
app.post("/api/plan", auth, async (q, r) => {
  if (limited("pl" + q.user.id, 6, 6e4)) return r.status(429).json({ error: "Slow down a little 💜" });
  const u = q.user,
    lg = LGS.includes(q.body.lang) ? q.body.lang : "en",
    p = buildPlan(u),
    tp = tips().slice(0, 3),
    lw = p.load < 1 ? "lighter" : p.load > 1 ? "slightly fuller" : "balanced";
  let note = null;
  try {
    note = await llm(
      sysPrompt(p.phase, p.mood, "exam stress", lg) +
        " Now write exactly 2 warm sentences introducing the user's 7-day study and rest plan. Say the study load is " +
        lw +
        " because of her mood and cycle phase, and apply one of these community tips: " +
        tp.map((t) => t.x).join(" | "),
      [
        {
          role: "user",
          content:
            "Exams: " +
            acad(u)
              .exams.map((e) => e.subj + " on " + e.date)
              .join(", "),
        },
      ],
    );
  } catch (x) {
    console.error("AI error:", x.message);
  }
  u.plan = {
    ts: Date.now(),
    days: p.days,
    tips: tp.map((t) => ({ a: t.a })),
    note:
      note ||
      `Your plan is ${lw} because your mood is ${p.mood}/5 and you’re in your ${p.phase.toLowerCase()} phase. ${tp[0] ? "Inspired by the community: " + tp[0].x.slice(0, 110) + "…" : "Short focus blocks with real breaks keep stress low."}`,
  };
  saveDb();
  r.json(u.plan);
});
// Short AI insight for each page (cached 10 min), falls back to rule-based text.
const insCache = new Map();
app.post("/api/insight", auth, async (q, r) => {
  if (limited("in" + q.user.id, 40, 6e4)) return r.status(429).json({ error: "Slow down a little 💜" });
  const pg = ["home", "journey", "selfcare", "community", "academics"].includes(q.body.page)
      ? q.body.page
      : "home",
    lg = LGS.includes(q.body.lang) ? q.body.lang : "en",
    u = q.user,
    today = iso(Date.now());
  const logs = db.logs.filter((l) => l.uid === u.id).slice(-5),
    avg = logs.length ? logs.reduce((s, l) => s + l.m, 0) / logs.length : 3,
    b = (u.boost || {})[today] || 0,
    ph = PN[phase(u.cycle).k];
  const key = [u.id, pg, lg, b, avg.toFixed(1), ph].join("|"),
    c = insCache.get(key);
  if (c && Date.now() - c.t < 6e5) return r.json({ text: c.x });
  const low = avg + b <= 2.5 || ph === "Menstrual",
    nt = tips().length,
    ex = acad(u)
      .exams.filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
  const L = {
    home: `Your recent mood is ${avg.toFixed(1)}/5 and you’re in your ${ph.toLowerCase()} phase. ${b ? "Talking with Folla today eased your stress." : "A short chat with Folla can lift today."}`,
    journey: b
      ? `Talking with Folla today lifted your mood by +${b} on your chart. Keep the conversation going.`
      : `Your mood is around ${avg.toFixed(1)}/5. Chat with Folla to ease today’s stress and lift your chart.`,
    selfcare: low
      ? "A 2-minute reset is your best match today. Keep it gentle."
      : "Morning pages will help you organize your thoughts and your day.",
    community: `Folla found ${nt} helpful time-management tips from the community. See them in Academics.`,
    academics: ex
      ? `Your next exam is ${ex.subj} on ${ex.date}. Short focus blocks with real breaks keep stress low.`
      : "Add your exams and Folla will build a calm study and rest plan.",
  };
  let x = null;
  try {
    x = await llm(
      sysPrompt(ph, avg.toFixed(1), "n/a", lg) +
        ` Now write ONE short insight (max 30 words) for the "${pg}" page. Mood lift from chatting today: ${b}. Next exam: ${ex ? ex.subj + " on " + ex.date : "none"}. Helpful community tips available: ${nt}.`,
      [{ role: "user", content: "Give my insight for this page." }],
    );
  } catch (e2) {
    console.error("AI error:", e2.message);
  }
  x = x || L[pg];
  insCache.set(key, { t: Date.now(), x });
  r.json({ text: x });
});
app.get("/api/health", (q, r) => r.json({ ok: true, ai: PROVIDER }));
app.listen(PORT, () =>
  console.log(
    `HERwell running on http://localhost:${PORT}  (AI: ${PROVIDER}${AI_MODEL ? ", " + AI_MODEL : ""})`,
  ),
);
