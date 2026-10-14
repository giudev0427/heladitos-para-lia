/* =========================================================================
   Heladitos para Lia — interactions
   Vanilla JS. No build step. Progressive: if anything fails, the page
   still shows the invitation (see .no-js fallback + safety timer).
   ========================================================================= */
(function () {
  'use strict';

  /* ------------------------------ helpers ------------------------------ */
  var qs = function (sel, root) { return (root || document).querySelector(sel); };
  var qsa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var rand = function (min, max) { return min + Math.random() * (max - min); };
  var pick = function (arr) { return arr[(Math.random() * arr.length) | 0]; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduceMotion = !!(motionQuery && motionQuery.matches);
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints || 0) > 0;

  var $ = {
    html: document.documentElement,
    intro: qs('#intro'),
    page: qs('#page'),
    starfield: qs('#starfield'),
    floaties: qs('#floaties'),
    canvas: qs('#fxCanvas'),
    btnYes: qs('#btnYes'),
    btnNo: qs('#btnNo'),
    noScreen: qs('#noScreen'),
    btnBack: qs('#btnBack'),
    sure: qs('#sure'),
    btnSure: qs('#btnSure'),
    btnThink: qs('#btnThink'),
    finalScreen: qs('#finalScreen'),
    btnRestart: qs('#btnRestart'),
    dateInput: qs('#dateInput'),
    timeInput: qs('#timeInput'),
    dateConfirm: qs('#dateConfirm'),
    btnEditDate: qs('#btnEditDate'),
    btnFinalSave: qs('#btnFinalSave'),
    whisper: qs('#whisper'),
    counter: qs('#sparkleCounter'),
    count: qs('#sparkleCount'),
    backTop: qs('#backToTop'),
    announce: qs('#srAnnounce'),
    musicBtn: qs('#btnMusic'),
    musicSlot: qs('#musicSlot'),
    galImages: qsa('.g-img')
  };

  function announce(text) {
    if (!$.announce) return;
    $.announce.textContent = '';
    window.setTimeout(function () { $.announce.textContent = text; }, 60);
  }

  /* ============================ AUDIO (opt-in) ============================ */
  var Music = {
    ctx: null, master: null, playing: false, timer: null, step: 0,
    notes: [349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99, 880.00],
    seq: [0, 2, 4, 3, 5, 4, 2, 1, 0, 2, 4, 5, 7, 6, 4, 2],
    init: function () {
      if (this.ctx) return true;
      try {
        var C = window.AudioContext || window.webkitAudioContext;
        if (!C) return false;
        this.ctx = new C();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.0001;
        this.master.connect(this.ctx.destination);
        return true;
      } catch (e) { return false; }
    },
    tone: function (freq, t, dur, vol, type) {
      try {
        var o = this.ctx.createOscillator();
        var g = this.ctx.createGain();
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(this.master);
        o.start(t); o.stop(t + dur + 0.06);
      } catch (e) { /* ignore */ }
    },
    tick: function () {
      var t = this.ctx.currentTime + 0.02;
      var n = this.notes[this.seq[this.step % this.seq.length]];
      this.tone(n, t, 1.7, 0.16, 'sine');
      this.tone(n / 2, t, 2.3, 0.07, 'triangle');
      if (this.step % 4 === 0) this.tone(n / 4, t, 3.2, 0.05, 'sine');
      this.step++;
    },
    start: function () {
      if (!this.init()) return false;
      if (this.ctx.state === 'suspended') { this.ctx.resume(); }
      this.playing = true;
      var now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
      this.master.gain.exponentialRampToValueAtTime(0.5, now + 1.4);
      this.tick();
      this.timer = window.setInterval(this.tick.bind(this), 620);
      return true;
    },
    stop: function () {
      if (!this.ctx) return;
      this.playing = false;
      window.clearInterval(this.timer);
      var now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
      this.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    },
    chime: function () {
      if (!this.playing || !this.ctx) return;
      var t = this.ctx.currentTime + 0.02;
      var self = this;
      [880, 1174.66, 1567.98].forEach(function (f, i) { self.tone(f, t + i * 0.09, 1.1, 0.13, 'sine'); });
    }
  };

  function setupMusic() {
    if (!$.musicBtn) return;
    var ico = qs('.music-ico', $.musicBtn);
    var label = qs('.music-label', $.musicBtn);
    $.musicBtn.addEventListener('click', function () {
      var on = $.musicBtn.getAttribute('aria-pressed') === 'true';
      if (on) {
        Music.stop();
        $.musicBtn.setAttribute('aria-pressed', 'false');
        if (ico) ico.textContent = '▶';
        if (label) label.textContent = 'Activar música';
        announce('Música desactivada.');
      } else {
        var ok = Music.start();
        if (!ok) {
          if (label) label.textContent = 'Tu navegador no permite audio';
          return;
        }
        $.musicBtn.setAttribute('aria-pressed', 'true');
        if (ico) ico.textContent = '❚❚';
        if (label) label.textContent = 'Silenciar música';
        announce('Música suave activada.');
      }
    });
  }

  /* ============================ STARFIELD ============================ */
  function buildStars() {
    if (!$.starfield) return;
    var count = reduceMotion ? 40 : (window.innerWidth < 640 ? 70 : 150);
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      s.className = 'star' + (Math.random() > 0.82 ? ' star--gold' : (Math.random() > 0.7 ? ' star--pink' : ''));
      var size = rand(1, 2.8);
      s.style.left = rand(0, 100).toFixed(2) + '%';
      s.style.top = rand(0, 100).toFixed(2) + '%';
      s.style.setProperty('--s', size.toFixed(2) + 'px');
      s.style.setProperty('--tw', rand(3, 7).toFixed(2) + 's');
      s.style.setProperty('--td', rand(0, 6).toFixed(2) + 's');
      frag.appendChild(s);
    }
    $.starfield.appendChild(frag);
  }

  /* ============================ FLOATING ICE CREAMS ============================ */
  var FLOAT_ART = [
    { id: 'il-cone', ar: 1.64 },
    { id: 'il-cup', ar: 1.29 },
    { id: 'il-pop', ar: 2.08 },
    { id: 'il-straw', ar: 1.2 },
    { id: 'il-sundae', ar: 1.27 }
  ];

  function buildFloaties() {
    if (!$.floaties) return;
    var count = reduceMotion ? 0 : (window.innerWidth < 640 ? 9 : 18);
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var art = pick(FLOAT_ART);
      var wrap = document.createElement('div');
      wrap.className = 'floaty';
      var w = rand(38, window.innerWidth < 640 ? 88 : 132);
      wrap.style.setProperty('--w', w.toFixed(0) + 'px');
      wrap.style.setProperty('--ar', art.ar);
      wrap.style.left = rand(-2, 96).toFixed(2) + '%';
      wrap.style.top = rand(2, 92).toFixed(2) + '%';
      wrap.style.setProperty('--dur', rand(12, 26).toFixed(1) + 's');
      wrap.style.setProperty('--delay', (-rand(0, 14)).toFixed(1) + 's');
      wrap.style.setProperty('--rise', (-rand(30, 90)).toFixed(0) + 'px');
      wrap.style.setProperty('--sway', rand(-40, 40).toFixed(0) + 'px');
      wrap.style.setProperty('--rot0', rand(-14, 4).toFixed(0) + 'deg');
      wrap.style.setProperty('--rot1', rand(-6, 18).toFixed(0) + 'deg');
      wrap.style.setProperty('--op-min', rand(0.08, 0.18).toFixed(2));
      wrap.style.setProperty('--op-max', rand(0.3, 0.6).toFixed(2));
      wrap.innerHTML = '<svg viewBox="' + viewBoxFor(art.id) + '" aria-hidden="true"><use href="#' + art.id + '"></use></svg>';
      frag.appendChild(wrap);
    }
    $.floaties.appendChild(frag);
  }
  function viewBoxFor(id) {
    if (id === 'il-cone') return '0 0 140 230';
    if (id === 'il-cup') return '0 0 170 220';
    if (id === 'il-pop') return '0 0 120 250';
    if (id === 'il-straw') return '0 0 100 120';
    return '0 0 440 560';
  }

  /* ============================ FX CANVAS ============================ */
  var FX = {
    ctx: null, W: 0, H: 0, dpr: 1, parts: [], running: false, raf: 0,
    init: function () {
      if (!$.canvas) return false;
      this.ctx = $.canvas.getContext('2d');
      if (!this.ctx) return false;
      this.resize();
      window.addEventListener('resize', this.resize.bind(this));
      return true;
    },
    resize: function () {
      if (!this.ctx) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.W = window.innerWidth;
      this.H = window.innerHeight;
      $.canvas.width = Math.floor(this.W * this.dpr);
      $.canvas.height = Math.floor(this.H * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    },
    add: function (p) {
      if (this.parts.length > 320) this.parts.shift();
      this.parts.push(p);
      if (!this.running) { this.running = true; this.raf = requestAnimationFrame(this.loop.bind(this)); }
    },
    loop: function () {
      var c = this.ctx;
      c.clearRect(0, 0, this.W, this.H);
      for (var i = this.parts.length - 1; i >= 0; i--) {
        var p = this.parts[i];
        p.life++;
        if (p.g) p.vy += p.g;
        p.vx *= p.fr || 1;
        p.x += p.vx;
        p.y += p.vy;
        if (p.sway) p.x += Math.sin((p.life + p.seed) * 0.05) * p.sway;
        p.rot += p.vr;
        var k = 1 - p.life / p.maxLife;
        if (k <= 0) { this.parts.splice(i, 1); continue; }
        c.save();
        c.globalAlpha = Math.max(0, k * (p.alpha || 1));
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.fillStyle = p.color;
        if (p.shape === 'rect') this.drawRect(c, p);
        else if (p.shape === 'heart') this.drawHeart(c, p);
        else if (p.shape === 'star') this.drawStar(c, p);
        else this.drawDot(c, p);
        c.restore();
      }
      if (this.parts.length) { this.raf = requestAnimationFrame(this.loop.bind(this)); }
      else { this.running = false; c.clearRect(0, 0, this.W, this.H); }
    },
    drawRect: function (c, p) { c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); },
    drawDot: function (c, p) { c.beginPath(); c.arc(0, 0, p.s / 2, 0, Math.PI * 2); c.fill(); },
    drawHeart: function (c, p) {
      var s = p.s / 32;
      c.beginPath();
      c.moveTo(0, 10 * s);
      c.bezierCurveTo(-20 * s, -6 * s, -10 * s, -22 * s, 0, -12 * s);
      c.bezierCurveTo(10 * s, -22 * s, 20 * s, -6 * s, 0, 10 * s);
      c.closePath(); c.fill();
    },
    drawStar: function (c, p) {
      var r = p.s / 2, r2 = r * 0.34;
      c.beginPath();
      for (var i = 0; i < 4; i++) {
        var a = (i / 4) * Math.PI * 2 - Math.PI / 2;
        var a2 = a + Math.PI / 4;
        c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        c.lineTo(Math.cos(a2) * r2, Math.sin(a2) * r2);
      }
      c.closePath(); c.fill();
    }
  };

  var CONFETTI_COLORS = ['#ff9bc4', '#ef5f97', '#f78bb4', '#ffd9e6', '#ffcf6b', '#d9c8f2', '#fff5e6', '#c9a0ff'];

  function sparkleBurst(x, y) {
    if (!FX.ctx || reduceMotion) return;
    var n = 10;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + Math.random();
      var sp = rand(1.4, 3.6);
      FX.add({
        x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.01, fr: 0.98,
        life: 0, maxLife: rand(38, 70), s: rand(6, 13), rot: rand(0, 6), vr: rand(-0.1, 0.1),
        color: Math.random() > 0.5 ? '#ffcf6b' : '#ffd9e6', shape: 'star', alpha: 1
      });
    }
  }

  function celebrate() {
    if (!FX.ctx) return;
    var n = reduceMotion ? 0 : (window.innerWidth < 640 ? 90 : 170);
    for (var i = 0; i < n; i++) {
      var fromTop = Math.random() > 0.42;
      if (fromTop) {
        FX.add({
          x: rand(0, FX.W), y: rand(-60, -10), vx: rand(-1.4, 1.4), vy: rand(1.6, 4.2),
          g: 0.045, fr: 0.995, life: 0, maxLife: rand(120, 240), s: rand(7, 15),
          rot: rand(0, 6), vr: rand(-0.18, 0.18),
          color: pick(CONFETTI_COLORS), shape: Math.random() > 0.55 ? 'rect' : (Math.random() > 0.5 ? 'heart' : 'star'), alpha: 1
        });
      } else {
        FX.add({
          x: rand(0, FX.W), y: FX.H + rand(0, 80), vx: rand(-0.6, 0.6), vy: -rand(0.9, 2.4),
          g: -0.005, fr: 0.999, life: 0, maxLife: rand(150, 300), s: rand(12, 26),
          rot: rand(-0.3, 0.3), vr: rand(-0.04, 0.04), sway: rand(0.2, 0.7), seed: rand(0, 100),
          color: pick(['#ef5f97', '#ff9bc4', '#ffcf6b', '#f78bb4']), shape: 'heart', alpha: 0.92
        });
      }
    }
    Music.chime();
  }

  /* ============================ SCREENS ============================ */
  var lastFocus = null;

  function show(el, focusEl) {
    if (!el) return;
    lastFocus = document.activeElement;
    el.classList.add('is-active');
    el.removeAttribute('aria-hidden');
    if (focusEl) window.setTimeout(function () { focusEl.focus(); }, 400);
  }
  function hide(el, restoreFocus) {
    if (!el) return;
    el.classList.remove('is-active');
    el.setAttribute('aria-hidden', 'true');
    if (restoreFocus && lastFocus && lastFocus.focus) {
      try { lastFocus.focus(); } catch (e) { /* ignore */ }
    }
  }

  /* ============================ INTRO ============================ */
  var introStarted = false;

  function startIntro() {
    if (introStarted) return;
    introStarted = true;
    window.clearTimeout(safetyTimer);
    if (!$.intro) { revealPage(); return; }
    $.intro.classList.add('zoom');
    if ($.starfield) $.starfield.classList.add('bright');
    try {
      var r = $.intro.querySelector('.intro-sundae');
      if (r) {
        var rect = r.getBoundingClientRect();
        sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    } catch (e) { /* ignore */ }
    window.setTimeout(function () {
      $.intro.classList.remove('is-active');
      $.intro.setAttribute('aria-hidden', 'true');
      revealPage();
    }, reduceMotion ? 220 : 950);
  }

  function revealPage() {
    if (!$.page) return;
    $.page.classList.add('is-ready');
    $.page.removeAttribute('aria-hidden');
    if ($.counter) $.counter.classList.add('is-visible');
    window.__heladitosReady = true;
    announce('Invitación abierta. ¿Vamos a comer heladito?');
    startWhispers();
  }

  var safetyTimer = 0;

  function setupIntro() {
    if (!$.intro) return;
    $.intro.addEventListener('click', startIntro);
    $.intro.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); startIntro(); }
    });
    var skip = qs('#introSkip');
    if (skip) skip.addEventListener('click', function (e) { e.stopPropagation(); startIntro(); });
    // never trap the page: auto-advance if nothing happens
    safetyTimer = window.setTimeout(startIntro, 14000);
  }

  /* ============================ WHISPERS ============================ */
  var WHISPERS = [
    'Un ratito dulce basta para una sonrisa ✨',
    'Las mejores tardes huelen a fresa 🍓',
    'Hay planes que saben mejor en buena compañía 💗',
    'Poco a poco, todo sabe más dulce 🍦'
  ];

  function startWhispers() {
    if (!$.whisper) return;
    if (reduceMotion) { $.whisper.textContent = WHISPERS[0]; return; }
    var i = 0;
    window.setInterval(function () {
      $.whisper.style.opacity = '0';
      window.setTimeout(function () {
        i = (i + 1) % WHISPERS.length;
        $.whisper.textContent = WHISPERS[i];
        $.whisper.style.opacity = '.92';
      }, 650);
    }, 6500);
  }

  /* ============================ NO BUTTON ============================ */
  var noTexts = [
    'NO, GRACIAS 🙈',
    '¿Segurita? 👀',
    '¿Y un heladito de fresa? 🍓',
    'Piénsalo dulcemente 🍦',
    'Una tarde bonita... ¿quizás? ✨',
    '¿Segura, segurita? 🥺'
  ];
  var dodgeCount = 0;
  var MAX_DODGES = 5;
  var noSettled = false;

  function resetNo() {
    dodgeCount = 0;
    noSettled = false;
    if ($.btnNo) {
      $.btnNo.style.transform = '';
      $.btnNo.classList.remove('is-dodging');
      $.btnNo.textContent = noTexts[0];
    }
  }

  function dodgeNo() {
    if (!$.btnNo || noSettled || reduceMotion) return;
    var field = $.btnNo.parentElement;
    if (!field) return;
    var fw = field.clientWidth, fh = field.clientHeight;
    var bw = $.btnNo.offsetWidth, bh = $.btnNo.offsetHeight;
    var maxX = Math.max(0, (fw - bw) / 2 - 4);
    var maxY = Math.max(0, (fh - bh) / 2 - 4);
    if (maxX < 8 && maxY < 8) { noSettled = true; return; }

    $.btnNo.classList.add('is-dodging');
    var x = 0, y = 0, tries = 0;
    // aim for a noticeably different spot
    do {
      x = rand(-maxX, maxX);
      y = rand(-maxY, maxY);
      tries++;
    } while (tries < 6 && Math.abs(x) < maxX * 0.34 && Math.abs(y) < maxY * 0.34 && (maxX > 20 || maxY > 20));

    $.btnNo.style.transform = 'translate(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px)';
    dodgeCount++;
    $.btnNo.textContent = noTexts[Math.min(dodgeCount, noTexts.length - 1)];
    if (dodgeCount >= MAX_DODGES) noSettled = true;
  }

  function chooseNo() {
    hide($.intro);
    show($.noScreen, $.btnBack);
    announce('Está bien, Lia. La invitación sigue aquí cuando quieras.');
  }

  function setupNo() {
    if (!$.btnNo) return;

    // Desktop: playful dodge when the pointer comes near
    if (!isTouch && !reduceMotion) {
      var card = $.btnNo.closest('.glass-card') || document;
      var throttle = false;
      card.addEventListener('mousemove', function (e) {
        if (noSettled || throttle) return;
        var r = $.btnNo.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist < Math.max(r.width, r.height) * 0.9 + 40) {
          throttle = true;
          window.setTimeout(function () { throttle = false; }, 260);
          dodgeNo();
        }
      });
    }

    // Click / tap
    $.btnNo.addEventListener('click', function () {
      if (reduceMotion || noSettled || dodgeCount >= MAX_DODGES) { chooseNo(); }
      else { dodgeNo(); }
    });

    // Keyboard: let it be chosen directly (accessible)
    $.btnNo.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        chooseNo();
      }
    });

    if ($.btnBack) $.btnBack.addEventListener('click', function () {
      hide($.noScreen, false);
      resetNo();
      if ($.btnYes) $.btnYes.focus();
      announce('De vuelta en la invitación.');
    });
  }

  /* ============================ YES FLOW ============================ */
  function setupYes() {
    if ($.btnYes) $.btnYes.addEventListener('click', function () {
      celebrate();
      announce('¡Genial! Solo una última pregunta.');
      window.setTimeout(function () { show($.sure, $.btnSure); }, reduceMotion ? 200 : 2200);
    });

    if ($.btnSure) $.btnSure.addEventListener('click', function () {
      celebrate();
      announce('¡Cita confirmada! Elige el día y la hora si quieres.');
      window.setTimeout(function () { show($.finalScreen, $.dateInput); }, reduceMotion ? 200 : 1800);
    });

    if ($.btnThink) $.btnThink.addEventListener('click', function () {
      hide($.sure, false);
      if ($.btnYes) $.btnYes.focus();
      announce('Sin prisa. La invitación sigue esperando.');
    });

    if ($.btnRestart) $.btnRestart.addEventListener('click', function () {
      hide($.finalScreen, false);
      resetNo();
      resetDate();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      if ($.btnYes) $.btnYes.focus();
      announce('Hemos vuelto al principio de la invitación.');
    });
  }

  /* ============================ DATE / TIME ============================ */
  var fmtDate = null, fmtTime = null;
  try {
    fmtDate = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    fmtTime = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' });
  } catch (e) { /* ignore */ }

  function hasDateValue() {
    return ($.dateInput && $.dateInput.value) || ($.timeInput && $.timeInput.value);
  }

  function buildConfirmText(saving) {
    var d = $.dateInput && $.dateInput.value;
    var t = $.timeInput && $.timeInput.value;
    var dateTxt = '', timeTxt = '';
    if (d) {
      var dd = new Date(d + 'T00:00:00');
      dateTxt = fmtDate && !isNaN(dd) ? fmtDate.format(dd) : d;
      dateTxt = dateTxt.charAt(0).toUpperCase() + dateTxt.slice(1);
    }
    if (t) {
      var tt = new Date('2000-01-01T' + t + ':00');
      timeTxt = fmtTime && !isNaN(tt) ? fmtTime.format(tt) : t;
    }
    if (!dateTxt && !timeTxt) {
      return 'Aún no hay fecha, pero la invitación queda abierta para cuando quieras 💗';
    }
    var out = 'Perfecto 💗 ';
    if (dateTxt && timeTxt) out += dateTxt + ' a las ' + timeTxt;
    else if (dateTxt) out += dateTxt;
    else out += 'A las ' + timeTxt;
    out += saving ? '. ¡Nuestro plan queda anotado!' : '. ¿Le damos el visto bueno?';
    return out;
  }

  function refreshConfirm(showIt) {
    if (!$.dateConfirm) return;
    if (showIt) {
      $.dateConfirm.textContent = buildConfirmText(false);
      $.dateConfirm.classList.add('is-shown');
    } else {
      $.dateConfirm.classList.remove('is-shown');
    }
  }

  function resetDate() {
    if ($.dateInput) $.dateInput.value = '';
    if ($.timeInput) $.timeInput.value = '';
    if ($.dateConfirm) { $.dateConfirm.classList.remove('is-shown'); $.dateConfirm.textContent = ''; }
    if ($.btnEditDate) $.btnEditDate.hidden = true;
    if ($.btnFinalSave) $.btnFinalSave.hidden = false;
    setDateEditing(true);
  }

  function setDateEditing(editing) {
    if ($.dateInput) $.dateInput.disabled = !editing;
    if ($.timeInput) $.timeInput.disabled = !editing;
  }

  function setupDate() {
    if ($.dateInput) $.dateInput.addEventListener('change', function () { refreshConfirm(hasDateValue()); });
    if ($.timeInput) $.timeInput.addEventListener('change', function () { refreshConfirm(hasDateValue()); });

    if ($.btnFinalSave) $.btnFinalSave.addEventListener('click', function () {
      if (hasDateValue()) {
        if ($.dateConfirm) { $.dateConfirm.textContent = buildConfirmText(true); $.dateConfirm.classList.add('is-shown'); }
        if ($.btnFinalSave) $.btnFinalSave.hidden = true;
        if ($.btnEditDate) $.btnEditDate.hidden = false;
        setDateEditing(false);
        celebrate();
        announce('¡Nuestro plan de heladitos queda anotado!');
      } else {
        if ($.dateConfirm) {
          $.dateConfirm.textContent = 'Sin fecha por ahora, no pasa nada: la invitación queda abierta 💗';
          $.dateConfirm.classList.add('is-shown');
        }
        announce('Puedes elegir la fecha cuando quieras.');
      }
    });

    if ($.btnEditDate) $.btnEditDate.addEventListener('click', function () {
      if ($.btnEditDate) $.btnEditDate.hidden = true;
      if ($.btnFinalSave) $.btnFinalSave.hidden = false;
      setDateEditing(true);
      refreshConfirm(false);
      if ($.dateInput) $.dateInput.focus();
    });
  }

  /* ============================ GALLERY FALLBACK ============================ */
  function setupGallery() {
    $.galImages.forEach(function (img) {
      var media = img.closest('.gal-media');
      var fail = function () { if (media) media.classList.add('is-failed'); };
      img.addEventListener('error', fail);
      if (img.complete && img.naturalWidth === 0) fail();
    });
  }

  /* ============================ REVEAL ON SCROLL ============================ */
  function setupReveal() {
    var items = qsa('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ============================ SCROLL UI + SPARKLE COUNTER ============================ */
  var sparkles = 0;

  function bumpSparkle(n) {
    sparkles += n;
    if ($.count) $.count.textContent = String(sparkles);
  }

  function setupScrollUI() {
    var onScroll = function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if ($.backTop) $.backTop.classList.toggle('is-visible', y > 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if ($.backTop) $.backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  function setupSparkles() {
    document.addEventListener('click', function (e) {
      if (!introStarted) return;
      var t = e.target;
      if (t && t.closest && t.closest('button, a, input, label, [role="button"], [role="dialog"]')) return;
      sparkleBurst(e.clientX, e.clientY);
      bumpSparkle(1);
    });
  }

  /* ============================ INIT ============================ */
  function init() {
    buildStars();
    buildFloaties();
    FX.init();
    setupIntro();
    setupMusic();
    setupNo();
    setupYes();
    setupDate();
    setupGallery();
    setupReveal();
    setupScrollUI();
    setupSparkles();

    // if there is no intro (no-js path surfaced), reveal immediately
    if (!$.intro) revealPage();

    if (motionQuery && motionQuery.addEventListener) {
      motionQuery.addEventListener('change', function (e) {
        reduceMotion = e.matches;
      });
    }
  }

  try {
    init();
  } catch (err) {
    // Never let a failure trap Lia on the intro screen.
    if ($.intro) { $.intro.classList.remove('is-active'); $.intro.setAttribute('aria-hidden', 'true'); }
    if ($.page) { $.page.classList.add('is-ready'); $.page.removeAttribute('aria-hidden'); }
    if (window.console && console.warn) console.warn('Heladitos: se activó el modo seguro.', err);
  }
})();
