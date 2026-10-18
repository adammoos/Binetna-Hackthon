/* HERwell frontend <-> backend layer. Loaded after the UI script; replaces local-only behaviour with API calls. */
const API = {
  tok: (() => {
    try {
      return localStorage.getItem("hw_tok") || "";
    } catch (e) {
      return "";
    }
  })(),
  async f(p, o = {}) {
    const r = await fetch("/api" + p, {
      method: o.m || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(API.tok ? { Authorization: "Bearer " + API.tok } : {}),
      },
      body: o.b ? JSON.stringify(o.b) : undefined,
    });
    const j = await r.json().catch(() => ({}));
    if (r.status === 401 && !p.startsWith("/auth/")) logout();
    if (!r.ok) {
      const e = new Error(j.error || "Something went wrong");
      e.data = j;
      throw e;
    }
    return j;
  },
};
let ME = null;
const CH = [];
S.wins = [];
const ago = (t) => {
  const m = ((Date.now() - t) / 6e4) | 0;
  return m < 1
    ? "just now"
    : m < 60
      ? m + "m ago"
      : m < 1440
        ? ((m / 60) | 0) + "h ago"
        : ((m / 1440) | 0) + "d ago";
};

// ---------- sign-in overlay ----------
document.head.insertAdjacentHTML(
  "beforeend",
  "<style>#au{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:16px;background:linear-gradient(135deg,var(--pk),var(--bg) 60%,var(--lv))}#au .c{width:min(400px,100%)}#au input{display:block;width:100%;margin-top:10px;padding:12px 14px;border-radius:16px;border:1px solid var(--p2);background:var(--bg);color:var(--tx);font:inherit;outline:0}#au input:focus{box-shadow:0 0 0 3px var(--pk)}</style>",
);
document.body.insertAdjacentHTML(
  "beforeend",
  '<div id="au"><div class="c"><div id="alg" style="text-align:center"></div><h1 style="text-align:center;color:var(--mv)">Binetna</h1><p class="mu" style="text-align:center;margin:4px 0 16px">A safe, private space. Others only ever see a random alias, never your name.</p><div class="chs" style="justify-content:center"><button class="ch on" id="t1">Sign in</button><button class="ch" id="t2">Create account</button></div><input id="an1" placeholder="First name (private, optional)" style="display:none"><input id="un" placeholder="Username" autocomplete="username"><input id="apw" type="password" placeholder="Password (6+ characters)" autocomplete="current-password"><p id="ae" style="color:#c0506f;min-height:18px;margin:8px 0;font-size:13px"></p><button class="bt" id="ab" style="width:100%;justify-content:center">Sign in</button></div></div>',
);
let isReg = false;
const setTab = (r) => {
  isReg = r;
  $("#t1").classList.toggle("on", !r);
  $("#t2").classList.toggle("on", r);
  $("#an1").style.display = r ? "block" : "none";
  $("#ab").textContent = r ? "Create account" : "Sign in";
};
$("#t1").onclick = () => setTab(false);
$("#t2").onclick = () => setTab(true);
const submitAuth = async () => {
  $("#ae").textContent = "";
  try {
    const d = await API.f(isReg ? "/auth/register" : "/auth/login", {
      m: "POST",
      b: { username: $("#un").value, password: $("#apw").value, name: $("#an1").value },
    });
    API.tok = d.token;
    try {
      localStorage.setItem("hw_tok", d.token);
    } catch (e) {}
    await boot(true);
  } catch (e) {
    $("#ae").textContent = e.message;
  }
};
$("#ab").onclick = submitAuth;
$("#apw").onkeydown = (e) => {
  if (e.key == "Enter") submitAuth();
};
function logout() {
  const t = API.tok;
  API.tok = "";
  try {
    localStorage.removeItem("hw_tok");
  } catch (e) {}
  fetch("/api/auth/logout", { method: "POST", headers: { Authorization: "Bearer " + t } }).finally(() =>
    location.reload(),
  );
}

// ---------- load everything for the signed-in profile ----------
async function boot(fresh) {
  const d = await API.f("/bootstrap");
  ME = d.me;
  S.alias = ME.alias;
  S.cy = ME.cycle;
  S.raw = d.logs;
  S.boost = d.boost || {};
  S.ac = d.academics || { classes: [], exams: [], plan: null };
  eff();
  S.pages = d.notes.filter((n) => n.k === "page");
  S.quran = d.notes.filter((n) => n.k === "quran");
  S.prayers = d.prayers || {};
  S.wins = d.notes.filter((n) => n.k === "win");
  S.posts = d.posts;
  $("#cs").value = S.cy.start;
  $("#cl").value = S.cy.len;
  $("#cp").value = S.cy.per;
  $(".us b").textContent = ME.name || "You";
  $(".us small").textContent = "@" + ME.username + " · private";
  $(".us .av").textContent = (ME.name || ME.username)[0].toUpperCase();
  if (!$("#lo")) {
    $(".us").insertAdjacentHTML(
      "beforeend",
      '<button class="ch" id="lo" style="margin-left:auto">Log out</button>',
    );
    $("#lo").onclick = logout;
  }
  render();
  feed();
  notesUI();
  acUI();
  aiBits();
  if (window.hwAfterBoot) hwAfterBoot();
  if (fresh && window.hwWelcome) hwWelcome();
  else $("#au").style.display = "none";
}

// ---------- mood check-in & cycle settings (saved to your profile) ----------
$("#sv").onclick = async () => {
  try {
    S.raw.push(await API.f("/logs", { m: "POST", b: { m: M } }));
    eff();
    render();
    aiBits();
    toast("Check-in saved. Thank you for showing up for yourself 💜");
  } catch (e) {
    toast(e.message);
  }
};
["cs", "cl", "cp"].forEach(
  (i) =>
    ($("#" + i).onchange = async () => {
      try {
        S.cy = (
          await API.f("/me", {
            m: "PUT",
            b: { cycle: { start: $("#cs").value, len: +$("#cl").value, per: +$("#cp").value } },
          })
        ).cycle;
        render();
      } catch (e) {
        toast(e.message);
      }
    }),
);

// ---------- achievements: a place to feel proud ----------
const streakNow = () => {
  const days = new Set(S.log.map((x) => iso(x.ts)));
  let n = 0;
  for (let i = days.has(iso(Date.now())) ? 0 : 1; days.has(iso(Date.now() - i * DAY)); i++) n++;
  return n;
};
function achUI() {
  if (!$("#al")) return;
  const w = S.wins || [],
    n = S.log.length,
    sk = streakNow(),
    mine = S.posts.filter((p) => p.own).length;
  const MS = [
    ["🌱", "First check-in", n >= 1],
    ["🔥", "3-day streak", sk >= 3],
    ["🌸", "7 check-ins", n >= 7],
    ["📖", "First morning page", S.pages.length >= 1],
    ["💜", "Shared in the circle", mine >= 1],
    ["⭐", "First achievement", w.length >= 1],
  ];
  $("#ac").textContent = MS.filter((m) => m[2]).length + " of " + MS.length + " milestones";
  $("#mst").innerHTML = MS.map(
    (m) => '<span class="mi' + (m[2] ? " on" : "") + '">' + m[0] + " " + m[1] + "</span>",
  ).join("");
  $("#as").textContent = w.length
    ? "You’ve celebrated " + w.length + " win" + (w.length == 1 ? "" : "s") + ". Look how far you’ve come 💜"
    : "Every step counts. Write down your first win today, even a tiny one.";
  $("#al").innerHTML = w.length
    ? w
        .slice(-3)
        .reverse()
        .map(
          (x) =>
            '<div class="win"><div class="st">✦</div><div class="wt">' +
            E(x.x) +
            "<small>" +
            ago(x.ts) +
            '</small></div><button class="x" data-nd="' +
            x.id +
            '" aria-label="Delete">✕</button></div>',
        )
        .join("")
    : '<div class="ach-empty">Your wins will shine here ✨<br><small>Passed an exam? Asked for help? Got out of bed on a hard day? It all counts.</small></div>';
  $("#awc").textContent = w.length + " saved";
}
$("#asv").onclick = async () => {
  const t = $("#aw").value.trim();
  if (!t) return;
  try {
    S.wins.push(await API.f("/notes", { m: "POST", b: { text: t, kind: "win" } }));
    $("#aw").value = "";
    achUI();
    toast("Achievement saved. You should be proud 💜");
    if (window.hwCelebrate) hwCelebrate();
  } catch (e) {
    toast(e.message);
  }
};

// ---------- mood chart: fills its card, readable labels ----------
function chartUI() {
  const box = $("#ch");
  if (!box) return;
  const R = S.log.slice(-14);
  if (!R.length) {
    box.innerHTML =
      '<div class="ach-empty" style="margin:0;height:100%;display:grid;place-items:center">Save your first check-in and your mood story will start here 🌸</div>';
    return;
  }
  const W = Math.max(260, box.clientWidth || 460),
    H = Math.max(230, box.clientHeight || 250),
    pl = 62,
    pr = 18,
    pt = 18,
    pb = 34,
    iw = W - pl - pr,
    ih = H - pt - pb;
  const x = (i) => pl + (R.length == 1 ? iw / 2 : (i * iw) / (R.length - 1)),
    y = (m) => pt + ((5 - m) / 4) * ih;
  const pts = R.map((r, i) => x(i) + "," + y(r.m)).join(" "),
    dl = (t) => new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short" });
  const ticks =
    R.length > 2
      ? [
          [0, "start"],
          [Math.floor((R.length - 1) / 2), "middle"],
          [R.length - 1, "end"],
        ]
      : R.map((r, i) => [i, i ? "end" : "start"]);
  box.innerHTML =
    '<svg viewBox="0 0 ' +
    W +
    " " +
    H +
    '"><defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#D98EAA" stop-opacity=".4"/><stop offset="1" stop-color="#D98EAA" stop-opacity="0"/></linearGradient></defs>' +
    [1, 2, 3, 4, 5]
      .map(
        (m) =>
          '<line x1="' +
          pl +
          '" x2="' +
          (W - pr) +
          '" y1="' +
          y(m) +
          '" y2="' +
          y(m) +
          '" stroke="var(--bd)" stroke-dasharray="3 5"/>' +
          (m % 2
            ? '<text x="0" y="' + (y(m) + 4) + '" fill="var(--mu)" font-size="11">' + MN[m - 1] + "</text>"
            : ""),
      )
      .join("") +
    (R.length > 1
      ? '<polygon points="' +
        x(0) +
        "," +
        (pt + ih) +
        " " +
        pts +
        " " +
        x(R.length - 1) +
        "," +
        (pt + ih) +
        '" fill="url(#ga)"/><polyline points="' +
        pts +
        '" fill="none" stroke="var(--ac)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
      : "") +
    R.map((r, i) =>
      face(Math.min(4, Math.max(0, Math.round(r.m) - 1))).replace(
        '<svg viewBox="0 0 40 40">',
        '<svg x="' + (x(i) - 14) + '" y="' + (y(r.m) - 14) + '" width="28" height="28" viewBox="0 0 40 40">',
      ),
    ).join("") +
    ticks
      .map(
        (t) =>
          '<text x="' +
          x(t[0]) +
          '" y="' +
          (H - 8) +
          '" text-anchor="' +
          t[1] +
          '" fill="var(--mu)" font-size="10.5">' +
          dl(R[t[0]].ts) +
          "</text>",
      )
      .join("") +
    "</svg>";
}
addEventListener("resize", chartUI);
const _go = go;
go = function (i) {
  _go(i);
  if (i == 1) chartUI();
};
const _render = render;
render = function () {
  _render();
  achUI();
  chartUI();
};

// ---------- notes (morning pages) ----------
function notesUI() {
  if (!$("#nl")) $("#sp").parentElement.insertAdjacentHTML("afterend", '<div id="nl"></div>');
  $("#nl").innerHTML = S.pages
    .slice(-4)
    .reverse()
    .map(
      (n) =>
        '<div class="pad"><b>' +
        new Date(n.ts).toLocaleDateString(undefined, { day: "numeric", month: "short" }) +
        ' <button class="ch" data-nd="' +
        n.id +
        '" style="float:right;padding:1px 8px">✕</button></b><span>' +
        E(n.x.slice(0, 110)) +
        (n.x.length > 110 ? "…" : "") +
        "</span></div>",
    )
    .join("");
  wc();
}
$("#sp").onclick = async () => {
  const t = $("#mp").value.trim();
  if (!t) return;
  try {
    S.pages.push(await API.f("/notes", { m: "POST", b: { text: t } }));
    $("#mp").value = "";
    notesUI();
    toast("Page saved to your private profile");
  } catch (e) {
    toast(e.message);
  }
};

// ---------- community: two kinds of conversation ----------
// help  = someone wants advice and answers.   heard = someone just wants to chat and feel heard.
let FM = "all",
  PM = "heard";
const MODES = {
  help: ["🧭", "I’m seeking help", "Advice and answers, please", "Share advice or an answer…"],
  heard: ["🤍", "I just want to chat", "Feel heard, no fixing needed", "Send some kind words…"],
};
const MTAG = { help: "🧭 Seeking help", heard: "🤍 Just chatting" },
  LN = { help: "💡 Answer", heard: "🤍 Kind words" };
function feed() {
  $("#pa").textContent = S.alias[0];
  $("#pa").style.background = hue(S.alias);
  $("#pn").textContent = S.alias;
  $("#pm").innerHTML = ["help", "heard"]
    .map(
      (k) =>
        '<button class="mo ' +
        k +
        (PM == k ? " on" : "") +
        '" data-pm="' +
        k +
        '"><b>' +
        MODES[k][0] +
        " " +
        MODES[k][1] +
        "</b><span>" +
        MODES[k][2] +
        "</span></button>",
    )
    .join("");
  $$("[data-pm]").forEach(
    (b) =>
      (b.onclick = () => {
        PM = b.dataset.pm;
        feed();
      }),
  );
  $("#pt").placeholder =
    PM == "help"
      ? "Ask your question or describe what you need help with…"
      : "Share what’s on your heart. Nobody will try to fix it…";
  const cnt = (k) => S.posts.filter((p) => (p.m || "heard") == k).length;
  $("#ft").innerHTML = [
    ["all", "All · " + S.posts.length],
    ["help", "🧭 Seeking help & answers · " + cnt("help")],
    ["heard", "🤍 Chat & feeling heard · " + cnt("heard")],
  ]
    .map(
      (t) =>
        '<button class="ch' + (FM == t[0] ? " on" : "") + '" data-ft="' + t[0] + '">' + t[1] + "</button>",
    )
    .join("");
  $$("[data-ft]").forEach(
    (b) =>
      (b.onclick = () => {
        FM = b.dataset.ft;
        feed();
      }),
  );
  const list = S.posts.filter((p) => FM == "all" || (p.m || "heard") == FM);
  $("#fd").innerHTML = list.length
    ? list
        .map((p) => {
          const m = p.m || "heard";
          return (
            '<div class="c po ' +
            m +
            '"><div class="hd"><div class="av" style="background:' +
            hue(p.a) +
            '">' +
            E(p.a[0]) +
            "</div><div><b>" +
            E(p.a) +
            '</b><br><small class="mu">' +
            ago(p.ts) +
            '</small> <span class="md-tag ' +
            m +
            '">' +
            MTAG[m] +
            "</span></div>" +
            (p.own
              ? '<button class="ch" data-d="' + p.id + '" style="margin-left:auto">Delete</button>'
              : "") +
            "</div><div>" +
            E(p.x) +
            '</div><div class="rx">' +
            ["🤗 Hug", "🙋 Same here", "✨ Proud"]
              .map(
                (r, j) =>
                  '<button data-r="' +
                  p.id +
                  "|" +
                  j +
                  '" class="' +
                  (p.mine[j] ? "on" : "") +
                  '">' +
                  r +
                  " " +
                  p.r[j] +
                  "</button>",
              )
              .join("") +
            "</div>" +
            p.c
              .map(
                (c) =>
                  '<div class="cm"><span class="ln">' +
                  LN[m] +
                  "</span><b>" +
                  E(c.a) +
                  ' <small class="mu">' +
                  ago(c.ts) +
                  "</small></b><div>" +
                  E(c.x) +
                  "</div></div>",
              )
              .join("") +
            '<div class="ip" style="margin-top:18px"><input data-ci="' +
            p.id +
            '" placeholder="' +
            MODES[m][3] +
            '"><button class="sb" data-cs="' +
            p.id +
            '">➤</button></div></div>'
          );
        })
        .join("")
    : '<div class="c po" style="text-align:center;color:var(--mu)">Nothing here yet. Be the first to share 💜</div>';
  achUI();
}
const upd = (p) => {
  S.posts = S.posts.map((x) => (x.id == p.id ? p : x));
  feed();
};
$("#na").onclick = async () => {
  try {
    S.alias = (await API.f("/me/alias", { m: "POST" })).alias;
    feed();
    toast("New anonymous alias: " + S.alias);
  } catch (e) {
    toast(e.message);
  }
};
$("#pb").onclick = async () => {
  const x = $("#pt").value.trim();
  if (!x) return;
  try {
    const d = await API.f("/posts", { m: "POST", b: { text: x, cat: CAT, mode: PM } });
    S.posts.unshift(d.post);
    if (FM != "all" && FM != PM) FM = PM;
    $("#pt").value = "";
    feed();
    $("#pw").innerHTML = d.crisis
      ? '<div class="al"><b>You are not alone.</b> Please reach a trusted person or a doctor now. If you may be in danger, call SAMU 190.</div>'
      : "";
  } catch (e) {
    toast(e.message);
  }
};
const sendComment = async (id) => {
  const i = document.querySelector('[data-ci="' + id + '"]');
  if (!i || !i.value.trim()) return;
  try {
    upd(await API.f("/posts/" + id + "/comments", { m: "POST", b: { text: i.value } }));
  } catch (e) {
    toast(e.message);
  }
};
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-r],[data-d],[data-cs],[data-nd]");
  if (!b) return;
  try {
    if (b.dataset.r) {
      const [id, k] = b.dataset.r.split("|");
      upd(await API.f("/posts/" + id + "/react", { m: "POST", b: { kind: +k } }));
    } else if (b.dataset.d) {
      await API.f("/posts/" + b.dataset.d, { m: "DELETE" });
      S.posts = S.posts.filter((p) => p.id != b.dataset.d);
      feed();
    } else if (b.dataset.cs) sendComment(b.dataset.cs);
    else if (b.dataset.nd) {
      await API.f("/notes/" + b.dataset.nd, { m: "DELETE" });
      S.pages = S.pages.filter((n) => n.id != b.dataset.nd);
      S.wins = S.wins.filter((n) => n.id != b.dataset.nd);
      S.quran = (S.quran || []).filter((n) => n.id != b.dataset.nd);
      notesUI();
      achUI();
      if (window.hwQuranList) hwQuranList();
    }
  } catch (x) {
    toast(x.message);
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && e.target.dataset && e.target.dataset.ci) sendComment(e.target.dataset.ci);
});

// ---------- AI companion: server-side (API key never reaches the browser) ----------
function applyAiMoodLog(log) {
  if (!log || !Number.isFinite(Number(log.ts)) || !Number.isFinite(Number(log.m))) return;
  const day = iso(Number(log.ts)),
    index = S.raw.findIndex((item) => iso(item.ts) === day),
    entry = { ts: Number(log.ts), m: Number(log.m), k: Number(log.k) };
  if (index >= 0) S.raw[index] = entry;
  else S.raw.push(entry);
  S.raw.sort((a, b) => a.ts - b.ts);
  eff();
  render();
  aiBits();
}
async function ask(q) {
  try {
    const d = await API.f("/chat", {
      m: "POST",
      b: { message: q, history: CH.slice(-8), lang: window.HWLANG || "en" },
    });
    applyAiMoodLog(d.moodLog);
    CH.push({ role: "user", content: q }, { role: "assistant", content: d.reply });
    return d.reply;
  } catch (e) {
    applyAiMoodLog(e.data && e.data.moodLog);
    if (e.message.includes("Slow down")) return e.message;
    return e.data ? e.message : "I’m here with you, but I couldn’t reach the AI service just now.";
  }
}
// ---------- Folla: mood lift from talking, AI insights on every page, Academics planner ----------
S.ac = S.ac || { classes: [], exams: [], plan: null };
S.raw = S.raw || [];
S.boost = S.boost || {};
const eff = () => {
  S.log = S.raw.map((l) => ({ ...l }));
};
const PGS = { s0: "home", s1: "journey", s3: "community", s4: "selfcare", s6: "academics" };
const aiBits = () => {
  Object.entries(PGS).forEach(async ([sid, pg]) => {
    let el = document.getElementById("in_" + pg);
    if (!el) {
      document
        .getElementById(sid)
        .insertAdjacentHTML("afterbegin", '<div class="fi2" id="in_' + pg + '"></div>');
      el = document.getElementById("in_" + pg);
    }
    try {
      const t = (await API.f("/insight", { m: "POST", b: { page: pg, lang: window.HWLANG || "en" } })).text;
      el.innerHTML = ic("st") + "<span><b>Folla’s insight</b><br>" + E(t) + "</span>";
    } catch (e) {}
  });
  tipsUI();
};
const DN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  DF = ["Easy", "Medium", "Hard"];
const saveAc = async () => {
  try {
    await API.f("/academics", { m: "PUT", b: { classes: S.ac.classes, exams: S.ac.exams } });
  } catch (e) {
    toast(e.message);
  }
};
function acUI() {
  const A = S.ac;
  $("#tt").innerHTML =
    DN.map((n, d) => {
      const c = A.classes.filter((x) => x.day === d).sort((p, q) => p.start.localeCompare(q.start));
      return c.length
        ? '<div class="pad"><b>' +
            n +
            "</b>" +
            c
              .map(
                (x) =>
                  "<span>" +
                  x.start +
                  "–" +
                  x.end +
                  " · " +
                  E(x.subj) +
                  ' <a href="#" data-xc="' +
                  x.id +
                  '">✕</a></span><br>',
              )
              .join("") +
            "</div>"
        : "";
    }).join("") || '<p class="mu">No classes yet. Add your first one above.</p>';
  $("#exl").innerHTML =
    A.exams
      .slice()
      .sort((p, q) => p.date.localeCompare(q.date))
      .map(
        (x) =>
          '<div class="pad"><b>' +
          E(x.subj) +
          "</b><span>" +
          x.date +
          " · " +
          DF[x.diff - 1] +
          ' <a href="#" data-xe="' +
          x.id +
          '">✕</a></span></div>',
      )
      .join("") || '<p class="mu">Add your exams and Folla will build around them.</p>';
  planUI();
}
$("#ca").onclick = () => {
  const s = $("#cj").value.trim();
  if (!s || !$("#c1").value || !$("#c2").value) return toast("Add a subject and times");
  S.ac.classes.push({
    id: String(Date.now()),
    day: +$("#cd").value,
    start: $("#c1").value,
    end: $("#c2").value,
    subj: s,
  });
  $("#cj").value = "";
  saveAc();
  acUI();
};
$("#ea").onclick = () => {
  const s = $("#es").value.trim();
  if (!s || !$("#ed").value) return toast("Add a subject and a date");
  S.ac.exams.push({ id: String(Date.now()), subj: s, date: $("#ed").value, diff: +$("#ef").value });
  $("#es").value = "";
  saveAc();
  acUI();
};
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-xc],[data-xe]");
  if (!b) return;
  e.preventDefault();
  if (b.dataset.xc) S.ac.classes = S.ac.classes.filter((x) => x.id != b.dataset.xc);
  else S.ac.exams = S.ac.exams.filter((x) => x.id != b.dataset.xe);
  saveAc();
  acUI();
});
$("#pg").onclick = async () => {
  if (!S.ac.exams.length) return toast("Add at least one exam first");
  const b = $("#pg"),
    t = b.textContent;
  b.textContent = "Folla is planning…";
  try {
    S.ac.plan = await API.f("/plan", { m: "POST", b: { lang: window.HWLANG || "en" } });
    planUI();
  } catch (e) {
    toast(e.message);
  }
  b.textContent = t;
};
function planUI() {
  const p = S.ac && S.ac.plan;
  $("#pl").innerHTML = !p
    ? '<p class="mu">Your calm, balanced plan will appear here.</p>'
    : '<div class="al" style="background:var(--lv);border-color:var(--p2)">' +
      E(p.note) +
      "</div>" +
      p.days
        .map(
          (d) =>
            '<h3 style="margin:16px 0 4px;font-size:15px">' +
            new Date(d.date).toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "short",
            }) +
            "</h3>" +
            (d.items
              .map((i) => '<div class="it ' + i.k + '"><b>' + i.t + "</b><span>" + E(i.x) + "</span></div>")
              .join("") || '<p class="mu" style="margin:4px 0">Free day. Rest is part of the plan.</p>'),
        )
        .join("") +
      (p.tips && p.tips.length
        ? '<p class="mu" style="margin-top:14px;font-size:12px">Built using community tips from: ' +
          p.tips.map((t) => E(t.a)).join(", ") +
          "</p>"
        : "");
}
async function tipsUI() {
  try {
    const t = await API.f("/tips");
    $("#tp").innerHTML =
      t
        .map(
          (x) => '<div class="pad"><b>' + E(x.a) + " · picked by Folla</b><span>" + E(x.x) + "</span></div>",
        )
        .join("") || '<p class="mu">No tips yet.</p>';
  } catch (e) {}
}
(() => {
  const a = document.querySelector('.nv[data-go="6"]'),
    p = document.querySelector('.nv[data-go="5"]');
  if (a && p) p.parentNode.insertBefore(a, p);
  $("#alg").innerHTML = LOGO.replace('width="26" height="26"', 'width="54" height="54"');
})();

if (API.tok) {
  $("#au").style.display = "none";
  boot().catch(() => {
    $("#au").style.display = "grid";
  });
}
