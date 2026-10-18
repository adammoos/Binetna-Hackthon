/* HERwell extras: a butterfly that follows your cursor on every page, a flock of butterflies
   that flies out when you sign in, and a soft calming sound. No external files needed. */
(function () {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const get = (k, d) => {
    try {
      const v = localStorage.getItem(k);
      return v === null ? d : v;
    } catch (e) {
      return d;
    }
  };
  const put = (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  };
  const pref = { sound: get("hw_snd", "1") === "1", fly: get("hw_fly", "1") === "1" };

  // ---------- styles ----------
  const st = document.createElement("style");
  st.textContent = `
  .bf{position:fixed;left:0;top:0;width:34px;height:30px;pointer-events:none;z-index:300;will-change:transform;opacity:0;transition:opacity .6s}
  .bf.show{opacity:1}
  .bf svg{width:100%;height:100%;overflow:visible;display:block}
  .bf .wl,.bf .wr{transform-box:fill-box;animation:bfFlap var(--fs,.5s) ease-in-out infinite alternate}
  .bf .wl{transform-origin:100% 50%}.bf .wr{transform-origin:0% 50%;animation-name:bfFlapR}
  @keyframes bfFlap{from{transform:scaleX(1)}to{transform:scaleX(.18)}}
  @keyframes bfFlapR{from{transform:scaleX(1)}to{transform:scaleX(.18)}}
  .bf.calm .wl,.bf.calm .wr{animation-duration:1.1s}
  #au{transition:opacity 1s ease,transform 1s ease}
  #au.leaving{opacity:0;transform:scale(1.04);pointer-events:none}
  #dock{position:fixed;right:16px;bottom:16px;z-index:150;display:flex;gap:8px}
  #dock button{width:38px;height:38px;border-radius:50%;border:1px solid var(--p2);background:var(--cd);color:var(--mv);cursor:pointer;font-size:16px;line-height:1;box-shadow:var(--sh);transition:.25s;display:grid;place-items:center}
  #dock button:hover{transform:translateY(-2px);background:var(--pk)}
  #dock button.off{opacity:.5;filter:grayscale(1)}
  @media(max-width:760px){#dock{bottom:84px;right:10px}}
  `;
  document.head.appendChild(st);

  // ---------- butterfly drawing ----------
  const PAL = [
    ["#F4A9C6", "#B8A9E3"],
    ["#E6A3BD", "#F8DDE8"],
    ["#B8A9E3", "#F4C8D8"],
    ["#F8C9A8", "#E6A3BD"],
    ["#9fd0d6", "#B8A9E3"],
    ["#F2B6D3", "#FBE3D0"],
  ];
  let uid = 0;
  function butterfly(pal) {
    const id = "bg" + uid++,
      a = pal[0],
      b = pal[1];
    const el = document.createElement("div");
    el.className = "bf";
    el.innerHTML = `<svg viewBox="0 0 34 30" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
      <g class="wl"><path d="M17 15C12 3 2 2 2 9c0 5 6 7 15 6z" fill="url(#${id})"/><path d="M17 16c-8 1-12 6-9 11 3 3 8-1 9-11z" fill="url(#${id})" opacity=".85"/></g>
      <g class="wr"><path d="M17 15C22 3 32 2 32 9c0 5-6 7-15 6z" fill="url(#${id})"/><path d="M17 16c8 1 12 6 9 11-3 3-8-1-9-11z" fill="url(#${id})" opacity=".85"/></g>
      <rect x="16.2" y="9" width="1.6" height="15" rx=".8" fill="#80516D"/><path d="M17 9c-1-3-3-4-4-4M17 9c1-3 3-4 4-4" stroke="#80516D" stroke-width=".7" fill="none" stroke-linecap="round"/></svg>`;
    document.body.appendChild(el);
    return el;
  }

  // ---------- the butterfly that follows the cursor ----------
  let pt = { x: innerWidth * 0.6, y: innerHeight * 0.4 },
    moved = false,
    lastMove = 0;
  const me = { x: pt.x, y: pt.y, a: 0, el: null };
  function addPointer(e) {
    pt.x = e.clientX;
    pt.y = e.clientY;
    moved = true;
    lastMove = performance.now();
  }
  addEventListener("pointermove", addPointer, { passive: true });
  addEventListener("pointerdown", addPointer, { passive: true });
  function startCompanion() {
    me.el = butterfly(PAL[0]);
    me.el.style.zIndex = 310;
    me.el.style.width = "46px";
    me.el.style.height = "41px";
    requestAnimationFrame(() => me.el.classList.add("show"));
    let t0 = performance.now(),
      wx = 0,
      wy = 0,
      wt = 0;
    (function loop(t) {
      requestAnimationFrame(loop);
      if (!pref.fly) {
        me.el.classList.remove("show");
        return;
      }
      me.el.classList.add("show");
      const dt = Math.min(50, t - t0) / 16.7;
      t0 = t;
      let tx = pt.x,
        ty = pt.y;
      const idle = !moved || t - lastMove > 2500;
      if (idle) {
        // no pointer (e.g. phone) or resting: flutter gently around the last spot
        if (t > wt) {
          wx = (Math.random() - 0.5) * 120;
          wy = (Math.random() - 0.5) * 90;
          wt = t + 1400 + Math.random() * 1400;
        }
        tx += wx;
        ty += wy;
      } else {
        // trail slightly behind and above the cursor so the pointer stays visible
        tx += 22;
        ty -= 26;
      }
      const k = RM ? 0.25 : (idle ? 0.03 : 0.09) * dt,
        px = me.x,
        py = me.y;
      me.x += (tx - me.x) * k;
      me.y += (ty - me.y) * k;
      const sp = Math.hypot(me.x - px, me.y - py);
      const bob = RM ? 0 : Math.sin(t / 230) * 3.5;
      const targetA = Math.max(-35, Math.min(35, (me.x - px) * 5)); // lean into the direction of travel
      me.a += (targetA - me.a) * 0.12;
      me.el.classList.toggle("calm", sp < 0.4);
      me.el.style.setProperty("--fs", sp > 2 ? ".22s" : sp > 0.5 ? ".34s" : ".55s");
      me.el.style.transform = `translate(${me.x - 23}px,${me.y - 20 + bob}px) rotate(${me.a}deg)`;
    })(t0);
  }

  // ---------- the flock that flies out of the sign-in page ----------
  function release(n, ox, oy) {
    const list = [];
    for (let i = 0; i < n; i++) {
      const el = butterfly(PAL[i % PAL.length]),
        s = 0.7 + Math.random() * 0.9;
      el.style.zIndex = 305;
      el.style.opacity = 1;
      el.style.transition = "none";
      el.style.setProperty("--fs", 0.2 + Math.random() * 0.18 + "s");
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.2; // fan out, mostly upward
      const v = (1.4 + Math.random() * 2.2) * (RM ? 0.5 : 1);
      list.push({
        el,
        x: ox + (Math.random() - 0.5) * 120,
        y: oy + (Math.random() - 0.5) * 60,
        vx: Math.cos(ang) * v,
        vy: Math.sin(ang) * v - 0.4,
        s,
        ph: Math.random() * 6,
        sw: 0.8 + Math.random() * 1.6,
        born: performance.now() + i * 90,
        life: 5200 + Math.random() * 3200,
      });
    }
    (function loop(t) {
      let alive = 0;
      for (const b of list) {
        if (b.dead) continue;
        const age = t - b.born;
        if (age < 0) {
          b.el.style.opacity = 0;
          alive++;
          continue;
        }
        if (age > b.life || b.y < -60 || b.x < -60 || b.x > innerWidth + 60) {
          b.el.remove();
          b.dead = true;
          continue;
        }
        alive++;
        b.x += b.vx + Math.sin(t / 380 + b.ph) * b.sw;
        b.y += b.vy + Math.cos(t / 520 + b.ph) * 0.8;
        b.vy -= 0.004; // slowly gather upward
        b.el.style.opacity = Math.min(1, age / 400, (b.life - age) / 900);
        b.el.style.transform = `translate(${b.x}px,${b.y}px) rotate(${Math.max(-40, Math.min(40, b.vx * 14))}deg) scale(${b.s})`;
      }
      if (alive) requestAnimationFrame(loop);
    })(performance.now());
  }

  // ---------- calming sound (synthesised: soft pad + gentle chimes) ----------
  let ctx = null;
  function audio() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    return ctx;
  }
  async function calm() {
    if (!pref.sound) return false;
    const c = audio();
    if (!c) return false;
    try {
      if (c.state === "suspended") await c.resume();
    } catch (e) {}
    if (c.state !== "running") return false;
    const now = c.currentTime,
      out = c.createGain();
    out.gain.setValueAtTime(0, now);
    out.gain.linearRampToValueAtTime(0.5, now + 1.2);
    out.gain.setValueAtTime(0.5, now + 5.5);
    out.gain.linearRampToValueAtTime(0, now + 9);
    // soft echo to give the chimes a gentle, spacious tail
    const dl = c.createDelay(1),
      fb = c.createGain(),
      lp = c.createBiquadFilter();
    dl.delayTime.value = 0.38;
    fb.gain.value = 0.42;
    lp.type = "lowpass";
    lp.frequency.value = 2200;
    out.connect(c.destination);
    out.connect(dl);
    dl.connect(lp);
    lp.connect(fb);
    fb.connect(dl);
    lp.connect(c.destination);
    // warm pad: an open D major chord
    [146.83, 220, 293.66, 369.99].forEach((f, i) => {
      const o = c.createOscillator(),
        g = c.createGain();
      o.type = "sine";
      o.frequency.value = f;
      o.detune.value = (i - 1.5) * 4;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.07, now + 2);
      g.gain.linearRampToValueAtTime(0, now + 8.5);
      o.connect(g);
      g.connect(out);
      o.start(now);
      o.stop(now + 9);
    });
    // chimes on a pentatonic scale
    const scale = [587.33, 659.25, 739.99, 880, 987.77, 1174.66];
    let at = now + 0.5;
    for (let i = 0; i < 9; i++) {
      const f = scale[(Math.random() * scale.length) | 0],
        o = c.createOscillator(),
        g = c.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(0.16, at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0008, at + 2.6);
      o.connect(g);
      g.connect(out);
      o.start(at);
      o.stop(at + 2.8);
      at += 0.45 + Math.random() * 0.55;
    }
    return true;
  }
  // browsers only allow sound after a tap/click: unlock on the first interaction (sign-in is one)
  const unlock = () => {
    const c = audio();
    if (c && c.state === "suspended") c.resume().catch(() => {});
  };
  addEventListener("pointerdown", unlock, { passive: true });
  addEventListener("keydown", unlock);

  // ---------- public hooks ----------
  window.hwWelcome = function () {
    const au = document.getElementById("au");
    let ox = innerWidth / 2,
      oy = innerHeight / 2;
    const card = au && au.querySelector(".c");
    if (card) {
      const r = card.getBoundingClientRect();
      ox = r.left + r.width / 2;
      oy = r.top + r.height / 2;
    }
    if (au) {
      au.classList.add("leaving");
      setTimeout(() => {
        au.style.display = "none";
        au.classList.remove("leaving");
      }, 1000);
    }
    if (pref.fly) release(RM ? 6 : 18, ox, oy);
    calm();
  };
  window.hwCelebrate = function () {
    if (pref.fly) release(RM ? 3 : 8, innerWidth / 2, innerHeight * 0.55);
  };

  // ---------- small dock: sound + butterfly switches ----------
  function dock() {
    const d = document.createElement("div");
    d.id = "dock";
    d.innerHTML =
      '<button id="bs0" title="Light / dark mode" aria-label="Toggle light or dark mode">🌙</button><button id="bs1" title="Calming sound on/off" aria-label="Toggle calming sound">🔊</button><button id="bs2" title="Butterfly on/off" aria-label="Toggle butterfly">🦋</button>';
    document.body.appendChild(d);
    const sync = () => {
      const a = d.querySelector("#bs1"),
        b = d.querySelector("#bs2");
      a.classList.toggle("off", !pref.sound);
      a.textContent = pref.sound ? "🔊" : "🔇";
      b.classList.toggle("off", !pref.fly);
    };
    d.querySelector("#bs1").onclick = () => {
      pref.sound = !pref.sound;
      put("hw_snd", pref.sound ? "1" : "0");
      sync();
      if (pref.sound) calm();
    };
    d.querySelector("#bs2").onclick = () => {
      pref.fly = !pref.fly;
      put("hw_fly", pref.fly ? "1" : "0");
      sync();
    };
    sync();
    const root = document.documentElement,
      tb = d.querySelector("#bs0");
    const paint = () => {
      tb.textContent = root.dataset.theme == "dark" ? "☀️" : "🌙";
    };
    tb.onclick = () => {
      const n = root.dataset.theme == "dark" ? "light" : "dark";
      root.dataset.theme = n;
      put("hw4t", n);
    };
    new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    paint();
  }

  function init() {
    dock();
    startCompanion();
  }
  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();
